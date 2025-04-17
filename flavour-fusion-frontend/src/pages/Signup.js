import React, { useState } from 'react';
import axios from '../axiosInstance';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const Signup = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    type: 'customer',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateField = (field, value) => {
    switch (field) {
      case 'fullName':
        return value.trim().length >= 3 ? '' : 'Name must be at least 3 characters';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'password':
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(value)
          ? ''
          : 'Password must be 6+ chars, include uppercase, number, special char';
      case 'address':
        return value.trim().length > 0 ? '' : 'Address is required';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (key !== 'image') {
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    try {
      await axios.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✅ Signup successful! Please login.');
      setForm({ fullName: '', email: '', password: '', address: '', type: 'customer', image: null });
      setErrors({});
    } catch (err) {
      setMessage('❌ Signup failed. Try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '480px' }}>
        <h3 className="mb-4 text-center text-danger">Signup</h3>
        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              isInvalid={!!errors.fullName}
            />
            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>User Role</Form.Label>
            <Form.Control
              as="select"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              isInvalid={!!errors.type}
              required
            >
              <option value="">Select Role</option>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="delivery">Delivery</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
          </Form.Group>

          <Button type="submit" className="w-100 mt-2" variant="danger">
            Sign Up
          </Button>
        
          <div className="text-center mt-3">
            <span>Already have an account? </span>
            <a href="/login" className="text-primary text-decoration-underline">Login here</a>
          </div>

        </Form>
      </Card>
    </div>
  );
};

export default Signup;