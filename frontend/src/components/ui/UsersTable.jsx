import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionMessageType, setActionMessageType] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('auth_token');
      const res = await fetch('/api/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch users.');
      }
    } catch (err) {
      setError('Failed to fetch users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBan = async (userId) => {
    setActionMessage(null);
    setActionMessageType(null);
    try {
      const token = Cookies.get('auth_token');
      const res = await fetch(`/api/user/${userId}/ban`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage('User banned.');
        setActionMessageType('success');
        fetchUsers();
      } else {
        setActionMessage(data.message || 'Failed to ban user.');
        setActionMessageType('error');
      }
    } catch (err) {
      setActionMessage('Failed to ban user.');
      setActionMessageType('error');
    }
  };

  const handleUnban = async (userId) => {
    setActionMessage(null);
    setActionMessageType(null);
    try {
      const token = Cookies.get('auth_token');
      const res = await fetch(`/api/user/${userId}/unban`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage('User unbanned.');
        setActionMessageType('success');
        fetchUsers();
      } else {
        setActionMessage(data.message || 'Failed to unban user.');
        setActionMessageType('error');
      }
    } catch (err) {
      setActionMessage('Failed to unban user.');
      setActionMessageType('error');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setActionMessage(null);
    setActionMessageType(null);
    try {
      const token = Cookies.get('auth_token');
      const res = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage('User deleted.');
        setActionMessageType('success');
        fetchUsers();
      } else {
        setActionMessage(data.message || 'Failed to delete user.');
        setActionMessageType('error');
      }
    } catch (err) {
      setActionMessage('Failed to delete user.');
      setActionMessageType('error');
    }
  };

  return (
    <div>
      <h2>Users</h2>
      {actionMessage && (
        <div style={{
          color: actionMessageType === 'success' ? '#16a34a' : '#dc2626',
          background: actionMessageType === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1.5px solid ${actionMessageType === 'success' ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: 8,
          padding: '0.7rem 1rem',
          marginBottom: 12,
          textAlign: 'center',
          fontWeight: 500
        }}>{actionMessage}</div>
      )}
      {loading ? <div>Loading users...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="admin-table-cell">{user.id}</td>
                <td className="admin-table-cell">{user.username}</td>
                <td className="admin-table-cell">{user.email}</td>
                <td className="admin-table-cell">{user.role}</td>
                <td className="admin-table-cell">{user.isActive ? 'Active' : 'Banned'}</td>
                <td className="admin-table-cell">
                  <button onClick={() => handleBan(user.id)} disabled={!user.isActive} style={{ marginRight: 8, background: '#fbbf24', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: user.isActive ? 'pointer' : 'not-allowed', opacity: user.isActive ? 1 : 0.5 }}>Ban</button>
                  <button onClick={() => handleUnban(user.id)} disabled={user.isActive} style={{ marginRight: 8, background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: !user.isActive ? 'pointer' : 'not-allowed', opacity: !user.isActive ? 1 : 0.5 }}>Unban</button>
                  <button onClick={() => handleDelete(user.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style>{`
        .admin-table-cell {
          color: #111;
        }
      `}</style>
    </div>
  );
};

export default UsersTable; 