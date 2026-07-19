import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-bg-secondary p-8 mt-auto">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto flex-wrap gap-4 max-md:flex-col max-md:text-center">
        <p className="text-sm text-text-muted">
          &copy; {currentYear} Man Dhanani. All rights reserved.
        </p>
        <div className="flex gap-6 max-md:flex-col max-md:gap-3">
          <a href="mailto:man.dhanani@example.com" className="flex items-center gap-2 text-sm text-text-muted no-underline transition-colors duration-200 hover:text-primary" aria-label="Email Me">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            man.dhanani@example.com
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-muted no-underline transition-colors duration-200 hover:text-primary" aria-label="LinkedIn Profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
