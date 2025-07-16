import React, { useState } from 'react';
import AddProductForm from '../components/ui/AddProductForm';
import OrdersTable from '../components/ui/OrdersTable';
import UsersTable from '../components/ui/UsersTable';
import blissfulLogo from '../assets/blissful-logo.jpg';
import { ShoppingBag, ClipboardList, Users, PlusCircle } from 'lucide-react';
import './adminpage.css';

const tabData = [
  { key: 'addProduct', label: 'Add Product', icon: <PlusCircle size={18} style={{ marginRight: 8 }} /> },
  { key: 'orders', label: 'Orders', icon: <ClipboardList size={18} style={{ marginRight: 8 }} /> },
  { key: 'users', label: 'Users', icon: <Users size={18} style={{ marginRight: 8 }} /> },
];

const summaryCards = [
  { label: 'Products', value: 8, icon: <ShoppingBag color="#ec4899" size={28} />, bg: 'linear-gradient(90deg, #fdf2f8, #f3e8ff)' },
  { label: 'Orders', value: 2, icon: <ClipboardList color="#9333ea" size={28} />, bg: 'linear-gradient(90deg, #ede9fe, #fdf2f8)' },
  { label: 'Users', value: 2, icon: <Users color="#c026d3" size={28} />, bg: 'linear-gradient(90deg, #f3e8ff, #ede9fe)' },
];

const AdminPage = () => {
  const [tab, setTab] = useState('addProduct');

  return (
    <div className="admin-dashboard-bg">
      {/* Decorative Dots */}
      <div className="admin-decorative-dot admin-dot-1" />
      <div className="admin-decorative-dot admin-dot-2" />
      <div className="admin-decorative-dot admin-dot-3" />
      <div className="admin-decorative-dot admin-dot-4" />
      <div className="admin-dashboard-header">
        <img src={blissfulLogo} alt="Blissful Cakes Logo" className="admin-dashboard-logo" />
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">Manage your application</p>
        {/* Summary Bar */}
        <div style={{ display: 'flex', gap: '1.5rem', margin: '2rem 0 1.5rem 0', justifyContent: 'center', flexWrap: 'wrap' }}>
          {summaryCards.map(card => (
            <div key={card.label} style={{
              background: card.bg,
              borderRadius: '1rem',
              boxShadow: '0 2px 8px rgba(236,72,153,0.08)',
              padding: '1.2rem 2.2rem',
              display: 'flex',
              alignItems: 'center',
              minWidth: 140,
              gap: 12,
            }}>
              {card.icon}
              <div>
                <div style={{ fontWeight: 700, fontSize: 22, color: '#c026d3' }}>{card.value}</div>
                <div style={{ fontWeight: 500, color: '#9333ea', fontSize: 14 }}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div className="admin-dashboard-tabs">
          {tabData.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={tab === t.key ? 'admin-dashboard-tab active' : 'admin-dashboard-tab'}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>
      {/* Divider */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', borderBottom: '2px solid #f3e8ff', marginBottom: 32 }} />
      <div className="admin-dashboard-card">
        {/* Section header with icon */}
        {tab === 'addProduct' && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 8 }}>
            <PlusCircle color="#ec4899" size={22} />
            <h2 style={{ margin: 0, color: '#c026d3' }}>Add Product</h2>
          </div>
        )}
        {tab === 'orders' && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 8 }}>
            <ClipboardList color="#9333ea" size={22} />
            <h2 style={{ margin: 0, color: '#9333ea' }}>Orders</h2>
          </div>
        )}
        {tab === 'users' && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 8 }}>
            <Users color="#c026d3" size={22} />
            <h2 style={{ margin: 0, color: '#c026d3' }}>Users</h2>
          </div>
        )}
        {/* Content */}
        {tab === 'addProduct' && <AddProductForm />}
        {tab === 'orders' && <OrdersTable />}
        {tab === 'users' && <UsersTable />}
      </div>
    </div>
  );
};

export default AdminPage; 