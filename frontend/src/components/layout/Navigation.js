// src/components/layout/Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Navigation links based on user role
  const getNavLinks = () => {
    const links = [
      { to: '/dashboard', label: 'Dashboard', icon: 'chart-pie', allowedRoles: ['Admin', 'Veterinarian', 'Pet Owner', 'Receptionist'] },
      { to: '/profile', label: 'Profile', icon: 'user', allowedRoles: ['Admin', 'Veterinarian', 'Pet Owner', 'Receptionist'] },
    ];

    // Admin specific links
    if (user && user.role === 'Admin') {
      links.push({ to: '/admin', label: 'Admin Panel', icon: 'cog', allowedRoles: ['Admin'] });
    }

    // Inventory management (available to staff but not pet owners)
    if (user && ['Admin', 'Veterinarian', 'Receptionist'].includes(user.role)) {
      links.push({ to: '/inventory', label: 'Inventory', icon: 'clipboard-list', allowedRoles: ['Admin', 'Veterinarian', 'Receptionist'] });
    }

    return links.filter(link => !link.allowedRoles || (user && link.allowedRoles.includes(user.role)));
  };

  // Get appropriate icon
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'chart-pie':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
          </svg>
        );
      case 'user':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        );
      case 'cog':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        );
      case 'clipboard-list':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="px-4 py-4">
      <ul className="space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center p-2 rounded-lg ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {getIcon(link.icon)}
                </div>
                <span className="ml-3">{link.label}</span>
                {isActive && (
                  <span className="ml-auto">
                    <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;