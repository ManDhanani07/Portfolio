import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import About from './components/About';
import Skills from './components/Skills';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import TaskManager from './pages/TaskManager';

function App() {
  const { pathname } = useLocation();

  // Scroll to top on every routing transition
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Scenario 2 of useState: Dark / Light theme toggler
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Apply theme attribute dynamically to HTML root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Student Data props mapping
  const studentData = {
    name: 'Man Dhanani',
    themeColor: '#2563eb',
    skillList: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Python',
      'Machine Learning',
      'Artificial Intelligence'
    ],
    projects: [
      {
        title: 'AI-Powered Personal Finance Advisor',
        description: 'An intelligent finance management application that analyzes spending habits, predicts future expenses, recommends personalized budgets, and answers financial questions using Machine Learning and Natural Language Processing.',
        tech: ['React', 'FastAPI', 'Python', 'PostgreSQL', 'Machine Learning']
      },
      {
        title: 'Autonomous Multi-Agent Research Assistant',
        description: 'An AI-powered research platform that autonomously gathers information from multiple academic sources, summarizes research papers, evaluates report quality, and generates comprehensive research reports using Large Language Models and Retrieval-Augmented Generation (RAG).',
        tech: ['Python', 'LangGraph', 'Groq API', 'ChromaDB', 'Streamlit']
      },
      {
        title: 'InfluConnect',
        description: 'A modern influencer-brand collaboration platform where businesses discover creators, manage campaigns, monitor engagement analytics, and communicate with influencers through an intuitive web interface.',
        tech: ['React', 'Node.js', 'Express.js', 'MongoDB']
      }
    ]
  };

  return (
    <>
      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content {
          flex: 1 0 auto;
        }

        /* Routing page wrappers */
        .route-padding-wrapper {
          padding-top: 70px;
        }
      `}</style>
      <div className="app-container">
        {/* Sticky Top Navigation Bar with Theme Toggler */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* Multi-Page Routes container */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home studentData={studentData} />} />
            <Route path="/about" element={<div className="route-padding-wrapper"><About /></div>} />
            <Route path="/skills" element={<div className="route-padding-wrapper"><Skills skillList={studentData.skillList} /></div>} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/task" element={<div className="route-padding-wrapper"><TaskManager /></div>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
