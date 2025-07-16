import React, { useState } from 'react';
import { X } from 'lucide-react';
import blissfulLogo from '../assets/blissful-logo.jpg';
import { Button } from '../components/ui/button';
import SignInForm from '../components/ui/SignInForm';
import SignUpForm from '../components/ui/SignUpForm';
import ForgotPasswordForm from '../components/ui/ForgotPasswordForm';
import AdminLoginForm from '../components/ui/AdminLoginForm';

const AuthModal = ({ setShowAuthModal, setUser, Cookies }) => {
  const [authMode, setAuthMode] = useState('signIn'); // 'signIn', 'signUp', 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [adminFormData, setAdminFormData] = useState({ email: '', password: '' });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAdminInputChange = (e) => {
    setAdminFormData({ ...adminFormData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'signUp' ? '/api/auth/register' : '/api/auth/login';
      const payload = authMode === 'signUp'
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.data || !data.data.token) {
        alert(data.message || 'Authentication failed');
        return;
      }
      Cookies.set('auth_token', data.data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.data.user), { expires: 7 });
      setUser(data.data.user);
      setShowAuthModal(false);
      setFormData({ username: '', email: '', password: '' });
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      // For now, use the same endpoint as user login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminFormData)
      });
      const data = await res.json();
      if (!res.ok || !data.data || !data.data.token) {
        alert(data.message || 'Admin authentication failed');
        return;
      }
      // Optionally, check if user is admin (role check)
      if (data.data.user.role !== 'admin') {
        alert('You are not authorized as admin.');
        return;
      }
      Cookies.set('auth_token', data.data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.data.user), { expires: 7 });
      setUser(data.data.user);
      setShowAuthModal(false);
      setAdminFormData({ email: '', password: '' });
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      setForgotPasswordSent(true);
    } catch (err) {
      setForgotPasswordSent(true);
    }
  };

  const toggleAuthMode = (mode) => {
    setAuthMode(mode);
    setFormData({ username: '', email: '', password: '' });
    setAdminFormData({ email: '', password: '' });
    setShowPassword(false);
    setForgotPasswordMode(false);
    setForgotPasswordSent(false);
    setForgotPasswordEmail('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={() => setShowAuthModal(false)} className="modal-close"><X /></button>
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-icon">
              <img src={blissfulLogo} alt="Blissful Cakes Logo" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(236,72,153,0.10)' }} />
            </div>
            <h2 className="modal-title">Welcome to Blissful Cake</h2>
            <p className="modal-subtitle">Your sweet journey begins here</p>
          </div>
          <div className="auth-toggle">
            <button onClick={() => toggleAuthMode('signIn')} className={`auth-toggle-button ${authMode === 'signIn' ? 'active' : 'inactive'}`}>Sign In</button>
            <button onClick={() => toggleAuthMode('signUp')} className={`auth-toggle-button ${authMode === 'signUp' ? 'active' : 'inactive'}`}>Sign Up</button>
            <button onClick={() => toggleAuthMode('admin')} className={`auth-toggle-button ${authMode === 'admin' ? 'active' : 'inactive'}`}>Admin Login</button>
          </div>
          {forgotPasswordMode ? (
            <div className="form-card">
              <ForgotPasswordForm
                email={forgotPasswordEmail}
                onChange={e => setForgotPasswordEmail(e.target.value)}
                onSubmit={handleForgotPasswordSubmit}
                onBack={() => { setForgotPasswordMode(false); setForgotPasswordSent(false); setForgotPasswordEmail(''); }}
                sent={forgotPasswordSent}
              />
            </div>
          ) : authMode === 'signIn' ? (
            <div className="form-card">
              <SignInForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleAuthSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onForgotPassword={() => setForgotPasswordMode(true)}
              />
            </div>
          ) : authMode === 'signUp' ? (
            <div className="form-card">
              <SignUpForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleAuthSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            </div>
          ) : (
            <div className="form-card">
              <AdminLoginForm
                formData={adminFormData}
                onChange={handleAdminInputChange}
                onSubmit={handleAdminLogin}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 