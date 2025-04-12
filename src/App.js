import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProfileHome from './components/ProfileHome';
import HomePage from './components/HomePage';
import IpRequest from './components/MulticastIPRequestForm';
import Results from './components/MulticastIPResults';
import Manage from './components/IPManager';
import Navbar from './components/Navbar';
import Admin from './components/AdminPage';
import RegisterPage from "./components/RegisterPage";
import UserManagement from './components/UserManagement';
import UserApproval from './components/UserApprovals';
import Documentation from './components/Documentation';



const SESSION_TIMEOUT = 30 * 60 * 1000;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  useEffect(() => {
    const storedUserDetail = localStorage.getItem('userDetail');
    const loggedInState = localStorage.getItem('isLoggedIn');

    if (storedUserDetail && loggedInState === 'true') {
      setUserDetail(JSON.parse(storedUserDetail));
      setIsLoggedIn(true);
      resetTimeout();
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userDetail) => {
    
    setIsLoggedIn(true);
    setUserDetail(userDetail);
    localStorage.setItem('userDetail', JSON.stringify(userDetail));
    localStorage.setItem('isLoggedIn', 'true');
    resetTimeout();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserDetail(null);
    localStorage.removeItem('userDetail');
    localStorage.removeItem('isLoggedIn');
    clearTimeout(timeoutId);
  };

  const resetTimeout = () => {
    clearTimeout(timeoutId);
    const id = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
    setTimeoutId(id);
  };

  useEffect(() => {
    const handleUserActivity = () => {
      if (isLoggedIn) {
        resetTimeout();
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
    };
  }, [isLoggedIn, timeoutId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isLoggedIn && <Navbar userDetail={userDetail} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profilehome" element={isLoggedIn ? <ProfileHome userDetail={userDetail} /> : <Navigate to="/login" />} />
        <Route path="/documentation" element={isLoggedIn ? <Documentation/> : <Navigate to="/login" />} />
        <Route path="/iprequest" element={isLoggedIn ? <IpRequest /> : <Navigate to="/login" />} />
        <Route path="/results" element={isLoggedIn ? <Results userDetail={userDetail} /> : <Navigate to="/login" />} />
        <Route path="/manage" element={isLoggedIn ? <Manage currentUser={userDetail} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isLoggedIn && userDetail.role === 'Admin' ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/usermanagement" element={isLoggedIn && userDetail.role === 'Admin' ? <UserManagement currentUser={userDetail["username"]}/> : <Navigate to="/login" />} />
        <Route path="/userapproval" element={isLoggedIn && userDetail.role === 'Admin' ? <UserApproval /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/profilehome" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
