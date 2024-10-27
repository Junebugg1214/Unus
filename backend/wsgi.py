from app import create_app

# Create the Flask application using production configuration
app, _ = create_app(config_name='production')

if __name__ == "__main__":
    app.run()

