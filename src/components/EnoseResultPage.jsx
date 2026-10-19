'use client';

import React from 'react';
import { 
  ActivityIcon, 
  InfoIcon, 
  CheckCircleIcon, 
  BeakerIcon, 
  PrinterIcon, 
  RefreshIcon, 
  HomeIcon,
  ShieldCheckIcon,
  LayersIcon
} from './Icons';

export default function EnoseResultPage({ result, onAnalyseAnother, onBackHome }) {
  if (!result) return null;

  const {
    prediction,
    confidence,
    percentage,
    gas_a,
    gas_b,
    features,
    disclaimer
  } = result;

  const displayPercentage = percentage !== undefined 
    ? percentage 
    : (confidence ? Math.round(confidence * 10000) / 100 : 95.0);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="result-container" style={{ maxWidth: '860px' }}>
      {/* Session Verification Header */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', padding: '12px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-teal">
            <BeakerIcon size={14} />
            <span>MOX Sensor Array Engine</span>
          </span>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Random Forest Classifier • 10 Active Sensor Channels • 35 Calibrated Classes
          </span>
        </div>

        <button 
          type="button" 
          onClick={handlePrint} 
          className="btn-secondary btn-sm"
          title="Print or export report"
        >
          <PrinterIcon size={14} />
          <span>Print Summary</span>
        </button>
      </div>

      {/* Primary Chemical Mixture Finding Card */}
      <div className="clean-card result-card result-healthy">
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
          <BeakerIcon size={36} />
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Gas-Mixture Array Classification
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            Mixture Class {prediction}
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '8px auto 0', lineHeight: 1.5 }}>
            Identified dataset signature match for multi-channel semiconductor response. Reference class index {prediction} out of 35 trained mixture configurations.
          </p>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', width: '100%', marginTop: '0.5rem' }}>
          {/* Ammonia */}
          <div className="summary-item" style={{ textAlign: 'left', background: 'var(--bg-subtle)' }}>
            <span className="summary-label">Ammonia (NH₃) Target</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
              {gas_a !== null && gas_a !== undefined ? `${gas_a} ppm` : 'Reference Class'}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Dataset reference concentration</span>
          </div>

          {/* Hydrogen */}
          <div className="summary-item" style={{ textAlign: 'left', background: 'var(--bg-subtle)' }}>
            <span className="summary-label">Hydrogen (H₂) Target</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--teal-text)' }}>
              {gas_b !== null && gas_b !== undefined ? `${gas_b} ppm` : 'Reference Class'}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Dataset reference concentration</span>
          </div>

          {/* Probability */}
          <div className="summary-item" style={{ textAlign: 'left', background: 'var(--bg-subtle)' }}>
            <span className="summary-label">Model Confidence</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-normal)' }}>
              {displayPercentage}%
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Random Forest class probability</span>
          </div>
        </div>

        {/* Clinical Biomarker Relevance Box */}
        <div style={{ width: '100%', textAlign: 'left', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginTop: '0.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ActivityIcon size={18} className="text-emerald" />
            <span>Biomedical Relevance in Exhaled Breath Analysis</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <p>
              <strong>Ammonia (NH₃):</strong> Exhaled breath ammonia arises from blood urea nitrogen hydrolysis. In clinical research, elevated breath ammonia is investigated as a non-invasive surrogate biomarker for impaired renal function (uremia) and hepatic portal encephalopathy.
            </p>
            <p>
              <strong>Hydrogen (H₂):</strong> Exhaled molecular hydrogen is produced almost exclusively by anaerobic fermentation of unabsorbed carbohydrates by colonic microflora. Breath hydrogen testing is widely recognized in gastroenterology for lactose malabsorption and Small Intestinal Bacterial Overgrowth (SIBO).
            </p>
          </div>
        </div>
      </div>

      {/* 10 Sensor Array Visual Profile */}
      {features && Array.isArray(features) && (
        <div className="clean-card" style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayersIcon size={18} className="text-emerald" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                10-Channel Sensor Response Fingerprint
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Normalized amplitude vector
            </span>
          </div>

          <div className="sensor-response-bars" style={{ height: '110px', marginBottom: '1.25rem' }}>
            {features.map((val, idx) => {
              const num = parseFloat(val) || 0;
              const clamped = Math.max(0.7, Math.min(1.3, num));
              const heightPct = Math.round(((clamped - 0.7) / 0.6) * 100);
              return (
                <div key={idx} className="sensor-bar-column">
                  <div 
                    className="sensor-bar-rect" 
                    style={{ 
                      height: `${heightPct}%`,
                      background: idx % 2 === 0 ? 'var(--primary)' : 'var(--teal-accent)'
                    }}
                    title={`Channel S${idx + 1}: ${num}`}
                  ></div>
                  <span className="sensor-bar-label">S{idx + 1}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            {features.map((val, idx) => (
              <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>S{idx + 1}:</span>
                <strong style={{ color: 'var(--text-main)' }}>{val}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Disclaimer */}
      <div className="disclaimer-box">
        <InfoIcon size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
        <span>
          <strong>Academic & Scientific Disclaimer:</strong> {disclaimer || "This module performs gas-mixture classification using a reference e-nose dataset. It is a research prototype and does not provide medical diagnosis."}
        </span>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          type="button" 
          onClick={onAnalyseAnother} 
          className="btn-primary"
          style={{ minWidth: '220px' }}
        >
          <RefreshIcon size={18} />
          <span>Screen Another Sensor Sample</span>
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
