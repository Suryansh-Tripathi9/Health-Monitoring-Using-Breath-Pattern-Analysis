'use client';

import React, { useState, useEffect } from 'react';
import AudioRecorder from './AudioRecorder';
import AudioUploader from './AudioUploader';
import { MicIcon, UploadIcon, LungsIcon, ActivityIcon, ArrowRightIcon, FileAudioIcon } from './Icons';
import predictionService from '../services/predictionService';

export default function HealthCheckPage({ onAnalyseAudio, onBackToHome, initialPreset }) {
  const getInitialCategory = (preset) => {
    if (preset && preset.startsWith('cough')) return 'cough';
    return 'breathing';
  };

  const getInitialAudioData = (preset) => {
    if (!preset) return null;
    let name = 'Deep_Breathing_Sample.wav';
    let url = '/sample-breath-deep.wav';
    if (preset === 'breathing-shallow') { name = 'Shallow_Breathing_Sample.wav'; url = '/sample-breath-shallow.wav'; }
    if (preset === 'cough-heavy') { name = 'Heavy_Cough_Sample.wav'; url = '/sample-cough-heavy.wav'; }
    if (preset === 'cough-shallow') { name = 'Shallow_Cough_Sample.wav'; url = '/sample-cough-shallow.wav'; }
    return {
      name: name,
      size: '280 KB',
      duration: '3.0s',
      url: url,
      sourceType: 'Demo Audio Sample'
    };
  };

  const [analysisCategory, setAnalysisCategory] = useState(() => getInitialCategory(initialPreset));
  const [analysisType, setAnalysisType] = useState(() => initialPreset || 'breathing-deep');
  const [inputTab, setInputTab] = useState('record');
  const [audioData, setAudioData] = useState(() => getInitialAudioData(initialPreset));
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    predictionService.checkBackendHealth().then((info) => {
      setBackendStatus(info);
    });
  }, []);

  const handleCategoryChange = (category) => {
    setAnalysisCategory(category);
    if (category === 'breathing') {
      setAnalysisType('breathing-deep');
    } else {
      setAnalysisType('cough-heavy');
    }
  };

  const handleLoadDemoSample = (sampleType) => {
    let name = 'Deep_Breathing_Sample.wav';
    let url = '/sample-breath-deep.wav';
    if (sampleType === 'breathing-shallow') { name = 'Shallow_Breathing_Sample.wav'; url = '/sample-breath-shallow.wav'; }
    if (sampleType === 'cough-heavy') { name = 'Heavy_Cough_Sample.wav'; url = '/sample-cough-heavy.wav'; }
    if (sampleType === 'cough-shallow') { name = 'Shallow_Cough_Sample.wav'; url = '/sample-cough-shallow.wav'; }

    setAnalysisType(sampleType);
    if (sampleType.startsWith('breathing')) {
      setAnalysisCategory('breathing');
    } else {
      setAnalysisCategory('cough');
    }

    setAudioData({
      name: name,
      size: '280 KB',
      duration: '3.0s',
      url: url,
      sourceType: 'Demo Audio Sample'
    });
  };

  const handleAnalyseClick = () => {
    if (!audioData) return;
    onAnalyseAudio({
      audioSource: audioData,
      analysisType: analysisType
    });
  };

  return (
    <div className="health-check-container">
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Audio Sample Analysis</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Select pattern category, record or upload an audio sample, and trigger AI estimation.
        </p>

        {backendStatus && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '6px 14px', borderRadius: '20px', background: backendStatus.status === 'healthy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${backendStatus.status === 'healthy' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`, fontSize: '0.82rem', fontWeight: 600, color: backendStatus.status === 'healthy' ? '#10b981' : '#f59e0b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: backendStatus.status === 'healthy' ? '#10b981' : '#f59e0b', display: 'inline-block' }}></span>
            <span>
              {backendStatus.status === 'healthy' 
                ? `Live ML Model Connected: ${backendStatus.model?.filename} (${backendStatus.model?.inputFeatures} Features, 300 Trees)` 
                : 'Offline Estimator Mode'}
            </span>
          </div>
        )}
      </div>

      {/* Step 1: Select Type */}
      <div className="clean-card config-card">
        <span className="section-label-step">Step 1 • Select Analysis Type</span>

        <div className="category-tabs">
          <button 
            type="button"
            className={`category-tab ${analysisCategory === 'breathing' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('breathing')}
          >
            <LungsIcon size={18} />
            <span>Breathing Pattern</span>
          </button>

          <button 
            type="button"
            className={`category-tab ${analysisCategory === 'cough' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('cough')}
          >
            <ActivityIcon size={18} />
            <span>Cough Pattern</span>
          </button>
        </div>

        <div className="subtypes-grid">
          {analysisCategory === 'breathing' ? (
            <>
              <div 
                className={`subtype-card ${analysisType === 'breathing-deep' ? 'selected' : ''}`}
                onClick={() => setAnalysisType('breathing-deep')}
              >
                <div className="subtype-details">
                  <h4>Deep Breathing</h4>
                  <p>Inhale/exhale cycles with full chest expansion.</p>
                </div>
              </div>

              <div 
                className={`subtype-card ${analysisType === 'breathing-shallow' ? 'selected' : ''}`}
                onClick={() => setAnalysisType('breathing-shallow')}
              >
                <div className="subtype-details">
                  <h4>Shallow Breathing</h4>
                  <p>Rapid, short-duration chest breathing.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div 
                className={`subtype-card ${analysisType === 'cough-heavy' ? 'selected' : ''}`}
                onClick={() => setAnalysisType('cough-heavy')}
              >
                <div className="subtype-details">
                  <h4>Heavy Cough</h4>
                  <p>Deep thoracic forced exhalation coughing.</p>
                </div>
              </div>

              <div 
                className={`subtype-card ${analysisType === 'cough-shallow' ? 'selected' : ''}`}
                onClick={() => setAnalysisType('cough-shallow')}
              >
                <div className="subtype-details">
                  <h4>Shallow Cough</h4>
                  <p>Light throat clearing or upper airway coughing.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Step 2: Audio Source Input */}
      <div className="clean-card input-card">
        <span className="section-label-step">Step 2 • Provide Audio Sample</span>

        <div className="input-method-tabs">
          <button
            type="button"
            className={`method-tab ${inputTab === 'record' ? 'active' : ''}`}
            onClick={() => setInputTab('record')}
          >
            <MicIcon size={18} />
            <span>Record Audio</span>
          </button>

          <button
            type="button"
            className={`method-tab ${inputTab === 'upload' ? 'active' : ''}`}
            onClick={() => setInputTab('upload')}
          >
            <UploadIcon size={18} />
            <span>Upload File</span>
          </button>
        </div>

        <div>
          {inputTab === 'record' ? (
            <AudioRecorder 
              onAudioReady={(data) => setAudioData(data)} 
              onClearAudio={() => setAudioData(null)}
              currentAudio={audioData}
            />
          ) : (
            <AudioUploader 
              onAudioReady={(data) => setAudioData(data)} 
              onClearAudio={() => setAudioData(null)}
              currentAudio={audioData}
            />
          )}
        </div>

        {/* Instant Demo Presets */}
        <div className="presets-bar">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            Or test with sample audio:
          </span>
          <button 
            type="button" 
            className="btn-preset" 
            onClick={() => handleLoadDemoSample('breathing-deep')}
          >
            <FileAudioIcon size={14} />
            <span>Deep Breath Sample</span>
          </button>
          <button 
            type="button" 
            className="btn-preset" 
            onClick={() => handleLoadDemoSample('cough-heavy')}
          >
            <FileAudioIcon size={14} />
            <span>Heavy Cough Sample</span>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={onBackToHome} className="btn-secondary">
          Back to Overview
        </button>

        <button 
          type="button" 
          onClick={handleAnalyseClick}
          disabled={!audioData}
          className="btn-primary"
          style={{ minWidth: '180px' }}
        >
          <span>Analyse Audio</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}
