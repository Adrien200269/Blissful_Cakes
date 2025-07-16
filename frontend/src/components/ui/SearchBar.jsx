import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }) => (
  <div className="search-container">
    <div className="search-wrapper">
      <Search className="search-icon" />
      <input
        type="text"
        placeholder="Search for cakes, cupcakes, and more..."
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </div>
  </div>
);

export default SearchBar; 