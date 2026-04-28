import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. Change this import from axios to your API client
import API from '../api/client'; 
import { FaShoppingCart, FaArrowLeft, FaStar, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // 2. Use API.get instead of axios.get
        // The base URL (Render/Localhost) is already handled in client.js
        const res = await API.get(`/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product", err);
        // If the request fails, product remains null, showing the "Not Found" UI
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${quantity} ${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="container vh-center py-5">
        <div className="glass-container p-5 text-dark fw-bold shadow-lg">
          <div className="spinner-border text-primary me-3" role="status"></div>
          LOADING PRODUCT...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container vh-center py-5 text-dark">
        <div className="glass-container p-5 shadow-lg">
          <h2>Product Not Found</h2>
          <p className="text-secondary">We couldn't find the gadget you're looking for.</p>
          <Link to="/" className="btn btn-primary mt-3 px-4 rounded-pill fw-bold">Go Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="text-start mb-4">
        <Link to="/" className="text-dark text-decoration-none fw-bold d-flex align-items-center gap-2 opacity-75">
          <FaArrowLeft /> Back to Shop
        </Link>
      </div>

      <div className="row g-5">
        <div className="col-12 col-lg-6">
          <div className="glass-container p-3 p-md-4 shadow-lg sticky-lg-top" style={{ top: '100px', background: 'rgba(255,255,255,0.2)' }}>
            <img 
              src={product.image || product.img || "https://via.placeholder.com/500"} 
              alt={product.name} 
              className="img-fluid rounded-4 shadow-sm"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/500x500?text=Image+Not+Found"; }}
            />
          </div>
        </div>

        <div className="col-12 col-lg-6 text-start">
          <div className="glass-container p-4 p-md-5 h-100 shadow-lg">
            <span className="badge bg-dark mb-2 px-3 py-2 rounded-pill text-uppercase">
              {product.category || 'Electronics'}
            </span>
            <h1 className="fw-800 display-5 mb-3 text-dark">
              {product.name}
            </h1>
            
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="text-warning d-flex">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <span className="text-secondary small fw-bold">({product.rating || '4.8'} / 5 Rating)</span>
            </div>

            <h2 className="display-6 fw-800 text-dark mb-4">
              ₹{product.price?.toLocaleString()}
            </h2>
            
            <p className="lead text-secondary mb-5" style={{ lineHeight: '1.8' }}>
              {product.description || "Experience premium quality with our campus exclusive collection."}
            </p>

            <div className="d-flex align-items-center gap-3 mb-5">
              <div className="glass-container d-flex align-items-center border-dark-subtle p-1 px-3 shadow-sm">
                <button className="btn btn-link text-dark p-0 text-decoration-none fs-4 fw-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}> - </button>
                <span className="mx-4 fw-bold text-dark">{quantity}</span>
                <button className="btn btn-link text-dark p-0 text-decoration-none fs-4 fw-bold" onClick={() => setQuantity(quantity + 1)}> + </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary flex-grow-1 py-3 rounded-pill shadow d-flex align-items-center justify-content-center gap-2 fw-bold"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>

            <hr className="my-5 text-dark-subtle" />
            <div className="row g-4">
              <div className="col-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white p-2 rounded-circle shadow-sm">
                    <FaTruck className="text-primary fs-4" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark">Fast Delivery</h6>
                    <small className="text-secondary">Campus-wide shipping</small>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white p-2 rounded-circle shadow-sm">
                    <FaShieldAlt className="text-primary fs-4" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark">Authentic</h6>
                    <small className="text-secondary">100% Quality Check</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;