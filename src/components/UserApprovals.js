import React, { useState, useEffect } from 'react';
import './UserApprovals.css';

const UserApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('http://10.20.52.99:4400/pending_registrations');
      const data = await response.json();
      setPendingUsers(data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const handleApprove = async (username) => {
    try {
      const response = await fetch('http://10.20.52.99:4400/approve_registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, status: 'approved' }),
      });

      if (response.ok) {
        alert(`User with username: ${username} approved.`);
        setPendingUsers(pendingUsers.filter(user => user.username !== username));
      } else {
        alert('Failed to approve user.');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <div className="user-approvals-container">
      <div className="user-approvals-card">
        <h1 className="user-approvals-title">Approval Requests</h1>
        {pendingUsers.length === 0 ? (
          <p>No pending users.</p>
        ) : (
          pendingUsers.map((user) => (
            <div key={user.username} className="user-app-item">
              <div className="user-info">
                <h2 className="username-approval">{user.username}</h2>
                <p className="department">Department: {user.department}</p>
              </div>
              <div className="user-actions">
                <button className="approve-button" onClick={() => handleApprove(user.username)}>Approve</button>
                <button className="reject-button" disabled title="Reject functionality coming soon">Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserApprovals;