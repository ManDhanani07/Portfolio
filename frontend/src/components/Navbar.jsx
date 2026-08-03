import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

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
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background-color: var(--bg-primary);
          opacity: 0.98;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          z-index: 1000;
          display: flex;
          align-items: center;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .navbar-content {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          color: var(--primary);
          letter-spacing: -0.5px;
          cursor: pointer;
          text-decoration: none;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .navbar-links {
          display: flex;
          list-style: none;
          gap: 32px;
          margin: 0;
          padding: 0;
        }

        .navbar-link {
          font-size: 14px;
          font-weight: 550;
          color: var(--text-muted);
          padding: 8px 0;
          position: relative;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .navbar-link:hover {
          color: var(--primary);
        }

        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary);
          transition: width 0.25s ease;
        }

        .navbar-link.active {
          color: var(--primary);
        }

        .navbar-link.active::after {
          width: 100%;
        }

        /* Theme Toggle Button */
        .theme-toggle-btn {
          background: none;
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-main);
          transition: all 0.25s ease;
        }

        .theme-toggle-btn:hover {
          background-color: var(--bg-secondary);
          border-color: var(--primary);
          color: var(--primary);
        }

        /* Hamburger toggle styling */
        .navbar-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 22px;
          height: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }

        .navbar-toggle .bar {
          width: 100%;
          height: 2px;
          background-color: var(--text-main);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        /* Responsive navigation drawer */
        @media (max-width: 768px) {
          .navbar-toggle {
            display: flex;
          }

          .navbar-toggle.is-active .bar:first-child {
            transform: translateY(7px) rotate(45deg);
          }

          .navbar-toggle.is-active .bar:nth-child(2) {
            opacity: 0;
          }

          .navbar-toggle.is-active .bar:last-child {
            transform: translateY(-7px) rotate(-45deg);
          }

          .navbar-links {
            position: fixed;
            top: 0;
            right: -100%;
            height: 100vh;
            width: 260px;
            background-color: var(--bg-primary);
            border-left: 1px solid var(--border);
            flex-direction: column;
            padding: 100px 32px;
            gap: 24px;
            transition: right 0.3s ease;
            box-shadow: var(--shadow-lg);
          }

          .navbar-links.mobile-active {
            right: 0;
          }

          .navbar-link {
            font-size: 16px;
            display: block;
            width: 100%;
          }

          .navbar-right {
            gap: 16px;
          }
        }
      `}</style>
      <nav className="navbar">
        <div className="navbar-content">
          <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
            Man's Portfolio
          </NavLink>

          {/* Navbar Toggle and Theme Switch block */}
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
                <li key={link.to} className="navbar-item">
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
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
