import React, { useState } from 'react';

function About() {
  const [showBio, setShowBio] = useState(true);

  return (
    <section className="w-full max-w-[800px] mx-auto p-6">
      {/* Show/Hide Toggler for About Section */}
      <div className="flex justify-center mb-8">
        <button 
          className="bg-primary-light text-primary border border-transparent px-7 py-3 rounded-[30px] text-[15px] font-semibold cursor-pointer transition-all duration-200 shadow-sm hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => setShowBio(prev => !prev)}
        >
          {showBio ? 'Hide About' : 'Show About'}
        </button>
      </div>

      {showBio && (
        <div className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-[20px] p-10 max-md:p-6 shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="font-heading text-[28px] font-bold mb-5 text-text-main">About Me</h3>
          <p className="text-[16px] text-text-muted leading-relaxed mb-4">
            I am a passionate software engineering student specializing in web application framework designs. My core values center on clean syntax formatting, responsive layouts, modular structures, and performance optimizations.
          </p>
          <p className="text-[16px] text-text-muted leading-relaxed mb-8">
            With extensive study of framework architectures like React, I build interactive clients with minimal footprints, robust state management patterns, and professional layouts.
          </p>
          
          {/* visual mock stats */}
          <div className="flex gap-10 max-md:gap-6 border-t border-border pt-6">
            <div className="flex flex-col">
              <span className="font-heading text-[28px] font-extrabold text-primary">4+</span>
              <span className="text-[13px] text-text-muted font-medium">AWDF Practicals</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[28px] font-extrabold text-primary">100%</span>
              <span className="text-[13px] text-text-muted font-medium">Clean Code</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default About;
