import React from 'react';
import './Footer.css'; // Make sure this is imported if you're using custom styles

const Footer = () => {
  return (
    <footer className="footer-full bg-black text-white py-4 mt-5">
      <div className="text-center">
        <h5 className="mb-2">🍴 Flavour Fusion</h5>
        <p className="small mb-1">Delivering taste to your doorstep</p>
        <p className="small mb-0">📞 Contact: +1 (123) 456-7890</p>
        <p className="small mb-3">📧 Email: support@flavourfusion.com</p>
        <div className="text-muted small">
          &copy; {new Date().getFullYear()} Flavour Fusion · All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
