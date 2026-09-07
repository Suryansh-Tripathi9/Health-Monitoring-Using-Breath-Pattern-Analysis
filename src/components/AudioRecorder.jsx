'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MicIcon, PlayIcon, PauseIcon, TrashIcon, CheckCircleIcon } from './Icons';

export default function AudioRecorder({ onAudioReady, onClearAudio, currentAudio }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [micError, setMicError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        onAudioReady({
          blob: audioBlob,
          url: url,
          name: `Recorded_Audio_${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`,
          duration: `${recordingTime}s`,
          sourceType: 'Recorded Audio'
        });

        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone error:', err);
      setMicError('Microphone permission denied or not supported. You can select one of the sample audio clips below or upload a file.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDelete = () => {
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlaying(false);
    setAudioUrl(null);
    setRecordingTime(0);
    onClearAudio();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ width: '100%' }}>
      {micError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#991b1b', marginBottom: '1rem' }}>
          {micError}
        </div>
      )}

      {!audioUrl && !isRecording && (
        <div className="audio-recorder-box">
          <button 
            type="button" 
            onClick={startRecording} 
            className="record-btn"
            title="Click to record microphone audio"
          >
            <MicIcon size={32} />
          </button>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Click to Start Recording</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Record 3 to 10 seconds of clear breathing or cough audio
            </p>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="audio-recorder-box" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>
            ● RECORDING LIVE AUDIO
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'monospace' }}>
            {formatTime(recordingTime)}
          </div>

          <button 
            type="button" 
            onClick={stopRecording} 
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Stop Recording
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <CheckCircleIcon size={20} className="text-emerald" />
              <span>Audio Recording Ready</span>
            </div>
            <span className="badge badge-primary">{recordingTime}s Recorded</span>
          </div>

          <div className="audio-player-bar">
            <button type="button" onClick={togglePlayback} className="play-toggle-btn">
              {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            </button>

            <div className="audio-progress-bg">
              <div className={`audio-progress-fill ${isPlaying ? 'playing' : ''}`}></div>
            </div>

            <audio 
              ref={audioPlayerRef} 
              src={audioUrl} 
              onEnded={() => setIsPlaying(false)} 
              style={{ display: 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={handleDelete} className="btn-secondary btn-sm">
              <TrashIcon size={16} />
              <span>Delete / Re-record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
