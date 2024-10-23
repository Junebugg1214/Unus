from celery import Celery

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

celery = Celery(__name__, broker='your_broker_url')

@celery.task(bind=True)
def run_inference(self, repo_path, input_data):
    try:
        # Placeholder for actual inference logic
        result = f"Inference is being run on the repository at {repo_path} with input data: {input_data}"
        return {"result": result}
    except Exception as e:
        raise self.retry(exc=e)


