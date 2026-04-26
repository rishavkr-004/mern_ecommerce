import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();

  // Calculate Total Price
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className="container py-5 mt-5">
        <div className="glass-container p-5 text-center shadow-lg border-0">
          <FaShoppingBag size={60} className="mb-4 text-dark opacity-25" />
          <h2 className="fw-800 text-dark">Your Cart is Empty</h2>
          <p className="text-secondary mb-4">Looks like you haven't discovered anything yet.</p>
          <Link to="/" className="btn btn-primary rounded-pill px-5 py-3 shadow-sm">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 text-start">
      <div className="mb-4">
        <h2 className="fw-800 text-white mb-1 text-uppercase">Shopping Cart</h2>
        <div className="bg-white rounded" style={{ height: '4px', width: '60px' }}></div>
      </div>

      <div className="row g-4">
        {/* Left Side: Items List */}
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div key={item._id} className="glass-container p-3 mb-3 shadow-sm d-flex align-items-center gap-3 border-0">
              {/* Product Image */}
              <img 
                src={item.image || item.img || "https://via.placeholder.com/100"} 
                alt={item.name} 
                className="rounded-3 shadow-sm" 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
              />
              
              {/* Product Details */}
              <div className="flex-grow-1">
                <h5 className="fw-bold mb-1 text-dark text-truncate" style={{maxWidth: '250px'}}>{item.name}</h5>
                <p className="text-secondary small mb-2">{item.category || 'Featured'}</p>
                
                {/* Simple Quantity Controller */}
                <div className="d-flex align-items-center gap-2">
                   <button className="btn btn-sm btn-light rounded-circle p-1" onClick={() => item.qty > 1 && addToCart(item, -1)}><FaMinus size={10}/></button>
                   <span className="fw-bold px-2">{item.qty}</span>
                   <button className="btn btn-sm btn-light rounded-circle p-1" onClick={() => addToCart(item, 1)}><FaPlus size={10}/></button>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="text-end pe-2">
                <h5 className="fw-800 text-dark mb-1">${(item.price * item.qty).toFixed(2)}</h5>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="btn btn-link text-danger p-0 text-decoration-none small fw-bold"
                >
                  <FaTrash className="me-1" /> Remove
                </button>
              </div>
            </div>
          ))}
          
          <Link to="/" className="text-white text-decoration-none small fw-bold d-inline-flex align-items-center mt-3 opacity-75 hover-opacity-100">
            <FaArrowLeft className="me-2" /> Continue Shopping
          </Link>
        </div>

        {/* Right Side: Summary Section */}
        <div className="col-lg-4">
          <div className="glass-container p-4 shadow-lg border-0 sticky-top" style={{ top: '100px' }}>
            <h4 className="fw-800 text-dark mb-4">Order Summary</h4>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Subtotal</span>
              <span className="fw-bold text-dark">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Shipping</span>
              <span className="text-success fw-bold">FREE</span>
            </div>
            
            <hr className="my-4 text-dark-subtle" />
            
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold text-dark fs-5">Estimated Total</span>
              <span className="fw-800 text-dark fs-4">${subtotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm mb-3">
  PROCEED TO CHECKOUT
</Link>
            
            <p className="text-center small text-secondary mb-0">
              Secure payments powered by CampusPay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;