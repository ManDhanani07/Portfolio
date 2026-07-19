import React, { useState } from 'react';

function Contact() {
  // Scenario 1 of useState: Controlled form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Clear inputs
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <style>{`
        .contact-section {
          background-color: var(--bg-primary);
          padding: 120px 24px 80px;
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-container {
          width: 100%;
          max-width: 950px;
          margin: 0 auto;
          text-align: center;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 32px;
          align-items: start;
          margin-top: 40px;
        }

        .contact-description {
          font-size: 15px;
          color: var(--text-muted);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .contact-form {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 40px;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        .form-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
        }

        .character-counter {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .form-submit-btn {
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          align-self: center;
          width: 100%;
          box-shadow: var(--shadow-sm);
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .form-submit-btn:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
        }

        /* Controlled input live preview container */
        .preview-box {
          background-color: var(--bg-primary);
          border: 1.5px dashed var(--border);
          border-radius: 12px;
          padding: 20px;
          text-align: left;
        }

        .preview-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .preview-item {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 8px;
          color: var(--text-muted);
        }

        .preview-item:last-child {
          margin-bottom: 0;
        }

        .preview-value {
          color: var(--text-main);
          font-weight: 550;
          word-break: break-word;
        }

        /* Thank you alert banner */
        .thankyou-card {
          background-color: var(--primary-light);
          border: 1px solid var(--primary);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          color: var(--text-main);
          font-weight: 550;
          text-align: center;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 600px) {
          .contact-form {
            padding: 24px;
          }
        }
      `}</style>
      <section className="contact-section">
        <div className="contact-container">
          <h2 className="section-title">Contact Me</h2>
          <div className="section-divider"></div>
          <p className="contact-description">
            Feel free to reach out for research collaborations, campaign opportunities, or software consulting.
          </p>

          {/* Display Success Banner after submit */}
          {isSubmitted && (
            <div className="thankyou-card">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', color: 'var(--primary)' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p>Thank you for contacting me. I will get back to you shortly!</p>
            </div>
          )}

          <div className="contact-grid">
            <form onSubmit={handleSubmit} className="contact-form">
              <div>
                <label className="form-label" htmlFor="contact-name">Name</label>
                <input 
                  type="text" 
                  id="contact-name"
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Your Full Name" 
                  required 
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="contact-email">Email</label>
                <input 
                  type="email" 
                  id="contact-email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="your.email@example.com" 
                  required 
                  className="form-input"
                />
              </div>

              <div>
                <div className="form-label-row">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <span className="character-counter">
                    Characters: {formData.message.length}
                  </span>
                </div>
                <textarea 
                  id="contact-message"
                  name="message" 
                  rows="5" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Write your message here..." 
                  required 
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="form-submit-btn">Send Message</button>
            </form>

            {/* Live Preview Box */}
            <div className="preview-box">
              <h3 className="preview-title">Live Form Preview</h3>
              <div className="preview-item">
                Name: <span className="preview-value">{formData.name || '---'}</span>
              </div>
              <div className="preview-item">
                Email: <span className="preview-value">{formData.email || '---'}</span>
              </div>
              <div className="preview-item">
                You typed: <span className="preview-value">{formData.message || '---'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
