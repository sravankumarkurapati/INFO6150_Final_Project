import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import { Modal, Button, Form, Tabs, Tab, Image } from 'react-bootstrap';
import { FaUser, FaStore, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Footer from '../components/Footer';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [commissions, setCommissions] = useState([]);

  const [userPage, setUserPage] = useState(1);
  const [restPage, setRestPage] = useState(1);
  const [commPage, setCommPage] = useState(1);

  const pageSize = 5;

      
  // Pagination
    
  
  

  const [showUserModal, setShowUserModal] = useState(false);
  const [showRestModal, setShowRestModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRest, setSelectedRest] = useState(null);

  const [userForm, setUserForm] = useState({ fullName: '', email: '', password: '', type: 'customer', address: '', image: null });
  const [restForm, setRestForm] = useState({ name: '', category: '', commissionRate: '', owner: '', image: null });

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const userRes = await axios.get('/users');
      const restRes = await axios.get('/restaurants');
      setUsers(userRes.data?.users || []);
      setRestaurants(restRes.data || []);
    } catch (error) {
      console.error('Fetch error:', error?.response?.data || error.message);
    }
  };

  const fetchCommissions = async () => {
    try {
      const res = await axios.get('/orders/admin/restaurant-commissions');
      setCommissions(res.data);
    } catch (err) {
      console.error('Commission fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCommissions();
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in userForm) formData.append(key, userForm[key]);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    try {
      if (editMode && selectedUser) {
        await axios.put(`/users/${selectedUser._id}`, formData, config);
      } else {
        await axios.post('/users', formData, config);
      }
      setShowUserModal(false);
      setUserForm({ fullName: '', email: '', password: '', type: 'customer', address: '', image: null });
      fetchData();
    } catch (err) {
      alert('Failed to submit user. Check form data.');
    }
  };

  const handleRestSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in restForm) formData.append(key, restForm[key]);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    try {
      if (editMode && selectedRest) {
        await axios.put(`/restaurants/${selectedRest._id}`, formData, config);
      } else {
        await axios.post('/restaurants', formData, config);
      }
      setShowRestModal(false);
      setRestForm({ name: '', category: '', commissionRate: '', owner: '', image: null });
      fetchData();
    } catch (err) {
      alert('Failed to submit restaurant. Check form data.');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete user?')) {
      await axios.delete(`/users/${id}`);
      fetchData();
    }
  };

  const deleteRestaurant = async (id) => {
    if (window.confirm('Delete restaurant?')) {
      await axios.delete(`/restaurants/${id}`);
      fetchData();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="text-white py-2 px-4 rounded" style={{ background: 'linear-gradient(to right, #ff9966, #ff5e62)' }}>Admin Dashboard</h2>
        {user?.fullName && (
          <div className="d-flex align-items-center">
            {user.profileImage && (
              <Image src={`${baseUrl}${user.profileImage}`} roundedCircle width={40} height={40} style={{ objectFit: 'cover', marginRight: '10px' }} />
            )}
            <span className="fw-bold">{user.fullName}</span>
          </div>
        )}
      </div>

      <div className="container-fluid mt-4">
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="users" title="Users">
          <div className="text-end mb-3">
            <Button onClick={() => {
              setEditMode(false);
              setSelectedUser(null);
              setUserForm({ fullName: '', email: '', password: '', type: 'customer', address: '', image: null });
              setShowUserModal(true);
            }}>
              <FaPlus className="me-1" /> Add User
            </Button>
          </div>
          <table className="table table-bordered align-middle text-center">
            <thead className="table-warning">
              <tr><th>Image</th><th>Name</th><th>Email</th><th>Role</th><th>Address</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.slice((userPage - 1) * pageSize, userPage * pageSize).map(user => (
                <tr key={user._id}>
                  <td>
                    {user.profileImage ? (
                      <img src={`${baseUrl}${user.profileImage}`} alt="Profile" width="40" height="40" style={{ objectFit: "cover", borderRadius: "50%" }} />
                    ) : (
                      <span className="text-muted small">No image</span>
                    )}
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td><span className="badge bg-danger">{user.type}</span></td>
                  <td>{user.address || '—'}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-1" onClick={() => {
                      setEditMode(true);
                      setSelectedUser(user);
                      setShowUserModal(true);
                      setUserForm({ ...user, password: '', image: null });
                    }}><FaEdit /></Button>
                    <Button size="sm" variant="danger" onClick={() => deleteUser(user._id)}><FaTrash /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

{restaurants.length > pageSize && (
  <div className="d-flex justify-content-center mt-3">
    {Array.from({ length: Math.ceil(restaurants.length / pageSize) }, (_, index) => (
      <Button
        key={index}
        variant={restPage === index + 1 ? 'primary' : 'light'}
        onClick={() => setRestPage(index + 1)}
        className="mx-1"
      >
        {index + 1}
      </Button>
    ))}
  </div>
)}



{users.length > pageSize && (
  <div className="d-flex justify-content-center mt-3">
    {Array.from({ length: Math.ceil(users.length / pageSize) }, (_, index) => (
      <Button
        key={index}
        variant={userPage === index + 1 ? 'primary' : 'light'}
        onClick={() => setUserPage(index + 1)}
        className="mx-1"
      >
        {index + 1}
      </Button>
    ))}
  </div>
)}


        </Tab>

        <Tab eventKey="restaurants" title="Restaurants">
          <div className="text-end mb-3">
            <Button onClick={() => {
              setEditMode(false);
              setSelectedRest(null);
              setRestForm({ name: '', category: '', commissionRate: '', owner: '', image: null });
              setShowRestModal(true);
            }}>
              <FaPlus className="me-1" /> Add Restaurant
            </Button>
          </div>
          <table className="table table-bordered align-middle text-center">
            <thead className="table-warning">
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Commission</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {restaurants.slice((restPage - 1) * pageSize, restPage * pageSize).map(r => (
                <tr key={r._id}>
                  <td>
                    {r.image ? (
                      <img src={`${baseUrl}${r.image}`} alt="Restaurant" width="60" height="50" style={{ objectFit: "cover", borderRadius: "8px" }} />
                    ) : (
                      <span className="text-muted small">No image</span>
                    )}
                  </td>
                  <td>{r.name}</td>
                  <td>{r.category}</td>
                  <td>{r.commissionRate || 0}%</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-1" onClick={() => {
                      setEditMode(true);
                      setSelectedRest(r);
                      setShowRestModal(true);
                      setRestForm({ ...r, image: null });
                    }}><FaEdit /></Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRestaurant(r._id)}><FaTrash /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tab>

        <Tab eventKey="commissions" title="Commissions">
  <h5 className="mt-3 mb-2">Restaurant Commissions Summary</h5>
  <table className="table table-bordered text-center">
    <thead className="table-warning">
      <tr>
        <th>Restaurant</th>
        <th>Revenue (USD)</th>
        <th>Commission Rate (%)</th>
        <th>Commission (USD)</th>
        <th>Orders</th>
      </tr>
    </thead>
    <tbody>
      {commissions.slice((commPage - 1) * pageSize, commPage * pageSize).map((row, idx) => (
        <tr key={idx}>
          <td>{row.restaurantName || 'N/A'}</td>
          <td>{row.totalRevenue?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}</td>
          <td>{row.commissionRate || 10}</td>
          <td>{row.totalCommission?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}</td>
          <td>{row.orderCount || 0}</td>
        </tr>
      ))}
    </tbody>
  </table>
</Tab>

      </Tabs>
    </div>

      {/* User Modal */}
      <Modal key={editMode ? selectedUser?._id : 'newUser'} show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editMode ? 'Edit User' : 'Add User'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserSubmit}>
            <Form.Group><Form.Label>Name</Form.Label><Form.Control value={userForm.fullName} onChange={e => setUserForm({ ...userForm, fullName: e.target.value })} required /></Form.Group>
            <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required /></Form.Group>
            {!editMode && (
              <Form.Group><Form.Label>Password</Form.Label><Form.Control type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required /></Form.Group>
            )}
            <Form.Group><Form.Label>Role</Form.Label>
              <Form.Select value={userForm.type} onChange={e => setUserForm({ ...userForm, type: e.target.value })}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="restaurant">Restaurant</option>
                <option value="delivery">Delivery</option>
              </Form.Select>
            </Form.Group>
            <Form.Group><Form.Label>Address</Form.Label><Form.Control value={userForm.address} onChange={e => setUserForm({ ...userForm, address: e.target.value })} /></Form.Group>
            <Form.Group className="mt-2"><Form.Label>Profile Image</Form.Label><Form.Control type="file" onChange={e => setUserForm({ ...userForm, image: e.target.files[0] })} /></Form.Group>
            <Button type="submit" className="mt-3 w-100">{editMode ? 'Update' : 'Create'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Restaurant Modal */}
      <Modal key={editMode ? selectedRest?._id : 'newRest'} show={showRestModal} onHide={() => setShowRestModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editMode ? 'Edit Restaurant' : 'Add Restaurant'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRestSubmit}>
            <Form.Group><Form.Label>Name</Form.Label><Form.Control value={restForm.name} onChange={e => setRestForm({ ...restForm, name: e.target.value })} required /></Form.Group>
            <Form.Group><Form.Label>Category</Form.Label><Form.Control value={restForm.category} onChange={e => setRestForm({ ...restForm, category: e.target.value })} required /></Form.Group>
            <Form.Group><Form.Label>Commission Rate (%)</Form.Label><Form.Control type="number" value={restForm.commissionRate} onChange={e => setRestForm({ ...restForm, commissionRate: e.target.value })} required /></Form.Group>
            <Form.Group><Form.Label>Restaurant Owner</Form.Label>
              <Form.Select value={restForm.owner} onChange={e => setRestForm({ ...restForm, owner: e.target.value })} required>
                <option value="">Select a restaurant owner</option>
                {users.filter(u => u.type === 'restaurant').map(u => (
                  <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2"><Form.Label>Restaurant Image</Form.Label><Form.Control type="file" onChange={e => setRestForm({ ...restForm, image: e.target.files[0] })} /></Form.Group>
            <Button type="submit" className="mt-3 w-100">{editMode ? 'Update' : 'Create'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
     
    </div>
  );
};

export default AdminDashboard;