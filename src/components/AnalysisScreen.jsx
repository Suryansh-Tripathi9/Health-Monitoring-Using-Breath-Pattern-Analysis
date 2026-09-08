'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle, Activity, Cpu } from 'lucide-react';
import predictionService from '../services/predictionService';

export default function AnalysisScreen({ audioSample, onAnalysisComplete }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Audio sample received & decrypted', key: 'received' },
    { label: 'Preprocessing audio spectrogram data', key: 'processing' },
    { label: 'Extracting spectral & pattern features', key: 'extracting' },
    { label: 'Generating AI health risk estimation', key: 'generating' }
  ];

  useEffect(() => {
    // Sequential progress animation timers
    const t1 = setTimeout(() => setActiveStep(1), 500);
    const t2 = setTimeout(() => setActiveStep(2), 1000);
    const t3 = setTimeout(() => setActiveStep(3), 1500);

    // Call prediction service concurrently
    let isSubscribed = true;

    predictionService.predictAudio({
      audioSource: audioSample?.audioSource,
      analysisType: audioSample?.analysisType || 'breathing-deep'
    }).then((result) => {
      // Ensure sequence completes before navigating
      setTimeout(() => {
        if (isSubscribed) {
          onAnalysisComplete(result);
        }
      }, 2000);
    });

    return () => {
      isSubscribed = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [audioSample, onAnalysisComplete]);

  return (
    <div style={{
      maxWidth: '680px',
      margin: '40px auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '32px'
    }}>
      {/* Central Visual Loader Ring */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div 
          className="pulse-active"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.2))',
            border: '2px solid rgba(14, 165, 233, 0.4)'
          }}
        />
        <Cpu size={48} className="spin-slow" style={{ color: '#38bdf8', zIndex: 2 }} />
      </div>

      {/* Header text */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Analysing your {audioSample?.categoryName?.toLowerCase() || 'breathing pattern'}...
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Processing acoustic frequency spectrum and temporal variations.
        </p>
      </div>

      {/* Sequential Step Timeline */}
      <div className="glass-panel" style={{ width: '100%', padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((step, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                  {isDone ? (
                    <CheckCircle2 size={24} style={{ color: '#34d399' }} />
                  ) : isCurrent ? (
                    <Loader2 size={24} style={{ color: '#38bdf8', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Circle size={24} style={{ color: 'var(--text-dim)', opacity: 0.5 }} />
                  )}
                </div>

                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: isCurrent || isDone ? 600 : 400,
                  color: isDone ? '#34d399' : isCurrent ? '#f8fafc' : 'var(--text-dim)',
                  transition: 'all 0.3s ease'
                }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{
          marginTop: '28px',
          height: '6px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${((activeStep + 1) / steps.length) * 100}%`,
            background: 'linear-gradient(90deg, #0ea5e9, #34d399)',
            transition: 'width 0.5s ease-in-out',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
