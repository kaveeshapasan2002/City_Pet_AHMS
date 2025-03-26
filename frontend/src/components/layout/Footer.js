// src/components/layout/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">CityPet</h3>
            <p className="text-sm text-gray-300">Caring for your pets since 2023</p>
          </div>
          
          <div className="mb-4 md:mb-0">
            <h4 className="text-sm font-semibold mb-2">Contact</h4>
            <p className="text-sm text-gray-300">Email: info@CityPet.com</p>
            <p className="text-sm text-gray-300">Phone:0754086545</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} CityPet. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
//i want commit
export default Footer;
