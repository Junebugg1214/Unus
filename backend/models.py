from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import validates
import re

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    repos = db.Column(db.JSON, default=list)

    @validates('username')
    def validate_username(self, key, username):
        if not username or len(username) < 3 or len(username) > 25:
            raise ValueError('Username must be between 3 and 25 characters.')
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError('Invalid email address.')
        return email

    def set_password(self, password):
        if not password or len(password) < 8:
            raise ValueError('Password must be at least 8 characters.')
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'repos': self.repos
        }

    def __repr__(self):
        return f'<User {self.username}>'

