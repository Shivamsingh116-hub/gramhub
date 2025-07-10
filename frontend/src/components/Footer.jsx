import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 max-[520px]:mb-16  box-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand Name */}
        <div className="text-lg font-semibold text-white">
          GramHub © {new Date().getFullYear()}
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <Link to="/profile" className="hover:text-white transition">
            Profile
          </Link>
          <Link to="/search" className="hover:text-white transition">
            Explore
          </Link>
          <Link to="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </div>

        {/* Social Media (Icons or Text Placeholder) */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white transition">🐦</a>
          <a href="#" className="hover:text-white transition">📸</a>
          <a href="#" className="hover:text-white transition">🔗</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
