'use client';

import React from 'react';
import { InfoIcon, ShieldCheckIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              RespiPattern Research Laboratory
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
              Department of Computer Science & Engineering • Vellore Institute of Technology, Vellore
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-neutral">Research Version 2.2</span>
            <span className="badge badge-teal">KAUH & ICBHI Reference Baselines</span>
          </div>
        </div>

        <div className="disclaimer-box" style={{ background: '#f8fafc', borderColor: '#e2e8f0', borderLeftColor: '#0284c7' }}>
          <InfoIcon size={18} className="text-primary flex-shrink-0" style={{ marginTop: '2px' }} />
          <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
            <strong>Academic Research & Screening Notice:</strong> This software is an academic engineering prototype developed for acoustic sound pattern evaluation and multi-sensor gas array analysis. It does not provide medical diagnosis, clinical prescriptions, or replace formal medical examination by a qualified physician.
          </p>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} RespiPattern Team. All research baselines acknowledged.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>KAUH Dataset Protocol</span>
            <span>•</span>
            <span>Causal AI SCM Framework</span>
            <span>•</span>
            <span>Chemical Sensor Array Lab</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
