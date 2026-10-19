'use client';

import React from 'react';
import { 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  RefreshIcon, 
  HomeIcon, 
  InfoIcon, 
  ActivityIcon,
  LayersIcon,
  PrinterIcon,
  ShieldCheckIcon,
  WaveformIcon
} from './Icons';
import CausalAnalysisCard from './CausalAnalysisCard';

export default function ResultPage({ result, onAnalyseAnother, onBackHome }) {
  if (!result) return null;

  const pattern = result.pattern || result.prediction || 'Normal';
  const isNormal = pattern.toLowerCase() === 'normal';

  const percentage = result.percentage !== undefined
    ? result.percentage
    : (result.probability ? Math.round(result.probability * 10000) / 100 : (result.confidence ? Math.round(result.confidence * 100) : 50));

  const nFeatures = result.n_features || 102;
  const possibleConditions = Array.isArray(result.possible_conditions) && result.possible_conditions.length > 0
    ? result.possible_conditions
    : (isNormal ? ['Healthy Respiratory Function', 'Clear Airways'] : ['Asthma Airway Obstruction', 'Chronic Bronchitis', 'COPD Wheezing']);

  const formattedTypeMap = {
    'breathing-deep': 'Deep Vesicular Breathing',
    'breathing-shallow': 'Shallow Respiration',
    'cough-heavy': 'Thoracic Cough Reflex',
    'cough-shallow': 'Laryngeal Cough Clearing',
  };
  const analysisTypeTitle = formattedTypeMap[result.analysisType] || result.analysisType || 'Respiratory Sound Assessment';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="result-container">
      {/* Clinical Session Verification Header */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', padding: '12px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-success">
            <ShieldCheckIcon size={14} />
            <span>KAUH Dataset Ensemble</span>
          </span>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            102 Extracted Acoustic Descriptors (MFCC, Spectral Rolloff & ZCR)
          </span>
        </div>

        <button 
          type="button" 
          onClick={handlePrint} 
          className="btn-secondary btn-sm"
          title="Print or export screening summary"
        >
          <PrinterIcon size={14} />
          <span>Print Summary</span>
        </button>
      </div>

      {/* Main Clinical Assessment Finding Card */}
      <div className={`clean-card result-card ${isNormal ? 'result-healthy' : 'result-risk'}`}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isNormal ? 'var(--status-normal-bg)' : 'var(--status-alert-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isNormal ? (
            <CheckCircleIcon size={38} className="text-emerald" />
          ) : (
            <AlertTriangleIcon size={38} className="text-rose" />
          )}
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Acoustic Pattern Finding
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: isNormal ? 'var(--status-normal-text)' : 'var(--status-alert-text)', marginTop: '2px' }}>
            {pattern}
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '8px auto 0', lineHeight: 1.5 }}>
            {isNormal 
              ? 'Acoustic waveform analysis indicates normal vesicular respiratory sounds without audible signs of bronchospasm, continuous wheezes, or inspiratory crackles.'
              : 'Acoustic waveform analysis identified spectral characteristics consistent with adventitious respiratory patterns. Compare against clinical symptoms and consult a physician.'}
          </p>
        </div>

        {/* Confidence Gauge Box */}
        <div className="confidence-box" style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Model Pattern Confidence
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: isNormal ? 'var(--status-normal)' : 'var(--status-alert)' }}>
                {percentage}%
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>calibrated</span>
            </div>
          </div>

          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${Math.min(100, Math.max(0, percentage))}%`, 
                background: isNormal ? 'var(--status-normal)' : 'var(--status-alert)',
                borderRadius: '4px',
                transition: 'width 0.8s ease'
              }}
            ></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span>Uncertain (&lt;50%)</span>
            <span>Borderline (50-70%)</span>
            <span>High Agreement (&gt;70%)</span>
          </div>
        </div>

        {/* Correlated Clinical Phenotypes */}
        <div style={{ width: '100%', maxWidth: '480px', textAlign: 'left', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ActivityIcon size={16} className="text-emerald" />
            <span>Dataset-Correlated Clinical Patterns</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {possibleConditions.map((cond, idx) => (
              <span 
                key={idx} 
                style={{ 
                  fontSize: '0.82rem', 
                  padding: '3px 10px', 
                  borderRadius: 'var(--radius-full)', 
                  background: '#ffffff', 
                  border: '1px solid var(--border-light)', 
                  color: 'var(--text-main)',
                  fontWeight: 500
                }}
              >
                {cond}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Causal AI Reasoning & Actionable Precautions */}
      <CausalAnalysisCard pattern={pattern} causalData={result.causal_analysis} />

      {/* Acoustic Engineering & Feature Extraction Card */}
      <div className="clean-card" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <WaveformIcon size={20} className="text-emerald" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            Acoustic Signal Processing & Feature Highlights
          </h3>
        </div>

        <div className="metrics-summary-grid">
          <div className="summary-item">
            <span className="summary-label">Sound Protocol</span>
            <span className="summary-value">{analysisTypeTitle}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Signal Source</span>
            <span className="summary-value truncate">{result.fileName || 'Audio Recording'}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Feature Vector</span>
            <span className="summary-value">{nFeatures} Acoustic Dimensions</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Sample Rate</span>
            <span className="summary-value">48,000 Hz Mono</span>
          </div>
        </div>
      </div>

      {/* Non-Diagnostic Clinical Research Disclaimer */}
      <div className="disclaimer-box">
        <InfoIcon size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
        <span>
          <strong>Research Advisory:</strong> This acoustic screening model was developed for research in breath pattern monitoring. Acoustic classifications reflect dataset distributions and do not constitute a clinical diagnosis or medical clearance. If experiencing respiratory distress, chest tightness, or persistent cough, seek immediate clinical care.
        </span>
      </div>

      {/* Bottom Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          type="button" 
          onClick={onAnalyseAnother} 
          className="btn-primary"
          style={{ minWidth: '210px' }}
        >
          <RefreshIcon size={18} />
          <span>Screen Another Sample</span>
        </button>

        <button 
          type="button" 
          onClick={onBackHome} 
          className="btn-secondary"
          style={{ minWidth: '160px' }}
        >
          <HomeIcon size={18} />
          <span>Overview</span>
        </button>
      </div>
    </div>
  );
}
