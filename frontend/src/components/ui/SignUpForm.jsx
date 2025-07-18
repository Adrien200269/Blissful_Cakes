import React from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import './AuthForm.css';

const SignUpForm = ({ formData, onChange, onSubmit, showPassword, setShowPassword }) => (
  <div className="auth-container">
    <div className="auth-card">
      <h2>Sign Up</h2>
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
      <div className="auth-footer">
        <span>Already have an account? <a href="/signin">Sign In</a></span>
      </div>
    </div>
  </div>
);

export default SignUpForm; 