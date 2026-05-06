import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaPhoneAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Dynamically point to localhost or live server
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
      // Normalize email (lowercase) to match backend constraints
      const res = await axios.post(`${API_URL}/api/auth/login`, { 
        email: email.toLowerCase(), 
        password 
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setLoading(false);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.msg || "Login failed. Please check your credentials.");
    }
  };

  // Social Login Placeholders
  const handleGoogleLogin = () => console.log("Redirecting to Google OAuth...");
  const handlePhoneLogin = () => console.log("Opening OTP Modal...");

  return (
    <div className="auth-container py-5">
      <div className="glass-container p-4 p-md-5 col-11 col-sm-8 col-md-6 col-lg-4 shadow-lg text-start">
        <div className="text-center mb-4">
          <h2 className="fw-800 text-white mb-1">WELCOME BACK</h2>
          <div className="bg-info mx-auto rounded" style={{ height: '3px', width: '40px' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label fw-600 small text-white-50">EMAIL ADDRESS</label>
            <div className="input-group glass-container p-1 rounded-pill">
              <span className="input-group-text bg-transparent border-0 text-info ps-3">
                <FaEnvelope />
              </span>
              <input 
                type="email" 
                className="form-control bg-transparent border-0 text-white shadow-none ps-2" 
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="form-label fw-600 small text-white-50">PASSWORD</label>
            <div className="input-group glass-container p-1 rounded-pill">
              <span className="input-group-text bg-transparent border-0 text-info ps-3">
                <FaLock />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control bg-transparent border-0 text-white shadow-none ps-2" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <span 
                className="input-group-text bg-transparent border-0 text-info pe-3"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="text-end mt-2 pe-2">
               <Link to="#" className="small text-decoration-none text-info fw-semibold opacity-75">Forgot password?</Link>
            </div>
          </div>

          <button type="submit" className="btn btn-info w-100 py-3 rounded-pill shadow-sm mb-4 fw-bold text-dark" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        {/* Divider */}
        <div className="position-relative mb-4 text-center">
          <hr className="text-white-50" />
          <span className="position-absolute top-50 start-50 translate-middle px-3 small text-white-50 fw-600 bg-dark" style={{ background: '#2e3440 !important' }}>
            OR CONTINUE WITH
          </span>
        </div>

        {/* Social Logins */}
        <div className="row g-2 mb-4">
          <div className="col-6">
            <button onClick={handleGoogleLogin} className="btn btn-outline-light w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 glass-container border-0">
              <FaGoogle className="text-danger" /> <span className="small fw-bold text-white">Google</span>
            </button>
          </div>
          <div className="col-6">
            <button onClick={handlePhoneLogin} className="btn btn-outline-light w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 glass-container border-0">
              <FaPhoneAlt className="text-info" /> <span className="small fw-bold text-white">Phone</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="small text-white-50 mb-0">
            New to Tech Connect? 
            <Link to="/signup" className="ms-2 text-decoration-none fw-bold text-info border-bottom border-info border-2">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;