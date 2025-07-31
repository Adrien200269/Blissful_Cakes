import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Cake } from 'lucide-react';
import blissfulLogo from '../assets/blissful-logo.jpg';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-container">
      {/* Decorative elements */}
      <div className="notfound-decorative notfound-decorative-1"></div>
      <div className="notfound-decorative notfound-decorative-2"></div>
      <div className="notfound-decorative notfound-decorative-3"></div>

      <div className="notfound-card">
        {/* Logo */}
        <div className="notfound-logo-container">
          <img 
            src={blissfulLogo} 
            alt="Blissful Cakes" 
            className="notfound-logo"
          />
          <Cake size={40} color="#ec4899" />
        </div>

        {/* 404 Number */}
        <div className="notfound-404">
          404
        </div>

        {/* Title */}
        <h1 className="notfound-title">
          Oops! Page Not Found
        </h1>

        {/* Description */}
        <p className="notfound-description">
          The page you're looking for seems to have wandered off to the bakery. 
          Don't worry, we'll help you find your way back to our delicious treats!
        </p>

        {/* Action Buttons */}
        <div className="notfound-buttons">
          <Link to="/" className="notfound-btn-primary">
            <Home size={20} />
            Back to Home
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="notfound-btn-secondary">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Fun message */}
        <div className="notfound-fun-message">
          <p className="notfound-fun-text">
            🍰 While you're here, why not check out our latest cake creations?
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 