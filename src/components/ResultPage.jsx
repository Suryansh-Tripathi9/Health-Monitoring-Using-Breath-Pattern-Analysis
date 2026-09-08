'use client';

import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, RefreshIcon, HomeIcon, InfoIcon } from './Icons';

export default function ResultPage({ result, onAnalyseAnother, onBackHome }) {
  if (!result) return null;

  const isPositive = result.prediction === 1 || result.label === 'Positive-associated';
  const labelText = result.label || (isPositive ? 'Positive-associated' : 'Reference');
  const percentage = result.percentage !== undefined ? result.percentage : (result.probability ? Math.round(result.probability * 10000) / 100 : (result.confidence ? Math.round(result.confidence * 100) : 50));
  
  const formattedTypeMap = {
    'breathing-deep': 'Deep Breathing',
    'breathing-shallow': 'Shallow Breathing',
    'cough-heavy': 'Heavy Cough',
    'cough-shallow': 'Shallow Cough',
  };
  const analysisTypeTitle = formattedTypeMap[result.analysisType] || result.analysisType || 'Breathing Pattern Analysis';

  return (
    <div className="result-container">
      {/* Model Verification Tag */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
            ⚡ Powered by breathing_random_forest.pkl (Random Forest, 512 Features)
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Spectrogram Shape: [128, 512]
        </span>
      </div>

      {/* Outcome Card */}
      <div className={`clean-card result-card ${!isPositive ? 'result-healthy' : 'result-risk'}`}>
        <div>
          {!isPositive ? (
            <CheckCircleIcon size={56} className="text-emerald" />
          ) : (
            <AlertTriangleIcon size={56} className="text-rose" />
          )}
        </div>

        <h1 className="result-headline" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {labelText}
        </h1>

        <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', maxWidth: '560px', textAlign: 'center' }}>
          {result.message || (isPositive 
            ? 'The audio pattern is associated with the positive class in the dataset.'
            : 'The audio pattern is associated with the reference class in the dataset.')}
        </p>

        <div className="confidence-box" style={{ marginTop: '1rem', width: '100%', maxWidth: '420px' }}>
          <div className="confidence-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Model Score (Positive Probability)</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: isPositive ? '#e11d48' : '#10b981' }}>{percentage}%</span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${Math.min(100, Math.max(0, percentage))}%`, 
                background: isPositive ? '#e11d48' : '#10b981' 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Summary Grid Card */}
      <div className="clean-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Analysis Sample Metrics</h3>

        <div className="metrics-summary-grid">
          <div className="summary-item">
            <span className="summary-label">Analysis Type</span>
            <span className="summary-value">{analysisTypeTitle}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Audio File</span>
            <span className="summary-value truncate">{result.fileName || 'Audio Clip'}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Prediction Label</span>
            <span className={`summary-value ${!isPositive ? 'text-emerald' : 'text-rose'}`}>
              {labelText}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Timestamp</span>
            <span className="summary-value">{result.timestamp || 'Just now'}</span>
          </div>
        </div>
      </div>

      {/* Academic Disclaimer Box */}
      <div className="disclaimer-box">
        <InfoIcon size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
        <span>
          <strong>Disclaimer:</strong> {result.disclaimer || 'This is a research prototype and not a medical diagnostic system.'}
          <br />
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
            Note: This result represents the model's association with health-status labels in the research dataset. It is not a medical diagnosis.
          </span>
        </span>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button type="button" onClick={onAnalyseAnother} className="btn-primary">
          <RefreshIcon size={18} />
          <span>Analyse Another Sample</span>
        </button>

        <button type="button" onClick={onBackHome} className="btn-secondary">
          <HomeIcon size={18} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}
