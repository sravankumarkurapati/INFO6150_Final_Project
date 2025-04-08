
import React from 'react';

const AdminDashboard = () => {
  const users = [
    { id: 1, name: 'Alice', role: 'Customer' },
    { id: 2, name: 'Bob', role: 'Owner' }
  ];

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr><th>User</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}><td>{user.name}</td><td>{user.role}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
