import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import { Table, Button } from 'react-bootstrap';

const DeliveryDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      const res = await axios.get(`/orders/delivery/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch delivery orders:', err.response?.data || err.message);
    }
  };

  const markCompleted = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: 'completed' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAssignedOrders();
    } catch (err) {
      console.error('Failed to update order:', err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Delivery Dashboard</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customer?.fullName || 'N/A'}</td>
              <td>{order.customer?.address || 'N/A'}</td>
              <td>{order.status}</td>
              <td>
                {order.status !== 'completed' && (
                  <Button size="sm" onClick={() => markCompleted(order._id)}>Mark Completed</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DeliveryDashboard;
