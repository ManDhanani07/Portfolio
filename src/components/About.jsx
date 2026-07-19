import React, { useState } from 'react';

function About() {
  const [showBio, setShowBio] = useState(true);

  return (
    <>
      <style>{`
        .about-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .about-container {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .section-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          color: var(--text-main);
          margin-bottom: 12px;
        }

        .section-divider {
          width: 50px;
          height: 3px;
          background-color: var(--primary);
          margin: 0 auto 48px;
          border-radius: 2px;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: flex-start;
        }

        .about-bio {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .bio-paragraph {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.7;
        }

        .about-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          box-shadow: var(--shadow-md);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .detail-item.border-none {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--primary);
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 15px;
          color: var(--text-main);
          font-weight: 550;
        }

        .toggle-bio-btn {
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          padding: 10px 26px;
          border-radius: 30px;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
          box-shadow: var(--shadow-sm);
        }

        .toggle-bio-btn:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
      <section className="about-section" id="about">
        <div className="about-container">
          <h2 className="section-title">About Me</h2>
          <div className="section-divider"></div>
          
          {/* Show/Hide Toggler for About Section */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <button 
              className="toggle-bio-btn"
              onClick={() => setShowBio(prev => !prev)}
            >
              {showBio ? 'Hide About' : 'Show About'}
            </button>
          </div>

          {showBio && (
            <div className="about-grid">
              <div className="about-bio">
                <p className="bio-paragraph">
                  Hello! I am an AI & Machine Learning student at CHARUSAT University with a strong interest in Artificial Intelligence, Machine Learning, Data Science, and Full-Stack Web Development. I enjoy building intelligent, efficient, and user-friendly applications while continuously strengthening my problem-solving and software development skills.
                </p>
                <p className="bio-paragraph">
                  I am passionate about developing AI-driven solutions, creating responsive web applications using modern technologies like React, and applying machine learning techniques to solve real-world problems. My goal is to build innovative software that combines intelligent decision-making with excellent user experiences.
                </p>
              </div>
              
              <div className="about-card">
                <div className="detail-item">
                  <span className="detail-label">University</span>
                  <span className="detail-value">Charotar University of Science and Technology (CHARUSAT)</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Course</span>
                  <span className="detail-value">B.Tech in Artificial Intelligence & Machine Learning</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Interests</span>
                  <span className="detail-value">AI, Machine Learning, UI/UX Systems</span>
                </div>
                <div className="detail-item border-none">
                  <span className="detail-label">Career Goal</span>
                  <span className="detail-value">Become an AI & Machine Learning Engineer, creating intelligent, scalable, and user-centric software solutions that address real-world challenges.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default About;
