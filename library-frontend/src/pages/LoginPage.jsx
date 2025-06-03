import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://localhost:7173/api/Auth/login',
        { username, password }
      );

      const token = response.data.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', response.data.username);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/books');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        setError(error.response.data || 'Invalid username or password');
      } else if (error.request) {
        setError('No response received from the server. Please try again.');
      } else {
        setError('An error occurred while setting up the request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">Library</div>
          <h1>Portal</h1>
          <p>Sign in to access the library management system</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Forgot your password? <a href="/reset-password">Reset it here</a></p>
          <p>Need help? Contact <a href="mailto:support@libraryhub.com">library@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;