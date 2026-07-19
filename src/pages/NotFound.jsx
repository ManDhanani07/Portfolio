import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="flex justify-center items-center pt-[160px] px-6 pb-24 min-h-[80vh]">
      <div className="bg-glass-bg backdrop-blur-md border border-glass-border p-10 max-md:p-6 rounded-[24px] shadow-xl text-center max-w-[480px] w-full">
        {/* Professional SVG Illustration */}
        <div className="mb-8 flex justify-center">
          <svg viewBox="0 0 200 200" className="w-[160px] h-[160px]" aria-hidden="true">
            <defs>
              <linearGradient id="svgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="var(--primary-light)" />
            <path d="M70,80 Q100,50 130,80" fill="none" stroke="url(#svgGrad)" strokeWidth="6" strokeLinecap="round" />
            <circle cx="75" cy="105" r="8" fill="var(--text-main)" />
            <circle cx="125" cy="105" r="8" fill="var(--text-main)" />
            <path d="M85,140 Q100,120 115,140" fill="none" stroke="url(#svgGrad)" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="font-heading text-3xl font-bold mb-3 text-text-main">Page Not Found</h2>
        <p className="text-[15px] text-text-muted leading-relaxed mb-8">
          The requested endpoint does not exist or has been relocated to another path.
        </p>
        <Link to="/" className="inline-block bg-primary text-white border-none py-3 px-8 rounded-[30px] text-[15px] font-semibold no-underline shadow-md transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg">
          Return Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
