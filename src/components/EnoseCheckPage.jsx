'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRightIcon, 
  InfoIcon, 
  ActivityIcon, 
  BeakerIcon, 
  RotateCcwIcon, 
  LayersIcon, 
  DatabaseIcon,
  ShieldCheckIcon
} from './Icons';
import predictionService from '../services/predictionService';

const DEFAULT_BASELINE = [
  '0.989', '0.997', '1.007', '1.013', '1.031', '0.977', '1.007', '1.041', '0.968', '0.961'
];

export default function EnoseCheckPage({ onAnalyseEnose, onBackToHome }) {
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [features, setFeatures] = useState(DEFAULT_BASELINE);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPresets() {
      const data = await predictionService.fetchEnosePresets();
      if (data && data.length > 0) {
        setPresets(data);
      }
    }
    loadPresets();
  }, []);

  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const found = presets.find((p) => p.id === presetId);
    if (found && found.features) {
      setFeatures(found.features.map(val => String(val)));
      setErrorMsg('');
    }
  };

  const handleFeatureChange = (index, val) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
    setSelectedPresetId('');
    setErrorMsg('');
  };

  const handleResetBaseline = () => {
    setFeatures(DEFAULT_BASELINE);
    setSelectedPresetId('');
    setErrorMsg('');
  };

  const handleRunAnalysis = async () => {
    setErrorMsg('');

    if (features.length !== 10) {
      setErrorMsg('Exactly 10 sensor channel values are required.');
      return;
    }

    const numFeatures = [];
    for (let i = 0; i < 10; i++) {
      const raw = features[i]?.trim();
      if (raw === '' || raw === undefined) {
        setErrorMsg(`Sensor Channel S${i + 1} is empty. Please enter a valid numerical value.`);
        return;
      }
      const num = parseFloat(raw);
      if (isNaN(num) || !isFinite(num)) {
        setErrorMsg(`Sensor Channel S${i + 1} ('${raw}') is not a valid number.`);
        return;
      }
      numFeatures.push(num);
    }

    setIsSubmitting(true);
    try {
      const result = await predictionService.predictEnose(numFeatures);
      onAnalyseEnose(result);
    } catch (err) {
      console.error('E-Nose analysis failed:', err);
      setErrorMsg(err.message || 'E-nose sensor inference failed. Please verify the ML service is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="health-check-container" style={{ maxWidth: '900px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <span className="badge badge-teal">
            <BeakerIcon size={14} />
            <span>Gas Sensing Modality</span>
          </span>
          <span className="badge badge-primary">
            <DatabaseIcon size={14} />
            <span>10-Channel MOX Array</span>
          </span>
        </div>

        <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          E-Nose Sensor Array Workbench
        </h1>
        <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
          Evaluate 10-channel semiconductor gas sensor responses against the calibrated Random Forest model to classify binary gas mixture compositions (NH₃ Ammonia & H₂ Hydrogen).
        </p>
      </div>

      {/* Calibrated Mixture Presets Card */}
      <div className="clean-card" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span className="section-label-step" style={{ margin: 0 }}>
              Calibrated Gas Mixture Reference Library
            </span>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Load authentic sensor response vectors from the reference dataset
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>
            35 Trained Mixture Classes
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          {presets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`btn-secondary btn-sm ${isSelected ? 'active' : ''}`}
                style={{
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-light)',
                  background: isSelected ? 'var(--primary-subtle)' : '#ffffff',
                  color: isSelected ? 'var(--primary-text)' : 'var(--text-main)',
                  boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BeakerIcon size={14} className={isSelected ? 'text-primary' : 'text-muted'} />
                  <span style={{ fontWeight: 600 }}>{preset.name}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {preset.gas_a !== undefined ? `${preset.gas_a} / ${preset.gas_b}` : 'Vector'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10-Channel Sensor Input Matrix */}
      <div className="clean-card" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span className="section-label-step" style={{ margin: 0 }}>
              Sensor Array Matrix • 10 Active Channels
            </span>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Normalized steady-state response amplitude (ΔG/G₀ or ΔR/R₀)
            </div>
          </div>

          <button 
            type="button"
            onClick={handleResetBaseline}
            className="btn-secondary btn-sm"
          >
            <RotateCcwIcon size={14} />
            <span>Reset to Baseline</span>
          </button>
        </div>

        {/* 10 Inputs Grid */}
        <div className="enose-channel-grid">
          {features.map((val, idx) => (
            <div key={idx} className="enose-channel-cell">
              <div className="enose-channel-label">
                <span>Channel S{idx + 1}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 400 }}>MOX</span>
              </div>
              <input
                id={`feature-${idx + 1}`}
                type="number"
                step="any"
                value={val}
                onChange={(e) => handleFeatureChange(idx, e.target.value)}
                className="enose-channel-input"
                placeholder="1.000"
              />
            </div>
          ))}
        </div>

        {/* Visual Response Bar Chart */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Real-Time Channel Response Profile
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Array profile visualization
            </span>
          </div>

          <div className="sensor-response-bars">
            {features.map((val, idx) => {
              const num = parseFloat(val) || 0;
              // Normalize visually around 1.0 (e.g. range 0.8 to 1.2 maps to 20% to 100%)
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
        </div>

        {errorMsg && (
          <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'var(--status-alert-bg)', border: '1px solid var(--status-alert-border)', borderRadius: 'var(--radius-sm)', color: 'var(--status-alert-text)', fontSize: '0.88rem' }}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Scientific Research Disclaimer */}
      <div className="disclaimer-box">
        <InfoIcon size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
        <span>
          <strong>Instrumentation Context:</strong> The E-Nose module classifies volatile binary gas mixtures based on multi-channel cross-reactive sensor array signatures. It serves as an experimental prototype for chemical biomarker screening and does not provide an invasive physiological or medical diagnosis.
        </span>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <button type="button" onClick={onBackToHome} className="btn-secondary">
          Back to Overview
        </button>

        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isSubmitting}
          className="btn-primary"
          style={{ minWidth: '220px' }}
        >
          <span>{isSubmitting ? 'Computing Sensor Inference...' : 'Analyze Sensor Array'}</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}
