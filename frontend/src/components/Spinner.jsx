import React from 'react';

function Spinner() {
  return (
    <>
      <style>{`
        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          min-height: 360px;
          max-width: 480px;
          margin: 20px auto;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          text-align: center;
          position: relative;
        }

        .spinner-orb {
          position: relative;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        /* Outer rotating ring */
        .spinner-outer-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top-color: var(--primary);
          border-right-color: var(--primary);
          border-radius: 50%;
          animation: spinClockwise 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
        }

        /* Inner counter-rotating ring */
        .spinner-inner-ring {
          position: absolute;
          width: 46px;
          height: 46px;
          border: 3.5px solid transparent;
          border-bottom-color: #a855f7;
          border-left-color: #a855f7;
          border-radius: 50%;
          animation: spinCounterClockwise 0.85s linear infinite;
          filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.4));
        }

        /* Center glowing pulse dot */
        .spinner-pulse-dot {
          width: 12px;
          height: 12px;
          background-color: var(--primary);
          border-radius: 50%;
          animation: pulseGlow 1.2s ease-in-out infinite alternate;
          box-shadow: 0 0 12px var(--primary);
        }

        @keyframes spinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spinCounterClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes pulseGlow {
          0% { transform: scale(0.7); opacity: 0.5; }
          100% { transform: scale(1.25); opacity: 1; }
        }

        .spinner-text {
          font-family: var(--font-heading);
          font-size: 17px;
          font-weight: 600;
          color: var(--text-main);
          letter-spacing: 0.3px;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .spinner-subtext {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Bouncing loading dots */
        .loading-dots span {
          display: inline-block;
          animation: waveDots 1.4s infinite ease-in-out both;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        .loading-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes waveDots {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1.2); opacity: 1; color: var(--primary); }
        }
      `}</style>

      <div className="spinner-wrapper">
        <div className="spinner-orb">
          <div className="spinner-outer-ring"></div>
          <div className="spinner-inner-ring"></div>
          <div className="spinner-pulse-dot"></div>
        </div>

        <h3 className="spinner-text">
          Loading GitHub Repositories
          <span className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </h3>
        <p className="spinner-subtext">Fetching live data from GitHub REST API</p>
      </div>
    </>
  );
}

export default Spinner;
