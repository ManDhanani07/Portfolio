import React from 'react';

function ErrorMessage({ error, onRetry }) {
  return (
    <>
      <style>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 24px;
          max-width: 520px;
          margin: 30px auto;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          text-align: center;
          box-shadow: var(--shadow-md);
        }

        .error-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .error-title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .error-description {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 28px;
          line-height: 1.6;
          max-width: 420px;
        }

        .retry-btn {
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          padding: 10px 26px;
          border-radius: 30px;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: var(--shadow-sm);
          white-space: nowrap;
        }

        .retry-btn:hover {
          background-color: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
      <div className="error-container">
        <div className="error-icon-wrapper">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="error-title">Unable to load repositories.</h3>
        <p className="error-description">{error || "Failed to fetch project data from GitHub API."}</p>
        <button onClick={onRetry} className="retry-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>Retry</span>
        </button>
      </div>
    </>
  );
}

export default ErrorMessage;
