from celery import Celery
from flask import Flask

def create_app():
    # Import the required parts inside the function to avoid circular imports.
    from app import app
    return app

def make_celery(app: Flask):
    # Create an instance of Celery, configuring backend and broker
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    # Update celery configuration with app's configurations
    celery.conf.update(app.config)

    # Create a new Task class that uses Flask's application context
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    # Assign custom context Task to Celery
    celery.Task = ContextTask
    return celery

# Create the app instance to use
app = create_app()

# Create Celery instance using Flask app context
celery = make_celery(app)
