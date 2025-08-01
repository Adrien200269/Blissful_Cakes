import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Star, Heart, Clock, Award, Eye, EyeOff, X, Trash2, Sun, Moon } from 'lucide-react';
import './App.css'
import blissfulLogo from './assets/blissful-logo.jpg';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import AboutUs from './AboutUs';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import Cookies from 'js-cookie';
import LandingPage from './pages/LandingPage';
import CartPanel from './pages/CartPanel';
import AuthModal from './pages/AuthModal';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';

function ProtectedAdminRoute({ user, children }) {
  const location = useLocation();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

const App = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartWarning, setShowCartWarning] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showCheckoutDetails, setShowCheckoutDetails] = React.useState(false);
  const [orderDetails, setOrderDetails] = React.useState(null);
  const [checkoutForm, setCheckoutForm] = React.useState({ name: '', address: '', note: '' });
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [blowCandle, setBlowCandle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    Cookies.set('favorites', JSON.stringify(favorites), { expires: 30 });
  }, [favorites]);

  useEffect(() => {
    const cookieUser = Cookies.get('user');
    setUser(cookieUser ? JSON.parse(cookieUser) : null);
  }, []);

  useEffect(() => {
    if (loading) {
      setBlowCandle(false);
      const timer = setTimeout(() => setBlowCandle(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAddToCart = (item) => {
    if (showCartWarning) setShowCartWarning(false);
    setCartItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };
  const handleChangeQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };
  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };
  const toggleFavorite = (itemId) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setShowCartWarning(true);
      return;
    }
    setShowCheckoutDetails(true);
  };
  const handleDetailsChange = (e) => {
    setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setOrderDetails(checkoutForm);
    setShowCheckoutDetails(false);
    setOrderSuccess(true);
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user');
    setUser(null);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      setForgotPasswordSent(true);
    } catch (err) {
      setForgotPasswordSent(true);
    }
  };

  return (
    <Router>
      <div className={`main-container theme-${theme}`}>
        {loading && (
          <div className="loading-overlay">
            <div className="cake-loader">
              <div className="cake-base"></div>
              <div className="cake-icing"></div>
              <div className="cake-candle">
                <div className={`cake-flame${blowCandle ? ' cake-candle-blow' : ''}`}></div>
              </div>
              <div className="cake-loader-text">Loading Blissful Cakes...</div>
            </div>
          </div>
        )}
        {showAuthModal && (
          <AuthModal setShowAuthModal={setShowAuthModal} setUser={setUser} Cookies={Cookies} />
        )}
        <CartPanel
          cartItems={cartItems}
          setCartItems={setCartItems}
          showCartWarning={showCartWarning}
          setShowCartWarning={setShowCartWarning}
          handleChangeQty={handleChangeQty}
          handleRemoveFromCart={handleRemoveFromCart}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          showCheckoutDetails={showCheckoutDetails}
          setShowCheckoutDetails={setShowCheckoutDetails}
          checkoutForm={checkoutForm}
          handleDetailsChange={handleDetailsChange}
          handleDetailsSubmit={handleDetailsSubmit}
          orderSuccess={orderSuccess}
          setOrderSuccess={setOrderSuccess}
          cartCount={cartCount}
          cartTotal={cartTotal}
          user={user}
          handleLogout={handleLogout}
        />
        <header className="header">
          <div className="header-container">
            <div className="header-content">
              <div className="logo-section">
                <img 
                  src={blissfulLogo} 
                  alt="Blissful Cakes Logo" 
                  className="logo-image"
                />
              </div>
              <nav className="nav">
                <Link to="/" className="nav-link active">Home</Link>
                <Link to="/about" className="nav-link">About Us</Link>
              </nav>
              <div className="header-actions">
                <button className="cart-button" onClick={() => setCartOpen(true)}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
                <button 
                  className="theme-toggle-button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark/light mode"
                >
                  {theme === 'light' ? <Moon /> : <Sun />}
                </button>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#9333ea', fontWeight: 600 }}>
                      {user.firstName || user.username || user.email}
                    </span>
                    <button className="sign-in-button" onClick={handleLogout} style={{ background: '#fff', color: '#c026d3', border: '1px solid #c026d3' }}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    className="sign-in-button"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
        <Routes>
          <Route path="/" element={user && user.role === 'admin' ? <Navigate to="/admin" replace /> : <LandingPage favorites={favorites} toggleFavorite={toggleFavorite} handleAddToCart={handleAddToCart} user={user} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute user={user}>
              <AdminPage />
            </ProtectedAdminRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-brand">
                <img 
                  src={blissfulLogo} 
                  alt="Blissful Cakes Logo" 
                  className="footer-logo"
                />
                <div>
                  <div className="footer-brand-text">Blissful Cakes</div>
                  <div className="footer-brand-subtitle">Crafted with Love</div>
                </div>
              </div>
              <p className="footer-description">Creating sweet memories, one cake at a time.</p>
              <div>
                <h4 className="footer-section-title">Quick Links</h4>
                <ul className="footer-list">
                  <li><Link to="/" className="footer-link">Home</Link></li>
                  <li><Link to="/about" className="footer-link">About Us</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="footer-section-title">Contact Info</h4>
                <div className="footer-contact">
                <p><strong>Phone:</strong> 9815095078 / 9805053518</p>
                <p><strong>Instagram:</strong> @blissfulcakes_pokhara</p>
                <p><strong>Location:</strong> Pokhara, Nepal</p>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Blissful Cakes. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

