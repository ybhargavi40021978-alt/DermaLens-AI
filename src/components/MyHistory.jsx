import React, { useEffect, useState } from 'react';
import { getHistory } from '../api/client';
import { CameraOff, Clock, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export default function MyHistory({ 
  setTab, 
  setSessionId, 
  setUploadedImages, 
  setApiResult, 
  setScreeningState, 
  setIsApiMode 
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      setLoading(false);
      return;
    }

    getHistory(guestId)
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to load history: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const handleSelectSession = (session) => {
    setSessionId(session.session_id);
    setApiResult(session.result);
    setUploadedImages(session.images || []);
    setIsApiMode(true);
    setScreeningState('complete');
    setTab('scan');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(15,76,92,0.1)', borderTopColor: 'var(--primary-teal)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-gray)' }}>Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(231,111,81,0.05)', borderRadius: '12px', border: '1px solid rgba(231,111,81,0.15)' }}>
        <ShieldAlert size={48} color="var(--accent-coral)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Unable to load history</h3>
        <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem' }}>{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(15,76,92,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Clock size={36} color="var(--primary-teal)" />
        </div>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-teal)', marginBottom: '0.75rem' }}>No screening history found</h3>
        <p style={{ color: 'var(--text-gray)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          You haven't run any AI screenings on this browser yet, or you are visiting for the first time.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => setTab('scan')}
          style={{ padding: '0.75rem 2rem' }}
        >
          Start AI Screening <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h2>Your Screening History</h2>
        <p style={{ color: 'var(--text-gray)' }}>Previously analyzed skin screenings stored locally on this browser.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {history.map((session) => {
          const result = session.result || {};
          const images = session.images || [];
          const firstImageSrc = images[0]?.src;
          const overallResult = result.overallResult || 'UNCERTAIN';
          const confidence = result.confidence !== undefined ? `${result.confidence}%` : 'N/A';
          const classification = result.classification || 'Skin spot evaluation';
          const formattedDate = new Date(session.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          // Determine risk colors
          let badgeText = '';
          let badgeBg = 'rgba(128,128,128,0.15)';
          let badgeColor = '#616161';
          if (overallResult === 'HIGH') {
            badgeBg = 'rgba(211,47,47,0.15)';
            badgeColor = '#D32F2F';
            badgeText = '🔴 HIGH RISK';
          } else if (overallResult === 'MODERATE') {
            badgeBg = 'rgba(245,127,23,0.15)';
            badgeColor = '#F57F17';
            badgeText = '🟡 MODERATE RISK';
          } else if (overallResult === 'LOW') {
            badgeBg = 'rgba(46,125,50,0.15)';
            badgeColor = '#2E7D32';
            badgeText = '🟢 LOW RISK';
          } else {
            badgeBg = 'rgba(128,128,128,0.15)';
            badgeColor = '#616161';
            badgeText = '⚪ UNCERTAIN';
          }

          return (
            <div 
              key={session.session_id} 
              className="glass-card hover-card"
              onClick={() => handleSelectSession(session)}
              style={{ 
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              {/* Thumbnail Container */}
              <div style={{ height: '200px', width: '100%', position: 'relative', background: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {firstImageSrc ? (
                  <img 
                    src={firstImageSrc} 
                    alt="Screening thumbnail" 
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <CameraOff size={48} color="var(--text-gray)" style={{ opacity: 0.5 }} />
                )}
                
                {/* Risk Level Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px',
                  background: badgeBg,
                  color: badgeColor,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {badgeText}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-teal)', margin: 0, lineHeight: '1.3' }}>
                    {classification}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                  <Award size={14} color="var(--primary-teal)" />
                  <span>AI Confidence: <strong>{confidence}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: 'auto' }}>
                  <Clock size={14} />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
