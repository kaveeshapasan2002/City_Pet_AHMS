// src/components/layout/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuth, user, logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">Pet Hospital</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            
            {isAuth ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/profile" className="hover:text-blue-200">Profile</Link>
                {user && user.role === 'Admin' && (
                  <Link to="/admin" className="hover:text-blue-200">Admin Panel</Link>
                )}
                <button
                  onClick={logoutUser}
                  className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-500">
            <Link to="/" className="block py-2 hover:text-blue-200">Home</Link>
            
            {isAuth ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-blue-200">Dashboard</Link>
                <Link to="/profile" className="block py-2 hover:text-blue-200">Profile</Link>
                {user && user.role === 'Admin' && (
                  <Link to="/admin" className="block py-2 hover:text-blue-200">Admin Panel</Link>
                )}
                <button
                  onClick={logoutUser}
                  className="block w-full text-left py-2 hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-blue-200">Login</Link>
                <Link to="/register" className="block py-2 hover:text-blue-200">Register</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;