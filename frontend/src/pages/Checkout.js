import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../api/client';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Validation Handler
  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only numbers
    if (value.length <= 6) {
      setFormData({ ...formData, zip: value });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (formData.zip.length !== 6) {
      alert("Zip code must be exactly 6 digits.");
      return;
    }
    if (!stripe || !elements) return;
    setIsProcessing(true);

    try {
      const { data } = await API.post('/api/payment/process', { amount: Math.round(total * 100) });
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        alert(result.error.message);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert("🚀 Order Placed Successfully!");
        clearCart();
        navigate('/');
      }
    } catch (err) {
      alert("Payment failed. Please check your backend connection.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4 text-start">
        <div className="col-lg-8">
          <div className="bg-white p-4 shadow-sm border rounded">
            <form onSubmit={handlePlaceOrder}>
              <div className="row">
                {/* Billing Address */}
                <div className="col-md-6 border-end">
                  <h5 className="fw-bold mb-4">BILLING ADDRESS</h5>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Full name</label>
                    <input type="text" className="form-control" placeholder="Enter name" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Email</label>
                    <input type="email" className="form-control" placeholder="Enter email" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Address</label>
                    <input type="text" className="form-control" placeholder="Enter address" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">City</label>
                    <input type="text" className="form-control" placeholder="Enter City" required />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label small text-muted">State</label>
                      <select 
                        className="form-select" 
                        required 
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                      >
                        <option value="">Choose State..</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label small text-muted">Zip code (6 digits)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="110001" 
                        value={formData.zip}
                        onChange={handleZipChange}
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="col-md-6 ps-md-4">
                  <h5 className="fw-bold mb-4">PAYMENT</h5>
                  <label className="form-label small text-muted">Accepted Card</label>
                  <div className="mb-4">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="visa" width="40" className="me-2"/>
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="master" width="40" className="me-2"/>
                    <img src="https://img.icons8.com/color/48/000000/amex.png" alt="amex" width="40"/>
                  </div>

                  <label className="form-label small text-muted">Secure Card Details</label>
                  <div className="p-3 border rounded bg-light mb-2">
                    <CardElement options={{
                      style: { base: { fontSize: '16px' } },
                      // If you want the CVV to be limited by Stripe automatically, 
                      // it handles 3 or 4 digits based on the card type (Visa vs Amex).
                    }} />
                  </div>
                  <p className="text-muted small mb-4">Note: Stripe handles CVV (3-4 digits) securely.</p>

                  <button 
                    type="submit" 
                    disabled={!stripe || isProcessing}
                    className="btn w-100 py-3 fw-bold text-white shadow-sm"
                    style={{ backgroundColor: '#2c3e50' }}
                  >
                    {isProcessing ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: '#fdf2e9' }}>
            <h5 className="fw-bold mb-4">YOUR ORDER</h5>
            {cartItems.map(item => (
              <div key={item._id} className="d-flex justify-content-between mb-2 small text-muted">
                <span>{item.name} (x{item.qty})</span>
                <span>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>TOTAL</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;