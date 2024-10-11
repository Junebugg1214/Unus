from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(ssl_context=(app.config['SSL_CERT_PATH'], app.config['SSL_KEY_PATH']))