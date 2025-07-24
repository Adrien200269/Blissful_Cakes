const token = localStorage.getItem('auth_token') || (window.Cookies && window.Cookies.get && window.Cookies.get('auth_token')) || '';import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import CartItem from '../components/ui/CartItem';
import CartWarning from '../components/ui/CartWarning';
import Cookies from 'js-cookie';

const CartPanel = ({
  cartItems,
  setCartItems,
  showCartWarning,
  setShowCartWarning,
  handleChangeQty,
  handleRemoveFromCart,
  cartOpen,
  setCartOpen,
  user
}) => {
  const [showCheckoutDetails, setShowCheckoutDetails] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', address: '', phone: '', note: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0);

  const handleDetailsChange = (e) => {
    setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setOrderError(null);
    // Validate phone
    if (!checkoutForm.phone || checkoutForm.phone.length < 10) {
      setOrderError('A valid phone number is required.');
      return;
    }
    // Prepare order data
    const orderData = {
      products: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
      address: checkoutForm.address,
      phone: checkoutForm.phone,
      note: checkoutForm.note
    };
    console.log('Order payload:', orderData);
    try {
      const token = Cookies.get('auth_token');
      console.log('JWT token:', token);
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowCheckoutDetails(false);
        setOrderSuccess(true);
        setCheckoutForm({ name: '', address: '', phone: '', note: '' });
        setCartItems([]); // Clear cart after order
      } else {
        setOrderError(data.message || 'Order failed.');
      }
    } catch (err) {
      setOrderError('Order failed. Please try again.');
    }
  };
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setShowCartWarning(true);
      return;
    }
    setShowCheckoutDetails(true);
  };

  return cartOpen ? (
    <div className="cart-overlay" onClick={() => { setCartOpen(false); setOrderSuccess(false); }}>
      <div className="cart-panel" onClick={e => e.stopPropagation()} style={{ maxHeight: '98vh', overflowY: 'auto' }}>
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
          <form className="cart-checkout-form" onSubmit={handleDetailsSubmit} style={{ padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
            <h2>Enter Your Details</h2>
            <label>Name</label>
            <Input name="name" value={checkoutForm.name} onChange={handleDetailsChange} required />
            <label>Address</label>
            <Input name="address" value={checkoutForm.address} onChange={handleDetailsChange} required />
            <label>Phone Number</label>
            <Input name="phone" value={checkoutForm.phone} onChange={handleDetailsChange} required type="tel" pattern="[0-9]{7,}" placeholder="Enter your phone number" />
            <label>Note for Cake Customization</label>
            <textarea
              name="note"
              value={checkoutForm.note}
              onChange={handleDetailsChange}
              placeholder="e.g. Less sugar, add message, etc."
              rows={3}
              style={{ resize: 'vertical', marginBottom: '0.5rem', borderRadius: '0.5rem', border: '1.5px solid #f3e8ff', padding: '0.7rem 1rem', fontSize: '1rem', background: '#fff', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box' }}
            />
            {orderError && <div style={{ color: 'red', marginBottom: 8 }}>{orderError}</div>}
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Button type="submit">Order Now</Button>
              <Button type="button" onClick={() => setShowCheckoutDetails(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <>
            {showCartWarning && <CartWarning onClose={() => setShowCartWarning(false)} />}
            <div className="cart-items-list">
              {cartItems.length === 0 ? (
                <div className="cart-empty">Your cart is empty.</div>
              ) : cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onChangeQty={handleChangeQty}
                  onRemove={handleRemoveFromCart}
                />
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
  ) : null;
};

export default CartPanel; 