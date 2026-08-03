import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import RepoCard from '../components/RepoCard';

function Projects() {
  // Required Practical 3 State Declarations
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Repositories function using GitHub REST API
  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      // Fetch public repositories from GitHub REST API
      const response = await fetch('https://api.github.com/users/ManDhanani07/repos?sort=updated');

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response format received.");
      }

      // Guarantee minimum 1.2s spinner display time so animation is clearly visible
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1200) {
        await new Promise((resolve) => setTimeout(resolve, 1200 - elapsedTime));
      }

      setRepos(data);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError(err.message || "Unable to load repositories.");
    } finally {
      // Always stop loading inside finally block
      setLoading(false);
    }
  };

  // Trigger API fetch on component mount using useEffect
  useEffect(() => {
    fetchRepositories();
  }, []);

  // Real-time case-insensitive search filtering
  const filteredRepos = repos.filter((repo) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const nameMatch = repo.name ? repo.name.toLowerCase().includes(term) : false;
    const descMatch = repo.description ? repo.description.toLowerCase().includes(term) : false;
    const langMatch = repo.language ? repo.language.toLowerCase().includes(term) : false;

    return nameMatch || descMatch || langMatch;
  });

  return (
    <>
      <style>{`
        .projects-section {
          background-color: var(--bg-primary);
          min-height: 85vh;
          padding-top: 110px !important;
          padding-bottom: 80px;
          padding-left: 24px;
          padding-right: 24px;
        }

        .projects-container {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .projects-intro {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 620px;
          margin: 0 auto 36px;
          line-height: 1.6;
          text-align: center;
        }

        /* Search Box Styles */
        .search-container {
          max-width: 540px;
          margin: 0 auto 48px;
          position: relative;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 14px 44px 14px 48px;
          border-radius: 30px;
          font-size: 15px;
          outline: none;
          font-family: inherit;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .search-clear-btn {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: color 0.2s ease;
        }

        .search-clear-btn:hover {
          color: var(--text-main);
        }

        .results-count {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          margin-top: 10px;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }

        /* Empty State Styles */
        .empty-state-container {
          text-align: center;
          padding: 60px 24px;
          background-color: var(--bg-secondary);
          border: 1px dashed var(--border);
          border-radius: 16px;
          max-width: 500px;
          margin: 20px auto;
        }

        .empty-state-icon {
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .empty-state-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .empty-state-text {
          font-size: 14px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section className="projects-section route-padding-wrapper">
        <div className="projects-container">
          <h2 className="section-title">Projects Showcase</h2>
          <div className="section-divider"></div>
          <p className="projects-intro">
            Explore live engineering repositories and open-source projects dynamically fetched from GitHub using the REST API:
          </p>

          {/* Real-Time Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search repositories by name, language, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            {!loading && !error && (
              <p className="results-count">
                Showing {filteredRepos.length} of {repos.length} repositories
              </p>
            )}
          </div>

          {/* Conditional Rendering: Loading State */}
          {loading && <Spinner />}

          {/* Conditional Rendering: Error State */}
          {!loading && error && (
            <ErrorMessage error={error} onRetry={fetchRepositories} />
          )}

          {/* Conditional Rendering: Empty State */}
          {!loading && !error && filteredRepos.length === 0 && (
            <div className="empty-state-container">
              <svg className="empty-state-icon" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <h3 className="empty-state-title">No repositories found.</h3>
              <p className="empty-state-text">
                No GitHub repositories match "{searchTerm}". Try searching for another keyword.
              </p>
            </div>
          )}

          {/* Conditional Rendering: Repositories Cards Grid */}
          {!loading && !error && filteredRepos.length > 0 && (
            <div className="projects-grid">
              {filteredRepos.map((repo, index) => (
                <RepoCard key={repo.id || index} repo={repo} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Projects;
