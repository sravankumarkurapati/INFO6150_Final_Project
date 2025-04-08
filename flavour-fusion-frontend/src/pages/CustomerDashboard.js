
import React from 'react';

const CustomerDashboard = () => {
  const orders = [
    { id: 1, item: 'Burger', status: 'Delivered' },
    { id: 2, item: 'Pizza', status: 'In Progress' }
  ];

  return (
    <div className="container mt-4">
      <h2>Customer Dashboard</h2>
      <ul className="list-group mt-3">
        {orders.map(order => (
          <li key={order.id} className="list-group-item d-flex justify-content-between">
            <span>{order.item}</span>
            <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning'}`}>
              {order.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDashboard;
