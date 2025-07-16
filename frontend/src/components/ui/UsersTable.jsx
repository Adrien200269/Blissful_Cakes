import React from 'react';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: 2, name: 'Jane Admin', email: 'jane@admin.com', role: 'admin' },
];

const UsersTable = () => (
  <div>
    <h2>Users</h2>
    <table className="admin-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {mockUsers.map(user => (
          <tr key={user.id}>
            <td className="admin-table-cell">{user.id}</td>
            <td className="admin-table-cell">{user.name}</td>
            <td className="admin-table-cell">{user.email}</td>
            <td className="admin-table-cell">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <style>{`
      .admin-table-cell {
        color: #111;
      }
    `}</style>
  </div>
);

export default UsersTable; 