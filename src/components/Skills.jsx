import React from 'react';

function Skills({ skillList }) {
  const list = skillList || [];

  return (
    <>
      <style>{`
        .skills-section {
          background-color: var(--bg-primary);
          text-align: center;
        }

        .skills-container {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .skills-intro {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          justify-content: center;
        }

        .skill-badge-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-sm);
          transition: all 0.25s ease;
          cursor: default;
        }

        .skill-badge-card:hover {
          background-color: var(--bg-primary);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .skill-icon-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 14px;
        }

        .skill-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
        }

        @media (max-width: 480px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section className="skills-section" id="skills">
        <div className="skills-container">
          <h2 className="section-title">Skills & Expertise</h2>
          <div className="section-divider"></div>
          <p className="skills-intro">
            A dynamic set of programming languages, libraries, tools, and algorithms acquired through university practicals and personal development:
          </p>
          
          <div className="skills-grid">
            {list.map((skill, index) => (
              <div className="skill-badge-card" key={index}>
                <div className="skill-icon-placeholder">
                  {skill.charAt(0)}
                </div>
                <span className="skill-title">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Skills;
