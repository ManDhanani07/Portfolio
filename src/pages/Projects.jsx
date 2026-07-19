import React from 'react';

function Projects({ projects }) {
  const list = projects || [];

  // Custom configuration mappings for each project card
  const projectClasses = ['finance', 'research', 'connect'];
  const projectBadges = ['AI Engine', 'LLM Agent', 'Full-Stack'];

  return (
    <>
      <style>{`
        .projects-section {
          background-color: var(--bg-primary);
          min-height: 85vh;
          padding: 120px 24px 80px;
        }

        .projects-container {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .projects-intro {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.6;
          text-align: center;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }

        /* Individual Custom Card */
        .project-card {
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
        }

        .project-card:hover {
          transform: translateY(-6px);
          border-color: var(--project-accent, var(--primary));
          box-shadow: 0 15px 30px -10px var(--project-accent-glow, rgba(59, 130, 246, 0.15));
        }

        /* Accents mapping */
        .project-card.finance {
          --project-accent: #3b82f6;
          --project-accent-glow: rgba(59, 130, 246, 0.2);
        }

        .project-card.research {
          --project-accent: #a855f7;
          --project-accent-glow: rgba(168, 85, 247, 0.2);
        }

        .project-card.connect {
          --project-accent: #10b981;
          --project-accent-glow: rgba(16, 185, 129, 0.2);
        }

        .project-window-header {
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .project-card-num {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          color: var(--project-accent, var(--primary));
          letter-spacing: 0.5px;
        }

        .visual-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--project-accent, var(--primary));
          background-color: var(--primary-light);
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .project-card-body {
          padding: 28px 24px;
          text-align: left;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          position: relative;
          z-index: 1;
        }

        .project-card-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 12px;
          line-height: 1.35;
        }

        .project-card-description {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.65;
          margin-bottom: 28px;
          flex-grow: 1;
        }

        .project-tech-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
        }

        .tech-badge {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-main);
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          padding: 4px 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .project-card:hover .tech-badge {
          border-color: var(--project-accent, var(--primary));
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
            A showcase of course assignments and engineering prototypes developed using structured component states, AI modules, and custom designs:
          </p>

          <div className="projects-grid">
            {list.map((project, index) => (
              <div className={`project-card ${projectClasses[index] || ''}`} key={index}>
                {/* Card Window Top Header Bar */}
                <div className="project-window-header">
                  <span className="project-card-num">
                    0{index + 1}
                  </span>
                  <span className="visual-badge">
                    {projectBadges[index] || 'Prototype'}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="project-card-body">
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-description">{project.description}</p>
                  <div className="project-tech-container">
                    {project.tech.map((technology, i) => (
                      <span className="tech-badge" key={i}>{technology}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Projects;
