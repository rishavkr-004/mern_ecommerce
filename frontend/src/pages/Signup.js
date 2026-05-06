import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/client'; // Uses your Axios client configuration
import { FaUser, FaEnvelope, FaLock, FaPhone, FaShieldAlt } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    otp: '' 
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) return alert("Phone number must be 10 digits");
    
    setLoading(true);
    try {
      // Normalize email to lowercase before sending request
      await API.post('/api/auth/send-otp', { email: formData.email.toLowerCase() });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Final Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send normalized email and data to the backend
      const payload = {
        ...formData,
        email: formData.email.toLowerCase()
      };
      
      const res = await API.post('/api/auth/signup', payload);
      alert(res.data.msg || "Registration Successful!"); 
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="glass-container p-4 p-md-5 col-11 col-sm-8 col-md-6 col-lg-4 shadow-lg text-start mx-auto">
        <div className="text-center mb-4">
          <h2 className="fw-800 text-white mb-1">CREATE ACCOUNT</h2>
          <div className="bg-info mx-auto rounded" style={{height: '3px', width: '40px'}}></div>
        </div>

        <form onSubmit={otpSent ? handleSignup : handleRequestOtp}>
          {/* Full Name and Inputs */}
          {!otpSent && (
            <>
              <div className="mb-3">
                <label className="form-label fw-600 small text-white-50">FULL NAME</label>
                <div className="input-group glass-container p-1 rounded-pill">
                  <span className="input-group-text bg-transparent border-0 text-info ps-3"><FaUser/></span>
                  <input type="text" className="form-control bg-transparent border-0 text-white shadow-none ps-2" placeholder="John Doe" required 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-600 small text-white-50">REAL EMAIL ADDRESS</label>
                <div className="input-group glass-container p-1 rounded-pill">
                  <span className="input-group-text bg-transparent border-0 text-info ps-3"><FaEnvelope/></span>
                  <input type="email" className="form-control bg-transparent border-0 text-white shadow-none ps-2" placeholder="name@domain.com" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-600 small text-white-50">PHONE NUMBER (10 DIGITS)</label>
                <div className="input-group glass-container p-1 rounded-pill">
                  <span className="input-group-text bg-transparent border-0 text-info ps-3"><FaPhone/></span>
                  <input type="text" className="form-control bg-transparent border-0 text-white shadow-none ps-2" placeholder="9876543210" maxLength="10" required 
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g,'')})} />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label fw-600 small text-white-50">PASSWORD</label>
                <div className="input-group glass-container p-1 rounded-pill">
                  <span className="input-group-text bg-transparent border-0 text-info ps-3"><FaLock/></span>
                  <input type="password" className="form-control bg-transparent border-0 text-white shadow-none ps-2" placeholder="••••••••" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {/* OTP Field */}
          {otpSent && (
            <div className="mb-4 animate-fadeIn">
              <label className="form-label fw-600 small text-info">ENTER 6-DIGIT OTP</label>
              <div className="input-group glass-container p-1 rounded-pill">
                <span className="input-group-text bg-transparent border-0 text-info ps-3"><FaShieldAlt/></span>
                <input type="text" className="form-control bg-transparent border-0 text-white shadow-none ps-2" placeholder="123456" maxLength="6" required 
                  onChange={(e) => setFormData({...formData, otp: e.target.value})} />
              </div>
              <p className="small text-white-50 mt-2">We've sent a code to {formData.email}</p>
            </div>
          )}

          <button type="submit" className={`btn ${otpSent ? 'btn-info text-dark' : 'btn-outline-light'} w-100 py-3 rounded-pill fw-bold mb-3`} disabled={loading}>
            {loading ? "PROCESSING..." : otpSent ? "VERIFY & REGISTER" : "SEND VERIFICATION OTP"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="small text-white-50">
            Already have an account? <Link to="/login" className="text-info fw-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;