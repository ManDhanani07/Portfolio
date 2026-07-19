import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <>
      <style>{`
        .notfound-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
        }

        .notfound-container {
          max-width: 500px;
          margin: 0 auto;
        }

        .notfound-code {
          font-size: 120px;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 20px;
          letter-spacing: -2px;
        }

        .notfound-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 16px;
        }

        .notfound-description {
          font-size: 16px;
          color: var(--text-muted);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .notfound-btn {
          display: inline-block;
          background-color: var(--primary);
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          padding: 12px 32px;
          border-radius: 30px;
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .notfound-btn:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
        }
      `}</style>
      <section className="notfound-section">
        <div className="notfound-container">
          <div className="notfound-code">404</div>
          <h2 className="notfound-title">Page Not Found</h2>
          <p className="notfound-description">
            Oops! The page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>
          <Link to="/" className="notfound-btn">
            Go Back Home
          </Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
