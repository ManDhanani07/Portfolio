import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from '../api';
import { LogOut, User, CheckCircle2, ShieldCheck, LogIn } from 'lucide-react';

import './Navbar.css';

function Navbar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
      setAuthenticated(isAuthenticated());
    };

    window.addEventListener('auth_state_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth_state_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/skills', label: 'Skills' },
    { to: '/projects', label: 'Projects' },
    { to: '/task', label: 'Tasks' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="navbar">
        <div className="navbar-content">
          <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
            Man's Portfolio
          </NavLink>

          {/* Navbar Right: Nav Links, Auth Controls, Theme Switch */}
          <div className="navbar-right">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Toggle Hamburger Button */}
            <button 
              className={`navbar-toggle ${isOpen ? 'is-active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>

            {/* Navigation Items List */}
            <ul className={`navbar-links ${isOpen ? 'mobile-active' : ''}`}>
              {navLinks.map((link) => (
                <li key={link.to} className="navbar-item" style={{ width: '100%' }}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {/* Authentication Status in Nav Menu */}
              <li className="navbar-item nav-auth-section">
                {authenticated ? (
                  <>
                    <div className="user-chip" title={user?.email || "Logged in"}>
                      <User size={13} />
                      <span>{user?.email || "Student"}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="login-btn-link"
                    onClick={closeMenu}
                  >
                    <LogIn size={14} />
                    <span>Login</span>
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
