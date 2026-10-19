'use client';

import React from 'react';
import { WaveformIcon, ActivityIcon, ShieldCheckIcon } from './Icons';

export default function Header({ currentModality, onSelectModality, onNavigateHome }) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand" onClick={onNavigateHome} role="button" tabIndex={0}>
          <div className="brand-icon">
            <WaveformIcon size={20} />
          </div>
          <div>
            <div className="brand-title">RespiPattern</div>
            <div className="brand-subtitle">Respiratory & Gas Sensing Laboratory</div>
          </div>
        </div>

        {/* Central Modality Segmented Switcher */}
        <nav className="nav-segmented-control" aria-label="Analysis Modality">
          <button
            type="button"
            className={`nav-segment-btn ${currentModality === 'audio' ? 'active' : ''}`}
            onClick={() => onSelectModality('audio')}
          >
            <WaveformIcon size={16} />
            <span>Acoustic Breath Analysis</span>
          </button>
          <button
            type="button"
            className={`nav-segment-btn ${currentModality === 'enose' ? 'active' : ''}`}
            onClick={() => onSelectModality('enose')}
          >
            <ActivityIcon size={16} />
            <span>E-Nose Gas Sensor Lab</span>
          </button>
        </nav>

        {/* Engine Status & Academic Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="engine-status-pill" title="FastAPI ML Microservice Operational">
            <span className="status-dot"></span>
            <span>ML Engine Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
