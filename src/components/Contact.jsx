import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent successfully!\nName: ${formData.name}\nEmail: ${formData.email}`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <style>{`
        .contact-section {
          background-color: var(--bg-primary);
          padding: 120px 24px 80px;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .section-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 12px;
        }

        .section-divider {
          width: 50px;
          height: 3px;
          background-color: var(--primary);
          margin: 0 auto 32px;
          border-radius: 2px;
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

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }

        .character-counter {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
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

        @media (max-width: 600px) {
          .contact-form {
            padding: 24px;
          }
        }
      `}</style>
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-divider"></div>
          <p className="contact-description">
            Have a question, project proposal, or just want to say hi? Drop me a message below.
          </p>
          
          <form onSubmit={handleFormSubmit} className="contact-form">
            <div>
              <label className="form-label" htmlFor="contact-name">Full Name</label>
              <input 
                type="text" 
                id="contact-name"
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name" 
                required 
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="contact-email">Email Address</label>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="contact-message">Your Message</label>
                <span className="character-counter">
                  {formData.message.length} characters
                </span>
              </div>
              <textarea 
                id="contact-message"
                name="message" 
                rows="4" 
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here..." 
                required
                className="form-textarea"
              ></textarea>
            </div>
            <button type="submit" className="form-submit-btn">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
