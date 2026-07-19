import React from 'react';

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
          font-weight: 550;
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
          <h2 className="header-subtitle">AI & Machine Learning Student</h2>
          <p className="header-description">
            Passionate about Artificial Intelligence, Machine Learning, and Full-Stack Web Development, with a focus on creating innovative, efficient, and user-centric software solutions.
          </p>
        </div>
      </header>
    </>
  );
}

export default Header;
