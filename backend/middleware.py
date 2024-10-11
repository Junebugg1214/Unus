from flask import request, jsonify
from functools import wraps
from models import User
import jwt
from config import Config

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        # Ensure token is provided
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        # Ensure the token is a Bearer token
        if not token.startswith("Bearer "):
            return jsonify({'message': 'Invalid token format! Token should start with "Bearer "'}), 401

        token = token.replace("Bearer ", "")  # Remove "Bearer " prefix

        try:
            # Decode the JWT token using the secret key from the config
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            # Use token data to find the user (assuming the token contains 'user_id')
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'message': 'User not found'}), 401

            # Attach current_user to the request so it can be used in the wrapped function
            request.current_user = current_user

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(*args, **kwargs)

    return decorated
