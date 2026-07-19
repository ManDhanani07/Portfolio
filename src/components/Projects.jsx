import React from 'react';

function Projects({ projects }) {
  const list = projects || [];

  return (
    <>
      <style>{`
        .projects-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .projects-container {
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .project-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .project-window-header {
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          padding: 12px 20px;
          display: flex;
          gap: 6px;
        }

        .window-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .window-dot.red { background-color: #ef4444; }
        .window-dot.yellow { background-color: #f59e0b; }
        .window-dot.green { background-color: #10b981; }

        .project-card-body {
          padding: 24px;
          text-align: left;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .project-card-title {
          font-family: var(--font-heading);
          font-size: 19px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 12px;
        }

        .project-card-description {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 24px;
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
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section className="projects-section" id="projects">
        <div className="projects-container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-divider"></div>
          <p className="projects-intro">
            A showcase of course assignments and engineering prototypes developed using structured component states and layouts:
          </p>
          
          <div className="projects-grid">
            {list.map((project, index) => (
              <div className="project-card" key={index}>
                <div className="project-window-header">
                  <span className="window-dot red"></span>
                  <span className="window-dot yellow"></span>
                  <span className="window-dot green"></span>
                </div>
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
