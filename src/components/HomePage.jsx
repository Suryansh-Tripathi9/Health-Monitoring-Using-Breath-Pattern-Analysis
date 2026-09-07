import React from 'react';
import { MicIcon, LungsIcon, ActivityIcon, ArrowRightIcon, InfoIcon } from './Icons';

export default function HomePage({ onStartCheck }) {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-box">
        <span className="badge badge-primary">AI-Assisted Diagnostics Prototype</span>

        <h1 className="hero-title">
          Health Monitoring Using<br />Breath Pattern Analysis
        </h1>

        <p className="hero-subtitle">
          AI-assisted analysis of breathing and cough patterns for preliminary health monitoring.
        </p>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px 20px', borderRadius: '12px', color: '#475569', fontSize: '0.92rem', maxWidth: '640px' }}>
          A signal processing prototype designed to evaluate acoustic respiration and cough patterns for non-invasive health estimation.
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={onStartCheck} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <span>Start Health Check</span>
            <ArrowRightIcon size={20} />
          </button>
        </div>

        <div className="disclaimer-box" style={{ maxWidth: '640px', marginTop: '0.5rem' }}>
          <InfoIcon size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
          <span>
            <strong>Academic Disclaimer:</strong> This prototype is intended for academic demonstration only and is not a medical diagnostic tool.
          </span>
        </div>
      </section>

      {/* Capability Cards Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, textAlign: 'center' }}>
          Core Prototype Capabilities
        </h2>

        <div className="cards-grid-3">
          {/* Card 1 */}
          <div className="clean-card capability-card">
            <div className="card-icon-box">
              <MicIcon size={26} />
            </div>
            <h3>🎙️ Breath Analysis</h3>
            <p>
              Deep and shallow acoustic pattern analysis with automated background signal filtering.
            </p>
          </div>

          {/* Card 2 */}
          <div className="clean-card capability-card">
            <div className="card-icon-box">
              <LungsIcon size={26} />
            </div>
            <h3>🫁 Pattern Detection</h3>
            <p>
              Evaluation of respiration cadence, cough spectral characteristics, and airflow regularity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="clean-card capability-card">
            <div className="card-icon-box">
              <ActivityIcon size={26} />
            </div>
            <h3>📊 Health Risk Estimation</h3>
            <p>
              Confidence-scored estimation comparing sample acoustic features against trained healthy baselines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
