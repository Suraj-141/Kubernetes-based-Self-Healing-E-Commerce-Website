import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, User, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', { username, password });
      toast.success('Account created successfully! Please log in.', { style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #10b981' }});
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Username might be taken.');
      toast.error('Registration failed.', { style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #ef4444' }});
    }
  };

  return (
    <div className="auth-container">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <UserPlus size={40} color="var(--primary)" />
        </div>
      </div>
      <h2>Create Account</h2>
      
      {error && <p style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <User size={20} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Choose a Username" 
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
            placeholder="Create a Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>Join Nexus Store</button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ fontWeight: 'bold' }}>Log in</Link>
      </p>
    </div>
  );
}
