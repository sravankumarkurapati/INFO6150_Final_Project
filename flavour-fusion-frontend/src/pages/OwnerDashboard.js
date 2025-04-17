
import React from 'react';

const OwnerDashboard = () => {
  const menu = [
    { id: 1, dish: 'Pasta Alfredo', price: 180 },
    { id: 2, dish: 'Tandoori Chicken', price: 240 }
  ];

  return (
    <div className="container mt-4">
      <h2>Owner Dashboard</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4 mt-3">
        {menu.map(item => (
          <div className="col" key={item.id}>
            <div className="card p-3 shadow-sm">
              <h5>{item.dish}</h5>
              <p>₹{item.price}</p>
              <button className="btn btn-outline-primary btn-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;
