import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Shield, Lock, Eye, HeartPulse, Activity, FileText, 
  Layers, Search, MessageSquare, Calendar, ChevronDown, ChevronUp, 
  CheckCircle2, AlertTriangle, Camera, Sparkles, Clock, Compass, Share2 
} from 'lucide-react';
import { 
  spots, faqs, ragQA, techArchitecture, responsiblePillars, 
  solutionImpact, futureScope 
} from '../data/mockData';

export default function LandingPage({ setView, setTab, onStartDemo, onStartScreening, handleNavClick }) {
  // Hero Interactive Lens State
  const [heroMonth, setHeroMonth] = useState('AUG');

  // Tutorial Video Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoTime, setDemoTime] = useState(0);
  const [demoVolume, setDemoVolume] = useState(0.8);
  const [demoMuted, setDemoMuted] = useState(false);
  const [demoFullscreen, setDemoFullscreen] = useState(false);
  const demoUtteranceRef = useRef(null);

  const scenes = [
    {
      title: "Introduction",
      text: "Welcome to DermaLens AI, an AI-assisted skin screening and patient education platform. The platform helps users upload skin images, receive an AI-assisted screening indication, understand the result in simple language, and prepare information to discuss with a healthcare professional.",
      duration: 12
    },
    {
      title: "Choose Language",
      text: "First, choose the language you understand best. The result, explanation, audio, and supported video content can be provided in the selected language.",
      duration: 8
    },
    {
      title: "Start Screening",
      text: "Click Start Screening to begin your visual history tracking and analysis.",
      duration: 6
    },
    {
      title: "Upload Images",
      text: "Upload clear images of the skin area you want to screen. You can upload multiple images so the system can compare the available views.",
      duration: 10
    },
    {
      title: "Image Quality",
      text: "The system checks the uploaded images for basic quality such as clarity and usability before analysis. Clear and well-lit images can provide better information.",
      duration: 10
    },
    {
      title: "AI Analysis",
      text: "After uploading the images, the AI analyzes the available images using the configured screening model. The system evaluates visual boundaries and pigment variation.",
      duration: 8
    },
    {
      title: "Screening Result",
      text: "After analysis, the system displays an AI-assisted screening indication. Levels range from Low, Moderate, High, to Uncertain. Remember: this is an AI-assisted screening indication, not a medical diagnosis.",
      duration: 12
    },
    {
      title: "Understand the Result",
      text: "The result is explained using simple language so that users can better understand what the AI found. You can read this easily on the screen.",
      duration: 8
    },
    {
      title: "Listen to Result",
      text: "If reading is difficult, the user can listen to the result by clicking the play button. The audio player speaks the full script.",
      duration: 8
    },
    {
      title: "Watch Result Explanation",
      text: "The platform can also provide a visual explanation of the screening result. This demo video guide helps explain the process.",
      duration: 8
    },
    {
      title: "Change Language",
      text: "The user can change the language at any time without uploading the images again. Here, we demonstrate changing from English to Telugu, updating the explanation texts instantly.",
      duration: 10
    },
    {
      title: "Ask Lens AI",
      text: "Users can ask questions about their result using the available AI assistant. The assistant answers questions based on the screening context.",
      duration: 8
    },
    {
      title: "Skin Story Timeline",
      text: "Skin Story allows users to keep track of previous and current skin observations over time. This helps spot changes in dimensions or contours.",
      duration: 8
    },
    {
      title: "Doctor Summary",
      text: "The user can generate a summary to help discuss the screening information with a qualified healthcare professional.",
      duration: 8
    },
    {
      title: "Final Safety Message",
      text: "Remember, DermaLens AI is designed to support screening, understanding, and communication. It does not replace a qualified healthcare professional or provide a medical diagnosis.",
      duration: 10
    },
    {
      title: "End",
      text: "Now you know how DermaLens AI works from start to finish. See it. Understand it. Act responsibly. Click Start Screening to begin.",
      duration: 8
    }
  ];

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  const getActiveSceneIndex = (time) => {
    let currentSum = 0;
    for (let i = 0; i < scenes.length; i++) {
      currentSum += scenes[i].duration;
      if (time < currentSum) return i;
    }
    return scenes.length - 1;
  };

  const activeSceneIdx = getActiveSceneIndex(demoTime);
  const activeScene = scenes[activeSceneIdx];

  const stopDemoSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const playDemoSpeech = (text) => {
    if (!window.speechSynthesis || demoMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = demoVolume;
    demoUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  const heroImages = {
    'JUN': spots.modRiskJun,
    'JUL': spots.modRiskJul,
    'AUG': spots.modRiskAug
  };
  const heroConfidence = {
    'JUN': '92%',
    'JUL': '85%',
    'AUG': '82%'
  };
  const heroChange = {
    'JUN': 'Stable',
    'JUL': 'Low',
    'AUG': 'Moderate'
  };

  // ABCDE Guide State
  const [activeAbcde, setActiveAbcde] = useState('A');
  const abcdeData = {
    A: { title: "Asymmetry", subtitle: "Asymmetric Shape", desc: "One half of the spot does not match the other half. Normal moles are typically round and symmetric.", visual: "Symmetric: Clear Circle | Atypical: Oval/Jagged bulge" },
    B: { title: "Border", subtitle: "Border Irregularity", desc: "The edges are irregular, ragged, notched, blurred, or poorly defined, blending into the surrounding skin.", visual: "Symmetric: Clean outline | Atypical: Fuzzy or scalloped edge" },
    C: { title: "Color", subtitle: "Color Variation", desc: "The color is not uniform. It may include shades of brown or black, or patches of pink, red, white, or blue.", visual: "Symmetric: Single shade | Atypical: Multiple shades / Red center" },
    D: { title: "Diameter", subtitle: "Size Comparison", desc: "The spot is larger than 6 millimeters across (about the size of a pencil eraser), although melanomas can sometimes be smaller.", visual: "Symmetric: Under 6mm | Atypical: Greater than 6mm / Expanding" },
    E: { title: "Evolution", subtitle: "Change Over Time", desc: "The spot is changing in size, shape, color, or elevation. This is the single most critical indicator that warrants professional dermatologist check.", visual: "Symmetric: Constant over years | Atypical: Developing new contours" }
  };

  // Cancer Type Interactive Tab State
  const [activeCancerTab, setActiveCancerTab] = useState('melanoma');

  // Explainable AI Spot Click State
  const [activeXaiArea, setActiveXaiArea] = useState('Border');
  const xaiExplanations = {
    Shape: { title: "Asymmetry Scan", desc: "The model detected a 24% expansion in the upper-right quadrant, representing asymmetric tissue expansion.", severity: "Moderate alert" },
    Border: { title: "Margin Scalloping", desc: "The model highlighted the fading top boundary where borders become jagged, a key indicator for atypical cell structures.", severity: "Important border alert" },
    Color: { title: "Pigment Clustering", desc: "Two distinct shades are flagged: a dark brown core and a light brown halo, representing pigment variance.", severity: "Multi-color alert" },
    Texture: { title: "Surface Roughness", desc: "Micro-texture checks indicate slightly elevated edges compared to normal surrounding tissue.", severity: "Low texture alert" }
  };

  // Compare changes mock slider position
  const [sliderPos, setSliderPos] = useState(50);

  // Technical Architecture interactive state
  const [activeArchNode, setActiveArchNode] = useState('mobilenet');

  // FAQ open state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // RAG Mini-Chat demo
  const [miniChatIndex, setMiniChatIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (demoPlaying && showDemoModal) {
      timer = setInterval(() => {
        setDemoTime(prev => {
          if (prev >= totalDuration - 1) {
            setDemoPlaying(false);
            stopDemoSpeech();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      stopDemoSpeech();
    }
    return () => {
      clearInterval(timer);
    };
  }, [demoPlaying, showDemoModal]);

  useEffect(() => {
    if (demoPlaying && showDemoModal) {
      playDemoSpeech(activeScene.text);
    } else {
      stopDemoSpeech();
    }
  }, [activeSceneIdx, demoPlaying, showDemoModal]);

  useEffect(() => {
    if (!showDemoModal) {
      setDemoPlaying(false);
      setDemoTime(0);
      stopDemoSpeech();
    }
  }, [showDemoModal]);

  const startScreening = () => {
    onStartScreening();
  };

  return (
    <div className="landing-page-wrapper">
      
      {/* 2. HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-badge">AI-Powered Skin Screening & Monitoring</span>
            <h1 className="hero-title">
              See the Change.<br />
              <span className="gradient-text">Understand the Risk.</span><br />
              Take the Right Next Step.
            </h1>
            <p className="hero-text">
              DermaLens AI combines computer vision, explainable AI, trusted medical knowledge, and personal skin tracking to help users monitor visible skin changes responsibly.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={startScreening}>
                Start Your Skin Story <ArrowRight size={16} />
              </button>
              <a href="#solution" className="btn btn-secondary">
                Explore the Solution
              </a>
            </div>
            <div className="hero-trust-line">
              <Shield size={16} className="gradient-text" />
              <span>AI-assisted • Explainable • Privacy-focused • Non-diagnostic</span>
            </div>
          </div>

          <div className="hero-visual">
            <div 
              className="skin-lens-container" 
              style={{ backgroundImage: `url(${heroImages[heroMonth]})` }}
            >
              <div className="skin-lens-overlay">
                <div className="skin-lens-scanner"></div>
              </div>

              {/* Interactive Timeline nav inside Hero */}
              <div className="timeline-nav-curve">
                {['JUN', 'JUL', 'AUG'].map((m) => (
                  <button 
                    key={m} 
                    className={`timeline-nav-btn ${heroMonth === m ? 'active' : ''}`}
                    onClick={() => setHeroMonth(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating Info Cards */}
            <div className="floating-lens-card" style={{ top: '20px', left: '-20px' }}>
              <span style={{ color: 'var(--text-gray)', fontWeight: 'bold' }}>IMAGE QUALITY</span>
              <span style={{ color: 'var(--secondary-forest)', fontWeight: 'bold' }}>Excellent ✓</span>
            </div>

            <div className="floating-lens-card" style={{ top: '160px', right: '-20px' }}>
              <span style={{ color: 'var(--text-gray)', fontWeight: 'bold' }}>AI SCREENING</span>
              <span style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>Complete ✓</span>
            </div>

            <div className="floating-lens-card" style={{ bottom: '20px', left: '10px' }}>
              <span style={{ color: 'var(--text-gray)', fontWeight: 'bold' }}>VISUAL CHANGE</span>
              <span style={{ color: heroMonth === 'AUG' ? 'var(--accent-coral)' : 'var(--text-dark)', fontWeight: 'bold' }}>
                {heroChange[heroMonth]}
              </span>
            </div>

            <div className="floating-lens-card" style={{ bottom: '100px', right: '-10px' }}>
              <span style={{ color: 'var(--text-gray)', fontWeight: 'bold' }}>MODEL CONFIDENCE</span>
              <span style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>{heroConfidence[heroMonth]}</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '5rem', fontStyle: 'italic', color: 'var(--primary-teal)', fontWeight: '600' }}>
          "One photo shows today. A timeline helps you understand change."
        </div>
      </section>

      {/* 3. HOW TO USE DERMALENS - TUTORIAL VIDEO SECTION */}
      <section style={{ padding: '4rem 2rem', background: 'var(--bg-warm-ivory)', borderTop: '1px solid rgba(15,76,92,0.08)', borderBottom: '1px solid rgba(15,76,92,0.08)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>🎥</span>
          <h2 style={{ color: 'var(--primary-teal)', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>How to Use DermaLens</h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Watch this short guide to understand how the complete platform works.
          </p>
          <button className="btn btn-primary" onClick={() => setShowDemoModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>
            ▶ Watch Demo
          </button>
        </div>
      </section>

      {/* 4. THE PROBLEM */}
      <section className="dark-section" id="problem" style={{ padding: '6rem 2rem', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--accent-aqua)', border: '1px solid rgba(255,255,255,0.1)' }}>The Core Problem</span>
            <h2 className="gradient-text-light" style={{ fontSize: '2.5rem', marginTop: '1rem', color: '#FFF' }}>
              Skin changes are easy to notice.<br />Harder to remember.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '1rem auto 0' }}>
              "People may notice a changing skin spot but often do not remember what it looked like before, do not know what changes matter, and may find AI results difficult to understand."
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', color: '#FFF', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: 'var(--accent-coral)', fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>01</span>
              <h3 style={{ color: '#FFF', margin: '0.5rem 0' }}>Memory Gap</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                People may not remember what a skin spot looked like weeks or months ago. Without a baseline record, spotting gradual changes is practically impossible.
              </p>
            </div>

            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', color: '#FFF', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: 'var(--accent-coral)', fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>02</span>
              <h3 style={{ color: '#FFF', margin: '0.5rem 0' }}>Unclear Information</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Technical AI predictions and medical jargon can be scary and difficult for everyday users to interpret, leaving them anxious and confused.
              </p>
            </div>

            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', color: '#FFF', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: 'var(--accent-coral)', fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>03</span>
              <h3 style={{ color: '#FFF', margin: '0.5rem 0' }}>Uncertain Next Steps</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Users may not know when an observation warrants consulting a professional, leading to delayed check-ups or unnecessary emergency visits.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--accent-aqua)', fontWeight: '600' }}>
            This is the gap DermaLens AI is designed to address.
          </div>
        </div>
      </section>

      {/* 5. OUR SOLUTION */}
      <section id="solution" style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">THE DERMALENS WORKFLOW</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>One platform. One continuous skin story.</h2>
            <p style={{ color: 'var(--text-gray)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              We guide you through a comprehensive, medically responsible screening process.
            </p>
          </div>

          {/* 6 Connected cards with animated flow paths */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', position: 'relative' }}>
            {[
              { num: "01", title: "CAPTURE", desc: "Take or upload up to 5 images of the same skin area for complete visual views." },
              { num: "02", title: "CHECK", desc: "Our system checks lighting, focus, and blur parameters individually per image." },
              { num: "03", title: "SCREEN", desc: "CNN algorithms analyze patterns and flag visual risk factors." },
              { num: "04", title: "EXPLAIN", desc: "Review where the AI focused on the image and why in simple language." },
              { num: "05", title: "TRACK", desc: "Save observations into a chronological timeline to track spots." },
              { num: "06", title: "ACT", desc: "Generate a medical summary to share with your dermatologist." }
            ].map((step, idx) => (
              <div key={idx} className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-coral)', fontFamily: 'var(--font-headings)' }}>{step.num}</span>
                <h4 style={{ color: 'var(--primary-teal)', margin: '0.5rem 0' }}>{step.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <button className="btn btn-primary" onClick={startScreening}>
              Try the Screening Flow <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. SKIN STORY CONCEPT */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="hero-badge">THE DIFFERENTIATOR</span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '1rem' }}>Your Skin Has a Story.</h2>
            <p style={{ margin: '1rem 0' }}>
              Unlike simple classifiers that provide single, scary probabilities, DermaLens builds a comprehensive narrative of change.
            </p>
            <p style={{ fontWeight: '600', color: 'var(--primary-teal)' }}>
              "Photo → Visual Analysis → Explanation → Personal Timeline → Change Comparison → Trusted Information → Professional Guidance"
            </p>
          </div>
          <div className="glass-card" style={{ background: '#FFF' }}>
            <h4 style={{ marginBottom: '1rem' }}>Concept Comparison</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--text-gray)', background: '#FAF9F5' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-gray)' }}>TRADITIONAL METHOD</span>
                <p style={{ fontWeight: 'bold' }}>Single Photo ➔ AI Prediction ➔ Anxiety</p>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--accent-coral)', background: 'rgba(231,111,81,0.05)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-coral)' }}>DERMALENS STORY LENS</span>
                <p style={{ fontWeight: 'bold', color: 'var(--primary-teal)' }}>Timeline Tracking ➔ Change Metrics ➔ Explainable Details ➔ Dermatologist Action Plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SKIN CANCER TYPES GUIDE */}
      <section className="dark-section" id="skin-guide" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--accent-aqua)', border: 'none' }}>Educational Guide Only</span>
            <h2 style={{ fontSize: '2.5rem', color: '#FFF', marginTop: '1rem' }}>Know the Major Types of Skin Cancer</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              These materials are educational and do not replace professional dermatological clinical visits.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {/* Melanoma */}
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF' }}>
              <h3 style={{ color: '#FFF' }}>Melanoma</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '1rem 0' }}>
                Melanoma develops from pigment-producing cells called melanocytes. It is less common than basal cell and squamous cell carcinoma but can be more serious because it can spread (metastasize) to other organs.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-coral)' }}>KEY INDICATORS (ABCDE):</span>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
                  <li>Asymmetrical shape</li>
                  <li>Irregular or notched borders</li>
                  <li>Varied colors (brown, black, red, blue)</li>
                  <li>Diameter larger than 6mm</li>
                  <li>Evolution or changes over time</li>
                </ul>
              </div>
              <button className="btn btn-glass" style={{ width: '100%' }} onClick={() => handleNavClick('learn-sec')}>
                Learn About Melanoma
              </button>
            </div>

            {/* BCC */}
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF' }}>
              <h3 style={{ color: '#FFF' }}>Basal Cell Carcinoma (BCC)</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '1rem 0' }}>
                Basal cell carcinoma begins in the basal cells in the skin. It is the most common type of skin cancer globally, typically growing very slowly and rarely metastasizing, though it can invade surrounding tissue.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-aqua)' }}>COMMON PRESENTATIONS:</span>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
                  <li>Pearly, waxy, or shiny bumps</li>
                  <li>Pink or red skin sores that do not heal</li>
                  <li>Slightly elevated rolled border</li>
                  <li>Bleeding, oozing, or crusted areas</li>
                </ul>
              </div>
              <button className="btn btn-glass" style={{ width: '100%' }} onClick={() => handleNavClick('learn-sec')}>
                Learn About BCC
              </button>
            </div>

            {/* SCC */}
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF' }}>
              <h3 style={{ color: '#FFF' }}>Squamous Cell Carcinoma (SCC)</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '1rem 0' }}>
                Squamous cell carcinoma develops from squamous cells in the outer layers of the skin. It is common on sun-exposed regions. If left untreated, it can grow deep or spread to lymph nodes.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-aqua)' }}>COMMON PRESENTATIONS:</span>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
                  <li>Rough, scaly, or thick red patches</li>
                  <li>Persistent sores that bleed easily</li>
                  <li>Rapidly growing dome-shaped nodules</li>
                  <li>Warts or growths with central crusts</li>
                </ul>
              </div>
              <button className="btn btn-glass" style={{ width: '100%' }} onClick={() => handleNavClick('learn-sec')}>
                Learn About SCC
              </button>
            </div>
          </div>

          {/* Cancer comparison table */}
          <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}>
            <h4 style={{ color: '#FFF', marginBottom: '1.5rem' }}>Educational Comparison Table <span style={{ fontSize: '0.75rem', color: 'var(--accent-coral)', marginLeft: '1rem' }}>(Educational comparison only)</span></h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--accent-aqua)' }}>Criteria</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--accent-aqua)' }}>Melanoma</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--accent-aqua)' }}>BCC</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--accent-aqua)' }}>SCC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>Origin</td>
                    <td style={{ padding: '1rem' }}>Melanocytes (pigment cells)</td>
                    <td style={{ padding: '1rem' }}>Basal cells (epidermis base)</td>
                    <td style={{ padding: '1rem' }}>Squamous cells (epidermis surface)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>Appearance</td>
                    <td style={{ padding: '1rem' }}>Dark, irregular, multi-tone moles</td>
                    <td style={{ padding: '1rem' }}>Pearly, waxy bumps or pink spots</td>
                    <td style={{ padding: '1rem' }}>Rough, scaly patches or red nodules</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>Typical Behavior</td>
                    <td style={{ padding: '1rem' }}>Can spread quickly if untreated</td>
                    <td style={{ padding: '1rem' }}>Very slow growing; local damage</td>
                    <td style={{ padding: '1rem' }}>Gradual growth; can spread locally</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>Clinical Action</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-coral)', fontWeight: 'bold' }}>Immediate professional evaluation</td>
                    <td style={{ padding: '1rem' }}>Professional exam and removal</td>
                    <td style={{ padding: '1rem' }}>Professional exam and removal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive ABCDE Section */}
          <div style={{ marginTop: '5rem' }}>
            <h4 style={{ color: '#FFF', textAlign: 'center', marginBottom: '2rem' }}>Interactive ABCDE Guide</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
              {Object.keys(abcdeData).map((letter) => (
                <button
                  key={letter}
                  className={`btn ${activeAbcde === letter ? 'btn-primary' : 'btn-glass'}`}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.5rem', fontWeight: 'bold', padding: 0 }}
                  onClick={() => setActiveAbcde(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
            <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#FFF', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-aqua)', fontWeight: 'bold' }}>{abcdeData[activeAbcde].subtitle}</span>
              <h3 style={{ color: '#FFF', margin: '0.5rem 0 1rem' }}>{abcdeData[activeAbcde].title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem' }}>{abcdeData[activeAbcde].desc}</p>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.5rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
                <strong>Indicator:</strong> {abcdeData[activeAbcde].visual}
              </div>
              {activeAbcde === 'E' && (
                <div style={{ marginTop: '1.5rem', color: 'var(--accent-coral)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  * Evolution / change over time is especially important to discuss with a healthcare professional.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">THE TECHNOLOGY PIPELINE</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>From one image to an understandable story.</h2>
            <p style={{ color: 'var(--text-gray)' }}>A secure, distributed, and multi-stage pipeline handles your screening request.</p>
          </div>

          {/* Interactive Pipeline diagram */}
          <div style={{ overflowX: 'auto', padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '980px', justifyContent: 'center' }}>
              {[
                { name: "USER", color: "#6C757D" },
                { name: "PHOTO", color: "var(--primary-teal)" },
                { name: "QUALITY CHECK", color: "var(--secondary-forest)" },
                { name: "OPENCV PREPROC", color: "var(--primary-teal)" },
                { name: "CNN / MOBILENET", color: "var(--accent-coral)" },
                { name: "RISK INDICATOR", color: "var(--accent-coral)" },
                { name: "RAG KNOWLEDGE", color: "var(--primary-teal)" },
                { name: "IBM GRANITE", color: "var(--primary-teal)" },
                { name: "EXPLANATION", color: "var(--secondary-forest)" },
                { name: "TIMELINE", color: "var(--primary-teal)" },
                { name: "NEXT STEP", color: "var(--accent-coral)" }
              ].map((node, index) => (
                <React.Fragment key={index}>
                  <div style={{
                    padding: '0.85rem 1rem',
                    background: node.color,
                    color: '#FFF',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'nowrap'
                  }}>
                    {node.name}
                  </div>
                  {index < 10 && (
                    <div style={{
                      width: '30px',
                      height: '2px',
                      background: 'rgba(15,76,92,0.2)',
                      position: 'relative'
                    }}>
                      <div className="pulse-teal-ring" style={{
                        position: 'absolute',
                        top: '-3px',
                        left: '12px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--primary-teal)'
                      }}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. SMART IMAGE QUALITY */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="hero-badge">Image Safeguard</span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '1rem' }}>Smart Image Quality Check</h2>
            <p style={{ margin: '1rem 0' }}>
              DermaLens checks critical parameters immediately on device before sending the image to our neural network. If quality fails, we guide you to retake the photo.
            </p>
            <div style={{ background: '#FFFFFF', padding: '1rem 1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(15,76,92,0.1)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-coral)', fontWeight: 'bold' }}>* CRITICAL MEDICAL NOTE:</span>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-dark)' }}>
                We never generate screening results from low-quality, blurry, or poorly-lit photos. Safe analysis requires a clear image.
              </p>
            </div>
          </div>
          <div className="glass-card" style={{ background: '#FFF' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={20} className="gradient-text" /> 
              Quality Diagnostics
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: "LIGHTING", val: "Good ✓", status: "ok" },
                { label: "SHARPNESS", val: "Good ✓", status: "ok" },
                { label: "FRAMING", val: "Good ✓", status: "ok" },
                { label: "VISIBILITY", val: "Good ✓", status: "ok" },
                { label: "STABILITY", val: "Good ✓", status: "ok" }
              ].map((chk, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F1ECE3' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{chk.label}</span>
                  <span style={{ color: 'var(--secondary-forest)', fontWeight: 'bold', fontSize: '0.9rem' }}>{chk.val}</span>
                </div>
              ))}
              <div style={{ background: 'rgba(30,70,32,0.05)', color: 'var(--secondary-forest)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Ready for screening.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. EXPLAINABLE AI */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ background: '#FFF', position: 'relative' }}>
            <h4 style={{ marginBottom: '1rem' }}>XAI Attention Map Simulation</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '1rem' }}>Click a visual feature to see the model focus overlay details:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['Shape', 'Border', 'Color', 'Texture'].map((area) => (
                <button
                  key={area}
                  className={`btn ${activeXaiArea === area ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                  onClick={() => setActiveXaiArea(area)}
                >
                  {area}
                </button>
              ))}
            </div>
            
            <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--bg-warm-ivory)' }}>
              <img src={spots.modRiskAug} alt="Spot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Simulated focus highlights */}
              {activeXaiArea === 'Border' && (
                <div style={{ position: 'absolute', inset: 0, border: '6px dashed var(--accent-coral)', borderRadius: '50%', animation: 'pulse-coral 1.5s infinite' }} />
              )}
              {activeXaiArea === 'Shape' && (
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%', background: 'rgba(231,111,81,0.2)', borderRadius: '50%' }} />
              )}
              {activeXaiArea === 'Color' && (
                <div style={{ position: 'absolute', top: '40%', left: '40%', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(142,202,230,0.5)', border: '2px solid var(--primary-teal)' }} />
              )}
              {activeXaiArea === 'Texture' && (
                <div style={{ position: 'absolute', inset: '30px', border: '2px solid var(--secondary-forest)', borderRadius: '50%', opacity: 0.8 }} />
              )}
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--bg-warm-ivory)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--primary-teal)' }}>{xaiExplanations[activeXaiArea].title}:</strong> {xaiExplanations[activeXaiArea].desc}
            </div>
          </div>
          <div>
            <span className="hero-badge">Explainability</span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '1rem' }}>Don't just show a result. Explain it.</h2>
            <p style={{ margin: '1rem 0' }}>
              DermaLens AI maps exact visual characteristics back onto the image. This explains exactly what features of shape, borders, or colors contributed to the risk classification.
            </p>
            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-gray)' }}>
              "This visualization represents areas that influenced the model. It is not proof of disease or a medical diagnosis."
            </p>
          </div>
        </div>
      </section>

      {/* 11. SKIN TIMELINE */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Skin Timeline</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Chronological Track Record</h2>
            <p style={{ color: 'var(--text-gray)' }}>See how tracking a spot transforms into a detailed, medical-grade skin history.</p>
          </div>

          <div className="glass-card" style={{ background: '#FFF' }}>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', borderBottom: '1px solid #F1ECE3', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-coral)' }}>3</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>observations</p>
              </div>
              <div style={{ borderRight: '1px solid #FAF9F5' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>65</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>days tracked</p>
              </div>
              <div style={{ borderRight: '1px solid #FAF9F5' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--secondary-forest)' }}>1</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>location</p>
              </div>
            </div>

            {/* Vertical timeline preview */}
            <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '11px', width: '2px', background: 'var(--primary-teal)' }}></div>

              {[
                { date: "JUN 04", label: "First observation", note: "Initially registered spot during monthly screening.", img: spots.modRiskJun },
                { date: "JUL 12", label: "Second observation", note: "Checked again. Border looks slightly fuzzier.", img: spots.modRiskJul },
                { date: "AUG 08", label: "Latest observation", note: "Flagged with Moderate Risk. Color variation detected.", img: spots.modRiskAug }
              ].map((time, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '2rem' }}>
                  {/* node */}
                  <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-coral)', border: '2px solid #FFF' }}></div>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', flexShrink: 0 }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary-teal)' }}>{time.date}</span>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-gray)' }}>{time.label}</p>
                    </div>
                    <img src={time.img} alt="Mole" style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                    <div style={{ fontSize: '0.9rem' }}>
                      <p style={{ fontWeight: '500' }}>{time.note}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>Left forearm</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. COMPARE CHANGES */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="hero-badge">Evolution</span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '1rem' }}>What changed?</h2>
            <p style={{ margin: '1rem 0' }}>
              Our sliding comparison tool overlaps consecutive scans. Move the slider to inspect structural changes directly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Visual Change</span>
                <span style={{ color: 'var(--accent-coral)', fontWeight: 'bold' }}>MODERATE</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>
                "Visual change describes differences between images. It does not determine whether a change is medically significant. If you are concerned about a change, consult a qualified healthcare professional."
              </p>
            </div>
          </div>

          <div>
            {/* Draggable before after slider mock */}
            <div className="comparison-slider-container">
              <div 
                className="comparison-image" 
                style={{ backgroundImage: `url(${spots.modRiskAug})` }}
              />
              <div 
                className="comparison-image" 
                style={{ 
                  backgroundImage: `url(${spots.modRiskJun})`,
                  width: `${sliderPos}%`,
                  borderRight: '2px solid #FFF'
                }}
              />
              <div 
                className="comparison-slider-handle"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="comparison-slider-button">
                  ↔
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPos} 
                onChange={(e) => setSliderPos(Number(e.target.value))}
                style={{ width: '80%', accentColor: 'var(--primary-teal)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 13. RAG + AI ASSISTANT (LENS) */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <strong style={{ color: 'var(--primary-teal)' }}>LENS Assistant</strong>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-gray)', margin: 0 }}>RAG-backed skin information companion</p>
              </div>
            </div>
            
            <div className="chat-messages">
              <div className="chat-bubble bot">
                Hi. I can explain your screening summary and provide general skin-health information.
              </div>
              <div className="chat-bubble user">
                {ragQA[miniChatIndex].question}
              </div>
              <div className="chat-bubble bot" style={{ whiteSpace: 'pre-line' }}>
                {ragQA[miniChatIndex].answer}
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-gray)' }}>
                  <strong>Sources:</strong> {ragQA[miniChatIndex].sources[0].title} ({ragQA[miniChatIndex].sources[0].author})
                </div>
              </div>
            </div>

            <div className="chat-suggestions">
              {ragQA.slice(0, 3).map((item, idx) => (
                <button 
                  key={idx} 
                  className="chat-suggestion-chip"
                  onClick={() => setMiniChatIndex(idx)}
                >
                  {item.question}
                </button>
              ))}
            </div>

            <div className="chat-input-area">
              <input type="text" readOnly placeholder="Ask LENS a question..." className="chat-input" />
              <button className="btn btn-primary" style={{ padding: '0 1rem' }} onClick={() => setView('app')}>Chat</button>
            </div>
          </div>

          <div>
            <span className="hero-badge">AI Assistant</span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '1rem' }}>Chat Safely With LENS</h2>
            <p style={{ margin: '1rem 0' }}>
              Ask LENS about visual attributes, skin guide definitions, or what risk categories signify. The assistant checks clinical references dynamically before outputting an answer.
            </p>
            <button className="btn btn-primary" onClick={() => { setView('app'); setTab('assistant'); }}>
              Open AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* 14. IBM GRANITE */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span className="hero-badge">Language Engine</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>IBM Granite Powered Explanations</h2>
          <p style={{ color: 'var(--text-gray)', maxWidth: '600px', margin: '0.5rem auto 2.5rem' }}>
            DermaLens utilizes IBM Granite to process mathematical visual features and clinical source excerpts, rendering patient summaries that are supportive, clear, and non-diagnostic.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: 'var(--bg-warm-ivory)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', border: '1px solid rgba(15,76,92,0.1)' }}>
            {[
              { num: "Q", text: "USER QUESTION", details: "What is melanoma?" },
              { num: "1", text: "KNOWLEDGE RETRIEVAL", details: "Fetches certified clinical guidelines." },
              { num: "2", text: "IBM GRANITE", details: "Translates technical medical text to patient language." },
              { num: "A", text: "RESPONSIBLE ANSWER", details: "Delivers simple explanation with source citations." }
            ].map((node, i) => (
              <div key={i} className="glass-card" style={{ background: '#FFF' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-coral)' }}>{node.num}</span>
                <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '0.85rem' }}>{node.text}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>{node.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. AGENTIC AI */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Multi-Agent Workflow</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>One experience. Multiple intelligent agents.</h2>
            <p style={{ color: 'var(--text-gray)' }}>
              An agentic workflow coordinates multiple AI components to complete the screening-support journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { role: "IMAGE AGENT", desc: "Coordinates camera controls and image capture triggers." },
              { role: "QUALITY AGENT", desc: "Checks lighting, alignment, and pixel sharpness metrics." },
              { role: "VISION MODEL", desc: "Runs MobileNet convolutions to catalog visual patterns." },
              { role: "EXPLANATION AGENT", desc: "Calculates visual attention weight indices." },
              { role: "KNOWLEDGE RETRIEVAL", desc: "Performs semantic database queries for RAG context." },
              { role: "GRANITE AGENT", desc: "Translates logs and excerpts into natural speech." },
              { role: "REPORT AGENT", desc: "Formats dates, data logs, and history for clinical summaries." }
            ].map((agent, i) => (
              <div key={i} className="glass-card" style={{ background: '#FFF', border: '1px solid rgba(15,76,92,0.08)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-coral)', letterSpacing: '1px' }}>AGENT {i+1}</span>
                <h4 style={{ color: 'var(--primary-teal)', margin: '0.25rem 0' }}>{agent.role}</h4>
                <p style={{ fontSize: '0.85rem' }}>{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. DOCTOR SUMMARY */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="hero-badge">Doctor-Ready</span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '1rem' }}>Turn observations into a professional summary.</h2>
            <p style={{ margin: '1rem 0' }}>
              DermaLens lets you compile scans, tracking notes, and AI explanation details into a comprehensive summary report to share with a physician.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => { setView('app'); setTab('doctoreport'); }}>
                Create Doctor Summary
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: '1.5rem' }}>
              "AI-assisted screening summary — not a medical diagnosis."
            </p>
          </div>

          <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px dashed var(--primary-teal)' }}>
            <div style={{ borderBottom: '1px solid rgba(15,76,92,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--primary-teal)' }}>DERMALENS AI - CLINICAL SUMMARY</strong>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-gray)' }}>Scan Date: August 08, 2026 | Location: Left Forearm</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <img src={spots.modRiskAug} alt="Mole" style={{ width: '48px', height: '48px', borderRadius: '4px' }} />
              <div style={{ fontSize: '0.75rem' }}>
                <p><strong>Risk Indication:</strong> Moderate Risk Indication</p>
                <p><strong>Confidence:</strong> 82%</p>
                <p><strong>Evolution:</strong> 1.3mm growth in 65 days</p>
              </div>
            </div>
            <div style={{ background: '#FFF', padding: '0.75rem', borderRadius: '4px', fontSize: '0.7rem' }}>
              <strong>Visual Features Detected:</strong> Mild shape discrepancy and dual-tone brown margins observed.
            </div>
          </div>
        </div>
      </section>

      {/* 17. TECHNOLOGY ARCHITECTURE */}
      <section className="dark-section" id="technology" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--accent-aqua)', border: 'none' }}>System Framework</span>
            <h2 style={{ fontSize: '2.5rem', color: '#FFF', marginTop: '1rem' }}>Technology behind DermaLens AI</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Click each component in the system graph to inspect details.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Interactive Graph layout */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              {techArchitecture.map((node) => (
                <button
                  key={node.id}
                  className={`btn ${activeArchNode === node.id ? 'btn-primary' : 'btn-glass'}`}
                  style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.75rem 1.25rem',
                    flex: '1 1 calc(50% - 1rem)',
                    minWidth: '160px',
                    borderColor: activeArchNode === node.id ? 'var(--primary-teal)' : 'rgba(255,255,255,0.2)'
                  }}
                  onClick={() => setActiveArchNode(node.id)}
                >
                  {node.title}
                </button>
              ))}
            </div>

            {/* Selected Node Details */}
            {activeArchNode && (
              <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-aqua)', fontWeight: 'bold' }}>{techArchitecture.find(n => n.id === activeArchNode).tech}</span>
                <h3 style={{ color: '#FFF', margin: '0.5rem 0' }}>{techArchitecture.find(n => n.id === activeArchNode).title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)' }}>{techArchitecture.find(n => n.id === activeArchNode).desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 18. RESPONSIBLE AI */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Pillars of Care</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Built for healthcare. Designed for responsibility.</h2>
            <p style={{ color: 'var(--text-gray)' }}>DermaLens incorporates guardrails at every layer of clinical screening.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {responsiblePillars.map((pillar, i) => (
              <div key={i} className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary-teal)', margin: '0.5rem 0' }}>{pillar.title}</h4>
                <p style={{ fontSize: '0.9rem' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 19. IMPACT */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Clinical Action</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>From uncertainty to informed action.</h2>
            <p style={{ color: 'var(--text-gray)' }}>Comparing patient tracking before and after incorporating DermaLens AI.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {/* Before */}
            <div className="glass-card" style={{ background: '#FFF', borderLeft: '6px solid var(--accent-coral)' }}>
              <h3 style={{ color: 'var(--accent-coral)', marginBottom: '1.5rem' }}>Before DermaLens</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {solutionImpact.before.map((item, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: '0.95rem' }}>"{item.title}"</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="glass-card" style={{ background: '#FFF', borderLeft: '6px solid var(--secondary-forest)' }}>
              <h3 style={{ color: 'var(--secondary-forest)', marginBottom: '1.5rem' }}>After DermaLens</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {solutionImpact.after.map((item, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--primary-teal)' }}>"{item.title}"</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 20. FUTURE SCOPE */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Roadmap</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Where DermaLens can go next</h2>
            <p style={{ color: 'var(--text-gray)' }}>Future Development Roadmap (Not currently implemented)</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {futureScope.map((scope, idx) => (
              <div key={idx} className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>FUTURE SCOPE</span>
                <h4 style={{ color: 'var(--primary-teal)', margin: '0.25rem 0' }}>{scope.title}</h4>
                <p style={{ fontSize: '0.85rem' }}>{scope.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW RELIABLE IS AI SCREENING */}
      <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Clinical Accuracy Guide</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>How reliable is AI screening?</h2>
            <p style={{ color: 'var(--text-gray)', maxWidth: '700px', margin: '0.5rem auto 0' }}>
              AI screening is a decision-support indicator, not a replacement for a dermatologist. Learn about the key factors that influence model performance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4.5rem' }}>
            <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)' }}>
              <h4>Image Quality & Lighting</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Blurs, shadows, and bad room lighting prevent standard neural networks from extracting precise contours and pigment boundaries.
              </p>
            </div>
            <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)' }}>
              <h4>Dataset Representation</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Model accuracy relies on training dataset diversity (skin tones, age classes, and lesion shapes) to avoid evaluation bias.
              </p>
            </div>
            <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)' }}>
              <h4>Explainable Confidence</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Model confidence describes how strongly the model favors a classification among trained classes, not the probability that the patient has cancer.
              </p>
            </div>
          </div>

          {/* Validation Metrics Box */}
          <div className="glass-card" style={{ textAlign: 'center', border: '1px dashed var(--primary-teal)', maxWidth: '750px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>MODEL VALIDATION METRICS</span>
            <h3 style={{ color: 'var(--primary-teal)', margin: '0.5rem 0 1rem' }}>Clinical Performance Metrics</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-coral)', fontWeight: 'bold' }}>
              Validation metrics will be displayed after proper model validation.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', maxWidth: '550px', margin: '0.5rem auto 0' }}>
              We do not fabricate accuracy values. Official metrics (Sensitivity, Specificity, ROC-AUC) will be updated following clinical board reviews.
            </p>
          </div>
        </div>
      </section>

      {/* STANDARDIZED PHOTO GUIDE */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)', borderTop: '1px solid rgba(15,76,92,0.06)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Photo Guidelines</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Take Better Comparison Photos</h2>
            <p style={{ color: 'var(--text-gray)' }}>Standardize your photography techniques to ensure accurate skin timeline logs.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: "Use similar lighting", desc: "Always check skin spots in similar bright, indirect daylight." },
              { title: "Keep similar distance", desc: "Hold your camera 6-8 inches away for close-up shots." },
              { title: "Keep focus locked", desc: "Tap the screen to stabilize focus on the lesion before shooting." },
              { title: "Include wide context", desc: "Capture a wide view card to establish body orientation." },
              { title: "Avoid filters & edits", desc: "Do not apply filters or color correctors that distort skin tones." },
              { title: "Avoid harsh shadows", desc: "Angle your camera so your hand does not cast shadows over the spot." },
              { title: "Maintain same location", desc: "Log spots from the same body quadrant to ensure timeline matching." }
            ].map((guide, idx) => (
              <div key={idx} className="glass-card" style={{ background: '#FFF', padding: '1.25rem', border: '1px solid rgba(15,76,92,0.06)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-coral)', fontFamily: 'var(--font-headings)' }}>{idx+1}</span>
                <h4 style={{ margin: '0.4rem 0 0.25rem', fontSize: '0.95rem' }}>{guide.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>{guide.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 21. FAQ */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-warm-ivory)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-badge">Common Questions</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ 
                    background: '#FFF', 
                    padding: '1.25rem 1.75rem', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--primary-teal)', fontSize: '1.05rem' }}>{faq.q}</strong>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  {isOpen && (
                    <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.5', borderTop: '1px solid #FAF9F5', paddingTop: '1rem' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 22. FINAL CTA */}
      <section style={{ padding: '8rem 2rem', background: 'var(--dark-navy)', color: '#FFF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="gradient-text-light" style={{ fontSize: '3rem', color: '#FFF', fontWeight: '800', marginBottom: '1rem' }}>
            Don't just detect.<br />Understand the change.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Start building your personal skin story with AI-assisted screening, visual tracking, and trusted medical information.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-accent" onClick={startScreening}>
              Start Your Skin Story <ArrowRight size={16} />
            </button>
            <button className="btn btn-glass" onClick={onStartDemo}>
              Try Judge Demo
            </button>
          </div>
        </div>
      </section>
      {/* 23. TUTORIAL DEMO VIDEO MODAL */}
      {showDemoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231,111,81,0.4); }
              70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(231,111,81,0); }
              100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231,111,81,0); }
            }
            @keyframes eqScale {
              0% { height: 10px; }
              100% { height: 36px; }
            }
          ` }} />
          
          <div style={{ width: '100%', maxWidth: '850px', background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', background: '#1C1C1E', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#FFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>🎥</span>
                <strong style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>DermaLens AI - Complete Platform Tutorial</strong>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                &times;
              </button>
            </div>

            {/* Simulated Video Player Screen */}
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative', overflow: 'hidden' }}>
              
              {/* RENDER DYNAMIC VISUAL FRAME */}
              <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                {(() => {
                  switch (activeSceneIdx) {
                    case 0:
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #0F4C5C 0%, #0d3b48 100%)', color: '#FFF', padding: '2rem', textAlign: 'center' }}>
                          <div style={{ border: '2px solid rgba(255,255,255,0.2)', padding: '1rem 2rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', animation: 'pulse 2s infinite' }}>
                            <span style={{ fontSize: '0.8rem', color: '#8ECAE6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>AI Skin Screening Portal</span>
                            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', fontFamily: 'serif' }}>DermaLens AI</h2>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>See the Change. Understand the Risk.</p>
                          </div>
                          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', opacity: 0.8 }}>
                            <span>✓ Visual Timeline</span>
                            <span>✓ Multi-Image Check</span>
                            <span>✓ RAG Explanations</span>
                          </div>
                        </div>
                      );
                    case 1:
                      return (
                        <div style={{ padding: '2rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ background: '#FFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', width: '280px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                            <span style={{ fontSize: '1.5rem' }}>🌐</span>
                            <h3 style={{ margin: '0.5rem 0', color: 'var(--primary-teal)' }}>Select Platform Language</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginBottom: '1rem' }}>Localize results, speech description, and explainer animations.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <div style={{ padding: '0.5rem', background: '#F1ECE3', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem' }}>English</div>
                              <div style={{ padding: '0.5rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-gray)' }}>తెలుగు (Telugu)</div>
                              <div style={{ padding: '0.5rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-gray)' }}>హిन्दी (Hindi)</div>
                            </div>
                          </div>
                        </div>
                      );
                    case 2:
                      return (
                        <div style={{ padding: '2rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center', background: '#FFF', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '350px' }}>
                            <span style={{ fontSize: '2rem' }}>✨</span>
                            <h3 style={{ color: 'var(--primary-teal)', margin: '0.5rem 0' }}>Start Skin Screening</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '1.5rem' }}>Begin tracking and inspecting spot modifications dynamically.</p>
                            <button className="btn btn-primary" onClick={() => { setShowDemoModal(false); startScreening(); }} style={{ padding: '0.75rem 2rem', fontSize: '1rem', width: '100%', animation: 'pulse 1.5s infinite', cursor: 'pointer' }}>
                              Start Screening Portal
                            </button>
                          </div>
                        </div>
                      );
                    case 3:
                      return (
                        <div style={{ padding: '1.5rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>Upload Multiple Views</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                            {[1, 2, 3, 4].map(idx => (
                              <div key={idx} style={{ border: '1.5px solid var(--secondary-forest)', borderRadius: '8px', padding: '0.5rem', background: '#FFF', textAlign: 'center', position: 'relative' }}>
                                <div style={{ width: '100%', height: '60px', background: '#F1ECE3', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📸</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '0.25rem' }}>View {idx}</div>
                                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--secondary-forest)', color: '#FFF', borderRadius: '50%', width: '14px', height: '14px', fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ border: '1px dashed rgba(15,76,92,0.3)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', background: '#FFF', fontSize: '0.75rem', color: 'var(--text-gray)' }}>
                            + Add another view (Maximum 5 images)
                          </div>
                        </div>
                      );
                    case 4:
                      return (
                        <div style={{ padding: '1.5rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.75rem' }}>Automated Image Suitability Checks</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#FFF', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF9F5', paddingBottom: '0.4rem' }}>
                              <span>✓ Sharpness check (Motion blur)</span>
                              <strong style={{ color: 'var(--secondary-forest)' }}>PASS (Good)</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF9F5', paddingBottom: '0.4rem' }}>
                              <span>✓ Brightness check (Under/Overexposed)</span>
                              <strong style={{ color: 'var(--secondary-forest)' }}>PASS (Good)</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF9F5', paddingBottom: '0.4rem' }}>
                              <span>✓ Visual details check (Obstructed view)</span>
                              <strong style={{ color: 'var(--secondary-forest)' }}>PASS (None)</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>✓ Duplicate check (Multiple same files)</span>
                              <strong style={{ color: 'var(--secondary-forest)' }}>PASS (Unique)</strong>
                            </div>
                          </div>
                        </div>
                      );
                    case 5:
                      return (
                        <div style={{ padding: '2rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', border: '4px solid rgba(15,76,92,0.1)', borderTopColor: 'var(--primary-teal)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                          <h4 style={{ color: 'var(--primary-teal)', margin: '1rem 0 0.5rem' }}>AI Multi-Image Screening...</h4>
                          <div style={{ width: '200px', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: '65%', height: '100%', background: 'var(--primary-teal)' }} />
                          </div>
                          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-gray)' }}>
                            Checking: MobileNet CNN Feature Extraction (65%)
                          </div>
                        </div>
                      );
                    case 6:
                      return (
                        <div style={{ padding: '1.25rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary-teal)' }}>AI Screening Summary</span>
                            <span style={{ background: 'rgba(231,111,81,0.1)', color: 'var(--accent-coral)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>MODERATE INDICATION</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '0.75rem 0' }}>
                            <div style={{ background: '#FFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                              <strong>Visual Finding Analysis:</strong>
                              <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem', fontSize: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <li>Asymmetry: Variation observed</li>
                                <li>Border: Scalloped edges</li>
                                <li>Color: Multi-color variance</li>
                              </ul>
                            </div>
                            <div style={{ background: '#FFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-gray)' }}>AI CONSISTENCY</span>
                              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary-forest)' }}>HIGH</span>
                              <span style={{ fontSize: '0.55rem', color: 'var(--text-gray)' }}>(4 of 4 views align)</span>
                            </div>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.65rem', color: 'var(--text-gray)' }}>
                            * Safety Notice: Visual screening is not a medical diagnosis. Seek professional dermatological clinical advice.
                          </div>
                        </div>
                      );
                    case 7:
                      return (
                        <div style={{ padding: '1.25rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>📄 Understand Your Result</h4>
                          <div style={{ background: '#FFF', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.7rem', color: '#444', lineHeight: '1.4' }}>
                            <strong>AI Analysis Explanation:</strong>
                            <p style={{ marginTop: '0.25rem', margin: 0 }}>
                              The models identified border asymmetry margins and pigment clustering of dark and light brown spots across the 4 analyzed images. While consistency rating is high, this screening represents statistical alignment with reference data, not a direct clinical verdict.
                            </p>
                          </div>
                        </div>
                      );
                    case 8:
                      return (
                        <div style={{ padding: '2rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ background: '#FFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', width: '280px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
                              <div style={{ width: '4px', height: '24px', background: 'var(--primary-teal)', borderRadius: '2px', animation: 'eqScale 0.7s ease infinite alternate' }} />
                              <div style={{ width: '4px', height: '36px', background: 'var(--primary-teal)', borderRadius: '2px', animation: 'eqScale 0.5s ease infinite alternate 0.2s' }} />
                              <div style={{ width: '4px', height: '16px', background: 'var(--primary-teal)', borderRadius: '2px', animation: 'eqScale 0.9s ease infinite alternate 0.4s' }} />
                              <div style={{ width: '4px', height: '28px', background: 'var(--primary-teal)', borderRadius: '2px', animation: 'eqScale 0.6s ease infinite alternate 0.6s' }} />
                            </div>
                            <h4 style={{ color: 'var(--primary-teal)', margin: '0.5rem 0' }}>🔊 Spoken Audio Explanation</h4>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-gray)' }}>Converting visual characteristics explanation into spoken narration.</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                              <span style={{ fontSize: '1.25rem' }}>⏸</span>
                              <div style={{ width: '100px', height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '45%', height: '100%', background: 'var(--primary-teal)' }} />
                              </div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-gray)' }}>0:12 / 0:45</span>
                            </div>
                          </div>
                        </div>
                      );
                    case 9:
                      return (
                        <div style={{ padding: '1.5rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', width: '320px', height: '160px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.75rem', color: '#FFF' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>
                              <span>🎥 Video Explainer</span>
                              <span>Scene 2 of 4</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, gap: '1.5rem' }}>
                              <div style={{ width: '50px', height: '50px', border: '2px dashed var(--accent-coral)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🔍</div>
                              <div style={{ fontSize: '0.7rem' }}>
                                <strong>Border Evolution</strong>
                                <div>Highlighting scallops</div>
                              </div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.25rem', borderRadius: '4px', fontSize: '0.6rem', textAlign: 'center' }}>
                              "The border scalloping represents atypical cell clustering margins."
                            </div>
                          </div>
                        </div>
                      );
                    case 10:
                      return (
                        <div style={{ padding: '1.5rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)' }}>Changing Language: English ➔ Telugu</span>
                            <span style={{ background: 'rgba(15,76,92,0.1)', color: 'var(--primary-teal)', padding: '0.2rem 0.4rem', borderRadius: '3px', fontSize: '0.6&apos;' }}>తమిళ / తెలుగు / హిందీ</span>
                          </div>
                          <div style={{ background: '#FFF', padding: '1rem', borderRadius: '8px', border: '1.5px solid var(--primary-teal)', fontSize: '0.7rem', lineHeight: '1.4' }}>
                            <strong style={{ color: 'var(--primary-teal)' }}>లక్షణాలు విశ్లేషణ (Telugu Result)</strong>
                            <p style={{ marginTop: '0.25rem', margin: 0, color: 'var(--text-dark)' }}>
                              మోడల్ చిత్రాలలో సరిహద్దు అసమానత మరియు వర్ణ వైవిధ్యాన్ని గుర్తించింది. ఈ స్క్రీనింగ్ వైద్య నిర్ధారణ కాదు.
                            </p>
                          </div>
                        </div>
                      );
                    case 11:
                      return (
                        <div style={{ padding: '1rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--primary-teal)', fontSize: '0.7rem' }}>🤖 Lens AI Assistant</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.5rem 0', flex: 1, overflowY: 'auto' }}>
                            <div style={{ alignSelf: 'flex-end', background: 'var(--primary-teal)', color: '#FFF', padding: '0.5rem 0.75rem', borderRadius: '12px 12px 2px 12px', maxWidth: '80%', fontSize: '0.65rem' }}>
                              What does my result mean?
                            </div>
                            <div style={{ alignSelf: 'flex-start', background: '#FFF', border: '1px solid rgba(0,0,0,0.05)', padding: '0.5rem 0.75rem', borderRadius: '12px 12px 12px 2px', maxWidth: '80%', fontSize: '0.65rem', lineHeight: '1.3' }}>
                              Moderate risk indicates that visual attributes like color variation and border margins show atypical patterns. It suggests scheduling a dermatologist review.
                            </div>
                          </div>
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.4rem', display: 'flex', gap: '0.5rem' }}>
                            <div style={{ flex: 1, background: '#FFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', color: 'var(--text-gray)' }}>Type message...</div>
                            <button className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}>Send</button>
                          </div>
                        </div>
                      );
                    case 12:
                      return (
                        <div style={{ padding: '1.25rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>📅 Skin Story Timeline Comparison</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#FFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>JUNE (Baseline)</div>
                              <div style={{ width: '80px', height: '60px', background: '#FAF9F6', borderRadius: '4px', margin: '0.25rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🟢</div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--secondary-forest)', fontWeight: 'bold' }}>Stable Spot</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>AUGUST (Current)</div>
                              <div style={{ width: '80px', height: '60px', background: '#FAF9F6', borderRadius: '4px', margin: '0.25rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🟠</div>
                              <div style={{ fontSize: '0.6rem', color: 'var(--accent-coral)', fontWeight: 'bold' }}>Moderate Change</div>
                            </div>
                          </div>
                        </div>
                      );
                    case 13:
                      return (
                        <div style={{ padding: '1rem', height: '100%', background: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>📄 Generate Doctor Summary</h4>
                          <div style={{ background: '#FFF', border: '1.5px solid var(--primary-teal)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.65rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--primary-teal)', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 'bold' }}>DERMALENS CLINICAL REPORT</span>
                              <span>ID: DL-MEMBER-AUG26</span>
                            </div>
                            <div><strong>Case Indication:</strong> MODERATE RISK</div>
                            <div><strong>Consistency Index:</strong> HIGH (4 views analyzed)</div>
                            <div><strong>Symmetry Index:</strong> Variation flagged in margin borders</div>
                            <div style={{ marginTop: '0.5rem', background: '#FAF9F6', border: '1px solid rgba(0,0,0,0.05)', padding: '0.25rem', borderRadius: '3px', fontSize: '0.55rem', color: 'var(--text-gray)' }}>
                              * Ready to print or share directly with your clinical dermatologist.
                            </div>
                          </div>
                        </div>
                      );
                    case 14:
                      return (
                        <div style={{ padding: '2rem', height: '100%', background: 'rgba(231,111,81,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                          <span style={{ fontSize: '2.5rem' }}>⚠️</span>
                          <h3 style={{ color: 'var(--accent-coral)', margin: '0.5rem 0 0.25rem' }}>AI Screening &ne; Diagnosis</h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)', maxWidth: '300px', margin: 0, fontWeight: '500', lineHeight: '1.4' }}>
                            DermaLens AI is for visual changes screening and doctor report compilation. It does not replace a clinical dermatologist biopsy or diagnosis.
                          </p>
                        </div>
                      );
                    case 15:
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #0F4C5C 0%, #0d3b48 100%)', color: '#FFF', padding: '2rem', textAlign: 'center' }}>
                          <h3 style={{ fontSize: '1.5rem', fontFamily: 'serif', margin: '0 0 0.5rem' }}>DermaLens AI Walkthrough</h3>
                          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 1.5rem' }}>
                            See it. Understand it. Act responsibly.
                          </p>
                          <button className="btn btn-accent" onClick={() => { setShowDemoModal(false); startScreening(); }} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            Start Screening Now
                          </button>
                        </div>
                      );
                    default:
                      return null;
                  }
                })()}
              </div>

              {/* Subtitles Overlay */}
              <div style={{ position: 'absolute', bottom: '20px', left: '5%', right: '5%', background: 'rgba(0,0,0,0.75)', color: '#FFF', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none', lineHeight: '1.4' }}>
                <strong>{activeScene.title}: </strong>
                <span>{activeScene.text}</span>
              </div>
            </div>

            {/* Video Control Bar */}
            <div style={{ padding: '0.75rem 1.5rem', background: '#1C1C1E', color: '#FFF', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Progress Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', width: '30px' }}>
                  {Math.floor(demoTime / 60)}:{(demoTime % 60).toString().padStart(2, '0')}
                </span>
                <input 
                  type="range"
                  min={0}
                  max={totalDuration}
                  value={demoTime}
                  onChange={(e) => {
                    const newTime = parseInt(e.target.value);
                    setDemoTime(newTime);
                    if (demoPlaying) {
                      const idx = getActiveSceneIndex(newTime);
                      playDemoSpeech(scenes[idx].text);
                    }
                  }}
                  style={{ flex: 1, accentColor: 'var(--primary-teal)', cursor: 'pointer', height: '4px' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', width: '30px' }}>
                  {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  
                  {/* Play / Pause */}
                  <button 
                    onClick={() => setDemoPlaying(!demoPlaying)}
                    style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {demoPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>

                  {/* Replay */}
                  <button 
                    onClick={() => {
                      setDemoTime(0);
                      setDemoPlaying(true);
                      playDemoSpeech(scenes[0].text);
                    }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    ↻ Replay
                  </button>

                  {/* Volume / Mute */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                    <button 
                      onClick={() => setDemoMuted(!demoMuted)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      {demoMuted ? "🔇 Mute" : "🔊 Vol"}
                    </button>
                    <input 
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={demoMuted ? 0 : demoVolume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setDemoVolume(v);
                        setDemoMuted(v === 0);
                        if (demoUtteranceRef.current) {
                          demoUtteranceRef.current.volume = v;
                        }
                      }}
                      style={{ width: '60px', accentColor: 'var(--primary-teal)', cursor: 'pointer', height: '3px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Scene {activeSceneIdx + 1} / {scenes.length}
                  </span>
                  
                  {/* Close button */}
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowDemoModal(false)}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', borderRadius: '4px', background: 'none', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
