import React from 'react';
import { Button } from './button';

const CartWarning = ({ onClose }) => (
  <div className="cart-warning" style={{ background: '#fff0f3', color: '#c026d3', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center', border: '1.5px solid #f3e8ff' }}>
    <strong>Nothing added in cart</strong>
    <div style={{ color: '#444', marginTop: 4 }}>Please add items to your cart before proceeding to checkout.</div>
    <Button onClick={onClose} style={{ marginTop: 8 }}>OK</Button>
  </div>
);

export default CartWarning; 