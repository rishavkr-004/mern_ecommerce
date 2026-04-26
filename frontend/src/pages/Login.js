import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaPhoneAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed.");
    }
  };

  // Social Login Placeholders
  const handleGoogleLogin = () => console.log("Redirecting to Google OAuth...");
  const handlePhoneLogin = () => console.log("Opening OTP Modal...");

  return (
    <div className="auth-container py-5">
      <div className="glass-container p-4 p-md-5 col-11 col-sm-8 col-md-6 col-lg-4 shadow-lg text-start">
        <div className="text-center mb-4">
          <h2 className="fw-800 text-dark mb-1">WELCOME BACK</h2>
          <div className="bg-dark mx-auto rounded" style={{ height: '3px', width: '40px' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Password Field with View Toggle */}
          <div className="mb-4">
            <label className="form-label fw-600 small text-dark">PASSWORD</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-dark-subtle">
                <FaLock className="text-secondary" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control bg-transparent border-x-0 border-dark-subtle ps-0" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <span 
                className="input-group-text bg-transparent border-start-0 border-dark-subtle cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <FaEyeSlash className="text-secondary" /> : <FaEye className="text-secondary" />}
              </span>
            </div>
            <div className="text-end mt-2">
               <Link to="#" className="small text-decoration-none text-dark fw-semibold opacity-75">Forgot password?</Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3 shadow-sm mb-4">
            SIGN IN
          </button>
        </form>

        {/* Divider */}
        <div className="position-relative mb-4">
          <hr className="text-dark-subtle" />
          <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-secondary fw-600" style={{ background: 'transparent !important', backdropFilter: 'blur(10px)' }}>
            OR CONTINUE WITH
          </span>
        </div>

        {/* Social Logins */}
        <div className="row g-2 mb-4">
          <div className="col-6">
            <button onClick={handleGoogleLogin} className="btn btn-light w-100 py-2 d-flex align-items-center justify-content-center gap-2 glass-container border-dark-subtle">
              <FaGoogle className="text-danger" /> <span className="small fw-bold">Google</span>
            </button>
          </div>
          <div className="col-6">
            <button onClick={handlePhoneLogin} className="btn btn-light w-100 py-2 d-flex align-items-center justify-content-center gap-2 glass-container border-dark-subtle">
              <FaPhoneAlt className="text-primary" /> <span className="small fw-bold">Phone</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="small text-secondary mb-0">
            New to Campus Shop? 
            <Link to="/signup" className="ms-2 text-decoration-none fw-bold text-dark border-bottom border-dark border-2">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;