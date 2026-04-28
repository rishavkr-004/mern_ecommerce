import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaEye, FaMobileAlt, FaLaptop, FaHeadphones, FaPlus } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import API from '../api/client'; // Import your new API folder logic

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword') || '';

  const categories = [
    { name: 'All', icon: <FaShoppingCart />, value: '' },
    { name: 'Mobile', icon: <FaMobileAlt />, value: 'Mobile' },
    { name: 'Laptop', icon: <FaLaptop />, value: 'Laptop' },
    { name: 'Audio', icon: <FaHeadphones />, value: 'Audio' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // We only use the endpoint path now. The Base URL is handled by the client!
        let endpoint = '/api/products';
        
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (activeCategory) params.append('category', activeCategory);

        const queryString = params.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        const res = await API.get(url); 
        setProducts(res.data);
        setVisibleCount(12);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, keyword]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div className="pb-5">
      <section className="py-5 mb-4 text-center text-white">
        <div className="container py-lg-4">
          <h1 className="display-3 fw-800 mb-2 text-uppercase font-nordic">
            Tech <span className="text-info">Connect</span>
          </h1>
          <p className="lead mb-4 opacity-75">
            {keyword ? `Search results for "${keyword}"` : "Exclusive Electronics Collection for KRMU Students."}
          </p>
        </div>
      </section>

      {!keyword && (
        <div className="container mb-5">
          <div className="d-flex justify-content-center gap-3 overflow-auto pb-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.value)}
                className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 transition-all ${
                  activeCategory === cat.value 
                  ? 'btn-info text-dark shadow-lg scale-up' 
                  : 'btn-outline-light border-0 glass-container'
                }`}
                style={{ minWidth: '130px' }}
              >
                {cat.icon} <span className="fw-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div className="text-start">
            <h2 className="fw-bold text-white mb-0">
              {keyword ? 'Search Results' : activeCategory ? `${activeCategory}s` : 'Trending Now'}
            </h2>
            <div className="bg-info rounded" style={{ height: '4px', width: '60px' }}></div>
          </div>
          <span className="text-white-50">{products.length} Products Found</span>
        </div>

        {loading ? (
          <div className="text-center py-5">
             <div className="spinner-border text-info" role="status"></div>
             <p className="text-white mt-2 fw-bold italic">Scanning the warehouse...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 text-white">
            <h3>No gadgets found matching your criteria.</h3>
            <button className="btn btn-info mt-3" onClick={() => window.location.href='/'}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {products.slice(0, visibleCount).map((product) => {
                const discount = product.originalPrice 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                  : 0;

                return (
                  <div key={product._id} className="col-12 col-sm-6 col-lg-3">
                    <div className="glass-container p-3 h-100 product-card-hover d-flex flex-column border-0 shadow-lg position-relative">
                      {discount > 0 && (
                        <span className="position-absolute top-0 end-0 m-3 badge bg-danger z-3 shadow">
                          {discount}% OFF
                        </span>
                      )}
                      <div className="position-relative overflow-hidden rounded-4 mb-3 bg-white p-3 shadow-inner">
                        <img 
                          src={product.img || product.image} 
                          alt={product.name} 
                          className="img-fluid w-100" 
                          style={{ height: '180px', objectFit: 'contain' }}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Tech+Item"; }}
                        />
                      </div>
                      <div className="text-start px-1 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-info-emphasis opacity-75">{product.category}</small>
                          <small className="text-warning fw-bold">★ {product.rating || '4.0'}</small>
                        </div>
                        <h6 className="fw-bold mb-2 text-white text-truncate-2" style={{ height: '42px', fontSize: '0.95rem' }}>
                          {product.name}
                        </h6>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <h4 className="fw-800 mb-0 text-white">₹{product.price.toLocaleString()}</h4>
                          {product.originalPrice > product.price && (
                            <small className="text-white-50 text-decoration-line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="mt-auto d-flex gap-2">
                        <button className="btn btn-info flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold text-dark">
                          <FaShoppingCart size={14} /> <span>Add</span>
                        </button>
                        <Link 
                          to={`/product/${product._id}`} 
                          className="btn btn-outline-light glass-container d-flex align-items-center px-3"
                        >
                          <FaEye size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {visibleCount < products.length && (
              <div className="text-center mt-5">
                <button onClick={loadMore} className="btn btn-lg btn-outline-info rounded-pill px-5 glass-container border-info border-2 text-white fw-bold d-inline-flex align-items-center gap-2">
                  <FaPlus size={14} /> Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;