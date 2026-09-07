'use client';

import React, { useState, useEffect } from 'react';
import mockPredictionService from '../services/predictionService';
import { CheckCircleIcon } from './Icons';

const STEPS = [
  { label: 'Audio received', description: 'Sample converted & validated' },
  { label: 'Processing audio', description: 'Filtering noise & normalizing signal' },
  { label: 'Extracting pattern features', description: 'Generating acoustic feature vector' },
  { label: 'Generating health estimate', description: 'Comparing against acoustic baselines' }
];

export default function AnalysisProgressPage({ analysisParams, onAnalysisComplete }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    let isMounted = true;

    mockPredictionService.predictAudio(analysisParams)
      .then((res) => {
        if (isMounted) setPredictionResult(res);
      })
      .catch((err) => console.error('Inference error:', err));

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [analysisParams]);

  useEffect(() => {
    if (activeStepIndex === STEPS.length - 1 && predictionResult) {
      const timeout = setTimeout(() => {
        onAnalysisComplete(predictionResult);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [activeStepIndex, predictionResult, onAnalysisComplete]);

  return (
    <div className="analysis-container">
      <div className="clean-card analysis-card">
        <div className="spinner-lg"></div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Analysing your audio sample...
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          AI model is processing acoustic patterns and extracting signal features.
        </p>

        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((activeStepIndex + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>

        <div className="step-items-list">
          {STEPS.map((step, idx) => {
            const isDone = idx < activeStepIndex || (idx === activeStepIndex && activeStepIndex === STEPS.length - 1 && predictionResult);
            const isCurrent = idx === activeStepIndex && !isDone;

            return (
              <div 
                key={idx} 
                className={`step-item-box ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div>
                  {isDone ? (
                    <CheckCircleIcon size={18} className="text-emerald" />
                  ) : isCurrent ? (
                    <span style={{ color: 'var(--primary)' }}>●</span>
                  ) : (
                    <span style={{ color: '#cbd5e1' }}>○</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{step.label}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{step.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
