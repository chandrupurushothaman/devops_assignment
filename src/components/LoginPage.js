import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Typography from "@mui/material/Typography";
import itLogo from "./i&tlogo.png";

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter both email and password');
      return;
    }

    const userData = { username, password };

    try {
      const response = await fetch('http://10.20.52.99:4400/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const { status, user_detail } = await response.json();
      console.log("status:", status);

      if (status) {
        localStorage.setItem('userDetail', JSON.stringify(user_detail));
        localStorage.setItem('isLoggedIn', 'true');
        onLoginSuccess(user_detail);
        navigate('/profilehome');
      } else {
        setError(user_detail);
      }
    } catch (error) {
      setError('Failed to login, please try again.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Navigate to forgot password page
  };

  return (
    <div className="login-container">
      <div className="pre-navbar">
        <Typography variant="h5" component="h1" className="pre-navbar-title">
        TAG YOUR IP<img src={itLogo} alt="Logo" className="pre-navbar-logo"/>
        </Typography>
      </div>
      <div className="form-card">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label" htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter your email"
                required
            />
          </div>
          <div className="input-group">
            <label className="label" htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="button login-button">Login</button>
        </form>
        <button onClick={handleRegister} className="button register-button">Register</button>
        {/* <div className="forgot-password-button">
          <button type="button" onClick={handleForgotPassword}>
            Forgot Password?
          </button>

        </div> */}
      </div>
    </div>
  );
}

export default LoginPage;
