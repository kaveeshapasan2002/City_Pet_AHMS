// Update to src/components/layout/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBadge from '../messaging/NotificationBadge';

const Header = () => {
  const { isAuth, user, logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 animate-fade-in">
            CityPet
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About' },
              
              { to: '/services', label: 'Services' },
              { to: '/contact', label: 'Contact' },
            ].map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className="relative text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {isAuth ? (
              <>
                <Link
                  to="/dashboard"
                  className="relative text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 animate-fade-in group"
                  style={{ animationDelay: '750ms' }}
                >
                  Dashboard
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                {/* Messages Link with optional notification count */}
                <Link
                  to="/messages"
                  className="relative text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 animate-fade-in group"
                  style={{ animationDelay: '900ms' }}
                >
                  Messages
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                {/* Notification Badge */}
                <NotificationBadge />
                
                <Link
                  to="/profile"
                  className="relative text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 animate-fade-in group"
                  style={{ animationDelay: '1050ms' }}
                >
                  Profile
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {user && user.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className="relative text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 animate-fade-in group"
                    style={{ animationDelay: '1200ms' }}
                  >
                    Admin Panel
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                <button
                  onClick={logoutUser}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 animate-bounce delay-1350"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 animate-bounce delay-750"
              >
                Log In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
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
          <nav className="md:hidden py-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 animate-slide-down">
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About' },
              { to: '/staff', label: 'Our Staff' },
              { to: '/services', label: 'Services' },
              { to: '/contact', label: 'Contact' },
            ].map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className="block py-3 px-4 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
            {isAuth ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-3 px-4 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="block py-3 px-4 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block py-3 px-4 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                >
                  Profile
                </Link>
                {user && user.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className="block py-3 px-4 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logoutUser}
                  className="block w-full text-left py-3 px-4 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-3 px-4 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
              >
                Log In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

//added that updated header