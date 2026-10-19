'use client';

import React from 'react';
import { WaveformIcon, ActivityIcon, ArrowRightIcon, ShieldCheckIcon, SparklesIcon, LungsIcon } from './Icons';

export default function HomePage({ onStartAudioCheck, onStartEnoseCheck }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge badge-primary">Multimodal Health Sensing Architecture</span>
          <span className="badge badge-teal">Causal AI Enhanced</span>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0f172a' }}>
          Non-Invasive Breath Pattern Analysis & Screening
        </h1>

        <p style={{ fontSize: '1.08rem', color: '#475569', lineHeight: 1.6, maxWidth: '680px' }}>
          An AI-assisted platform evaluating acoustic respiratory sound biomarkers and chemical gas sensor array patterns for intelligent health monitoring.
        </p>

        {/* Quick Launch Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            onClick={onStartAudioCheck} 
            className="btn-primary" 
            style={{ padding: '12px 26px', fontSize: '0.98rem' }}
          >
            <WaveformIcon size={18} />
            <span>Launch Acoustic Sound Screening</span>
            <ArrowRightIcon size={16} />
          </button>

          <button 
            type="button" 
            onClick={onStartEnoseCheck} 
            className="btn-secondary" 
            style={{ padding: '12px 24px', fontSize: '0.98rem' }}
          >
            <ActivityIcon size={18} />
            <span>Open E-Nose Sensor Lab</span>
          </button>
        </div>
      </section>

      {/* Two Modality Hub Cards */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Select Screening Modality
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
              Choose between acoustic lung sound analysis or multi-sensor chemical array profiling.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Acoustic Breath Screening */}
          <div className="clean-card card-interactive" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WaveformIcon size={22} />
                </div>
                <span className="badge badge-primary">Primary Clinical Engine</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Acoustic Respiratory Analysis
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                Evaluates breath and cough auscultation recordings using a 102-point spectral feature pipeline to identify adventitious sound patterns and associated medical conditions.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem', fontSize: '0.85rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span><strong>102 Spectral Descriptors</strong> (MFCCs, spectral contrast, ZCR)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span><strong>Pattern Classification</strong> (Normal, Wheeze, Crackle)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span><strong>Causal AI Reasoning</strong> (Root triggers & self-care precautions)</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={onStartAudioCheck} 
              className="btn-primary" 
              style={{ width: '100%', padding: '11px', fontSize: '0.92rem' }}
            >
              <span>Begin Audio Screening</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Card 2: E-Nose Sensor Lab */}
          <div className="clean-card card-interactive" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIcon size={22} />
                </div>
                <span className="badge badge-teal">Chemical Array Modality</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                E-Nose Gas Sensor Lab
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                Processes multi-channel semiconductor gas sensor array measurements against 35 reference chemical mixture classes to evaluate sensor-fusion screening capabilities.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem', fontSize: '0.85rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span><strong>10 Sensor Resistance Channels</strong> (Multi-sensor array)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span><strong>35 Mixture Profiles</strong> (NH3 & H2 concentrations)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheckIcon size={16} className="text-emerald" />
                  <span><strong>Pre-loaded Lab Presets</strong> for benchmark demonstration</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={onStartEnoseCheck} 
              className="btn-secondary" 
              style={{ width: '100%', padding: '11px', fontSize: '0.92rem' }}
            >
              <span>Open Gas Sensor Lab</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Methodological Flow Strip */}
      <section className="clean-card" style={{ padding: '2rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', textAlign: 'center' }}>
          Screening & Analysis Pipeline Workflow
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
              Phase 01 • Signal Capture
            </span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e293b' }}>
              Input Acquisition
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
              48kHz respiratory audio recording or 10-channel sensor resistance vector.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
              Phase 02 • ML Inference
            </span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e293b' }}>
              Feature Consensus
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
              102 acoustic spectral features / sensor resistance patterns evaluated by Random Forest models.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
              Phase 03 • Causal AI
            </span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e293b' }}>
              Attribution & Precautions
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
              Structural Causal Models determine probable root triggers and recommend actionable lifestyle steps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
