import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function NavBar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] bg-glass-bg backdrop-blur-md border-b border-glass-border transition-all duration-300">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6 py-4">
        <NavLink to="/" className="font-heading text-2xl font-extrabold text-primary no-underline flex items-center" onClick={closeMenu}>
          <span className="text-text-main">Man</span>Dhanani
        </NavLink>

        {/* Responsive Hamburger Toggle */}
        <button 
          className="md:hidden flex flex-col justify-between w-6 h-[18px] bg-transparent border-none cursor-pointer p-0 z-[1001]" 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`w-full h-[2px] bg-text-main rounded-[2px] transition-all duration-300 origin-left ${isOpen ? 'rotate-45' : ''}`}></span>
          <span className={`w-full h-[2px] bg-text-main rounded-[2px] transition-all duration-300 origin-left ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-full h-[2px] bg-text-main rounded-[2px] transition-all duration-300 origin-left ${isOpen ? '-rotate-45' : ''}`}></span>
        </button>

        {/* Links List */}
        <ul className={`
          flex items-center list-none gap-8 m-0 p-0
          max-md:fixed max-md:top-0 max-md:height-screen max-md:w-[280px] max-md:bg-bg-secondary max-md:border-l max-md:border-border max-md:flex-col max-md:items-start max-md:p-[100px_40px] max-md:gap-6 max-md:transition-all max-md:duration-300 max-md:shadow-xl
          ${isOpen ? 'max-md:right-0' : 'max-md:right-[-100%]'}
        `}>
          <li className="flex items-center">
            <NavLink 
              to="/" 
              className={({ isActive }) => `
                text-[15px] font-medium text-text-muted no-underline relative py-1 transition-colors duration-300 hover:text-primary
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:w-0 hover:after:w-full
                ${isActive ? 'text-primary after:w-full' : ''}
              `}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li className="flex items-center">
            <NavLink 
              to="/about" 
              className={({ isActive }) => `
                text-[15px] font-medium text-text-muted no-underline relative py-1 transition-colors duration-300 hover:text-primary
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:w-0 hover:after:w-full
                ${isActive ? 'text-primary after:w-full' : ''}
              `}
              onClick={closeMenu}
            >
              About
            </NavLink>
          </li>
          <li className="flex items-center">
            <NavLink 
              to="/skills" 
              className={({ isActive }) => `
                text-[15px] font-medium text-text-muted no-underline relative py-1 transition-colors duration-300 hover:text-primary
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:w-0 hover:after:w-full
                ${isActive ? 'text-primary after:w-full' : ''}
              `}
              onClick={closeMenu}
            >
              Skills
            </NavLink>
          </li>
          <li className="flex items-center">
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `
                text-[15px] font-medium text-text-muted no-underline relative py-1 transition-colors duration-300 hover:text-primary
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:w-0 hover:after:w-full
                ${isActive ? 'text-primary after:w-full' : ''}
              `}
              onClick={closeMenu}
            >
              Projects
            </NavLink>
          </li>
          <li className="flex items-center">
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `
                text-[15px] font-medium text-text-muted no-underline relative py-1 transition-colors duration-300 hover:text-primary
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:w-0 hover:after:w-full
                ${isActive ? 'text-primary after:w-full' : ''}
              `}
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </li>
          
          {/* Light/Dark Toggle */}
          <li className="flex items-center max-md:mt-4">
            <button 
              className="bg-transparent border border-border text-text-main p-2 rounded-full cursor-pointer flex items-center justify-center w-10 h-10 transition-all duration-200 hover:bg-border hover:text-primary hover:rotate-[15deg]" 
              onClick={() => { toggleTheme(); closeMenu(); }}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
