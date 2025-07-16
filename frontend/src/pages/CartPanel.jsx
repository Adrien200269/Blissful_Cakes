import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import CartItem from '../components/ui/CartItem';
import CartWarning from '../components/ui/CartWarning';

const CartPanel = ({
  cartItems,
  setCartItems,
  showCartWarning,
  setShowCartWarning,
  handleChangeQty,
  handleRemoveFromCart,
  cartOpen,
  setCartOpen
}) => {
  const [showCheckoutDetails, setShowCheckoutDetails] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', address: '', note: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + (parseInt(i.price.replace(/\D/g, '')) * i.quantity), 0);

  const handleDetailsChange = (e) => {
    setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setShowCheckoutDetails(false);
    setOrderSuccess(true);
    setCheckoutForm({ name: '', address: '', note: '' });
    setCartItems([]); // Clear cart after order
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