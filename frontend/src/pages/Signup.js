import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/client';
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
      await API.post('/api/auth/send-otp', { email: formData.email });
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
    try {
      const res = await API.post('/api/auth/signup', formData);
// Use 'res' here to show the message from your backend
alert(res.data.msg || "Registration Successful!"); 
navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Verification failed.");
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="glass-container p-4 p-md-5 col-11 col-sm-8 col-md-6 col-lg-4 shadow-lg text-start mx-auto">
        <div className="text-center mb-4">
          <h2 className="fw-800 text-dark mb-1">CREATE ACCOUNT</h2>
          <div className="bg-dark mx-auto rounded" style={{height: '3px', width: '40px'}}></div>
        </div>

        <form onSubmit={otpSent ? handleSignup : handleRequestOtp}>
          {/* Full Name */}
          {!otpSent && (
            <>
              <div className="mb-3">
                <label className="form-label fw-600 small">FULL NAME</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent"><FaUser/></span>
                  <input type="text" className="form-control" placeholder="John Doe" required 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-600 small">REAL EMAIL ADDRESS</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent"><FaEnvelope/></span>
                  <input type="email" className="form-control" placeholder="name@domain.com" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-600 small">PHONE NUMBER (10 DIGITS)</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent"><FaPhone/></span>
                  <input type="text" className="form-control" placeholder="9876543210" maxLength="10" required 
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g,'')})} />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label fw-600 small">PASSWORD</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent"><FaLock/></span>
                  <input type="password" className="form-control" placeholder="••••••••" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {/* OTP Field (Visible only after clicking Send OTP) */}
          {otpSent && (
            <div className="mb-4 animate-fadeIn">
              <label className="form-label fw-600 small text-primary">ENTER 6-DIGIT OTP</label>
              <div className="input-group">
                <span className="input-group-text bg-primary text-white"><FaShieldAlt/></span>
                <input type="text" className="form-control border-primary" placeholder="123456" maxLength="6" required 
                  onChange={(e) => setFormData({...formData, otp: e.target.value})} />
              </div>
              <p className="small text-muted mt-2">We've sent a code to {formData.email}</p>
            </div>
          )}

          <button type="submit" className={`btn ${otpSent ? 'btn-success' : 'btn-dark'} w-100 py-3`} disabled={loading}>
            {loading ? "SENDING..." : otpSent ? "VERIFY & REGISTER" : "SEND VERIFICATION OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small text-secondary">
            Already have an account? <Link to="/login" className="text-dark fw-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;