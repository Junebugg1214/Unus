import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import app, db
from models import User

# Set the app configuration
app.config.from_object(os.environ.get('FLASK_CONFIG', 'config.DevelopmentConfig'))

migrate = Migrate(app, db)
manager = Manager(app)

# Add database migration commands
manager.add_command('db', MigrateCommand)

@manager.command
def create_admin():
    """Create an admin user"""
    username = input("Enter admin username: ")
    email = input("Enter admin email: ")
    password = input("Enter admin password: ")
    
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f"Admin user {username} created successfully.")

@manager.command
def list_users():
    """List all users"""
    users = User.query.all()
    for user in users:
        print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")

@manager.command
def init_db():
    """Initialize the database"""
    db.create_all()
    print("Database initialized.")

@manager.command
def drop_db():
    """Drop the database"""
    if input("Are you sure you want to drop the database? (y/n): ").lower() == 'y':
        db.drop_all()
        print("Database dropped.")
    else:
        print("Database drop aborted.")

if __name__ == '__main__':
    manager.run()