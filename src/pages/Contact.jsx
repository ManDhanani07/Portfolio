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
    alert(`Form Submitted Successfully!\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="max-w-[1200px] mx-auto pt-[120px] px-6 pb-20">
      <div className="text-center max-w-[600px] mx-auto mb-14">
        <h2 className="font-heading text-[36px] font-bold mb-3 text-text-main">Get In Touch</h2>
        <p className="text-[16px] text-text-muted leading-relaxed">We would love to hear from you. Drop us a line below.</p>
      </div>

      <div className="max-w-[640px] mx-auto">
        {/* Controlled Form Card */}
        <div className="bg-card-bg border border-border p-10 max-md:p-6 rounded-[20px] shadow-lg">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-text-muted">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe" 
                className="bg-bg-primary border border-border text-text-main px-4 py-3 rounded-lg text-[15px] transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-text-muted">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com" 
                className="bg-bg-primary border border-border text-text-main px-4 py-3 rounded-lg text-[15px] transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="message" className="text-sm font-semibold text-text-muted">Message</label>
                <span className="text-xs text-primary font-semibold bg-primary-light px-2.5 py-0.5 rounded-full">
                  Characters: {formData.message.length}
                </span>
              </div>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message here..." 
                className="bg-bg-primary border border-border text-text-main px-4 py-3 rounded-lg text-[15px] transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                required
              ></textarea>
            </div>

            <button type="submit" className="bg-primary text-white border-none py-3.5 px-7 rounded-[30px] text-[15px] font-semibold cursor-pointer shadow-md transition-all duration-200 w-full hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
