import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-cyan-700 py-8 max-[520px]:mb-16 box-border shadow-inner">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand Name */}
        <div className="text-lg font-bold text-cyan-800">
          GramHub © {new Date().getFullYear()}
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="hover:text-cyan-900 transition duration-200">
            Home
          </Link>
          <Link to="/profile" className="hover:text-cyan-900 transition duration-200">
            Profile
          </Link>
          <Link to="/search" className="hover:text-cyan-900 transition duration-200">
            Explore
          </Link>
          <Link to="/contact" className="hover:text-cyan-900 transition duration-200">
            Contact
          </Link>
        </div>

        {/* Social Media */}
        <div className="flex space-x-4 text-cyan-600">
          <a href="#" className="hover:text-cyan-800 transition duration-200">🐦</a>
          <a href="#" className="hover:text-cyan-800 transition duration-200">📸</a>
          <a href="#" className="hover:text-cyan-800 transition duration-200">🔗</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
