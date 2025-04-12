import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import Typography from "@mui/material/Typography";
import itLogo from "./i&tlogo.png";

function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !username || !department || !password || !confirmPassword) {
      alert('Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    const userData = { name, username, department, password };

    try {
      const response = await fetch('http://10.20.52.99:4400/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const { status, message } = await response.json();
      if (status) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError(message);
      }
    } catch (error) {
      setError('Failed to register, please try again.');
    }
  };

  return (
      <div className="register-container">
        <div className="pre-navbar">
          <Typography variant="h5" component="h1" className="pre-navbar-title">
          TAG YOUR IP <img src={itLogo} alt="Logo" className="pre-navbar-logo"/>
          </Typography>
        </div>
        <div className="form-card">
          <h1 className="register-title">Register</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label" htmlFor="name">Name</label>
              <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Enter your name"
                  required
              />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="email">Email</label>
              <input
                  type="email"
                  id="email"
                  value={username}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                  required
              />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="department">Department</label>
              <input
                  type="text"
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input"
                  placeholder="Enter your department"
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
            <div className="input-group">
              <label className="label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Confirm your password"
                  required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="button register-button">Register</button>
            <button onClick={handleLogin} className="button login-button"> Sign In</button>
            <div className="password-requirements">
            </div>
          </form>
        </div>
      </div>
  );
}

export default RegisterPage;
