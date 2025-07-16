import React from 'react';
import { Heart, Star } from 'lucide-react';

const ProductCard = ({ item, isFavorite, onToggleFavorite, onAddToCart }) => (
  <div className="product-card">
    <div className="product-image-container">
      <img src={item.image} alt={item.name} className="product-image" />
      <button
        className={`favorite-button${isFavorite ? ' favorited' : ''}`}
        onClick={() => onToggleFavorite(item.id)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart fill={isFavorite ? '#ec4899' : 'none'} />
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
        <button className="add-to-cart-button" onClick={() => onAddToCart(item)}>
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard;
