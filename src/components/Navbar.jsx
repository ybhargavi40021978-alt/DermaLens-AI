import React, { useState, useEffect } from 'react';
import { Home, Scan, History, Sparkles, ArrowRight } from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setView, 
  activeTab, 
  setTab, 
  onStartDemo: _onStartDemo, 
  onStartScreening,
  handleNavClick: propHandleNavClick 
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const internalNavClick = (sectionId, appTab) => {
    if (appTab) {
      setView('app');
      setTab(appTab);
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

  const onNavClick = propHandleNavClick || internalNavClick;

  const isLinkActive = (sectionId, appTab) => {
    if (appTab) {
      return currentView === 'app' && activeTab === appTab;
    }
    return currentView === 'landing' && sectionId === 'home' && !scrolled;
  };

  return (
    <>
      {/* Desktop Sticky Header */}
      <nav className={`main-navbar ${scrolled || currentView === 'app' ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <a href="#" className="navbar-logo" onClick={(e) => { e.preventDefault(); onNavClick('home'); }}>
            <svg className="navbar-logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" />
              <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" />
              <path d="M25 50 C 35 30, 65 30, 75 50 C 65 70, 35 70, 25 50 Z" stroke="#E76F51" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="50" r="6" fill="#8ECAE6" />
            </svg>
            <span>DERMALENS AI</span>
          </a>

          <ul className="navbar-links">
            <li>
              <a 
                href="#" 
                className={`navbar-link ${isLinkActive('home') ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); onNavClick('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="navbar-link" 
                onClick={(e) => { e.preventDefault(); onNavClick('solution'); }}
              >
                Solution
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="navbar-link" 
                onClick={(e) => { e.preventDefault(); onNavClick('skin-guide'); }}
              >
                Skin Guide
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`navbar-link ${isLinkActive(null, 'scan') ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); onNavClick(null, 'scan'); }}
              >
                AI Screening
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`navbar-link ${isLinkActive(null, 'history') ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); onNavClick(null, 'history'); }}
              >
                My History
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`navbar-link ${isLinkActive(null, 'story') ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); onNavClick(null, 'story'); }}
              >
                Skin Story
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`navbar-link ${isLinkActive(null, 'assistant') ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); onNavClick(null, 'assistant'); }}
              >
                AI Assistant
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="navbar-link" 
                onClick={(e) => { e.preventDefault(); onNavClick('technology'); }}
              >
                Technology
              </a>
            </li>
          </ul>

          <div className="navbar-ctas">
            <button 
              type="button"
              className="btn navbar-btn-primary" 
              onClick={onStartScreening}
              title="Upload your skin photos for AI analysis"
            >
              <Scan size={16} />
              <span>Start Screening</span>
              <ArrowRight size={14} style={{ opacity: 0.85 }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="mobile-bottom-navbar">
        <button 
          type="button"
          className={`mobile-nav-item ${currentView === 'landing' ? 'active' : ''}`}
          onClick={() => { setView('landing'); window.scrollTo(0, 0); }}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        
        <button 
          type="button"
          className={`mobile-nav-item scan-primary ${currentView === 'app' && activeTab === 'scan' ? 'active' : ''}`}
          onClick={onStartScreening}
        >
          <Scan size={22} />
          <span>Scan</span>
        </button>
        
        <button 
          type="button"
          className={`mobile-nav-item ${currentView === 'app' && activeTab === 'story' ? 'active' : ''}`}
          onClick={() => { setView('app'); setTab('story'); window.scrollTo(0, 0); }}
        >
          <History size={20} />
          <span>Story</span>
        </button>

        <button 
          type="button"
          className={`mobile-nav-item ${currentView === 'app' && activeTab === 'assistant' ? 'active' : ''}`}
          onClick={() => { setView('app'); setTab('assistant'); window.scrollTo(0, 0); }}
        >
          <Sparkles size={20} />
          <span>Lens</span>
        </button>
      </nav>
    </>
  );
}
