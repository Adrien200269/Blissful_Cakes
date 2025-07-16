import React, { useState } from 'react';
import { X } from 'lucide-react';
import blissfulLogo from '../assets/blissful-logo.jpg';
import { Button } from '../components/ui/button';
import SignInForm from '../components/ui/SignInForm';
import SignUpForm from '../components/ui/SignUpForm';
import ForgotPasswordForm from '../components/ui/ForgotPasswordForm';

const AuthModal = ({ setShowAuthModal, setUser, Cookies }) => {
  const [authMode, setAuthMode] = useState('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn');
    setFormData({ username: '', email: '', password: '' });
    setShowPassword(false);
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
            <button onClick={() => setAuthMode('signIn')} className={`auth-toggle-button ${authMode === 'signIn' ? 'active' : 'inactive'}`}>Sign In</button>
            <button onClick={() => setAuthMode('signUp')} className={`auth-toggle-button ${authMode === 'signUp' ? 'active' : 'inactive'}`}>Sign Up</button>
          </div>
          {forgotPasswordMode ? (
            <ForgotPasswordForm
              email={forgotPasswordEmail}
              onChange={e => setForgotPasswordEmail(e.target.value)}
              onSubmit={handleForgotPasswordSubmit}
              onBack={() => { setForgotPasswordMode(false); setForgotPasswordSent(false); setForgotPasswordEmail(''); }}
              sent={forgotPasswordSent}
            />
          ) : authMode === 'signIn' ? (
            <SignInForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleAuthSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onForgotPassword={() => setForgotPasswordMode(true)}
            />
          ) : (
            <SignUpForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleAuthSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 