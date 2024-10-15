from app import create_app

# Since create_app returns both app and csrf, unpack them
app, _ = create_app('development')  # We only need the Flask app instance

