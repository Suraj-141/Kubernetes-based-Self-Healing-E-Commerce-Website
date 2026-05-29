import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

export default function Navbar({ user, onLogout, cartCount }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Package size={28} color="#38bdf8" />
        Nexus Store
      </Link>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        
        <Link to="/cart" className="nav-link" style={{ position: 'relative' }}>
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
        
        {user ? (
          <>
            <span className="nav-link" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              <User size={20} />
              {user.username}
            </span>
            <button onClick={onLogout} style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register">
              <button style={{ padding: '0.5rem 1.25rem' }}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
