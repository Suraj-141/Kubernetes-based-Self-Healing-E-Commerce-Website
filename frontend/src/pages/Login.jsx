import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, User, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', { username, password });
      onLogin(res.data);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
      toast.error('Login failed. Please check your credentials.', { style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #ef4444' }});
    }
  };

  return (
    <div className="auth-container">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <LogIn size={40} color="var(--accent)" />
        </div>
      </div>
      <h2>Welcome Back</h2>
      
      {error && <p style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <User size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Lock size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-muted)' }} />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>Log In to Nexus</button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register" style={{ fontWeight: 'bold' }}>Sign up</Link>
      </p>
    </div>
  );
}
