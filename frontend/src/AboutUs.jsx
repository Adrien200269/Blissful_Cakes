import React from 'react';
import './AboutUs.css';
import blissfulLogo from './assets/blissful-logo.jpg';

const AboutUs = () => (
  <div className="aboutus-main">
    <div className="aboutus-card">
      <div className="aboutus-content">
        <div className="aboutus-text">
          <h1>About Us</h1>
          <p>
            Welcome to <b>Blissful Cakes Pokhara</b>, your premier destination for delicious and beautifully crafted cakes in the heart of Pokhara!
          </p>
          <p>
            Established with a deep passion for baking and creativity, we take pride in offering a wide variety of delectable treats tailored to suit every occasion. From intricately designed custom cakes and delightful cupcakes to unique bento cakes and elegant wine-themed desserts, our bakery is dedicated to turning your special moments into unforgettable memories.
          </p>
          <p>
            Each cake is baked with the finest ingredients, ensuring exceptional taste and stunning presentation that will impress your guests.
          </p>
          <p>
            Located conveniently in Pokhara, we are committed to serving our community with love and dedication. Whether you're celebrating a birthday, anniversary, or any other milestone, our skilled bakers are here to bring your vision to life.
          </p>
          <p>
            You can reach us at <b>9816010373</b> or <b>9806593345</b> for orders and inquiries, or explore our online cake shop for a seamless shopping experience.
          </p>
          <p>
            Stay connected with us on Instagram 
            <a href="https://www.instagram.com/blissfulcakes_pokhara" target="_blank" rel="noopener noreferrer" style={{ color: "#b53471", textDecoration: "underline", marginLeft: "4px" }}>
              @blissfulcakes_pokhara
            </a> 
            and 
            <a href="https://www.instagram.com/pragati_bij_shr/" target="_blank" rel="noopener noreferrer" style={{ color: "#b53471", textDecoration: "underline", marginLeft: "4px" }}>
              @pragat_bij_shr
            </a>, where we regularly share the latest updates, behind-the-scenes glimpses, and photos of our mouth-watering creations.
          </p>
          <p>
            At Blissful Cakes Pokhara, we believe every bite should be a moment of bliss—let us sweeten your celebrations today!
          </p>
          <div className="aboutus-contact">
            <h2>Contact Information</h2>
            <p><strong>Phone:</strong> 9815095078 / 9805053518</p>
            <p>
              <strong>Instagram:</strong>
              <a
                href="https://www.instagram.com/blissfulcakes_pokhara"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#b53471", textDecoration: "underline", marginLeft: "6px" }}
              >
                @blissfulcakes_pokhara
              </a>
            </p>
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
