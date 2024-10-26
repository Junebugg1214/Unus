import os
from typing import Dict, Any
import secrets
import string

def generate_secure_key(length: int = 50) -> str:
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def validate_env_config() -> Dict[str, Any]:
    required_vars = {
        'FLASK_ENV': str,
        'DATABASE_URL': str,
        'REDIS_URL': str,
        'SECRET_KEY': str,
        'JWT_SECRET_KEY': str,
    }

    missing_vars = []
    insecure_vars = []

    for var, expected_type in required_vars.items():
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        elif var in ['SECRET_KEY', 'JWT_SECRET_KEY'] and len(value) < 32:
            insecure_vars.append(var)

    if missing_vars:
        print(f"Missing required environment variables: {', '.join(missing_vars)}")

    if insecure_vars:
        print(f"Insecure keys detected: {', '.join(insecure_vars)}")
        print("Generating new secure keys...")

        for var in insecure_vars:
            new_key = generate_secure_key()
            print(f"New {var}: {new_key}")

    # Validate database URL format
    db_url = os.getenv('DATABASE_URL', '')
    if not db_url.startswith('postgresql://'):
        print("WARNING: DATABASE_URL should start with 'postgresql://'")

    # Validate Redis URL format
    redis_url = os.getenv('REDIS_URL', '')
    if not redis_url.startswith('redis://'):
        print("WARNING: REDIS_URL should start with 'redis://'")

    return {
        'missing_vars': missing_vars,
        'insecure_vars': insecure_vars
    }

if __name__ == '__main__':
    validate_env_config()
