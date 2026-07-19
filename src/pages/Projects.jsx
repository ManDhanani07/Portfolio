import React from 'react';

function Projects() {
  const projectsData = [
    {
      title: 'AI Powered Personal Finance Advisor',
      description: 'An intelligent banking companion that aggregates transactions, extracts classification keywords, forecasts recurring bills, and provides customized budgets.',
      tech: ['React', 'FastAPI', 'PostgreSQL', 'LangChain'],
      gitLink: 'https://github.com'
    },
    {
      title: 'Autonomous Multi-Agent Research Assistant',
      description: 'A distributed LLM orchestrator running parallel search routines, compiling citations, synthesizing literature reviews, and formatting academic documents.',
      tech: ['React', 'Python', 'Docker', 'OpenAI API'],
      gitLink: 'https://github.com'
    },
    {
      title: 'Weather Prediction System',
      description: 'A forecasting workflow utilizing LSTM neural networks to crunch meteorological streams, map pressure anomalies, and display graphical temperature grids.',
      tech: ['TypeScript', 'TensorFlow', 'Python', 'Vite'],
      gitLink: 'https://github.com'
    }
  ];

  return (
    <section className="max-w-[1200px] mx-auto pt-[120px] px-6 pb-20">
      <div className="text-center max-w-[600px] mx-auto mb-14">
        <h2 className="font-heading text-[36px] font-bold mb-3 text-text-main">Featured Projects</h2>
        <p className="text-[16px] text-text-muted leading-relaxed">Demonstrating practical engineering, design implementation, and clean structures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <div className="bg-card-bg border border-border rounded-[20px] overflow-hidden shadow-md transition-all duration-300 flex flex-col hover:-translate-y-1.5 hover:shadow-xl hover:border-primary" key={index}>
            <div className="bg-bg-primary border-b border-border px-5 py-3 flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
              <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
            </div>
            
            <div className="p-7 text-left flex flex-col flex-grow">
              <h3 className="font-heading text-xl font-bold mb-3 text-text-main">{project.title}</h3>
              <p className="text-[15px] text-text-muted leading-relaxed mb-6 flex-grow">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, i) => (
                  <span className="text-[11px] font-semibold uppercase text-text-muted border border-border px-2.5 py-0.5 rounded bg-bg-primary" key={i}>{t}</span>
                ))}
              </div>
              
              <div className="border-t border-border pt-5 mt-auto">
                <a href={project.gitLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted no-underline transition-colors duration-200 hover:text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
