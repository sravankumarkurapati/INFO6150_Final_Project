
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container text-center">
        <h5 className="mb-2 fw-bold" style={{ color: '#ff9966' }}>Flavour Fusion</h5>
        <p className="mb-1">Delivering Taste to Your Doorstep</p>
        <p className="small mb-1">📧 support@flavourfusion.com | 📞 +1 (555) 123-4567</p>
        <p className="small mb-0">© {new Date().getFullYear()} Flavour Fusion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;