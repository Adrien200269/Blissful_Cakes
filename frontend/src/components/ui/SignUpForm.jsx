import React from 'react';
import { Eye, EyeOff, User } from 'lucide-react';

const SignUpForm = ({ formData, onChange, onSubmit, showPassword, setShowPassword }) => (
  <form onSubmit={onSubmit} className="form">
    <div className="form-group">
      <label className="form-label">Username</label>
      <div className="form-input-wrapper">
        <User className="form-icon" />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder="Enter your username"
          className="form-input"
          required
        />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Email</label>
      <div className="form-input-wrapper">
        <span className="form-icon email">@</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Enter your email"
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
          placeholder="Create a password"
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
      <span>✨</span>Create Account
    </button>
  </form>
);

export default SignUpForm; 