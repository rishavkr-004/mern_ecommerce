import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Logic to show a "Discount" badge if price < originalPrice
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="glass-product-card">
      {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
      
      <Link to={`/product/${product._id}`}>
        <img src={product.img} alt={product.name} className="product-image" />
      </Link>

      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>
        
        <div className="rating">
          <span className="stars">⭐ {product.rating}</span>
          <span className="category-tag">{product.category}</span>
        </div>

        <div className="price-container">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;