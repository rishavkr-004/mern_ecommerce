import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pb-5">
      {/* Hero Section */}
      <section className="py-5 mb-5 text-center text-white">
        <div className="container py-lg-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-2 fw-800 mb-3 text-uppercase">Campus <span className="text-dark">Shop</span></h1>
              <p className="lead mb-4 opacity-75">Exclusive glassmorphism collection for KRMU students.</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-dark btn-lg rounded-pill px-5 shadow">Shop Now</button>
                <button className="btn btn-outline-light btn-lg rounded-pill px-5">Explore</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div className="text-start">
            <h2 className="fw-bold text-white mb-0">Trending Now</h2>
            <div className="bg-white rounded" style={{height: '4px', width: '60px'}}></div>
          </div>
          <Link to="/category/all" className="text-white text-decoration-none fw-semibold">View All →</Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
             <div className="spinner-border text-light" role="status"></div>
             <p className="text-white mt-2 fw-bold">Loading amazing products...</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map(product => (
              <div key={product._id} className="col-12 col-sm-6 col-lg-3">
                <div className="glass-container p-3 h-100 product-card d-flex flex-column border-0 shadow-lg">
                  
                  {/* Image Wrapper */}
                  <div className="position-relative overflow-hidden rounded-4 mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <img 
                      src={product.image || product.img || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"} 
                      alt={product.name} 
                      className="img-fluid w-100" 
                      style={{ height: '220px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300x220?text=Product+Image"; }}
                    />
                    <span className="position-absolute top-0 start-0 m-2 badge bg-dark opacity-75 fw-normal">
                      {product.category || product.cat || 'Featured'}
                    </span>
                  </div>

                  {/* Content - FIXED TO SHOW DATA OR FALLBACK */}
                  <div className="text-start px-1 flex-grow-1">
                    <h5 className="fw-bold mb-1 text-truncate text-dark" title={product.name}>
                      {product.name || "Product Name"}
                    </h5>
                    <h4 className="fw-800 mb-3 text-dark">
                      {product.price ? `$${product.price}` : "$0.00"}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm">
                      <FaShoppingCart size={14} /> <span>Add</span>
                    </button>
                    <Link 
                      to={`/product/${product._id}`} 
                      className="btn btn-light bg-white border-0 glass-container d-flex align-items-center px-3 shadow-sm"
                    >
                      <FaEye size={18} className="text-dark" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;