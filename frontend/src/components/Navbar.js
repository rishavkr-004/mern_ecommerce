import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // 1. Import the hook

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // 2. Pull cartItems from global state
  
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-800 text-dark" style={{ fontSize: '1.6rem', letterSpacing: '-1px' }} to="/">
          CAMPUS<span className="text-white">SHOP</span>
        </Link>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-600 px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-600 px-3" to="/category/all">Shop</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-4 mt-3 mt-lg-0">
            {/* Cart Icon - NOW UPDATES DYNAMICALLY */}
            <Link to="/cart" className="position-relative text-dark transition-hover">
              <FaShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm" style={{ fontSize: '0.65rem' }}>
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-none d-md-block text-end">
                  <small className="d-block text-secondary text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Account</small>
                  <span className="fw-600 text-dark">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary px-4 rounded-pill shadow-sm d-flex align-items-center gap-2">
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