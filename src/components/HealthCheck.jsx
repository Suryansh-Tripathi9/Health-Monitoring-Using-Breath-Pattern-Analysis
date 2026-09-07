'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Upload, Play, Pause, Square, Trash2, CheckCircle2, 
  FileAudio, Volume2, Sparkles, ArrowRight, RefreshCw, AlertCircle
} from 'lucide-react';

export default function HealthCheck({ onAnalyse }) {
  // Analysis type state
  const [category, setCategory] = useState('breathing'); // 'breathing' | 'cough'
  const [subType, setSubType] = useState('deep'); // 'deep' | 'shallow' for breathing, 'heavy' | 'shallow' for cough

  // Audio input mode: 'record' | 'upload' | 'sample'
  const [inputMode, setInputMode] = useState('record');

  // Audio state
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [duration, setDuration] = useState(0);

  // Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingError, setRecordingError] = useState('');

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Derive analysisType identifier string
  const getAnalysisTypeKey = () => {
    if (category === 'breathing') {
      return subType === 'deep' ? 'breathing-deep' : 'breathing-shallow';
    } else {
      return subType === 'heavy' ? 'cough-heavy' : 'cough-shallow';
    }
  };

  // Pre-loaded samples for quick demo testing
  const demoSamples = [
    {
      id: 'sample-deep-breath',
      title: 'Deep Breathing Sample',
      category: 'breathing',
      subType: 'deep',
      typeKey: 'breathing-deep',
      duration: '4s',
      url: 'https://cdn.freesound.org/previews/512/512243_10915993-lq.mp3' // public clean breathing sample fallback
    },
    {
      id: 'sample-heavy-cough',
      title: 'Heavy Cough Sample',
      category: 'cough',
      subType: 'heavy',
      typeKey: 'cough-heavy',
      duration: '3s',
      url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3' // public clean cough sample fallback
    }
  ];

  // Clean up ObjectURL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl && !audioUrl.startsWith('http')) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  // Start Microphone Recording
  const startRecording = async () => {
    setRecordingError('');
    setAudioBlob(null);
    setAudioUrl(null);
    setFileName('');
    setDuration(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setFileName(`Mic_Recording_${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`);

        // Stop all audio stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone access error:', err);
      setRecordingError('Microphone access denied or unavailable. Please check browser permissions or use Audio Upload / Pre-loaded Samples.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select a valid audio file (e.g. MP3, WAV, WEBM, M4A).');
      return;
    }

    setAudioBlob(file);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Get audio duration
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      setDuration(Math.round(tempAudio.duration));
    };
  };

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setAudioBlob(file);
        setFileName(file.name);
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
      }
    }
  };

  // Handle Sample Select
  const handleSelectSample = (sample) => {
    setCategory(sample.category);
    setSubType(sample.subType);
    setAudioBlob({ isSample: true, name: sample.title, duration: sample.duration });
    setAudioUrl(sample.url);
    setFileName(sample.title);
    setDuration(parseInt(sample.duration));
  };

  // Clear current audio
  const handleClearAudio = () => {
    setAudioBlob(null);
    if (audioUrl && !audioUrl.startsWith('http')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setFileName('');
    setDuration(0);
    setIsPlaying(false);
  };

  // Toggle Audio Playback
  const togglePlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProceed = () => {
    if (!audioUrl) return;
    onAnalyse({
      audioSource: audioBlob || audioUrl,
      fileName: fileName || 'Recorded_Breath_Sample.webm',
      analysisType: getAnalysisTypeKey(),
      categoryName: category === 'breathing' ? 'Breathing Pattern' : 'Cough Pattern',
      subTypeName: subType === 'deep' ? 'Deep' : subType === 'heavy' ? 'Heavy' : 'Shallow'
    });
  };

  return (
    <div style={{
      maxWidth: '850px',
      margin: '0 auto',
      padding: '36px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Select & Prepare Audio Sample
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Choose your analysis category, then record or upload your audio pattern.
        </p>
      </div>

      {/* Step 1: Category & Pattern Selection */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>1. Select Analysis Type</span>
        </div>

        {/* Category Radio Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <button
            onClick={() => {
              setCategory('breathing');
              setSubType('deep');
            }}
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: category === 'breathing' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `2px solid ${category === 'breathing' ? '#0ea5e9' : 'rgba(255, 255, 255, 0.08)'}`,
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🎙️</span> Breathing Analysis
          </button>

          <button
            onClick={() => {
              setCategory('cough');
              setSubType('heavy');
            }}
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: category === 'cough' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `2px solid ${category === 'cough' ? '#0ea5e9' : 'rgba(255, 255, 255, 0.08)'}`,
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🫁</span> Cough Analysis
          </button>
        </div>

        {/* Sub-type Selection */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Pattern Detail:
          </span>

          {category === 'breathing' ? (
            <>
              <button
                onClick={() => setSubType('deep')}
                className={subType === 'deep' ? 'badge badge-primary' : 'btn-secondary'}
                style={{ padding: '8px 18px', cursor: 'pointer' }}
              >
                Deep Breathing
              </button>
              <button
                onClick={() => setSubType('shallow')}
                className={subType === 'shallow' ? 'badge badge-primary' : 'btn-secondary'}
                style={{ padding: '8px 18px', cursor: 'pointer' }}
              >
                Shallow Breathing
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setSubType('heavy')}
                className={subType === 'heavy' ? 'badge badge-primary' : 'btn-secondary'}
                style={{ padding: '8px 18px', cursor: 'pointer' }}
              >
                Heavy Cough
              </button>
              <button
                onClick={() => setSubType('shallow')}
                className={subType === 'shallow' ? 'badge badge-primary' : 'btn-secondary'}
                style={{ padding: '8px 18px', cursor: 'pointer' }}
              >
                Shallow Cough
              </button>
            </>
          )}
        </div>
      </div>

      {/* Step 2: Audio Source (Record / Upload / Demo Sample) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>2. Provide Audio Input</span>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setInputMode('record')}
              style={{
                background: inputMode === 'record' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                color: inputMode === 'record' ? '#38bdf8' : 'var(--text-dim)',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              Microphone
            </button>
            <button
              onClick={() => setInputMode('upload')}
              style={{
                background: inputMode === 'upload' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                color: inputMode === 'upload' ? '#38bdf8' : 'var(--text-dim)',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              Upload File
            </button>
            <button
              onClick={() => setInputMode('sample')}
              style={{
                background: inputMode === 'sample' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                color: inputMode === 'sample' ? '#38bdf8' : 'var(--text-dim)',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              Demo Samples
            </button>
          </div>
        </div>

        {/* INPUT MODE: RECORD */}
        {inputMode === 'record' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '24px 12px'
          }}>
            {/* Wave Visualizer Box */}
            <div className={`wave-container ${isRecording ? 'active' : ''}`} style={{ margin: '10px 0' }}>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>

            {/* Timer */}
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: isRecording ? '#f43f5e' : 'var(--text-main)'
            }}>
              {formatTime(recordingTime)}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isRecording ? '🔴 Recording in progress... speak or breathe into your microphone.' : 'Click start to begin microphone capture'}
            </div>

            {/* Mic Controls */}
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="btn-primary pulse-active"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}
              >
                <Mic size={20} /> Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 4px 20px rgba(244, 63, 94, 0.4)' }}
              >
                <Square size={20} /> Stop Recording
              </button>
            )}

            {recordingError && (
              <div style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', marginTop: '8px' }}>
                <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                {recordingError}
              </div>
            )}
          </div>
        )}

        {/* INPUT MODE: UPLOAD */}
        {inputMode === 'upload' && (
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: '2px dashed rgba(14, 165, 233, 0.4)',
              borderRadius: '16px',
              padding: '36px 20px',
              textAlign: 'center',
              background: 'rgba(14, 165, 233, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(14, 165, 233, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Upload size={28} />
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>
                Drag & Drop audio file here
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supports WAV, MP3, WEBM, or M4A (Max 15MB)
              </div>
            </div>

            <label className="btn-secondary" style={{ cursor: 'pointer', marginTop: '6px' }}>
              Browse File
              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
        )}

        {/* INPUT MODE: DEMO SAMPLES */}
        {inputMode === 'sample' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Select a pre-loaded sample audio file for immediate presentation testing:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {demoSamples.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: fileName === sample.title ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${fileName === sample.title ? '#0ea5e9' : 'var(--border-card)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileAudio size={22} style={{ color: '#38bdf8' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                        {sample.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Duration: {sample.duration}
                      </div>
                    </div>
                  </div>

                  {fileName === sample.title && (
                    <CheckCircle2 size={20} style={{ color: '#34d399' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIO READY PREVIEW PLAYER CARD */}
        {audioUrl && (
          <div style={{
            marginTop: '20px',
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
              <button
                onClick={togglePlay}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
              </button>

              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#f8fafc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {fileName || 'Audio Sample Ready'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>
                  ✓ Audio capture ready for acoustic feature extraction
                </div>
              </div>

              {/* Hidden HTML5 Audio player for playback control */}
              <audio 
                ref={audioPlayerRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)} 
              />
            </div>

            <button
              onClick={handleClearAudio}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px'
              }}
              title="Remove audio sample"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Primary CTA Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleProceed}
          disabled={!audioUrl || isRecording}
          className="btn-primary"
          style={{
            fontSize: '1.1rem',
            padding: '16px 44px',
            width: '100%',
            maxWidth: '400px'
          }}
        >
          Analyse Audio <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
