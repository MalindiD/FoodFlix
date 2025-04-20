import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} FoodFlix. All rights reserved.</p>
        <div className="mt-2">
          <a href="/about" className="text-white hover:text-gray-400 mx-2">
            About Us
          </a>
          <a href="/contact" className="text-white hover:text-gray-400 mx-2">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
