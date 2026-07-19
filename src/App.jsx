import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import Contact from './components/Contact';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Data props to be passed down. Not hardcoded in child components.
  const studentData = {
    name: 'Man Dhanani',
    themeColor: '#2563eb', // Blue accent color specified in design requirements
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
        description: 'An intelligent banking advisor that automatically compiles transaction summaries, extracts classification tags, and forecasts month-to-month budgets.',
        tech: ['React', 'FastAPI', 'PostgreSQL', 'LangChain']
      },
      {
        title: 'Autonomous Multi-Agent Research Assistant',
        description: 'An AI-powered multi-agent research platform that autonomously gathers information from multiple academic sources, summarizes findings, evaluates report quality, and generates comprehensive research reports using Large Language Models and Retrieval-Augmented Generation (RAG).',
        tech: ['Python', 'LangGraph', 'Groq API', 'ChromaDB', 'Streamlit']
      },
      {
        title: 'InfluConnect',
        description: 'A social media influencer collaboration platform that connects brands with content creators, enabling campaign management, influencer discovery, performance tracking, and seamless communication through a modern web interface.',
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

        /* Routing view padding wrapper class */
        .route-padding-wrapper {
          padding-top: 70px; /* Accounts for fixed navbar height */
        }
      `}</style>
      <div className="app-container">
        {/* Sticky Top Navigation Bar */}
        <Navbar />

        {/* Dynamic Pages Routing Workspace */}
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="landing-page-flow">
                  <Header name={studentData.name} themeColor={studentData.themeColor} />
                  <About />
                  <Skills skillList={studentData.skillList} />
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="route-padding-wrapper">
                  <About />
                </div>
              }
            />
            <Route
              path="/skills"
              element={
                <div className="route-padding-wrapper">
                  <Skills skillList={studentData.skillList} />
                </div>
              }
            />
            <Route
              path="/projects"
              element={
                <div className="route-padding-wrapper">
                  <Projects projects={studentData.projects} />
                </div>
              }
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Global Footer (Present across all routing screens) */}
        <Footer />
      </div>
    </>
  );
}

export default App;
