import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; // ✅
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  return (
    <Router>
      <Navbar userType={role} />
      <Routes>
        <Route path="/" element={role ? <Navigate to={`/${role}/dashboard`} /> : <Navigate to="/login/customer" />} />
        <Route path="/login" element={<Navigate to="/login/customer" />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ This enables routing */}

        {/* Dashboard Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/restaurant/dashboard" element={<ProtectedRoute allowedRoles={['restaurant']}><RestaurantDashboard /></ProtectedRoute>} />
        <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/delivery/dashboard" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
