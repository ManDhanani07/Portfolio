import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import About from './components/About';
import Skills from './components/Skills';

// Import Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  // 1. Dark/Light Mode Toggle State Hook
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Props data to pass down to Home -> Header and Skills
  const studentInfo = {
    name: 'Man Dhanani',
    title: 'Full-Stack Software Engineer & UX Designer',
    themeColor: '#6366f1', // Indigo custom accent color
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git', 'Python']
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Navigation Bar (Present across all routing screens) */}
        <NavBar theme={theme} toggleTheme={toggleTheme} />

        {/* Dynamic Pages Routing Workspace */}
        <main className="flex-[1_0_auto] w-full box-border">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  name={studentInfo.name} 
                  title={studentInfo.title} 
                  themeColor={studentInfo.themeColor} 
                  skills={studentInfo.skills} 
                />
              } 
            />
            <Route path="/about" element={<div className="pt-[120px] pb-10"><About /></div>} />
            <Route path="/skills" element={<div className="pt-[120px] pb-10"><Skills skills={studentInfo.skills} /></div>} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer (Present across all routing screens) */}
        <Footer />
      </div>
  );
}

export default App;
