import { useState } from 'react';
import axios from 'axios';
import { Trash2, CreditCard, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Cart({ cart, user, clearCart }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const resolvedUserId = user?.userId || user?.id;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout', { style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #ef4444' }});
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      // Send one order request per cart item (matching the order-service API)
      for (const item of cart) {
        await axios.post('/api/orders/orders', {
          userId: resolvedUserId,
          productId: item.id,
          quantity: item.qty,
          price: parseFloat(item.price),
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
      
      setSuccess(true);
      clearCart();
      toast.success('Payment successful! Order placed.', { style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #10b981' }});
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
      toast.error('Checkout failed. Please try again.', { style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #ef4444' }});
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <CreditCard size={40} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Order Complete!</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Thank you for your purchase. Your premium gear is on its way.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', margin: '6rem auto', maxWidth: '400px' }}>
        <ShoppingCart size={80} color="var(--surface-border)" style={{ marginBottom: '2rem' }} />
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Looks like you haven't added any premium gear to your cart yet.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ShoppingCart size={32} color="var(--primary)" />
        Your Cart
      </h1>
      
      {error && <p style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>{error}</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(item => (
            <div key={item.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', padding: '1rem 1.5rem', gap: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                {item.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Quantity: {item.qty}</p>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                ${(item.price * item.qty).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="card" style={{ position: 'sticky', top: '120px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
            </div>
            
            <button 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} 
              onClick={handleCheckout} 
              disabled={processing}
            >
              <CreditCard size={20} />
              {processing ? 'Processing Secure Payment...' : 'Secure Checkout'}
            </button>
            
            {!user && (
              <p style={{ textAlign: 'center', color: 'var(--danger)', fontSize: '0.9rem', marginTop: '1rem' }}>
                You must log in to checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
