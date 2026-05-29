import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    // Normalize: API returns `userId`, map it to `id` for consistency
    const normalizedUser = { ...userData, id: userData.userId || userData.id };
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', normalizedUser.token);
    toast.success('Successfully logged in!', {
      style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #38bdf8' }
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast('Logged out', { icon: '👋', style: { background: '#1e293b', color: '#f8fafc' } });
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #10b981' }
    });
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <Toaster position="bottom-right" />
      <Navbar user={user} onLogout={handleLogout} cartCount={cart.reduce((a, c) => a + c.qty, 0)} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart cart={cart} user={user} clearCart={clearCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
