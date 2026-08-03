import React, { useState } from 'react';

function RepoCard({ repo, index }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper date formatter
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper size formatter (KB / MB)
  const formatSize = (sizeKB) => {
    if (!sizeKB) return '0 KB';
    if (sizeKB >= 1024) {
      return `${(sizeKB / 1024).toFixed(2)} MB`;
    }
    return `${sizeKB} KB`;
  };

  // Copy git clone URL to clipboard
  const handleCopyClone = (e) => {
    e.stopPropagation();
    if (repo.clone_url) {
      navigator.clipboard.writeText(`git clone ${repo.clone_url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Accent theme mapping
  const projectClasses = ['finance', 'research', 'connect'];
  const cardClass = projectClasses[index % 3];

  return (
    <>
      <style>{`
        .repo-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-left: 4px solid var(--project-accent, var(--primary));
          border-radius: 4px 20px 20px 20px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .repo-card:hover {
          transform: translateY(-6px);
          border-color: var(--project-accent, var(--primary));
          box-shadow: 0 15px 30px -10px var(--project-accent-glow, rgba(59, 130, 246, 0.15));
        }

        .repo-card.finance {
          --project-accent: #3b82f6;
          --project-accent-glow: rgba(59, 130, 246, 0.2);
        }

        .repo-card.research {
          --project-accent: #a855f7;
          --project-accent-glow: rgba(168, 85, 247, 0.2);
        }

        .repo-card.connect {
          --project-accent: #10b981;
          --project-accent-glow: rgba(16, 185, 129, 0.2);
        }

        .repo-card-header {
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .repo-card-num {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          color: var(--project-accent, var(--primary));
          letter-spacing: 0.5px;
        }

        .repo-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--project-accent, var(--primary));
          background-color: var(--primary-light);
          padding: 3px 10px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .repo-card-body {
          padding: 24px;
          text-align: left;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .repo-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .repo-github-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .repo-card-title {
          font-family: var(--font-heading);
          font-size: 19px;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.35;
          word-break: break-word;
        }

        .repo-full-name {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 12px;
          font-family: monospace;
        }

        .repo-card-description {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 16px;
          flex-grow: 1;
        }

        /* Topics Tags Pill list */
        .topics-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .topic-pill {
          font-size: 11px;
          font-weight: 600;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 8px;
          border-radius: 12px;
        }

        /* Detailed Stats Grid inside Card */
        .card-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 16px;
          padding: 12px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
        }

        .stat-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-icon {
          flex-shrink: 0;
        }

        .stat-icon.star {
          color: #f59e0b;
        }

        .stat-icon.fork {
          color: #a855f7;
        }

        .stat-icon.issue {
          color: #10b981;
        }

        .stat-icon.size {
          color: #f97316;
        }

        .stat-box strong {
          color: var(--text-main);
        }

        .repo-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px dashed var(--border);
          gap: 10px;
          flex-wrap: wrap;
        }

        .view-details-btn {
          background-color: var(--primary-light);
          color: var(--primary);
          border: 1px solid var(--primary);
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .view-details-btn:hover {
          background-color: var(--primary);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .repo-open-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          color: var(--text-main);
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .repo-open-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--bg-secondary);
          transform: translateY(-1px);
        }

        /* Modal Styles for "All Project Details" */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          max-width: 650px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 32px;
          position: relative;
          box-shadow: var(--shadow-lg);
          text-align: left;
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          color: var(--text-muted);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          color: var(--text-main);
          border-color: var(--primary);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .modal-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid var(--primary);
        }

        .modal-title-group h3 {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-main);
        }

        .modal-title-group p {
          font-size: 13px;
          color: var(--text-muted);
        }

        .modal-section-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 20px 0 10px;
        }

        .modal-description {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .modal-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .modal-detail-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          padding: 12px 16px;
          border-radius: 10px;
        }

        .modal-detail-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .modal-detail-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
          margin-top: 4px;
        }

        .clone-box {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
        }

        .clone-text {
          font-family: monospace;
          font-size: 13px;
          color: var(--primary);
          overflow-x: auto;
          white-space: nowrap;
        }

        .copy-btn {
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          flex-shrink: 0;
        }

        .copy-btn:hover {
          background-color: var(--primary-hover);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
      `}</style>

      <div className={`repo-card ${cardClass}`}>
        <div className="repo-card-header">
          <span className="repo-card-num">0{index + 1}</span>
          <span className="repo-badge">{repo.language || 'General'}</span>
        </div>

        <div className="repo-card-body">
          <div className="repo-title-row">
            <svg className="repo-github-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <h3 className="repo-card-title">{repo.name}</h3>
          </div>
          <div className="repo-full-name">{repo.full_name}</div>

          <p className="repo-card-description">
            {repo.description || "No description provided for this repository."}
          </p>

          {/* Topics Tag List */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="topics-container">
              {repo.topics.map((topic, i) => (
                <span key={i} className="topic-pill">#{topic}</span>
              ))}
            </div>
          )}

          {/* Stats Overview Grid */}
          <div className="card-stats-grid">
            <div className="stat-box">
              <svg className="stat-icon star" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Stars:</span> <strong>{repo.stargazers_count || 0}</strong>
            </div>
            <div className="stat-box">
              <svg className="stat-icon fork" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="6" r="3" />
                <path d="M18 9v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
                <path d="M12 12v3" />
              </svg>
              <span>Forks:</span> <strong>{repo.forks_count || 0}</strong>
            </div>
            <div className="stat-box">
              <svg className="stat-icon issue" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 2 1.88 1.88"/>
                <path d="M14.12 3.88 16 2"/>
                <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/>
                <path d="M12 20v-9"/>
                <path d="M6.53 9C4.6 9.8 3 11.4 3 14"/>
                <path d="M6 18c-1.5-.6-2.6-1.7-3-3"/>
                <path d="M17.47 9c1.93.8 3.53 2.4 3.53 5"/>
                <path d="M18 18c1.5-.6 2.6-1.7 3-3"/>
              </svg>
              <span>Issues:</span> <strong>{repo.open_issues_count || 0}</strong>
            </div>
            <div className="stat-box">
              <svg className="stat-icon size" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              <span>Size:</span> <strong>{formatSize(repo.size)}</strong>
            </div>
          </div>

          {/* Card Action Buttons */}
          <div className="repo-footer-row">
            <button
              className="view-details-btn"
              onClick={() => setShowModal(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>Full Details</span>
            </button>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-open-btn"
            >
              <span>Open in New Tab</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Modal Showing EVERY SINGLE Detail */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <div className="modal-header">
              {repo.owner?.avatar_url && (
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="modal-avatar"
                />
              )}
              <div className="modal-title-group">
                <h3>{repo.name}</h3>
                <p>Owner: @{repo.owner?.login || 'ManDhanani07'} • {repo.visibility || 'public'}</p>
              </div>
            </div>

            <div className="modal-section-title">Description</div>
            <p className="modal-description">
              {repo.description || "No description provided for this repository."}
            </p>

            <div className="modal-section-title">Repository Metrics & Details</div>
            <div className="modal-details-grid">
              <div className="modal-detail-card">
                <div className="modal-detail-label">Primary Language</div>
                <div className="modal-detail-value">{repo.language || 'N/A'}</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Stars Count</div>
                <div className="modal-detail-value">{repo.stargazers_count || 0} Stars</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Forks Count</div>
                <div className="modal-detail-value">{repo.forks_count || 0} Forks</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Open Issues</div>
                <div className="modal-detail-value">{repo.open_issues_count || 0} Open</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Repository Size</div>
                <div className="modal-detail-value">{formatSize(repo.size)}</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Default Branch</div>
                <div className="modal-detail-value">{repo.default_branch || 'main'}</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">License</div>
                <div className="modal-detail-value">{repo.license ? repo.license.name || repo.license.spdx_id : 'No License'}</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Created On</div>
                <div className="modal-detail-value">{formatDate(repo.created_at)}</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Last Updated</div>
                <div className="modal-detail-value">{formatDate(repo.updated_at)}</div>
              </div>
              <div className="modal-detail-card">
                <div className="modal-detail-label">Last Pushed</div>
                <div className="modal-detail-value">{formatDate(repo.pushed_at)}</div>
              </div>
            </div>

            {/* Topics Section */}
            {repo.topics && repo.topics.length > 0 && (
              <>
                <div className="modal-section-title">Topics & Keywords</div>
                <div className="topics-container" style={{ marginBottom: '24px' }}>
                  {repo.topics.map((topic, i) => (
                    <span key={i} className="topic-pill">#{topic}</span>
                  ))}
                </div>
              </>
            )}

            {/* Git Clone URL Box */}
            <div className="modal-section-title">Git Clone Command</div>
            <div className="clone-box">
              <span className="clone-text">git clone {repo.clone_url || repo.html_url}</span>
              <button className="copy-btn" onClick={handleCopyClone}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="modal-actions">
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-open-btn"
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  Live Demo 🚀
                </a>
              )}
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-open-btn"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RepoCard;
