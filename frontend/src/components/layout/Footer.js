import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand Info */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
              CityPet
            </h3>
            <p className="text-sm text-blue-100">
              Caring for your pets since 2023
            </p>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in delay-150">
            <h4 className="text-lg font-semibold text-white mb-3">Contact</h4>
            <p className="text-sm text-blue-100">Email: info@CityPet.com</p>
            <p className="text-sm text-blue-100">Phone: 0754086545</p>
          </div>

          {/* Social Media and Copyright */}
          <div className="animate-fade-in delay-300">
            <h4 className="text-lg font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
            </div>
            <p className="text-sm text-blue-100">
              © {new Date().getFullYear()} CityPet. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;