import React from 'react';
import './CategoryRibbon.css';

const categories = [
  { name: 'All', icon: '🛍️' },
  { name: 'Mobile', icon: '📱' },
  { name: 'Laptop', icon: '💻' },
  { name: 'Audio', icon: '🎧' },
];

const CategoryRibbon = ({ activeCategory, setCategory }) => {
  return (
    <div className="category-container">
      <div className="category-scroll">
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            className={`category-card ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setCategory(cat.name === 'All' ? '' : cat.name)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryRibbon;