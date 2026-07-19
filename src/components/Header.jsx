import React from 'react';

function Header({ name, title, themeColor }) {
  const dynamicAccent = themeColor || 'var(--primary)';

  return (
    <header className="flex flex-col items-center justify-center pt-[120px] px-6 pb-[60px] text-center max-w-[800px] mx-auto">
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-primary-light text-[14px] font-semibold px-4 py-1.5 rounded-[30px] mb-6" style={{ color: dynamicAccent }}>
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          AWDF Practical Showcase
        </div>
        <h1 className="text-[56px] leading-[1.15] mb-3 font-heading font-extrabold max-md:text-[40px] text-text-main">
          Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${dynamicAccent} 0%, var(--accent) 100%)` }}>{name}</span>
        </h1>
        <h2 className="text-2xl font-medium text-text-muted mb-6 font-heading max-md:text-xl">{title}</h2>
        <p className="text-lg text-text-muted max-w-[580px] leading-relaxed max-md:text-[16px]">
          Building performant web applications with structured frameworks, modular architectures, and modern design systems.
        </p>
      </div>
    </header>
  );
}

export default Header;
