import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import Persistent Components
import Navbar from './components/Navbar';

// =============================================================================
// PRACTICAL 8: BEFORE OPTIMIZATION (Reference)
// =============================================================================
// In the unoptimized state, all routes are imported statically like this:
// import Home from './pages/Home';
// import About from './components/About';
// import Skills from './components/Skills';
// import Projects from './pages/Projects';
// import Contact from './pages/Contact';
// import TaskManager from './pages/TaskManager';
// import Auth from './pages/Auth';
// import NotFound from './pages/NotFound';

// =============================================================================
// PRACTICAL 8: AFTER OPTIMIZATION (ACTIVE - Code Splitting via React.lazy)
// =============================================================================
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const TaskManager = lazy(() => import('./pages/TaskManager'));
const Auth = lazy(() => import('./pages/Auth'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Meaningful Fallback UI rendered by Suspense while route chunks load
const PageLoadingFallback = () => (
  <div
    className="route-padding-wrapper"
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontFamily: "'Outfit', sans-serif",
      fontSize: '15px',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontWeight: 500, letterSpacing: '0.3px' }}>Loading page chunk...</span>
    </div>
  </div>
);

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
    <div className="app-container">
      {/* Sticky Top Navigation Bar with Theme Toggler */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Multi-Page Routes container with Suspense Code Splitting */}
      <main className="main-content">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home studentData={studentData} />} />
            <Route path="/about" element={<div className="route-padding-wrapper"><About /></div>} />
            <Route path="/skills" element={<div className="route-padding-wrapper"><Skills skillList={studentData.skillList} /></div>} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/task" element={<div className="route-padding-wrapper"><TaskManager /></div>} />
            <Route path="/login" element={<div className="route-padding-wrapper"><Auth initialMode="login" /></div>} />
            <Route path="/register" element={<div className="route-padding-wrapper"><Auth initialMode="register" /></div>} />
            <Route path="/forgot-password" element={<div className="route-padding-wrapper"><Auth initialMode="forgot" /></div>} />
            <Route path="/reset-password" element={<div className="route-padding-wrapper"><Auth initialMode="reset" /></div>} />
            <Route path="/auth" element={<div className="route-padding-wrapper"><Auth initialMode="login" /></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
