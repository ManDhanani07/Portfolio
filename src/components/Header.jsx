import React from 'react';
import { Link } from 'react-router-dom';

function Header({ name, themeColor }) {
  const accentColor = themeColor || '#2563eb';

  return (
    <>
      <style>{`
        .header-section {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 90vh;
          padding: 100px 24px 80px;
          background-color: var(--bg-primary);
          text-align: center;
        }

        .header-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .portfolio-badge {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 6px 16px;
          border: 1.5px solid var(--primary);
          border-radius: 30px;
          margin-bottom: 24px;
        }

        .header-name {
          font-family: var(--font-heading);
          font-size: 54px;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .highlight-text {
          transition: color 0.3s ease;
        }

        .header-subtitle {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .header-description {
          font-size: 17px;
          color: var(--text-muted);
          max-width: 580px;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .header-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .header-cta-btn {
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          padding: 12px 30px;
          border-radius: 30px;
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: var(--shadow-sm);
        }

        .header-cta-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .header-secondary-btn {
          background-color: transparent;
          border: 1.5px solid var(--primary);
          font-size: 15px;
          font-weight: 600;
          padding: 11px 30px;
          border-radius: 30px;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .header-secondary-btn:hover {
          background-color: var(--bg-secondary);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .header-name {
            font-size: 38px;
          }
          .header-subtitle {
            font-size: 20px;
          }
          .header-description {
            font-size: 15px;
          }
        }
      `}</style>
      <header className="header-section" id="home">
        <div className="header-container">
          <span className="portfolio-badge" style={{ color: accentColor, borderColor: accentColor }}>
            Welcome to my Portfolio
          </span>
          <h1 className="header-name">
            Hello, I'm <span className="highlight-text" style={{ color: accentColor }}>{name}</span>
          </h1>
          <h2 className="header-subtitle">Aspiring AI Engineer & Full-Stack Developer</h2>
          <p className="header-description">
            Passionate about Artificial Intelligence, Machine Learning, and Full-Stack Web Development, with a focus on creating innovative, efficient, and user-centric software solutions.
          </p>

        </div>
      </header>
    </>
  );
}

export default Header;
