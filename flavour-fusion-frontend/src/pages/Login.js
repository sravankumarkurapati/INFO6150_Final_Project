import React, { useState } from 'react';
import axios from '../axiosInstance';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', { email, password });
      const user = res.data;
      if (user.type.toLowerCase() !== role.toLowerCase()) {
        alert(`Incorrect role selected. You are logged in as '${user.type}'`);
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = `/${user.type}/dashboard`;
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      className="login-bg d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundImage: 'url(/bg-food.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
    >
      <div className="card shadow-lg p-4 border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <h3 className="text-center mb-4" style={{ color: '#ff5e62' }}>Flavour Fusion Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="restaurant">Restaurant</option>
              <option value="customer">Customer</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-lg btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: '#ff5e62', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
