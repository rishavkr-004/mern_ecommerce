import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaTruck, FaCreditCard } from 'react-icons/fa';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Simulate an API call to save order
    console.log("Order placed for:", cartItems, "to:", address);
    alert("🚀 Order Placed Successfully! Thank you for shopping.");
    clearCart(); // Empty the cart after order
    navigate('/'); // Back to home
  };

  return (
    <div className="container py-5 text-start">
      <div className="row g-5">
        {/* Left Side: Shipping Form */}
        <div className="col-lg-7">
          <div className="glass-container p-4 p-md-5 shadow-lg border-0">
            <h3 className="fw-800 mb-4 d-flex align-items-center gap-2">
              <FaTruck size={24} /> SHIPPING DETAILS
            </h3>
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label className="form-label small fw-bold">STREET ADDRESS</label>
                <input type="text" className="form-control bg-transparent border-dark-subtle" placeholder="123 University Ave" required onChange={(e) => setAddress({...address, street: e.target.value})} />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">CITY</label>
                  <input type="text" className="form-control bg-transparent border-dark-subtle" placeholder="Delhi" required onChange={(e) => setAddress({...address, city: e.target.value})} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">ZIP CODE</label>
                  <input type="text" className="form-control bg-transparent border-dark-subtle" placeholder="110001" required onChange={(e) => setAddress({...address, zip: e.target.value})} />
                </div>
              </div>

              <h3 className="fw-800 mt-5 mb-4 d-flex align-items-center gap-2">
                <FaCreditCard size={24} /> PAYMENT METHOD
              </h3>
              <div className="glass-container p-3 mb-4 border-primary bg-primary bg-opacity-10">
                <div className="form-check">
                  <input className="form-check-input" type="radio" checked readOnly />
                  <label className="form-check-label fw-bold">Cash on Delivery (Campus Pickup)</label>
                  <p className="small text-secondary mb-0">Pay when you receive your items at the KRMU Student Center.</p>
                </div>
              </div>

              <button type="submit" className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-lg mt-3">
                <FaLock className="me-2" /> CONFIRM & PLACE ORDER
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="col-lg-5">
          <div className="glass-container p-4 shadow-lg border-0 sticky-top" style={{ top: '100px' }}>
            <h4 className="fw-800 mb-4">YOUR ORDER</h4>
            {cartItems.map(item => (
              <div key={item._id} className="d-flex justify-content-between mb-2 small">
                <span>{item.name} (x{item.qty})</span>
                <span className="fw-bold">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fs-4 fw-800 text-dark">
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;