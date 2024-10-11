from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from flask_talisman import Talisman
from celery import Celery
from .config import Config
from .errors.handlers import register_error_handlers
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_swagger_ui import get_swaggerui_blueprint

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
csrf = CSRFProtect()
talisman = Talisman()
celery = Celery()
limiter = Limiter(key_func=get_remote_address)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    csrf.init_app(app)
    talisman.init_app(app)
    limiter.init_app(app)

    celery.conf.update(app.config)

    from .auth import bp as auth_bp
    from .repo import bp as repo_bp
    from .inference import bp as inference_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(repo_bp, url_prefix='/api/repo')
    app.register_blueprint(inference_bp, url_prefix='/api/inference')

    SWAGGER_URL = '/api/docs'
    API_URL = '/static/swagger.json'
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "Unus API"
        }
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    register_error_handlers(app)

    return app