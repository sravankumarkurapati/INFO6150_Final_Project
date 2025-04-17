
// Cleaned & Valid JSX with correct structure, delivery person display, and status handling

import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import { Form, Button, Table, Modal, Card, Tabs, Tab } from 'react-bootstrap';

const RestaurantDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const [restaurantId, setRestaurantId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [items, setItems] = useState([]);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [newOrders, setNewOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [deliveringOrders, setDeliveringOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [deliveryPeople, setDeliveryPeople] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', image: null });
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalCommission: 0, totalOrders: 0 });
  const [key, setKey] = useState('performance');

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const res = await axios.get(`/restaurants/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRestaurantId(res.data.restaurant._id);
        setRestaurantName(res.data.restaurant.name);
      } catch (err) {
        console.error('Failed to fetch restaurant ID:', err);
      }
    };

    fetchRestaurantId();
    fetchDeliveryUsers();
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchItems();
      fetchOrders();
      fetchStats();
    }
  }, [restaurantId]);

  const fetchStats = async () => {
    const res = await axios.get(`/orders/restaurant/${restaurantId}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStats(res.data);
  };

  const fetchItems = async () => {
    const res = await axios.get(`/items/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`/orders/restaurant/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orders = res.data;
    setNewOrders(orders.filter(o => ['pending', 'processing', 'accepted'].includes(o.status)));
    setPreparingOrders(orders.filter(o => o.status === 'preparing'));
    setDeliveringOrders(orders.filter(o => o.status === 'delivering'));
    setCompletedOrders(orders.filter(o => o.status === 'completed'));
  };

  const fetchDeliveryUsers = async () => {
    const res = await axios.get('/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const allUsers = res.data.users || res.data;
    setDeliveryPeople(allUsers.filter(u => u.type === 'delivery'));
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await axios.put(`/orders/${orderId}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrders();
  };

  const assignDelivery = async (orderId, deliveryPersonId) => {
    await axios.put(`/orders/${orderId}/assign`, { deliveryPersonId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrders();
  };

  const handleAddItem = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('quantity', form.quantity);
    formData.append('restaurant', restaurantId);
    formData.append('image', form.image);

    await axios.post('/items', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    setShowAddModal(false);
    fetchItems();
  };

  const updateItemQuantity = async (itemId, oldQty, newQty) => {
    if (oldQty === newQty) return;
    if (window.confirm(`Update quantity from ${oldQty} to ${newQty}?`)) {
      await axios.put(`/items/${itemId}`, { quantity: newQty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    }
  };

  const headerStyle = {
    background: 'linear-gradient(to right, #ff9966, #ff5e62)',
    color: '#fff',
    textAlign: 'center',
    padding: '12px 0',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold'
  };

  const orderTable = (title, data, showActions = false, showDeliveryPerson = false) => (
    <div className="mt-4">
      <h5 style={headerStyle}>{title}</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            {showDeliveryPerson ? <th>Delivery Person</th> : <th>Delivery</th>}
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customer?.fullName || 'N/A'}</td>
              <td>{order.status}</td>
              <td>{order.totalAmount}</td>
              <td>
                {(order.status === 'preparing' || order.status === 'delivering') ? (
                  <Form.Select
                    value={order.deliveryPerson?._id || ''}
                    onChange={(e) => assignDelivery(order._id, e.target.value)}
                    disabled={order.status === 'delivering'}
                  >
                    <option value="">Assign Delivery Person</option>
                    {deliveryPeople.map(dp => (
                      <option key={dp._id} value={dp._id}>{dp.fullName}</option>
                    ))}
                  </Form.Select>
                ) : (
                  <span className="text-muted">Not Applicable</span>
                )}
              </td>
              {showDeliveryPerson && <td>{order.deliveryPerson?.fullName || 'N/A'}</td>}
              {showActions && (
                <td>
                  {order.status === 'pending' && <Button size="sm" onClick={() => updateOrderStatus(order._id, 'preparing')}>Prepare</Button>}
                  {order.status === 'preparing' && <Button size="sm" onClick={() => updateOrderStatus(order._id, 'delivering')}>Deliver</Button>}
                  {order.status === 'delivering' && <span className="text-muted">In Progress</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div className="container py-4">
      <div style={headerStyle}>Restaurant Dashboard</div>
      <h4 className="text-center mb-4 text-muted">Welcome, {restaurantName}</h4>

      <Tabs activeKey={key} onSelect={setKey} className="mb-4 justify-content-center">
        <Tab eventKey="performance" title="Performance">
          <Card className="mb-4 p-3 shadow-sm">
            <h5 className="mb-3">Restaurant Performance</h5>
            <p><strong>Total Orders:</strong> {stats.totalOrders}</p>
            <p><strong>Total Revenue:</strong> ₹{stats.totalRevenue}</p>
            <p><strong>Commission to Flavour Fusion:</strong> ₹{stats.totalCommission}</p>
          </Card>
        </Tab>

        <Tab eventKey="items" title="Item Management">
          <div className="text-center mb-3">
            <Button onClick={() => setShowAddModal(true)}>Add Item</Button>
          </div>

          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton><Modal.Title>Add Item</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group><Form.Label>Name</Form.Label><Form.Control type="text" onChange={(e) => setForm({ ...form, name: e.target.value })} /></Form.Group>
                <Form.Group><Form.Label>Price</Form.Label><Form.Control type="number" onChange={(e) => setForm({ ...form, price: e.target.value })} /></Form.Group>
                <Form.Group><Form.Label>Quantity</Form.Label><Form.Control type="number" onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></Form.Group>
                <Form.Group><Form.Label>Image</Form.Label><Form.Control type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} /></Form.Group>
                <Button className="mt-3" onClick={handleAddItem}>Submit</Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Table striped bordered hover className="mt-4">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Qty</th><th>Update</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td className="d-flex">
                    <Form.Control
                      type="number"
                      value={editedQuantities[item._id] ?? item.quantity}
                      onChange={(e) => setEditedQuantities(prev => ({ ...prev, [item._id]: e.target.value }))}
                      style={{ width: '80px', marginRight: '10px' }}
                    />
                    <Button
                      size="sm"
                      onClick={() => updateItemQuantity(item._id, item.quantity, parseInt(editedQuantities[item._id]))}
                      disabled={parseInt(editedQuantities[item._id]) === item.quantity || !editedQuantities[item._id]}
                    >Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="orders" title="Orders">
          {orderTable('New Orders', newOrders, true)}
          {orderTable('Preparing Orders', preparingOrders, true)}
          {orderTable('Delivering Orders', deliveringOrders, true)}
          {orderTable('Completed Orders', completedOrders, false, true)}
        </Tab>
      </Tabs>
    </div>
  );
};

export default RestaurantDashboard;