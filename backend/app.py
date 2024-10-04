import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from celery import Celery
from dotenv import load_dotenv
import git
import shutil
import subprocess
import docker
import re
from models import db, User
from config import Config
from utils import allowed_file, save_uploaded_file, install_requirements
from error_handlers import register_error_handlers
from middleware import token_required

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)

# Initialize Celery
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# Register error handlers
register_error_handlers(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@celery.task
def run_inference(repo_path, input_data):
    try:
        client = docker.from_env()
        container = client.containers.run(
            'python:3.9',
            command=f'python /app/main.py --input "{input_data}"',
            volumes={repo_path: {'bind': '/app', 'mode': 'ro'}},
            detach=True
        )
        result = container.wait()
        output = container.logs().decode('utf-8')
        container.remove()
        return {'status': 'completed', 'result': output.strip()}
    except Exception as e:
        return {'status': 'error', 'result': str(e)}

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or len(username) < 3 or len(username) > 25:
        return jsonify({'error': 'Invalid username'}), 400

    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email'}), 400

    if not password or len(password) < 8:
        return jsonify({'error': 'Invalid password'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'}), 200
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/clone', methods=['POST'])
@login_required
def clone_repository():
    data = request.json
    repo_url = data.get('repo_url')
    repo_name = repo_url.split('/')[-1].replace('.git', '')
    repo_path = os.path.join(app.config['AGENT_FOLDER'], repo_name)

    try:
        git.Repo.clone_from(repo_url, repo_path)
        install_requirements(repo_path)
        
        # Update user's repos
        current_user.repos = current_user.repos + [{'name': repo_name, 'path': repo_path}]
        db.session.commit()
        
        return jsonify({'message': f'Repository {repo_name} cloned successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/repos', methods=['GET'])
@login_required
def get_repos():
    return jsonify({'repos': [repo['name'] for repo in current_user.repos]}), 200

@app.route('/api/delete_repo', methods=['POST'])
@login_required
def delete_repo():
    data = request.json
    repo_name = data.get('repo_name')
    repo_path = next((repo['path'] for repo in current_user.repos if repo['name'] == repo_name), None)

    if not repo_path:
        return jsonify({'error': 'Repository not found'}), 404

    try:
        shutil.rmtree(repo_path)
        current_user.repos = [repo for repo in current_user.repos if repo['name'] != repo_name]
        db.session.commit()
        return jsonify({'message': f'Repository {repo_name} deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/run_inference', methods=['POST'])
@login_required
def run_inference_api():
    repo_name = request.form.get('repo_name')
    input_text = request.form.get('input_text')
    input_file = request.files.get('input_file')

    repo_path = next((repo['path'] for repo in current_user.repos if repo['name'] == repo_name), None)
    if not repo_path:
        return jsonify({'error': 'Repository not found'}), 404

    if input_file:
        file_path = save_uploaded_file(input_file)
        if not file_path:
            return jsonify({'error': 'Invalid file'}), 400
        input_data = file_path
    else:
        input_data = input_text

    task = run_inference.delay(repo_path, input_data)
    result = task.get(timeout=60)  # Wait for the task to complete

    if result['status'] == 'completed':
        return jsonify({'result': result['result']}), 200
    else:
        return jsonify({'error': result['result']}), 400

@app.route('/api/change_password', methods=['POST'])
@login_required
def change_password():
    data = request.json
    new_password = data.get('password')
    if not new_password or len(new_password) < 8:
        return jsonify({'error': 'Invalid password'}), 400
    
    current_user.set_password(new_password)
    db.session.commit()
    return jsonify({'message': 'Password changed successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)