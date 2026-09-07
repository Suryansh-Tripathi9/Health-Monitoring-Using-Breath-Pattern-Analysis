import React from 'react';
import { InfoIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-disclaimer">
          <InfoIcon size={18} className="text-muted flex-shrink-0" />
          <p>
            <strong>Academic Demonstration Notice:</strong> This prototype is built for educational & research presentation purposes. It is not intended for clinical use, medical diagnosis, or patient monitoring.
          </p>
        </div>
        <div className="footer-meta">
          <span>College Project Demo</span>
          <span className="dot">•</span>
          <span>Breath & Cough Pattern Analysis</span>
          <span className="dot">•</span>
          <span>Built with Next.js & React</span>
        </div>
      </div>
    </footer>
  );
}
