import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Settings from './pages/Settings';
import './App.css';

function App(): JSX.Element {
  const logoUrl = chrome.runtime.getURL('dangmoo.png');
  
  return (
    <Router>
      <div className="app">
        <div className="header">
          <img src={logoUrl} alt="Dangmoo" className="logo" />
        </div>
        <nav className="nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/main" className="nav-link">Main</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Main />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

