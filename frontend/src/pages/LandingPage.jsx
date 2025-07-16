import React, { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import CategoryFilter from '../components/ui/CategoryFilter';
import SearchBar from '../components/ui/SearchBar';

const LandingPage = ({ favorites, toggleFavorite, handleAddToCart, user }) => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');

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
      image: 'https://i.ibb.co/QFK1h58H/IMG-20250608-WA0003-removebg-preview.png',
      rating: 4.8,
      category: 'Cakes',
      description: 'Classic vanilla cake with buttercream'
    },
    {
      id: 8,
      name: 'Walnut Brownies',
      price: 'Rs 1200',
      image: 'https://imgs.search.brave.com/B5xUaUO0MFN1IEUwUnMGea1DAE1w4YOXViscLdb1UcA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92aW50/YWdla2l0Y2hlbm5v/dGVzLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNy8xMC9X/YWxudXQtYnJvd25p/ZXMtYmF0dGVyLWlu/LWEtc3F1YXJlLXBh/bi5qcGVn',
      rating: 4.7,
      category: 'Brownies',
      description: 'Brownies with crunchy walnuts'
    }
  ];

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
          <SearchBar value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />

          {/* Category Filters */}
          <CategoryFilter categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="product-grid">
        <div className="grid">
          {filteredItems.map((item, index) => (
            <ProductCard
              key={item.id}
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={handleAddToCart}
            />
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
              <div className="feature-icon">{/* Add icon here */}</div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">Only the finest ingredients in every creation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">{/* Add icon here */}</div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">Fresh cakes delivered to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">{/* Add icon here */}</div>
              <h3 className="feature-title">Made with Love</h3>
              <p className="feature-description">Every cake is crafted with care and passion</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage; 