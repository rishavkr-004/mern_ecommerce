import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/client';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

// 1. Stable Input Component (Outside main component to maintain focus)
const AuthInput = ({ label, icon: Icon, type, name, placeholder, value, onChange, required, ...props }) => (
  <div className="mb-3">
    <label className="form-label fw-600 small text-white-50">{label}</label>
    <div className="input-group glass-container p-1 rounded-pill">
      <span className="input-group-text bg-transparent border-0 text-info ps-3">
        <Icon />
      </span>
      <input
        type={type}
        name={name}
        className="form-control bg-transparent border-0 text-white shadow-none ps-2"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={type === "password" ? "new-password" : "on"}
        {...props}
      />
    </div>
  </div>
);

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Optimized Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Phone logic: only numbers; Others: normal value
      [name]: name === 'phone' ? value.replace(/\D/g, '') : value
    }));
  };

  // 3. Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front-end Pre-validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      return alert("Please fill in all required fields correctly.");
    }

    if (formData.phone.length !== 10) {
      return alert("Phone number must be exactly 10 digits.");
    }

    setLoading(true);
    try {
      // Professional Payload: Trim spaces and normalize email
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password
      };

      const res = await API.post('/api/auth/signup', payload);
      
      if (res.data.success || res.status === 201) {
        alert(res.data.msg || "Account created successfully!");
        navigate('/login');
      }
    } catch (err) {
      // Logic for catching backend "Please fill in all required fields"
      const serverMsg = err.response?.data?.msg || "Registration failed. Please try again.";
      alert(serverMsg);
      console.error("Signup Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="glass-container p-4 p-md-5 col-11 col-sm-8 col-md-6 col-lg-4 shadow-lg text-start mx-auto">
        <div className="text-center mb-4">
          <h2 className="fw-800 text-white mb-1">CREATE ACCOUNT</h2>
          <div className="bg-info mx-auto rounded" style={{ height: '3px', width: '40px' }}></div>
        </div>

        <form onSubmit={handleSubmit} noValidate={false}>
          <AuthInput 
            label="FULL NAME" 
            icon={FaUser} 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name" 
            required 
          />

          <AuthInput 
            label="EMAIL ADDRESS" 
            icon={FaEnvelope} 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com" 
            required 
          />

          <AuthInput 
            label="PHONE NUMBER" 
            icon={FaPhone} 
            type="tel" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number" 
            maxLength="10"
            required 
          />

          <AuthInput 
            label="PASSWORD" 
            icon={FaLock} 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password" 
            required 
          />

          <button 
            type="submit" 
            className="btn btn-info text-dark w-100 py-3 rounded-pill fw-bold mb-3 mt-4" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                PROCESSING...
              </>
            ) : "REGISTER NOW"}
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