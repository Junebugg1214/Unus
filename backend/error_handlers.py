from flask import jsonify
from werkzeug.exceptions import HTTPException
from flask_jwt_extended.exceptions import JWTExtendedException

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify(error="Bad request", message=str(e)), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify(error="Not found", message="The requested resource was not found"), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify(error="Internal server error", message="An unexpected error occurred"), 500

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_exception(e):
        return jsonify(error="JWT Token error", message=str(e)), 401

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response = e.get_response()
        response.data = jsonify({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        })
        response.content_type = "application/json"
        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        # Log the error here if needed
        return jsonify(error="Unexpected error", message=str(e)), 500
