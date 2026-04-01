import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Mock login for now or use real endpoint if CORS allows
      // For this demo, we'll try to hit the real endpoint but fallback to a mock if it fails due to CORS/network
      // In a real scenario, we'd configure a proxy.

      const loginPayload = {
        email,
        password,
        mac_address: "00:00:00:00:00:00", // Dummy MAC for dashboard login
        username: "DashboardUser",
        c: "web-dashboard"
      };

      try {
        const response = await axios.post('http://localhost:8000/api/login', loginPayload);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } catch (err) {
        console.error("Login failed", err);
        setError('Login failed. Please check your credentials.');
      }

    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            margin: '0 0 1rem 0',
            fontSize: '3.5rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: 'linear-gradient(180deg, #fff 0%, #ccc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255,255,255,0.3)'
          }}>ROCKS</h1>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid red',
            color: '#ff6b6b',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{ paddingLeft: '35px' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '35px' }}
                required
              />
            </div>
          </div>

          <button type="submit" style={{ width: '100%' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}
