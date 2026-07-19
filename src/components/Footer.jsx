import React from 'react';

function Footer() {
  return (
    <>
      <style>{`
        .footer-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border);
          padding: 40px 24px;
        }

        .footer-container {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .social-links-row {
          display: flex;
          gap: 24px;
        }

        .social-link-item {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .social-link-item:hover {
          color: var(--primary);
        }

        .footer-copyright {
          font-size: 13px;
          color: var(--text-muted);
        }

        @media (max-width: 600px) {
          .footer-container {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
      <footer className="footer-section">
        <div className="footer-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Man Dhanani. All rights reserved.
          </p>
          
          <div className="social-links-row">
            <a href="mailto:man.dhanani@example.com" className="social-link-item">
              Email
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link-item">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link-item">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
