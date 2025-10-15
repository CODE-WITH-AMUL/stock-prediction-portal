import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        const errMsg =
          data.password || data.username || data.email || data.detail || 'Registration failed';
        throw new Error(Array.isArray(errMsg) ? errMsg.join(', ') : errMsg);
      }

      alert('Account created successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '2rem',
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: 'white',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '3rem',
          borderRadius: '24px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 40px 80px rgba(139, 92, 246, 0.3)',
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background:
              'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Create Your Account
        </h2>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              color: '#fca5a5',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            style={inputStyle}
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={buttonStyle(loading)}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p
          style={{
            color: '#64748b',
            fontSize: '0.9rem',
            textAlign: 'center',
            marginTop: '1.5rem',
          }}
        >
          Already have an account?{' '}
          <a href="/login" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  background: 'rgba(15, 23, 42, 0.8)',
  color: 'white',
  fontSize: '1rem',
};

const buttonStyle = (loading) => ({
  padding: '1.25rem',
  fontSize: '1.1rem',
  fontWeight: '700',
  color: 'white',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  border: 'none',
  borderRadius: '50px',
  cursor: loading ? 'not-allowed' : 'pointer',
  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: loading ? 0.7 : 1,
});

export default Register;
