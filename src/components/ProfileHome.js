import React from 'react';
import './ProfileHome.css';

function ProfileHome({ userDetail }) {
  const username = userDetail?.name || 'User';

  return (
    <div className="container">
      <div className="profile-form-card">
        <div className="title">
          <h1 className="username">Hi {username},</h1>
          <p className="welcome-message">Welcome to TAG YOUR IP</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHome;
