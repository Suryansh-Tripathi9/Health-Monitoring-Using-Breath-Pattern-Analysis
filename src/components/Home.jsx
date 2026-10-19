'use client';

import React from 'react';
import { Mic, Activity, BarChart3, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Home({ onStart }) {
  const capabilities = [
    {
      icon: <Mic size={24} style={{ color: '#38bdf8' }} />,
      title: '🎙️ Breath & Cough Audio Analysis',
      description: 'Capture high-resolution breathing acoustics or cough recordings directly from your microphone or file uploads.',
      tag: 'Acoustic Input'
    },
    {
      icon: <Activity size={24} style={{ color: '#34d399' }} />,
      title: '🫁 Acoustic Pattern Detection',
      description: 'Pre-processes raw audio signals to isolate spectral frequencies and breath rhythm characteristics.',
      tag: 'Feature Extraction'
    },
    {
      icon: <BarChart3 size={24} style={{ color: '#fbbf24' }} />,
      title: '📊 Respiratory Assessment',
      description: 'Evaluates breath frequency dynamics against baseline indicators with pattern confidence metrics.',
      tag: 'Pattern Scoring'
    }
  ];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '48px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div className="badge badge-primary">
          <Sparkles size={14} /> Research Prototype
        </div>

        <h1 className="gradient-title" style={{
          fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
          fontWeight: 800,
          lineHeight: 1.2,
          maxWidth: '850px'
        }}>
          Health Monitoring Using Breath Pattern Analysis
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '720px',
          lineHeight: 1.6
        }}>
          AI-assisted analysis of breathing and cough patterns for preliminary health monitoring research.
        </p>

        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-dim)',
          maxWidth: '650px'
        }}>
          This research prototype demonstrates non-invasive acoustic pattern evaluation. Model compares acoustic features with patterns learned from the KAUH reference dataset.
        </p>

        {/* Primary CTA */}
        <div style={{ marginTop: '12px' }}>
          <button 
            onClick={onStart}
            className="btn-primary"
            style={{ fontSize: '1.1rem', padding: '16px 36px' }}
          >
            Start Health Check <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* 3 Capability Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginTop: '10px'
      }}>
        {capabilities.map((cap, idx) => (
          <div 
            key={idx}
            className="glass-panel"
            style={{
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cap.icon}
              </div>
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600
              }}>
                {cap.tag}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>
              {cap.title}
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              {cap.description}
            </p>
          </div>
        ))}
      </div>

      {/* Academic Disclaimer Box */}
      <div className="disclaimer-box" style={{ marginTop: '10px' }}>
        <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#fbbf24' }} />
        <div>
          <strong style={{ color: '#fef08a', display: 'block', marginBottom: '2px' }}>Academic Disclaimer</strong>
          Research prototype for respiratory health monitoring. Possible associations are dataset-derived and are not a medical diagnosis.
        </div>
      </div>
    </div>
  );
}
