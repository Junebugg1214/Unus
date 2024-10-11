from app import celery, docker
import os
import logging

# Set up logger for the task
logger = logging.getLogger(__name__)

@celery.task(bind=True)
def run_inference(self, repo_path, input_data):
    try:
        # Validate if the repository path exists
        if not os.path.exists(repo_path):
            raise ValueError(f"Repository path does not exist: {repo_path}")

        # Initialize Docker client
        client = docker.from_env()

        # Check input type and construct the Docker command accordingly
        if isinstance(input_data, str) and os.path.isfile(input_data):
            command = f'python /app/main.py --input_file "{input_data}"'
        else:
            command = f'python /app/main.py --input "{input_data}"'

        # Run Docker container with resource limitations
        container = client.containers.run(
            'python:3.9',
            command=command,
            volumes={repo_path: {'bind': '/app', 'mode': 'ro'}},
            detach=True,
            remove=True,
            mem_limit='1g',  # Limit memory usage to 1GB
            cpu_period=100000,
            cpu_quota=50000  # Limit CPU usage to 50%
        )

        # Wait for container to finish running
        result = container.wait()
        if result['StatusCode'] != 0:
            # Collect container logs for debugging purposes
            error_logs = container.logs().decode('utf-8')
            raise RuntimeError(f"Inference script failed with status code {result['StatusCode']}. Logs: {error_logs}")

        # Retrieve container logs for output
        output = container.logs().decode('utf-8')
        logger.info(f"Inference completed successfully: {output.strip()}")
        return {'status': 'completed', 'result': output.strip()}

    except docker.errors.ContainerError as e:
        # Handle Docker container errors
        logger.error(f"Container error during inference: {str(e)}")
        self.update_state(state='FAILURE', meta={'exc': str(e)})
        raise e

    except docker.errors.ImageNotFound as e:
        # Handle case when the Docker image is not found
        logger.error(f"Docker image not found: {str(e)}")
        self.update_state(state='FAILURE', meta={'exc': 'Docker image not found'})
        raise e

    except docker.errors.APIError as e:
        # Handle Docker API errors
        logger.error(f"Docker API error: {str(e)}")
        self.update_state(state='FAILURE', meta={'exc': 'Docker API error'})
        raise e

    except Exception as e:
        # Handle all other exceptions
        logger.error(f"Unexpected error during inference: {str(e)}")
        self.update_state(state='FAILURE', meta={'exc': str(e)})
        raise e
