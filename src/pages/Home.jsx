import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function Home({ name, title, themeColor }) {
  return (
    <div className="flex flex-col items-center w-full min-h-[70vh] justify-center">
      {/* Composited Header (Hero Section) */}
      <Header name={name} title={title} themeColor={themeColor} />

      {/* Routing CTA to Projects Page */}
      <div className="mt-8 mb-12 flex justify-center w-full">
        <Link to="/projects" className="inline-flex items-center gap-2 bg-primary text-white border-none px-8 py-3.5 rounded-[30px] text-[16px] font-semibold no-underline shadow-md transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg">
          View Projects
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Home;
