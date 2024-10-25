from app import create_app

# Create the Flask application instance
app = create_app(config_name='production')

# Note: SSL termination is handled by Nginx, so there's no need for `ssl_context` here.
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

