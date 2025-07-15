import React from 'react';
import './AboutUs.css';
import blissfulLogo from './assets/blissful-logo.jpg';

const AboutUs = () => (
  <div className="aboutus-main">
    <div className="aboutus-card">
      <div className="aboutus-content">
        <div className="aboutus-text">
          <h1>About Us</h1>
          <p>Welcome to Blissful Cakes Pokhara, your premier destination for delicious and beautifully crafted cakes in the heart of Pokhara! Established with a deep passion for baking and creativity, we take pride in offering a wide variety of delectable treats tailored to suit every occasion. From intricately designed custom cakes and delightful cupcakes to unique berrie cakes and elegant wine-themed desserts.</p>
          <p>Our bakery is dedicated to turning your special moments into unforgettable memories. Each cake is baked with the finest ingredients, authentic recipes, and genuine love and attention that will impress your guests.</p>
          <p>Located conveniently in Pokhara, we are committed to serving our community with love and dedication. Whether you're celebrating a birthday, anniversary, or other milestone, our skilled bakers are here to bring your vision to life. You can reach us at 9815095078 or 9805053518 for orders and inquiries, or visit our online cake shop for a seamless shopping experience. Stay connected with us on Instagram @blissfulcakes_pokhara and on Facebook. Or, Ily, where we regularly share the latest updates, behind-the-scenes moments, and special promotions for our valued customers. Come join the Blissful experience at Blissful Cakes Pokhara, and let us make your next celebration today!</p>
          <div className="aboutus-contact">
            <h2>Contact Information</h2>
            <p><strong>Phone:</strong> 9815095078 / 9805053518</p>
            <p><strong>Instagram:</strong> @blissfulcakes_pokhara</p>
            <p><strong>Location:</strong> Pokhara, Nepal</p>
          </div>
        </div>
        <div className="aboutus-logo">
          <img src={blissfulLogo} alt="Blissful Cakes Logo" />
        </div>
      </div>
    </div>
  </div>
);

export default AboutUs;
