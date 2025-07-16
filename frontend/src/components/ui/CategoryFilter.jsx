import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => (
  <div className="category-filters">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onSelectCategory(category)}
        className={`category-button ${activeCategory === category ? 'active' : 'inactive'}`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default CategoryFilter; 