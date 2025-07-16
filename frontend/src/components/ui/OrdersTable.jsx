import React from 'react';
import { ClipboardList } from 'lucide-react';

const mockOrders = [
  { id: 1, user: 'john@example.com', items: 'Chocolate Cake x1', total: 'Rs 800', status: 'Delivered', address: 'Pokhara', phone: '9800000001', note: 'No nuts' },
  { id: 2, user: 'jane@example.com', items: 'Cupcake x2', total: 'Rs 200', status: 'Pending', address: 'Kathmandu', phone: '9800000002', note: 'Birthday message: Happy Bday!' },
];

const statusColors = {
  Delivered: 'badge-delivered',
  Pending: 'badge-pending',
  Cancelled: 'badge-cancelled',
};

const OrdersTable = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 8 }}>
      <ClipboardList color="#9333ea" size={22} />
      <h2 style={{ margin: 0, color: '#9333ea', fontWeight: 700, fontSize: 22 }}>Orders</h2>
    </div>
    <div className="admin-table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user}</td>
              <td>{order.items}</td>
              <td>{order.total}</td>
              <td>
                <span className={`order-status-badge ${statusColors[order.status] || ''}`}>{order.status}</span>
              </td>
              <td>{order.address}</td>
              <td>{order.phone}</td>
              <td>
                <span className="order-note-ellipsis" title={order.note}>{order.note}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersTable; 