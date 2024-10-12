import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">Unus</Link>
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-gray-600 hover:text-gray-800">Home</Link>
              <Link to="/account" className="text-gray-600 hover:text-gray-800">Account</Link>
              <Link to="/example-form" className="text-gray-600 hover:text-gray-800">Example Form</Link>
              <span className="text-gray-600">Welcome, {user.username}</span>
              <Button onClick={onLogout} variant="outline">Logout</Button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;