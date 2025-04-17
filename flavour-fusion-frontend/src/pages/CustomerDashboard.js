import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import { Card, Button, Row, Col, Modal, Form, Alert, Pagination, Tabs, Tab } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '../components/StripeCheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CustomerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [restaurants, setRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [currentRestaurantPage, setCurrentRestaurantPage] = useState(1);
  const [currentItemPage, setCurrentItemPage] = useState(1);
  const restaurantsPerPage = 6;
  const itemsPerPage = 6;

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, []);

  const fetchRestaurants = async () => {
    const res = await axios.get('/restaurants', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setRestaurants(res.data.restaurants || res.data);
  };

  const fetchItems = async (restaurantId) => {
    const res = await axios.get(`/items/${restaurantId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setItems(res.data);
    setSelectedRestaurant(restaurantId);
    setCurrentItemPage(1);
  };

  const fetchOrders = async () => {
    const res = await axios.get('/orders/customer', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setOrders(res.data);
  };

  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].restaurant !== selectedRestaurant) {
      if (window.confirm("You already have items from another restaurant. Clear cart and add this item?")) {
        setCart([{ item, quantity: 1, restaurant: selectedRestaurant }]);
      }
      return;
    }

    const exists = cart.find(c => c.item._id === item._id);
    if (exists) {
      setCart(cart.map(c => c.item._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item, quantity: 1, restaurant: selectedRestaurant }]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart(cart.map(c => c.item._id === id ? { ...c, quantity: parseInt(qty) } : c));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedRestaurant(null);
    setItems([]);
  };

  const placeOrderAfterPayment = async () => {
    try {
      const payload = {
        restaurant: selectedRestaurant,
        items: cart.map(c => ({ item: c.item._id, quantity: c.quantity })),
        totalAmount: cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0)
      };

      const res = await axios.post('/orders', payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      await axios.put(`/orders/${res.data._id}/completePayment`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setMessage("✅ Payment successful and order placed!");
      clearCart();
      fetchOrders();
      setShowStripeModal(false);
    } catch (err) {
      setMessage("❌ Order failed after payment");
    }
  };

  const paginate = (items, page, perPage) => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  };

  const inProgressOrders = orders.filter(o => o.status !== 'delivered');
  const pastOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="container mt-4">
      <h2>Customer Dashboard</h2>
      {message && <Alert variant="success">{message}</Alert>}

      <Tabs defaultActiveKey="restaurants" className="mb-3">
        <Tab eventKey="restaurants" title="Browse Restaurants">
          <h4 className="mt-4">Restaurants</h4>
          <Row>
            {paginate(restaurants, currentRestaurantPage, restaurantsPerPage).map(r => (
              <Col md={4} key={r._id} className="mb-3">
                <Card style={{ height: '100%' }}>
                <Card.Img
  variant="top"
  src={`${process.env.REACT_APP_BASE_URL}${r.image}`}
  style={{
    height: '200px',
    width: '100%',
    objectFit: 'cover',
    display: 'block'
  }}
/>

                  <Card.Body>
                    <Card.Title>{r.name}</Card.Title>
                    <Card.Text>{r.category}</Card.Text>
                    <Button onClick={() => fetchItems(r._id)}>Explore Menu</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Pagination>
            {[...Array(Math.ceil(restaurants.length / restaurantsPerPage)).keys()].map(num => (
              <Pagination.Item key={num + 1} active={num + 1 === currentRestaurantPage} onClick={() => setCurrentRestaurantPage(num + 1)}>
                {num + 1}
              </Pagination.Item>
            ))}
          </Pagination>

          {items.length > 0 && (
            <Row className="mt-5">
              <Col md={8}>
                <h4>Menu</h4>
                <Row>
                  {paginate(items, currentItemPage, itemsPerPage).map(item => (
                    <Col md={6} key={item._id} className="mb-3">
                      <Card>
                      <Card.Img
  variant="top"
  src={`${process.env.REACT_APP_BASE_URL}${item.image}`}
  style={{
    height: '160px',
    width: '100%',
    objectFit: 'cover',
    display: 'block'
  }}
/>

                        <Card.Body>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>₹{item.price}</Card.Text>
                          <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Pagination>
                  {[...Array(Math.ceil(items.length / itemsPerPage)).keys()].map(num => (
                    <Pagination.Item key={num + 1} active={num + 1 === currentItemPage} onClick={() => setCurrentItemPage(num + 1)}>
                      {num + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </Col>

              <Col md={4}>
                {cart.length > 0 && (
                  <div className="bg-light p-3 rounded shadow sticky-top">
                    <h5>Your Cart</h5>
                    <table className="table small">
                      <thead>
                        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
                      </thead>
                      <tbody>
                        {cart.map(c => (
                          <tr key={c.item._id}>
                            <td>{c.item.name}</td>
                            <td>
                              <input type="number" min="1" value={c.quantity} onChange={(e) => updateQty(c.item._id, e.target.value)} style={{ width: '50px' }} />
                            </td>
                            <td>₹{c.item.price * c.quantity}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="2" className="text-end"><strong>Total</strong></td>
                          <td>₹{cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                    <Button variant="success" onClick={() => setShowStripeModal(true)} className="w-100">Pay & Place Order</Button>
                    <Button variant="secondary" onClick={clearCart} className="w-100 mt-2">Clear Cart</Button>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Tab>

        <Tab eventKey="orders" title="My Orders">
          <h4 className="mt-4">Orders In Progress</h4>
          <table className="table table-bordered">
            <thead>
              <tr><th>Order ID</th><th>Total</th><th>Status</th><th>Items</th></tr>
            </thead>
            <tbody>
              {inProgressOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>
                    <ul className="mb-0">
                      {order.items.map((i, idx) => (
                        <li key={idx}>{i.item?.name} x {i.quantity}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="mt-5">Past Orders</h4>
          <table className="table table-bordered">
            <thead>
              <tr><th>Order ID</th><th>Total</th><th>Status</th><th>Items</th></tr>
            </thead>
            <tbody>
              {pastOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>
                    <ul className="mb-0">
                      {order.items.map((i, idx) => (
                        <li key={idx}>{i.item?.name} x {i.quantity}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tab>
      </Tabs>

      <Modal show={showStripeModal} onHide={() => setShowStripeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm
              amount={cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0)}
              onPaymentSuccess={placeOrderAfterPayment}
            />
          </Elements>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
