
import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import { Table, Button, Card, Tabs, Tab } from 'react-bootstrap';

const DeliveryDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const [orders, setOrders] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;

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
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="text-white py-2 px-4 rounded" style={{ background: 'linear-gradient(to right, #ff9966, #ff5e62)' }}>
          Delivery Dashboard
        </h2>
        {user?.fullName && (
          <div className="d-flex align-items-center">
            {user.profileImage && (
              <img
                src={`${baseUrl}${user.profileImage}`}
                alt="Profile"
                width={40}
                height={40}
                className="me-2 rounded-circle"
              />
            )}
            <span className="fw-bold">{user.fullName}</span>
          </div>
        )}
      </div>

      <Tabs defaultActiveKey="active" className="mb-4">
  <Tab eventKey="active" title="Active Orders">
    <div className="row">
        {orders.filter(order => order.status !== 'completed').map(order => (
          <div className="col-md-6 col-lg-4 mb-4" key={order._id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h5 className="mb-2">Order ID: {order._id}</h5>
                <p><strong>Customer:</strong> {order.customer?.fullName || 'N/A'}</p>
                <p><strong>Customer Address:</strong> {order.customer?.address || 'N/A'}</p>
                <p><strong>Restaurant:</strong> {order.restaurant?.name || 'N/A'}</p>
                <p><strong>Restaurant Address:</strong> {order.restaurant?.address || 'N/A'}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Items:</strong></p>
                <ul className="mb-2 ps-3">
                  {order.items.map((i, idx) => (
                    <li key={idx}>
                      {i.item?.name || 'Unnamed'} × {i.quantity}
                    </li>
                  ))}
                </ul>
                {order.status !== 'completed' ? (
                  <Button variant="success" size="sm" onClick={() => markCompleted(order._id)}>
                    Mark Completed
                  </Button>
                ) : (
                  <span className="text-success fw-bold">Completed</span>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
          </div>
  </Tab>
  <Tab eventKey="completed" title="Completed Orders">
    <div className="row">
      {orders.filter(o => o.status === 'completed').map(order => (
        <div className="col-md-6 col-lg-4 mb-4" key={order._id}>
          <Card className="shadow-sm h-100 border-success">
            <Card.Body>
              <h5 className="mb-2">Order ID: {order._id}</h5>
              <p><strong>Customer:</strong> {order.customer?.fullName || 'N/A'}</p>
              <p><strong>Customer Address:</strong> {order.customer?.address || 'N/A'}</p>
              <p><strong>Restaurant:</strong> {order.restaurant?.name || 'N/A'}</p>
              <p><strong>Restaurant Address:</strong> {order.restaurant?.address || 'N/A'}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul className="mb-2 ps-3">
                {order.items.map((i, idx) => (
                  <li key={idx}>
                    {i.item?.name || 'Unnamed'} × {i.quantity}
                  </li>
                ))}
              </ul>
              <span className="text-success fw-bold">Completed</span>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  </Tab>
</Tabs>
</div>
  );
};

export default DeliveryDashboard;