import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [keyword, setKeyword] = useState('');

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // This will hit your backend route: /api/products?keyword=...
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3 glass-container shadow-sm border-bottom border-white-10">
      <div className="container">
        {/* Brand - Updated to match Tech theme */}
        <Link className="navbar-brand fw-800 text-info" style={{ fontSize: '1.6rem', letterSpacing: '-1px' }} to="/">
          TECH<span className="text-white">CONNECT</span>
        </Link>
        
        <button className="navbar-toggler border-0 shadow-none text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Search Bar - Integrated with backend ?keyword= logic */}
          <form onSubmit={submitHandler} className="mx-auto mt-3 mt-lg-0 col-lg-5">
            <div className="input-group glass-container rounded-pill px-3 py-1">
              <input
                type="text"
                className="form-control bg-transparent border-0 text-white shadow-none"
                placeholder="Search gadgets, brands..."
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="btn text-info border-0" type="submit">
                <FaSearch />
              </button>
            </div>
          </form>
          
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link className="nav-link text-white fw-600 px-3 opacity-75 hover-opacity-100" to="/">Home</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-4 mt-3 mt-lg-0 ms-lg-4">
            {/* Cart Icon with Dynamic Badge */}
            <Link to="/cart" className="position-relative text-white transition-hover">
              <FaShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info text-dark shadow" style={{ fontSize: '0.65rem' }}>
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-none d-md-block text-end">
                  <small className="d-block text-info-emphasis text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Authorized</small>
                  <span className="fw-600 text-white">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-info btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-info px-4 rounded-pill shadow-sm d-flex align-items-center gap-2 fw-bold text-dark">
                <FaUser size={14} /> <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;