import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Star, Heart, Clock, Award, Eye, EyeOff, X, Trash2, Sun, Moon } from 'lucide-react';
import './App.css'
import blissfulLogo from './assets/blissful-logo.jpg';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AboutUs from './AboutUs';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import Cookies from 'js-cookie';

// LandingPage component now receives modal props from App
const LandingPage = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  showPassword,
  setShowPassword,
  formData,
  setFormData,
  handleInputChange,
  handleAuthSubmit,
  toggleAuthMode,
  handleAddToCart,
  favorites,
  toggleFavorite
}) => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const categories = ['All Items', 'Brownies', 'Cakes', 'Cupcakes', 'Favorites'];

  const featuredItems = [
    {
      id: 1,
      name: 'Chocolate Cupcakes',
      price: 'Rs 100',
      image: 'https://imgs.search.brave.com/YqcuC94aeLsCGr6er44Xiuljg1zv0d9wt8n5Z66boAM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDkx/Nzg3Mjc3L3Bob3Rv/L2ljaW5nLWN1cGNh/a2VzLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz12QUlyVHJl/ZEdwMFJWVFVPem9H/ZFVWZEJDcjZTcFhn/eWQ4UzlpWFZqQ0Fr/PQ',
      rating: 4.8,
      category: 'Cupcakes',
      description: 'Rich chocolate cupcakes'
    },
    {
      id: 2,
      name: 'Chocolate Fudge Cake',
      price: 'Rs 800',
      image: 'https://imgs.search.brave.com/fXK4V7ejh8NoQRhbvM2tAR0HcfJrQ_nUvihbNzzbgDE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTIx/Nzg5NTE2NS9waG90/by9wb3VyaW5nLWNo/b2NvbGF0ZS1pY2lu/Zy1vbi10aGUtY2Fr/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9YmtBbUJLVjZf/dTlUUFo4Zm9pTmo2/WExBNWItbzV1YV9Q/NWU2aEQwM0Z3TT0',
      rating: 4.9,
      category: 'Cakes',
      description: 'Rich chocolate cake with fudge frosting'
    },
    {
      id: 3,
      name: 'Double Chocolate Brownies',
      price: 'Rs 1000',
      image: 'https://i.ibb.co/23BSPh8m/IMG-20250608-WA0006.jpg',
      rating: 4.7,
      category: 'Brownies',
      description: 'Rich fudgy brownies'
    },
    {
      id: 4,
      name: 'Red Velvet Cake',
      price: 'Rs 1000',
      image: 'https://imgs.search.brave.com/kPumdg61p7Qr5CQBN60PU51gp4s0ut0Fvm4KGMwW2-w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdj/ZG4uZmxvd2VyYXVy/YS5jb20vRFNDXzMw/MDYuanBn',
      rating: 4.9,
      category: 'Cakes',
      description: 'Traditional red velvet with cream cheese frosting'
    },
    {
      id: 5,
      name: 'Strawberry Cupcakes',
      price: 'Rs 100',
      image: 'https://imgs.search.brave.com/7wBN-MXCUZoEiUVcSI39zn87_N6QhJVQMrLZENJ7NCY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaW1tZWRpYXRl/LmNvLnVrL3Byb2R1/Y3Rpb24vdm9sYXRp/bGUvc2l0ZXMvMzAv/MjAyMC8wOC9zdHJh/d2JlcnJ5LWN1cGNh/a2VzLWY1ZjNkMzEu/anBnP3F1YWxpdHk9/OTAmcmVzaXplPTQ0/MCw0MDA',
      rating: 4.8,
      category: 'Cupcakes',
      description: 'Fresh strawberry cupcakes'
    },
    {
      id: 6,
      name: 'Vanilla Cupcakes',
      price: 'Rs 100',
      image: 'https://imgs.search.brave.com/WvrvoqonalGkK1arh2N4r8G6_Jvdhoz89qwc_wILhMY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cmVjaXBldGluZWF0/cy5jb20vdGFjaHlv/bi8yMDIwLzA5L0Zs/dWZmeS1WYW5pbGxh/LUZyb3N0aW5nX0xl/c3MtU3dlZXRfRXJt/aW5lLUZyb3N0aW5n/XzEtd2hpdGUuanBn',
      rating: 4.6,
      category: 'Cupcakes',
      description: 'Classic vanilla cupcakes'
    },
    {
      id: 7,
      name: 'Vanilla Dream Cake',
      price: 'Rs 750',
      image: 'https://i.ibb.co/QFK1h58H/IMG-20250608-WA0003-removebg-preview.png', // Replace with your actual image URL if needed
      rating: 4.8,
      category: 'Cakes',
      description: 'Classic vanilla cake with buttercream'
    },
    {
      id: 8,
      name: 'Walnut Brownies',
      price: 'Rs 1200',
      image: 'https://imgs.search.brave.com/B5xUaUO0MFN1IEUwUnMGea1DAE1w4YOXViscLdb1UcA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92aW50/YWdla2l0Y2hlbm5v/dGVzLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNy8xMC9X/YWxudXQtYnJvd25p/ZXMtYmF0dGVyLWlu/LWEtc3F1YXJlLXBh/bi5qcGVn', // Replace with your actual image URL if needed
      rating: 4.7,
      category: 'Brownies',
      description: 'Brownies with crunchy walnuts'
    }
  ];

  // Update filteredItems to also filter by searchQuery
  const filteredItems = featuredItems.filter(item => {
    const matchesCategory = activeCategory === 'All Items'
      ? true
      : activeCategory === 'Favorites'
        ? favorites.includes(item.id)
        : item.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="decorative-dot decorative-dot-1"></div>
        <div className="decorative-dot decorative-dot-2"></div>
        <div className="decorative-dot decorative-dot-3"></div>
        <div className="decorative-dot decorative-dot-4"></div>
      </div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title" style={{fontFamily: 'Times New Roman, serif'}}>
            Welcome to Blissful Cakes
          </h1>
          <div className="hero-divider"></div>
          <p className="hero-subtitle" style={{fontFamily: 'Times New Roman, serif'}}>
            Your premier destination for delicious and beautifully crafted cakes
          </p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search for cakes, cupcakes, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-button ${
                  activeCategory === category ? 'active' : 'inactive'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="modal-close"
            >
              <X />
            </button>

            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-icon">
                <img src={blissfulLogo} alt="Blissful Cakes Logo" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(236,72,153,0.10)' }} />

                </div>
                <h2 className="modal-title">
                  Welcome to Blissful Cake
                </h2>
                <p className="modal-subtitle">Your sweet journey begins here</p>
              </div>

              {/* Auth Toggle */}
              <div className="auth-toggle">
                <button
                  onClick={() => setAuthMode('signIn')}
                  className={`auth-toggle-button ${authMode === 'signIn' ? 'active' : 'inactive'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signUp')}
                  className={`auth-toggle-button ${authMode === 'signUp' ? 'active' : 'inactive'}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Auth Form */}
              {forgotPasswordMode ? (
                forgotPasswordSent ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <h2 style={{ color: '#9333ea', marginBottom: '1rem' }}>Check your email</h2>
                    <p style={{ color: '#444' }}>If this email exists, a password reset link has been sent.</p>
                    <Button onClick={() => { setForgotPasswordMode(false); setForgotPasswordSent(false); setForgotPasswordEmail(''); }}>Back to Sign In</Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} className="forgot-password-form">
                    <div className="form-group">
                      <label className="form-label">Enter your email</label>
                      <div className="form-input-wrapper">
                        <span className="form-icon email">@</span>
                        <input
                          type="email"
                          name="forgotPasswordEmail"
                          value={forgotPasswordEmail}
                          onChange={e => setForgotPasswordEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="form-input"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">Send Reset Link</Button>
                    <Button type="button" onClick={() => { setForgotPasswordMode(false); setForgotPasswordSent(false); setForgotPasswordEmail(''); }} style={{ marginLeft: 8, background: '#fff', color: '#c026d3', border: '1px solid #c026d3' }}>Back to Sign In</Button>
                  </form>
                )
              ) : (
                <form onSubmit={handleAuthSubmit} className="form">
                  {authMode === 'signUp' && (
                    <div className="form-group">
                      <label className="form-label">
                        Full Name
                      </label>
                      <div className="form-input-wrapper">
                        <User className="form-icon" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="form-input"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">
                      Email
                    </label>
                    <div className="form-input-wrapper">
                      <span className="form-icon email">@</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Password
                    </label>
                    <div className="form-input-wrapper">
                      <span className="form-icon password">🔒</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={authMode === 'signUp' ? 'Create a password' : 'Enter your password'}
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

                  {authMode === 'signIn' && (
                    <div className="forgot-password">
                      <button
                        type="button"
                        className="forgot-password-link"
                        onClick={() => setForgotPasswordMode(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="submit-button"
                  >
                    <span>✨</span>
                    {authMode === 'signUp' ? 'Create Account' : 'Sign In'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Featured Items Grid */}
      <section className="product-grid">
        <div className="grid">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="product-card"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="product-image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />
                <button 
                  className={`favorite-button${favorites.includes(item.id) ? ' favorited' : ''}`}
                  onClick={() => toggleFavorite(item.id)}
                  aria-label={favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart fill={favorites.includes(item.id) ? '#ec4899' : 'none'} />
                </button>
              </div>
              
              <div className="product-content">
                <div className="product-header">
                  <h3 className="product-title">{item.name}</h3>
                  <div className="product-rating">
                    <Star className="star-icon" />
                    <span className="rating-text">{item.rating}</span>
                  </div>
                </div>
                
                <p className="product-description">{item.description}</p>
                
                <div className="product-footer">
                  <span className="product-price">{item.price}</span>
                  <button 
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Why Choose Blissful Cakes?</h2>
            <p className="features-subtitle">We're committed to bringing you the finest baked goods with exceptional quality and service</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Award />
              </div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">Only the finest ingredients in every creation</p>
        </div>
              
            <div className="feature-card">
              <div className="feature-icon">
                <Clock />
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">Fresh cakes delivered to your doorstep</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Heart />
              </div>
              <h3 className="feature-title">Made with Love</h3>
              <p className="feature-description">Every cake is crafted with care and passion</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const App = () => {
  // Move modal state and logic here
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const cookieFavs = Cookies.get('favorites');
    return cookieFavs ? JSON.parse(cookieFavs) : [];
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showCheckoutDetails, setShowCheckoutDetails] = React.useState(false);
  const [orderDetails, setOrderDetails] = React.useState(null);
  const [checkoutForm, setCheckoutForm] = React.useState({ name: '', address: '', note: '' });
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [user, setUser] = useState(() => {
    const cookieUser = Cookies.get('user');
    return cookieUser ? JSON.parse(cookieUser) : null;
  });
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'signUp' ? '/api/auth/register' : '/api/auth/login';
      const payload = authMode === 'signUp'
        ? { username: formData.fullName, email: formData.email, password: formData.password, firstName: formData.fullName.split(' ')[0], lastName: formData.fullName.split(' ').slice(1).join(' ') }
        : { email: formData.email, password: formData.password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        alert(data.message || 'Authentication failed');
        return;
      }
      // Store token and user info in cookies
      Cookies.set('auth_token', data.data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.data.user), { expires: 7 });
      setUser(data.data.user);
      setShowAuthModal(false);
      setFormData({ fullName: '', email: '', password: '' });
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn');
    setFormData({ fullName: '', email: '', password: '' });
    setShowPassword(false);
  };

  // Add to Cart handler
  const handleAddToCart = (item) => {
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

  // Remove from cart
  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Change quantity
  const handleChangeQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  // Cart total
  const cartTotal = cartItems.reduce((sum, i) => sum + (parseInt(i.price.replace(/\D/g, '')) * i.quantity), 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const toggleFavorite = (itemId) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCheckout = () => {
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
    // Optionally close cart after a delay
    // setTimeout(() => setCartOpen(false), 2000);
  };

  // Add logout handler
  const handleLogout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user');
    setUser(null);
  };

  // Add NotFound component
  function NotFound() {
    return (
      <div className="notfound-container">
        <div className="notfound-404">404</div>
        <div className="notfound-icon" role="img" aria-label="confused face">🤔</div>
        <div className="notfound-title">Page Not Found</div>
        <div className="notfound-desc">Sorry, the page you are looking for does not exist.</div>
        <Link to="/" className="notfound-home-link">Go to Home</Link>
      </div>
    );
  }

  // Add handler for forgot password submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      // Always show the same message for security
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
        {/* Cart Side Panel */}
        {cartOpen && (
          <div className="cart-overlay" onClick={() => { setCartOpen(false); setOrderSuccess(false); }}>
            <div className="cart-panel" onClick={e => e.stopPropagation()}>
              <div className="cart-header">
                <span className="cart-title">Shopping Cart ( {cartCount} items )</span>
                <button className="cart-close" onClick={() => { setCartOpen(false); setOrderSuccess(false); }}><X /></button>
              </div>
              {orderSuccess ? (
                <div className="order-success-message" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                  <h2 style={{ color: '#9333ea', marginBottom: '1rem' }}>Order successfully placed!</h2>
                  <p style={{ color: '#c026d3' }}>Thank you for your order. We will contact you soon!</p>
                </div>
              ) : showCheckoutDetails ? (
                <form className="cart-checkout-form" onSubmit={handleDetailsSubmit} style={{ padding: 24 }}>
                  <h2>Enter Your Details</h2>
                  <label>Name</label>
                  <Input name="name" value={checkoutForm.name} onChange={handleDetailsChange} required />
                  <label>Address</label>
                  <Input name="address" value={checkoutForm.address} onChange={handleDetailsChange} required />
                  <label>Note for Cake Customization</label>
                  <textarea
                    name="note"
                    value={checkoutForm.note}
                    onChange={handleDetailsChange}
                    placeholder="e.g. Less sugar, add message, etc."
                    rows={3}
                    style={{ resize: 'vertical', marginBottom: '0.5rem', borderRadius: '0.5rem', border: '1.5px solid #f3e8ff', padding: '0.7rem 1rem', fontSize: '1rem', background: '#fff', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box' }}
                  />
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <Button type="submit">Order Now</Button>
                    <Button type="button" onClick={() => setShowCheckoutDetails(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="cart-items-list">
                    {cartItems.length === 0 ? (
                      <div className="cart-empty">Your cart is empty.</div>
                    ) : cartItems.map(item => (
                      <div className="cart-item" key={item.id}>
                        <img src={item.image} alt={item.name} className="cart-item-img" />
                        <div className="cart-item-info">
                          <div className="cart-item-title">{item.name}</div>
                          <div className="cart-item-price">Rs {parseInt(item.price.replace(/\D/g, '')) * item.quantity}</div>
                          <div className="cart-item-controls">
                            <button onClick={() => handleChangeQty(item.id, -1)} className="cart-qty-btn">-</button>
                            <span className="cart-qty">{item.quantity}</span>
                            <button onClick={() => handleChangeQty(item.id, 1)} className="cart-qty-btn">+</button>
                            <button onClick={() => handleRemoveFromCart(item.id)} className="cart-remove-btn"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-footer">
                    <div className="cart-total-row">
                      <span>Total:</span>
                      <span className="cart-total">Rs {cartTotal}</span>
                    </div>
                    <div className="cart-total-note">Including all items</div>
                    <button className="cart-checkout-btn" onClick={handleCheckout}>✨ Proceed to Checkout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* Header */}
        <header className="header">
          <div className="header-container">
            <div className="header-content">
              {/* Logo */}
              <div className="logo-section">
                <img 
                  src={blissfulLogo} 
                  alt="Blissful Cakes Logo" 
                  className="logo-image"
                />
              </div>
              {/* Navigation */}
              <nav className="nav">
                <Link to="/" className="nav-link active">Home</Link>
                <Link to="/about" className="nav-link">About Us</Link>
              </nav>
              {/* Right Side (cart, sign in, etc.) */}
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
        {/* Page Content */}
        <Routes>
          <Route path="/" element={<LandingPage
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
            authMode={authMode}
            setAuthMode={setAuthMode}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleAuthSubmit={handleAuthSubmit}
            toggleAuthMode={toggleAuthMode}
            handleAddToCart={handleAddToCart}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            forgotPasswordMode={forgotPasswordMode}
            setForgotPasswordMode={setForgotPasswordMode}
            forgotPasswordEmail={forgotPasswordEmail}
            setForgotPasswordEmail={setForgotPasswordEmail}
            forgotPasswordSent={forgotPasswordSent}
            setForgotPasswordSent={setForgotPasswordSent}
            handleForgotPasswordSubmit={handleForgotPasswordSubmit}
          />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/menu" element={<LandingPage
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
            authMode={authMode}
            setAuthMode={setAuthMode}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleAuthSubmit={handleAuthSubmit}
            toggleAuthMode={toggleAuthMode}
            handleAddToCart={handleAddToCart}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            forgotPasswordMode={forgotPasswordMode}
            setForgotPasswordMode={setForgotPasswordMode}
            forgotPasswordEmail={forgotPasswordEmail}
            setForgotPasswordEmail={setForgotPasswordEmail}
            forgotPasswordSent={forgotPasswordSent}
            setForgotPasswordSent={setForgotPasswordSent}
            handleForgotPasswordSubmit={handleForgotPasswordSubmit}
          />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Footer */}
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

