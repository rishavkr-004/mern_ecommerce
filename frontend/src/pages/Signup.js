import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect to your Node.js backend
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(res.data.msg || "Registration Successful!");
      navigate('/login'); // Move to login after successful signup
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="glass-container p-4 p-md-5 col-11 col-sm-8 col-md-6 col-lg-4 shadow-lg text-start">
        {/* Header Section */}
        <div className="text-center mb-4">
          <h2 className="fw-800 text-dark mb-1">CREATE ACCOUNT</h2>
          <div className="bg-dark mx-auto rounded" style={{height: '3px', width: '40px'}}></div>
          <p className="text-secondary mt-3 small">Join our campus community today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="mb-3">
            <label className="form-label fw-600 small text-dark">FULL NAME</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-dark-subtle">
                <FaUser className="text-secondary" />
              </span>
              <input 
                type="text" 
                className="form-control bg-transparent border-start-0 border-dark-subtle ps-0" 
                placeholder="John Doe"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                style={{boxShadow: 'none'}}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label fw-600 small text-dark">EMAIL ADDRESS</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-dark-subtle">
                <FaEnvelope className="text-secondary" />
              </span>
              <input 
                type="email" 
                className="form-control bg-transparent border-start-0 border-dark-subtle ps-0" 
                placeholder="name@university.edu"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
                style={{boxShadow: 'none'}}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="form-label fw-600 small text-dark">PASSWORD</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-dark-subtle">
                <FaLock className="text-secondary" />
              </span>
              <input 
                type="password" 
                className="form-control bg-transparent border-start-0 border-dark-subtle ps-0" 
                placeholder="Create a strong password"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                style={{boxShadow: 'none'}}
              />
            </div>
          </div>

          {/* Signup Button */}
          <button type="submit" className="btn btn-primary w-100 py-3 shadow-sm mb-3">
            REGISTER NOW
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-4">
          <p className="small text-secondary mb-0">
            Already have an account? 
            <Link to="/login" className="ms-2 text-decoration-none fw-bold text-dark border-bottom border-dark border-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;