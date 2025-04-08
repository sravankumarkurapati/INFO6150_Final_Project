
import React from 'react';

const DeliveryDashboard = () => {
  const deliveries = [
    { id: 1, address: '123 Main St', status: 'Pending' },
    { id: 2, address: '45 Ocean Dr', status: 'Delivered' }
  ];

  return (
    <div className="container mt-4">
      <h2>Delivery Dashboard</h2>
      <ul className="list-group mt-3">
        {deliveries.map(delivery => (
          <li key={delivery.id} className="list-group-item d-flex justify-content-between align-items-center">
            {delivery.address}
            <span className={`badge ${delivery.status === 'Delivered' ? 'bg-success' : 'bg-secondary'}`}>
              {delivery.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryDashboard;
