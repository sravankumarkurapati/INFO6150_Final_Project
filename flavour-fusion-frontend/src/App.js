import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.type; // ✅ FIXED: from .role to .type

  return (
    <Router>
      <div className="app-container">
        <Navbar userType={role} />
        <Routes>
          <Route path="/" element={role ? <Navigate to={`/${role}/dashboard`} /> : <Navigate to="/login/customer" />} />
          <Route path="/login" element={<Navigate to="/login/customer" />} />

          {/* ✅ FIXED: force Login component to re-render using key */}
          <Route path="/login/:role" element={<Login key={window.location.pathname} />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/restaurant/dashboard" element={<ProtectedRoute allowedRoles={['restaurant']}><RestaurantDashboard /></ProtectedRoute>} />
          <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/delivery/dashboard" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
