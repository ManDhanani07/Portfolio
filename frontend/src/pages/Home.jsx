import React from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import Footer from '../components/Footer';

function Home({ studentData }) {
  return (
    <div className="home-page-container">
      <Header name={studentData.name} themeColor={studentData.themeColor} />
      <About />
      <Skills skillList={studentData.skillList} />
      <Footer />
    </div>
  );
}

export default Home;
