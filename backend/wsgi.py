from app import create_app

# Creating the Flask application using production configuration
app, _ = create_app(config_name='production')

