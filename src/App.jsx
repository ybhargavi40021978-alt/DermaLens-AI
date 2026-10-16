import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AppWorkspace from './components/AppWorkspace';

function App() {
  const [currentView, setView] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setTab] = useState('scan'); // 'scan' | 'story' | 'compare' | 'assistant' | 'doctoreport' | 'history'
  const [selectedCaseId, setSelectedCaseId] = useState('case-02'); // Default to Case 2 (Moderate)
  // Bumped every time "Try Demo" is clicked so AppWorkspace remounts fresh
  // and always lands directly on the populated "Your Image Set" screening screen.
  const [demoResetKey, setDemoResetKey] = useState(0);
  const [defaultApiMode, setDefaultApiMode] = useState(true);

  useEffect(() => {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_id', guestId);
    }
  }, []);

  const handleStartScreening = () => {
    setView('app');
    setTab('scan');
    setDefaultApiMode(true);
    setDemoResetKey((k) => k + 1);
    window.scrollTo(0, 0);
  };

  const handleStartDemo = () => {
    setView('app');
    setTab('scan');
    setSelectedCaseId('case-02'); // Default to Moderate Risk Case
    setDefaultApiMode(false);
    setDemoResetKey((k) => k + 1);
    window.scrollTo(0, 0);
  };

  const handleNavClick = (sectionId, appTab) => {
    if (appTab) {
      setView('app');
      setTab(appTab);
      if (appTab === 'scan') {
        setDefaultApiMode(true);
        setDemoResetKey((k) => k + 1);
      }
      window.scrollTo(0, 0);
    } else {
      setView('landing');
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. NAVBAR */}
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        activeTab={activeTab} 
        setTab={setTab} 
        onStartDemo={handleStartDemo} 
        onStartScreening={handleStartScreening}
        handleNavClick={handleNavClick}
      />

      {/* VIEW CONDITIONAL RENDERING */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' ? (
          <LandingPage 
            setView={setView} 
            setTab={setTab} 
            onStartDemo={handleStartDemo} 
            onStartScreening={handleStartScreening}
            handleNavClick={handleNavClick}
          />
        ) : (
          <AppWorkspace 
            key={demoResetKey}
            activeTab={activeTab} 
            setTab={setTab} 
            selectedCaseId={selectedCaseId} 
            setSelectedCaseId={setSelectedCaseId} 
            defaultApiMode={defaultApiMode}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="dark-section" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '5rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '4rem', marginBottom: '4rem' }}>
            {/* Brand column */}
            <div>
              <a href="#" className="navbar-logo dark-text" style={{ marginBottom: '1rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                <svg className="navbar-logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" />
                  <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" />
                  <path d="M25 50 C 35 30, 65 30, 75 50 C 65 70, 35 70, 25 50 Z" stroke="#E76F51" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="6" fill="#8ECAE6" />
                </svg>
                <span>DERMALENS AI</span>
              </a>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "Your Skin Has a Story."
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                DermaLens AI is an AI-assisted skin screening, education, and monitoring platform. It combines visual tracking, explainable AI, and trusted medical knowledge to help users monitor visible skin changes responsibly.
              </p>
            </div>

            {/* Links column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-aqua)', letterSpacing: '1px', textTransform: 'uppercase' }}>Navigation</span>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('solution'); }}>
                      Solution
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('skin-guide'); }}>
                      Skin Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick(null, 'scan'); }}>
                      Screening Portal
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick(null, 'story'); }}>
                      Skin Story Logs
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-aqua)', letterSpacing: '1px', textTransform: 'uppercase' }}>Resources</span>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick(null, 'assistant'); }}>
                      AI Assistant
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('technology'); }}>
                      Technology Stack
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('problem'); }}>
                      Core Problem
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('technology'); }}>
                      Responsible AI Pillars
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                      About Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer & Copyright */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
            <p style={{ color: 'var(--accent-coral)', fontWeight: '600', lineHeight: '1.4' }}>
              * DISCLAIMER: DermaLens AI provides AI-assisted screening indicators and educational materials. It is not a substitute for professional medical diagnosis, clinical evaluation, or pathological testing. Always consult a qualified dermatologist or medical practitioner for any concerning skin changes or queries.
            </p>
            <p style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              © {new Date().getFullYear()} DermaLens AI. Designed for Clinical Awareness, Safety, and User-Led Skin Story Tracking.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;
