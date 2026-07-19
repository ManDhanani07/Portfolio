import React from 'react';

function Skills({ skills }) {
  const displaySkills = skills || [];

  return (
    <section className="w-full max-w-[800px] mx-auto p-6">
      <div className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-[20px] p-10 max-md:p-6 shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h3 className="font-heading text-[28px] font-bold mb-2 text-text-main">Technical Expertise</h3>
        <p className="text-[14px] text-text-muted mb-7">Languages, libraries, and frameworks I use</p>
        
        <div className="flex flex-wrap gap-3">
          {displaySkills.map((skill, index) => (
            <div className="group flex items-center gap-2 bg-bg-secondary border border-border text-text-main px-5 py-2.5 rounded-[30px] text-[15px] font-semibold transition-all duration-200 cursor-default shadow-sm hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md" key={index}>
              <span className="w-1.5 h-1.5 bg-primary rounded-full transition-colors duration-200 group-hover:bg-accent"></span>
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
