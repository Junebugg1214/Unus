from flask import Flask, request, jsonify, send_from_directory, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from celery import Celery, uuid
from dotenv import load_dotenv
import git
import shutil
import subprocess
import docker
import os
import re
import logging
from models import db, User
from config import Config
from utils import allowed_file, save_uploaded_file, install_requirements
from error_handlers import register_error_handlers
from flask_talisman import Talisman
from config import config

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config['development'])  # or use 'production' as needed


# Initialize extensions
jwt = JWTManager(app)
csrf = CSRFProtect(app)
db.init_app(app)
migrate = Migrate(app, db)
talisman = Talisman(app)

# Initialize Celery
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# Register error handlers
register_error_handlers(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security configuration with Talisman
csp = {
    'default-src': ["'self'"],
    'img-src': ["'self'", 'data:'],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"]
}
talisman = Talisman(app, content_security_policy=csp)

@celery.task(bind=True)
def run_inference(self, repo_path, input_data):
    try:
        # Input validation
        if not os.path.exists(repo_path):
            raise ValueError(f"Repository path does not exist: {repo_path}")

        if not isinstance(input_data, str):
            raise ValueError("Input data must be a string.")

        # Run Docker container
        client = docker.from_env()
        container = client.containers.run(
            'python:3.9',
            command=f'python /app/main.py --input "{input_data}"',
            volumes={repo_path: {'bind': '/app', 'mode': 'ro'}},
            detach=True,
            remove=True  # Automatically remove container after stopping
        )
        
        # Wait for the container to finish execution
        result = container.wait()
        if result['StatusCode'] != 0:
            raise RuntimeError(f"Inference script failed with status code {result['StatusCode']}.")

        # Get container logs
        output = container.logs().decode('utf-8')

        # Log and return result
        logger.info(f"Inference completed successfully: {output.strip()}")
        return {'status': 'completed', 'result': output.strip()}

    except docker.errors.ContainerError as e:
        self.update_state(state='FAILURE', meta={'exc': str(e)})
        logger.error(f"Container error during inference: {str(e)}")
        raise e
    except docker.errors.DockerException as e:
        self.update_state(state='FAILURE', meta={'exc': str(e)})
        logger.error(f"Docker error: {str(e)}")
        raise e
    except Exception as e:
        self.update_state(state='FAILURE', meta={'exc': str(e)})
        logger.error(f"Unexpected error during inference: {str(e)}")
        raise e

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.to_dict()), 200

@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real application, you might want to blacklist the token here
    return jsonify({"msg": "Successfully logged out"}), 200

@app.route('/api/run_inference', methods=['POST'])
@jwt_required()
@csrf.exempt
def run_inference_api():
    repo_name = request.form.get('repo_name')
    input_text = request.form.get('input_text')
    input_file = request.files.get('input_file')

    if not repo_name:
        return jsonify({'error': 'Repository name is required'}), 400

    user = User.query.filter_by(username=get_jwt_identity()).first()
    repo_path = next((repo['path'] for repo in user.repos if repo['name'] == repo_name), None)
    if not repo_path:
        return jsonify({'error': 'Repository not found'}), 404

    if input_file:
        file_path = save_uploaded_file(input_file)
        if not file_path:
            return jsonify({'error': 'Invalid file'}), 400
        input_data = file_path
    elif input_text:
        input_data = input_text
    else:
        return jsonify({'error': 'Input text or input file is required'}), 400

    try:
        task = run_inference.apply_async(args=[repo_path, input_data], task_id=uuid())
        return jsonify({'task_id': task.id}), 202
    except Exception as e:
        logger.error(f"Failed to start inference: {str(e)}")
        return jsonify({'error': 'Failed to start inference'}), 500

@app.route('/api/task_status/<task_id>', methods=['GET'])
@jwt_required()
def get_task_status(task_id):
    task = run_inference.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {'state': task.state, 'status': 'Pending...'}
    elif task.state == 'STARTED':
        response = {'state': task.state, 'status': 'Inference in progress...'}
    elif task.state == 'SUCCESS':
        response = {'state': task.state, 'result': task.result.get('result', '')}
    elif task.state == 'FAILURE':
        response = {'state': task.state, 'error': str(task.info)}
    else:
        response = {'state': task.state, 'status': 'Unknown status'}
    return jsonify(response)

@app.route('/api/clone', methods=['POST'])
@jwt_required()
def clone_repository():
    data = request.json
    repo_url = data.get('repo_url')

    if not repo_url or not re.match(r'^https:\/\/github\.com\/[\w\-]+\/[\w\-]+(\.git)?$', repo_url):
        return jsonify({'error': 'Invalid GitHub repository URL'}), 400

    repo_name = repo_url.split('/')[-1].replace('.git', '')
    repo_path = os.path.join(app.config['AGENT_FOLDER'], repo_name)

    user = User.query.filter_by(username=get_jwt_identity()).first()
    if any(repo['name'] == repo_name for repo in user.repos):
        return jsonify({'error': f'Repository {repo_name} has already been cloned'}), 400

    try:
        git.Repo.clone_from(repo_url, repo_path)
        
        requirements_file = os.path.join(repo_path, 'requirements.txt')
        if os.path.exists(requirements_file):
            install_requirements(repo_path)

        user.repos = user.repos + [{'name': repo_name, 'path': repo_path}]
        db.session.commit()

        return jsonify({'message': f'Repository {repo_name} cloned successfully'}), 200

    except git.exc.GitCommandError as git_error:
        logger.error(f"Failed to clone repository: {str(git_error)}")
        return jsonify({'error': f'Failed to clone repository: {str(git_error)}'}), 400
    except Exception as e:
        logger.error(f"Unexpected error during repository cloning: {str(e)}")
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False, ssl_context=('cert.pem', 'key.pem'))