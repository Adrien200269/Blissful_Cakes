import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const SignInForm = ({ formData, onChange, onSubmit, showPassword, setShowPassword, onForgotPassword }) => {
  return <form onSubmit={onSubmit} className="form">
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
          placeholder="Enter your password"
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
    <div className="forgot-password">
      <button type="button" className="forgot-password-link" onClick={onForgotPassword}>
        Forgot Password?
      </button>
    </div>
    <button type="submit" className="submit-button">
      <span>✨</span>Sign In
    </button>
  </form>
}

export default SignInForm; 