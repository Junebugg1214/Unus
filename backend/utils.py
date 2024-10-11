import os
import subprocess
from werkzeug.utils import secure_filename
from flask import current_app
from flask_jwt_extended import get_jwt_identity
from models import User

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return file_path
    return None

def install_requirements(repo_path):
    requirements_path = os.path.join(repo_path, 'requirements.txt')
    if os.path.exists(requirements_path):
        subprocess.run(['pip', 'install', '-r', requirements_path], check=True)

def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

def is_safe_path(path, base_dir):
    """Check if the path is safe (doesn't try to access parent directories)"""
    return os.path.abspath(os.path.join(base_dir, path)).startswith(base_dir)
