import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Layout Components
import Navbar from './components/Navbar';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Initialize Stripe with your Publishable Key from Stripe Dashboard
// Replace 'pk_test_...' with your actual key
const stripePromise = loadStripe('pk_test_your_public_key_goes_here');

function App() {
  return (
    <div className="App">
      {/* Wrap the Router or just the Routes with Elements. 
          Everything inside this provider can now use Stripe hooks. 
      */}
      <Elements stripe={stripePromise}>
        <Router>
          <Navbar /> 
          
          <main className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
        </Router>
      </Elements>
    </div>
  );
}

export default App;