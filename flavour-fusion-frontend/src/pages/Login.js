
import React from 'react';
import '../styles/custom.css';
import loginBg from '../assets/login_background.jpg';

const Login = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white p-4 rounded shadow" style={{ minWidth: '300px' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
