from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app import celery, limiter
from app.utils import save_uploaded_file
import docker
import os

bp = Blueprint('inference', __name__)

@celery.task(bind=True)
def run_inference(self, repo_path, input_data):
    try:
        client = docker.from_env()
        container = client.containers.run(
            'python:3.9',
            command=f'python /app/main.py --input "{input_data}"',
            volumes={repo_path: {'bind': '/app', 'mode': 'ro'}},
            detach=True,
            remove=True
        )
        
        result = container.wait()
        if result['StatusCode'] != 0:
            raise RuntimeError(f"Inference script failed with status code {result['StatusCode']}.")

        output = container.logs().decode('utf-8')

        return {'status': 'completed', 'result': output.strip()}
    except Exception as e:
        self.update_state(state='FAILURE', meta={'exc': str(e)})
        raise e

@bp.route('/run', methods=['POST'])
@login_required
@limiter.limit("5 per minute")
def run_inference_api():
    repo_name = request.form.get('repo_name')
    input_text = request.form.get('input_text')
    input_file = request.files.get('input_file')

    if not repo_name:
        return jsonify({'error': 'Repository name is required'}), 400

    repo_path = next((repo['path'] for repo in current_user.repos if repo['name'] == repo_name), None)
    if not repo_path:
        return jsonify({'error': 'Repository not found'}), 404

    if input_file:
        file_path = save_uploaded_file(input_file, current_app.config['UPLOAD_FOLDER'])
        if not file_path:
            return jsonify({'error': 'Invalid file'}), 400
        input_data = file_path
    elif input_text:
        input_data = input_text
    else:
        return jsonify({'error': 'Input text or input file is required'}), 400

    task = run_inference.apply_async(args=[repo_path, input_data])
    return jsonify({'task_id': task.id}), 202

@bp.route('/status/<task_id>', methods=['GET'])
@login_required
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