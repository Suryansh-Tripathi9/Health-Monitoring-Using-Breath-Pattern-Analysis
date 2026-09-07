import React from 'react';
import { ActivityIcon } from './Icons';

export default function Header({ currentStep, onNavigateHome }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand" onClick={onNavigateHome}>
          <div className="brand-icon">
            <ActivityIcon size={22} />
          </div>
          <div>
            <div className="brand-title">RespiPattern AI</div>
            <div className="brand-subtitle">Breath Pattern Health Monitor</div>
          </div>
        </div>

        <div className="header-tag">
          Academic Prototype v1.0
        </div>
      </div>
    </header>
  );
}
