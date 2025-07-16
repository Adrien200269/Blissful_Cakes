import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AdminLoginForm = ({ formData, onChange, onSubmit, showPassword, setShowPassword }) => (
  <form onSubmit={onSubmit} className="form">
    <div className="form-group">
      <label className="form-label">Admin Email</label>
      <div className="form-input-wrapper">
        <span className="form-icon email">@</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Enter admin email"
          className="form-input"
          required
        />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Password</label>
      <div className="form-input-wrapper">
        <span className="form-icon password">🔒</span>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Enter password"
          className="form-input"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
    <button type="submit" className="submit-button">
      <span>✨</span>Admin Login
    </button>
  </form>
);

export default AdminLoginForm; 