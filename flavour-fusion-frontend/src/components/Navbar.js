import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userType }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: 'linear-gradient(to right, #ff9966, #ff5e62)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          🍽️ FlavourFusion
        </Link>

        {/* NAV LINKS (optional) */}
        {/* <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            ...dashboard links based on userType... 
          </ul>
        </div> */}

        {/* ✅ Logout on far right */}
        <div className="ms-auto">
          {user && (
            <button
              onClick={handleLogout}
              className="btn btn-outline-light fw-bold"
              style={{ borderRadius: '25px' }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
