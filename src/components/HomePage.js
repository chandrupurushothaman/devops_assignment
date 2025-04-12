import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
      <div className="container">
          <div className="home-form-card">
              <h1 className="title">TAG YOUR IP</h1>
              <div className="button-container">
                  <button className="home-button" onClick={() => navigate('/login')}>Login</button>
                  <button className="home-button" onClick={() => navigate('/register')}>Register</button>
              </div>
          </div>
      </div>
  );
}

export default HomePage;
