import React from 'react';
import { Trash2 } from 'lucide-react';

const CartItem = ({ item, onChangeQty, onRemove }) => (
  <div className="cart-item">
    <img src={item.image} alt={item.name} className="cart-item-img" />
    <div className="cart-item-info">
      <div className="cart-item-title">{item.name}</div>
      <div className="cart-item-price">Rs {parseInt(item.price.replace(/\D/g, '')) * item.quantity}</div>
      <div className="cart-item-controls">
        <button onClick={() => onChangeQty(item.id, -1)} className="cart-qty-btn">-</button>
        <span className="cart-qty">{item.quantity}</span>
        <button onClick={() => onChangeQty(item.id, 1)} className="cart-qty-btn">+</button>
        <button onClick={() => onRemove(item.id)} className="cart-remove-btn"><Trash2 size={18} /></button>
      </div>
    </div>
  </div>
);

export default CartItem; 