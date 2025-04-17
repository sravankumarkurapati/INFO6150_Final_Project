import React from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../utils';

const Navbar = ({ userType }) => {
  const user = JSON.parse(localStorage.getItem('user'));

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

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {userType === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/admin/dashboard">
                  Admin Panel
                </Link>
              </li>
            )}
            {userType === 'restaurant' && (
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/restaurant/dashboard">
                  Restaurant Panel
                </Link>
              </li>
            )}
            {userType === 'customer' && (
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/customer/dashboard">
                  Customer Panel
                </Link>
              </li>
            )}
            {userType === 'delivery' && (
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/delivery/dashboard">
                  Delivery Panel
                </Link>
              </li>
            )}
          </ul>

          {user && (
            <button
              onClick={logoutUser}
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
