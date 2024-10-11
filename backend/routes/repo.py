from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app import db, limiter
from app.utils import clone_git_repo, install_requirements
import os

bp = Blueprint('repo', __name__)

@bp.route('/clone', methods=['POST'])
@login_required
@limiter.limit("10 per hour")
def clone_repository():
    data = request.json
    repo_url = data.get('repo_url')

    if not repo_url or not repo_url.startswith('https://github.com/'):
        return jsonify({'error': 'Invalid GitHub repository URL'}), 400

    repo_name = repo_url.split('/')[-1].replace('.git', '')
    repo_path = os.path.join(current_app.config['AGENT_FOLDER'], repo_name)

    if any(repo['name'] == repo_name for repo in current_user.repos):
        return jsonify({'error': f'Repository {repo_name} has already been cloned'}), 400

    try:
        clone_git_repo(repo_url, repo_path)
        install_requirements(repo_path)

        current_user.repos = current_user.repos + [{'name': repo_name, 'path': repo_path}]
        db.session.commit()

        return jsonify({'message': f'Repository {repo_name} cloned successfully'}), 200
    except Exception as e:
        current_app.logger.error(f"Failed to clone repository: {str(e)}")
        return jsonify({'error': 'Failed to clone repository'}), 500