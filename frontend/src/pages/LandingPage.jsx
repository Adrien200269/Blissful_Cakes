import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ui/ProductCard';
import CategoryFilter from '../components/ui/CategoryFilter';
import SearchBar from '../components/ui/SearchBar';

const LandingPage = ({ favorites, toggleFavorite, handleAddToCart, user, refreshSignal }) => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load products.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshSignal]);

  const categories = ['All Items', 'Brownies', 'Cakes', 'Cupcakes', 'Favorites'];

  const filteredItems = products.filter(item => {
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
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title" style={{fontFamily: 'Times New Roman, serif'}}>
            Welcome to Blissful Cakes
          </h1>
          {/* Show username/email after login */}
          {user && (
            <div style={{
              textAlign: 'center',
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#9333ea',
              margin: '0.5rem 0 0.5rem 0',
              letterSpacing: '0.5px',
            }}>
              {user.username || user.email}
            </div>
          )}
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
        {loading ? (
          <div style={{ textAlign: 'center', color: '#9333ea', fontWeight: 600, fontSize: 20, padding: '2rem' }}>Loading products...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'red', fontWeight: 600, fontSize: 18, padding: '2rem' }}>{error}</div>
        ) : (
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
        )}
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