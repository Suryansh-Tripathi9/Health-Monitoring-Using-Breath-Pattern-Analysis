'use client';

import React, { useState, useEffect } from 'react';
import AudioRecorder from './AudioRecorder';
import AudioUploader from './AudioUploader';
import { 
  MicIcon, 
  UploadIcon, 
  LungsIcon, 
  ActivityIcon, 
  ArrowRightIcon, 
  FileAudioIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  InfoIcon
} from './Icons';
import predictionService from '../services/predictionService';

const BENCHMARK_SAMPLES = [
  {
    id: 'breathing-deep',
    category: 'breathing',
    title: 'Normal Vesicular Breath',
    subtitle: 'Healthy tidal inspiration & expiration',
    duration: '3.0s',
    tag: 'Normal Control',
    tagColor: 'success',
    url: '/sample-breath-deep.wav',
    fileName: 'Vesicular_Normal_Breath.wav'
  },
  {
    id: 'breathing-shallow',
    category: 'breathing',
    title: 'Asthmatic Wheeze Sign',
    subtitle: 'High-frequency continuous expiratory sound',
    duration: '3.0s',
    tag: 'Wheeze Pattern',
    tagColor: 'warning',
    url: '/sample-breath-shallow.wav',
    fileName: 'Asthma_Wheeze_Sample.wav'
  },
  {
    id: 'cough-heavy',
    category: 'cough',
    title: 'Thoracic Cough Burst',
    subtitle: 'Deep lower respiratory forced expulsion',
    duration: '3.0s',
    tag: 'Deep Cough',
    tagColor: 'alert',
    url: '/sample-cough-heavy.wav',
    fileName: 'Thoracic_Cough_Sample.wav'
  },
  {
    id: 'cough-shallow',
    category: 'cough',
    title: 'Upper Airway Clearing',
    subtitle: 'Glottic throat cough & airway clearance',
    duration: '3.0s',
    tag: 'Throat Clearing',
    tagColor: 'neutral',
    url: '/sample-cough-shallow.wav',
    fileName: 'Laryngeal_Cough_Sample.wav'
  }
];

export default function HealthCheckPage({ onAnalyseAudio, onBackToHome, initialPreset }) {
  const getInitialCategory = (preset) => {
    if (preset && preset.startsWith('cough')) return 'cough';
    return 'breathing';
  };

  const getInitialAudioData = (preset) => {
    if (!preset) return null;
    const match = BENCHMARK_SAMPLES.find(s => s.id === preset) || BENCHMARK_SAMPLES[0];
    return {
      name: match.fileName,
      size: '280 KB',
      duration: match.duration,
      url: match.url,
      sourceType: 'Clinical Benchmark'
    };
  };

  const [analysisCategory, setAnalysisCategory] = useState(() => getInitialCategory(initialPreset));
  const [analysisType, setAnalysisType] = useState(() => initialPreset || 'breathing-deep');
  const [inputTab, setInputTab] = useState('record');
  const [audioData, setAudioData] = useState(() => getInitialAudioData(initialPreset));
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState(() => initialPreset || null);
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

  const handleSelectBenchmark = (sample) => {
    setSelectedBenchmarkId(sample.id);
    setAnalysisType(sample.id);
    setAnalysisCategory(sample.category);

    setAudioData({
      name: sample.fileName,
      size: '280 KB',
      duration: sample.duration,
      url: sample.url,
      sourceType: 'Clinical Benchmark Library'
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
      {/* Page Title & Context */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">
            <LungsIcon size={14} />
            <span>Acoustic Modality</span>
          </span>
          <span className="badge badge-teal">
            <ShieldCheckIcon size={14} />
            <span>KAUH Dataset Protocol</span>
          </span>
        </div>

        <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Respiratory Acoustic Analysis Studio
        </h1>
        <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto' }}>
          Capture or upload respiratory sound recordings for signal feature extraction (MFCCs, spectral roll-off, zero-crossing) and automated pattern screening.
        </p>

        {/* System Status Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
          <div className="engine-status-pill">
            <span className="status-dot"></span>
            <span>
              {backendStatus?.status === 'healthy' 
                ? 'KAUH Acoustic Classifier Online • 102 Feature Descriptors' 
                : 'Connecting to Acoustic Classifier...'}
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Select Protocol */}
      <div className="clean-card" style={{ padding: '1.5rem 1.75rem' }}>
        <span className="section-label-step">Protocol 1 • Select Clinical Sound Type</span>

        <div className="category-tabs">
          <button 
            type="button"
            className={`category-tab ${analysisCategory === 'breathing' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('breathing')}
          >
            <LungsIcon size={18} />
            <span>Breath Pattern Analysis</span>
          </button>

          <button 
            type="button"
            className={`category-tab ${analysisCategory === 'cough' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('cough')}
          >
            <ActivityIcon size={18} />
            <span>Cough Sound Dynamics</span>
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
                  <h4>Deep Vesicular Respiration</h4>
                  <p>Inhale and exhale with deep tidal cycles to assess bronchial and peripheral airway sounds.</p>
                </div>
              </div>

              <div 
                className={`subtype-card ${analysisType === 'breathing-shallow' ? 'selected' : ''}`}
                onClick={() => setAnalysisType('breathing-shallow')}
              >
                <div className="subtype-details">
                  <h4>Shallow / Rapid Respiration</h4>
                  <p>Short-duration respiratory cycles useful for detecting tachypneic and wheezing resistance.</p>
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
                  <h4>Deep Thoracic Cough</h4>
                  <p>High-energy forced expiration to assess lower airway mucus loading and bronchospasm.</p>
                </div>
              </div>

              <div 
                className={`subtype-card ${analysisType === 'cough-shallow' ? 'selected' : ''}`}
                onClick={() => setAnalysisType('cough-shallow')}
              >
                <div className="subtype-details">
                  <h4>Upper Airway Throat Clearing</h4>
                  <p>Light laryngeal coughing to isolate glottic friction and upper respiratory resistance.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Step 2: Audio Capture / Upload */}
      <div className="clean-card" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
          <span className="section-label-step" style={{ margin: 0 }}>
            Protocol 2 • Provide Audio Recording
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Recommended: 48kHz Mono • 3 to 10 seconds
          </span>
        </div>

        <div className="input-method-tabs">
          <button
            type="button"
            className={`method-tab ${inputTab === 'record' ? 'active' : ''}`}
            onClick={() => setInputTab('record')}
          >
            <MicIcon size={18} />
            <span>Microphone Capture</span>
          </button>

          <button
            type="button"
            className={`method-tab ${inputTab === 'upload' ? 'active' : ''}`}
            onClick={() => setInputTab('upload')}
          >
            <UploadIcon size={18} />
            <span>Upload WAV / MP3</span>
          </button>
        </div>

        <div>
          {inputTab === 'record' ? (
            <AudioRecorder 
              onAudioReady={(data) => {
                setSelectedBenchmarkId(null);
                setAudioData(data);
              }} 
              onClearAudio={() => {
                setAudioData(null);
                setSelectedBenchmarkId(null);
              }}
              currentAudio={audioData}
            />
          ) : (
            <AudioUploader 
              onAudioReady={(data) => {
                setSelectedBenchmarkId(null);
                setAudioData(data);
              }} 
              onClearAudio={() => {
                setAudioData(null);
                setSelectedBenchmarkId(null);
              }}
              currentAudio={audioData}
            />
          )}
        </div>

        {/* Clinical Benchmark Sound Library */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Or Evaluate Using Benchmark Clinical Reference Samples:
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Curated from KAUH reference archive
            </span>
          </div>

          <div className="benchmark-audio-grid">
            {BENCHMARK_SAMPLES.map((sample) => {
              const isSelected = selectedBenchmarkId === sample.id;
              return (
                <div 
                  key={sample.id}
                  className={`benchmark-audio-card ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectBenchmark(sample)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ marginTop: '2px', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                      <FileAudioIcon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {sample.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {sample.subtitle}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span className={`badge badge-${sample.tagColor}`} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                      {sample.tag}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>
                      {sample.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Audio Confirmation Bar */}
        {audioData && (
          <div style={{ marginTop: '1.25rem', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircleIcon size={18} className="text-emerald" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Sample Loaded: <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{audioData.name}</span>
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Source: {audioData.sourceType || 'User Audio'}
            </span>
          </div>
        )}
      </div>

      {/* Acoustic Instructions Guidance */}
      <div className="disclaimer-box">
        <InfoIcon size={18} className="flex-shrink-0" style={{ marginTop: '2px' }} />
        <span>
          <strong>Recording Protocol:</strong> Position your device microphone approximately 10 cm from your mouth in a low-noise room. Breathe deeply and steadily with an open mouth. Avoid speaking or touching the microphone while recording.
        </span>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <button type="button" onClick={onBackToHome} className="btn-secondary">
          Back to Overview
        </button>

        <button 
          type="button" 
          onClick={handleAnalyseClick}
          disabled={!audioData}
          className="btn-primary"
          style={{ minWidth: '200px' }}
        >
          <span>Run Acoustic Analysis</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}
