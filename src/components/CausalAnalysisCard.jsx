'use client';

import React, { useState } from 'react';
import { 
  ActivityIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  InfoIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  LungsIcon 
} from './Icons';

// Fallback knowledge base if backend offline or testing mock data
const CLIENT_FALLBACK_CAUSAL = {
  'Wheeze-dominant': {
    pattern: 'Wheeze-dominant',
    description: 'Continuous high-pitched musical sound produced by turbulent airflow passing through narrowed or constricted bronchial passages.',
    pathophysiology: {
      mechanism: 'Bronchospasm & Mucosal Inflammation',
      explanation: 'Contraction of bronchial smooth muscle and localized mucosal swelling dynamically narrow small-to-medium airways, accelerating airflow velocity and creating continuous acoustic vibrations during expiration.',
      target_airways: 'Small to medium bronchi and bronchioles'
    },
    causal_graph: {
      root_causes: [
        { category: 'Environmental Irritants', trigger: 'Airborne Particulates & High AQI (PM2.5 / PM10)', impact: 'Triggers immediate bronchial hypersensitivity and mucosal inflammation.' },
        { category: 'Allergen Exposure', trigger: 'Bio-Allergens (Pollen, Dust Mites, Animal Dander, Fungal Spores)', impact: 'Stimulates histamine release causing rapid airway smooth muscle constriction.' },
        { category: 'Thermal & Physical', trigger: 'Cold Dry Air & Strenuous Sudden Exertion', impact: 'Causes evaporative water loss and cooling of airway epithelium, stimulating reactive bronchoconstriction.' },
        { category: 'Chemical & Lifestyle', trigger: 'Tobacco Smoke, Aerosols, Industrial Fumes', impact: 'Paralyzes protective airway cilia and provokes persistent epithelial irritation.' }
      ],
      mediating_effect: 'Dynamic Airway Narrowing (Bronchoconstriction & Mucosal Edema)',
      acoustic_manifestation: 'Wheeze-dominant sound (continuous musical high-pitch, >100ms)',
      interventional_mitigations: [
        'HEPA Air Filtration (Mitigates particulate triggers)',
        'Warm Inhaled Air Protection (Mitigates cold-air shock)',
        'Pursed-Lip Breathing (Stabilizes internal airway pressure)'
      ]
    },
    precautions: [
      { category: '🌿 Environmental & Air Quality', recommendation: 'Use a certified HEPA air purifier in primary living and sleeping spaces; keep windows closed during high-pollen or high-AQI periods.' },
      { category: '🧣 Thermal & Weather Protection', recommendation: 'Wear a breathable mask or scarf loosely covering the mouth and nose when going outside into cold or dry air to pre-warm and humidify inhaled air.' },
      { category: '🧘 Breathing & Physical Pacing', recommendation: 'Practice gentle pursed-lip exhalations (inhale through nose for 2s, exhale through pursed lips for 4s) to maintain positive end-expiratory pressure.' },
      { category: '💧 Mucosal Hydration', recommendation: 'Drink warm water or caffeine-free herbal teas throughout the day to prevent mucosal desiccation and thin any airway secretions.' }
    ],
    red_flag_warnings: [
      'Sudden severe shortness of breath at rest',
      'Inability to speak complete sentences without pausing for breath',
      'Bluish or gray tint on lips, tongue, or nail beds (cyanosis)',
      'Wheezing accompanied by rapid chest-tightening or dizziness'
    ]
  },
  'Crackle-dominant': {
    pattern: 'Crackle-dominant',
    description: 'Discontinuous, explosive popping sounds typically produced by the sudden reopening of collapsed, fluid-laden, or stiffened peripheral airways.',
    pathophysiology: {
      mechanism: 'Alveolar Fluid Accumulation & Peripheral Airway Reopening',
      explanation: 'Hydrostatic pressure or inflammatory exudate introduces fluid into terminal bronchioles and alveoli. During inspiration, the rapid equalization of pressure causes collapsed moist airway walls to pop open, producing brief acoustic impulses.',
      target_airways: 'Terminal bronchioles and alveoli (lower lung parenchyma)'
    },
    causal_graph: {
      root_causes: [
        { category: 'Infectious & Exudative', trigger: 'Recent Lower Respiratory Tract Infection / Inflammation', impact: 'Inflammatory exudates and cellular debris pool within terminal alveolar sacs.' },
        { category: 'Hemodynamic & Fluid', trigger: 'Pulmonary Congestion / Elevated Hydrostatic Pressure', impact: 'Excess microvascular fluid transudates into lung interstitium and alveolar spaces.' },
        { category: 'Postural & Stasis', trigger: 'Prolonged Supine Immobility (Bed Rest)', impact: 'Promotes dependent hypostatic fluid pooling in posterior lung bases.' },
        { category: 'Environmental & Irritant', trigger: 'Micro-Aspiration or Inhaled Toxic Particulates', impact: 'Causes localized capillary permeability increases.' }
      ],
      mediating_effect: 'Alveolar Fluid Layering & Terminal Airway Collapse',
      acoustic_manifestation: 'Crackle-dominant sound (discontinuous popping clicks, <20ms, primarily inspiratory)',
      interventional_mitigations: [
        'Elevated Posture / Semi-Fowler (Reduces dependent venous pooling)',
        'Controlled Huff-Coughing (Mobilizes peripheral secretions)',
        'Oxygen & Vitals Monitoring (Tracks gas-exchange efficiency)'
      ]
    },
    precautions: [
      { category: '🛌 Postural Adjustment', recommendation: 'Rest and sleep in a semi-upright or elevated posture (semi-Fowler position with head/chest elevated 30°–45°) to relieve hydrostatic pressure on lung bases.' },
      { category: '🌬️ Controlled Airway Clearance', recommendation: 'Practice gentle "huff-coughing" (forced exhalation technique) rather than violent throat-clearing to mobilize dependent bronchial secretions safely.' },
      { category: '📊 Vital Signs Tracking', recommendation: 'Regularly monitor resting peripheral oxygen saturation (SpO2) with a finger pulse oximeter and track resting pulse rate.' },
      { category: '🍲 Dietary & Sodium Moderation', recommendation: 'Moderate dietary sodium and processed food intake to avoid fluid retention; avoid sudden large volume fluid intake before bedtime.' }
    ],
    red_flag_warnings: [
      'Presence of persistent high fever (>38°C / 100.4°F) or severe shaking chills',
      'Coughing up rust-colored, pink, or blood-streaked sputum',
      'Sharp, stabbing chest pain localized to one side during deep breathing',
      'Resting oxygen saturation (SpO2) consistently below 93%'
    ]
  },
  'Normal': {
    pattern: 'Normal',
    description: 'Smooth, uninterrupted laminar airflow through clear tracheobronchial and vesicular structures without acoustic obstruction.',
    pathophysiology: {
      mechanism: 'Unobstructed Laminar Airflow & Clear Parenchyma',
      explanation: 'Airways maintain healthy caliber, cilia function smoothly, and alveolar sacs are elastic and fluid-free, allowing quiet laminar airflow.',
      target_airways: 'Full bronchial tree and pulmonary parenchyma'
    },
    causal_graph: {
      root_causes: [
        { category: 'Aerobic Health', trigger: 'Regular Aerobic Activity & Respiratory Conditioning', impact: 'Maintains diaphragmatic strength and healthy alveolar recruitment.' },
        { category: 'Clean Air Environment', trigger: 'Low Exposure to Particulate Pollution & Smoke', impact: 'Preserves healthy mucosal ciliary clearance.' },
        { category: 'Hydration & Rest', trigger: 'Adequate Systemic Hydration', impact: 'Keeps airway surface liquid balanced and slippery.' }
      ],
      mediating_effect: 'Unobstructed Airway Caliber & Elastic Compliance',
      acoustic_manifestation: 'Normal vesicular sound (soft, low-pitch, steady inspiration with quiet exhalation)',
      interventional_mitigations: [
        'Continued Aerobic Conditioning',
        'Preventative Air Quality Awareness',
        'Annual Health Screening'
      ]
    },
    precautions: [
      { category: '🏃 Aerobic Maintenance', recommendation: 'Continue regular low-to-moderate aerobic exercise (walking, cycling, swimming) to sustain respiratory muscle endurance and vital capacity.' },
      { category: '💨 Preventative Air Hygiene', recommendation: 'Avoid direct and secondhand tobacco smoke, wood-burning smoke, and unventilated chemical aerosols to preserve delicate cilia.' },
      { category: '🧘 Deep Diaphragmatic Breathing', recommendation: 'Incorporate daily 5-minute deep diaphragmatic breathing sessions to promote full lung expansion and prevent lower-lobe atelectasis.' },
      { category: '💧 Consistent Hydration', recommendation: 'Maintain optimal daily water intake to ensure the respiratory mucociliary blanket remains thin and effective at trapping dust.' }
    ],
    red_flag_warnings: [
      'New onset of unexplained coughing lasting more than 2 weeks',
      'Development of wheezing or crackling sounds during physical exertion',
      'Unexplained daytime fatigue accompanied by shallow breathing or snoring'
    ]
  }
};

export default function CausalAnalysisCard({ pattern, causalData }) {
  const [activeTab, setActiveTab] = useState('pathway'); // 'pathway' | 'causes' | 'precautions'

  // Resolve causal data from prop or client fallback
  let data = causalData;
  if (!data || !data.causal_graph) {
    const cleanPattern = (pattern || 'Normal').toLowerCase();
    if (cleanPattern.includes('wheeze')) {
      data = CLIENT_FALLBACK_CAUSAL['Wheeze-dominant'];
    } else if (cleanPattern.includes('crackle')) {
      data = CLIENT_FALLBACK_CAUSAL['Crackle-dominant'];
    } else {
      data = CLIENT_FALLBACK_CAUSAL['Normal'];
    }
  }

  const isNormal = (pattern || '').toLowerCase().includes('normal');
  const graph = data.causal_graph || {};
  const rootCauses = graph.root_causes || [];
  const precautions = data.precautions || [];
  const redFlags = data.red_flag_warnings || [];

  return (
    <div className="clean-card" style={{ padding: '1.75rem', marginTop: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <SparklesIcon size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Causal AI & Root-Cause Attribution
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                Structural Causal Model
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Deconstructs the biological cause-effect chain and computes non-clinical lifestyle mitigations.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setActiveTab('pathway')}
            style={{
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'pathway' ? '#ffffff' : 'transparent',
              color: activeTab === 'pathway' ? '#0284c7' : '#64748b',
              boxShadow: activeTab === 'pathway' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            ⛓️ Causal Pathway
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('causes')}
            style={{
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'causes' ? '#ffffff' : 'transparent',
              color: activeTab === 'causes' ? '#0284c7' : '#64748b',
              boxShadow: activeTab === 'causes' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🔍 Root Triggers ({rootCauses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('precautions')}
            style={{
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'precautions' ? '#ffffff' : 'transparent',
              color: activeTab === 'precautions' ? '#0284c7' : '#64748b',
              boxShadow: activeTab === 'precautions' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🛡️ Precautions ({precautions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Visual Causal Pathway Tree */}
      {activeTab === 'pathway' && (
        <div>
          <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Physiological Explanation
            </span>
            <p style={{ fontSize: '0.9rem', color: '#334155', marginTop: '4px', lineHeight: 1.5 }}>
              {data.pathophysiology?.explanation || data.description}
            </p>
          </div>

          {/* Visual 3-Node Causal Graph */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', alignItems: 'center', margin: '1.25rem 0' }}>
            {/* Node 1: Root Causes */}
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '14px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                  Node 1 • Root Causes
                </span>
                <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>
                  Exogenous (U)
                </span>
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                Environmental & Bio Triggers
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                Inhaled irritants, allergens, temperature shock, or capillary fluid shift.
              </p>
            </div>

            {/* Node 2: Pathophysiology (Mediator) */}
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                  Node 2 • Mediator (M)
                </span>
                <span style={{ fontSize: '0.72rem', background: '#fef9c3', color: '#854d0e', padding: '2px 6px', borderRadius: '4px' }}>
                  Pathology
                </span>
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                {data.pathophysiology?.mechanism || 'Airway State'}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                {data.pathophysiology?.target_airways ? `Site: ${data.pathophysiology.target_airways}` : 'Altered airway dynamics'}
              </p>
            </div>

            {/* Node 3: Observed Pattern (Effect) */}
            <div style={{ background: isNormal ? '#ecfdf5' : '#fff1f2', border: isNormal ? '1px solid #a7f3d0' : '1px solid #fecdd3', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isNormal ? '#047857' : '#be123c', textTransform: 'uppercase' }}>
                  Node 3 • Observed Effect (Y)
                </span>
                <span style={{ fontSize: '0.72rem', background: isNormal ? '#d1fae5' : '#ffe4e6', color: isNormal ? '#065f46' : '#9f1239', padding: '2px 6px', borderRadius: '4px' }}>
                  ML Output
                </span>
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                {pattern} Pattern
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                Acoustic spectral signature captured by 102 KAUH features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Root Causes & Environmental Triggers */}
      {activeTab === 'causes' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {rootCauses.map((rc, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                    {rc.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Trigger #{idx + 1}</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>
                  {rc.trigger}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                  ↳ <em>Impact:</em> {rc.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Targeted Precautions & Interventions */}
      {activeTab === 'precautions' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {precautions.map((p, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  {p.category}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                  {p.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red-Flag Clinical Safety Warning Guardrail */}
      {redFlags.length > 0 && !isNormal && (
        <div style={{ marginTop: '1.25rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#be123c', marginBottom: '6px' }}>
            <AlertTriangleIcon size={18} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Clinical Red Flags — When to Consult a Medical Professional:
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '4px' }}>
            {redFlags.map((rf, idx) => (
              <li key={idx} style={{ fontSize: '0.82rem', color: '#9f1239', fontWeight: 500 }}>
                {rf}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Causal Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '1rem', padding: '8px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b' }}>
        <InfoIcon size={16} className="flex-shrink-0" style={{ marginTop: '1px' }} />
        <span>
          <strong>Causal Reasoning Boundary:</strong> {data.causal_disclaimer || "Causal AI analysis provides trigger attribution and non-clinical lifestyle precautions based on respiratory physiology literature. It does not provide medical diagnosis."}
        </span>
      </div>
    </div>
  );
}
