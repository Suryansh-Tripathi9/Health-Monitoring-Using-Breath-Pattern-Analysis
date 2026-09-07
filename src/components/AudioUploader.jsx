'use client';

import React, { useState, useRef } from 'react';
import { UploadIcon, FileAudioIcon, PlayIcon, PauseIcon, TrashIcon, CheckCircleIcon, WaveformIcon } from './Icons';

export default function AudioUploader({ onAudioReady, onClearAudio, currentAudio }) {
  const [dragActive, setDragActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(wav|mp3|ogg|webm|m4a|aac)$/i)) {
      alert('Please upload a valid audio file (.wav, .mp3, .ogg, .webm, .m4a)');
      return;
    }

    const url = URL.createObjectURL(file);
    onAudioReady({
      file: file,
      url: url,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      sourceType: 'uploaded'
    });
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

  const handleRemove = () => {
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlaying(false);
    onClearAudio();
  };

  return (
    <div className="audio-uploader-container">
      {!currentAudio ? (
        <div 
          className={`dropzone-box ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept="audio/*,.wav,.mp3,.ogg,.webm,.m4a"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <div className="dropzone-icon">
            <UploadIcon size={36} />
          </div>

          <div className="dropzone-text">
            <h4>Click or Drag & Drop Audio File</h4>
            <p>Supports WAV, MP3, OGG, WEBM, M4A audio files</p>
          </div>

          <button type="button" className="btn-secondary btn-sm dropzone-browse-btn">
            Browse Files
          </button>
        </div>
      ) : (
        <div className="uploader-preview-state glass-panel">
          <div className="preview-header">
            <div className="preview-title">
              <CheckCircleIcon size={20} className="text-emerald" />
              <span>Audio File Uploaded</span>
            </div>
            <span className="badge badge-primary">{currentAudio.size || 'Audio Sample'}</span>
          </div>

          <div className="file-info-bar">
            <FileAudioIcon size={24} className="text-cyan" />
            <div className="file-info-details">
              <div className="file-name">{currentAudio.name}</div>
              <div className="file-type-tag">Source: {currentAudio.sourceType || 'File'}</div>
            </div>
          </div>

          <div className="audio-player-custom">
            <button 
              type="button" 
              onClick={togglePlayback} 
              className="play-toggle-btn"
            >
              {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            </button>

            <div className="audio-waveform-preview">
              <WaveformIcon size={24} className={isPlaying ? 'text-cyan animating' : 'text-muted'} />
              <div className="audio-progress-bar-bg">
                <div className={`audio-progress-bar-fill ${isPlaying ? 'playing' : ''}`}></div>
              </div>
            </div>

            <audio 
              ref={audioPlayerRef} 
              src={currentAudio.url} 
              onEnded={() => setIsPlaying(false)}
              className="hidden-audio-element" 
            />
          </div>

          <div className="preview-actions">
            <button type="button" onClick={handleRemove} className="btn-secondary btn-sm">
              <TrashIcon size={16} />
              <span>Remove / Replace File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
