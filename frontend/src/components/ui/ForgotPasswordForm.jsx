import React from 'react';
import { Button } from './button';

const ForgotPasswordForm = ({ email, onChange, onSubmit, onBack, sent }) => (
  sent ? (
    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <h2 style={{ color: '#9333ea', marginBottom: '1rem' }}>Check your email</h2>
      <p style={{ color: '#444' }}>If this email exists, a password reset link has been sent.</p>
      <Button onClick={onBack}>Back to Sign In</Button>
    </div>
  ) : (
    <form onSubmit={onSubmit} className="forgot-password-form">
      <div className="form-group">
        <label className="form-label">Enter your email</label>
        <div className="form-input-wrapper">
          <span className="form-icon email">@</span>
          <input
            type="email"
            name="forgotPasswordEmail"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
            className="form-input"
            required
          />
        </div>
      </div>
      <Button type="submit">Send Reset Link</Button>
      <Button type="button" onClick={onBack} style={{ marginLeft: 8, background: '#fff', color: '#c026d3', border: '1px solid #c026d3' }}>Back to Sign In</Button>
    </form>
  )
);

export default ForgotPasswordForm; 