# celery_worker.py
from celery import Celery

def make_celery(app):
    # Create an instance of Celery, configuring backend and broker
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    # Update Celery configuration with app's configurations
    celery.conf.update(app.config)

    # Create a new Task class that uses Flask's application context
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    # Assign custom context Task to Celery
    celery.Task = ContextTask
    return celery

