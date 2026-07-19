import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
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
          background-color: rgba(11, 15, 25, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          z-index: 1000;
          display: flex;
          align-items: center;
          transition: background-color 0.3s ease;
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
        }
      `}</style>
      <nav className="navbar">
        <div className="navbar-content">
          <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
            Man's Portfolio
          </NavLink>

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
      </nav>
    </>
  );
}

export default Navbar;
