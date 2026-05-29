import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/products/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <Zap size={48} color="var(--primary)" className="spinner" style={{ animation: 'rotate 2s linear infinite' }} />
      <h2 style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading premium gear...</h2>
    </div>
  );
  
  if (error) return <h2 style={{color: 'var(--danger)', textAlign: 'center', marginTop: '4rem'}}>{error}</h2>;

  return (
    <div>
      <div className="hero">
        <h1>Next-Gen Tech. <br/><span style={{ background: 'linear-gradient(to right, #38bdf8, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Delivered Fast.</span></h1>
        <p>Experience the ultimate in computing power, ergonomic design, and seamless connectivity with our curated collection of premium accessories.</p>
        <button style={{ fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
          Explore Collection
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <ShoppingBag size={28} color="var(--accent)" />
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Products</h2>
      </div>
      
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <div className="product-image-placeholder">
              {p.name.charAt(0)}
            </div>
            <h3 className="product-title">{p.name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '48px', fontSize: '0.95rem' }}>{p.description}</p>
            <div className="product-price">${p.price}</div>
            
            <button 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} 
              onClick={() => addToCart(p)} 
              disabled={p.stock_quantity === 0}
            >
              {p.stock_quantity > 0 ? (
                <>Add to Cart</>
              ) : (
                'Out of Stock'
              )}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
              <ShieldCheck size={14} color="var(--success)" />
              {p.stock_quantity > 0 ? `${p.stock_quantity} in stock ready to ship` : 'Restocking soon'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
