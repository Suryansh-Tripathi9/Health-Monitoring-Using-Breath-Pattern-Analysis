"""
Causal AI Reasoning Engine for Breath Pattern Analysis
======================================================
This module provides Structural Causal Model (SCM) analysis for detected
respiratory sound patterns (Normal, Wheeze-dominant, Crackle-dominant).

Instead of treating patterns as direct disease labels, this engine evaluates:
  1. Root Causal Triggers (Environmental, Lifestyle, Biological factors)
  2. Internal Pathophysiological Mediators (Airway narrowing, Alveolar fluid)
  3. Observable Acoustic Manifestation (Acoustic Spectral Features)
  4. Actionable Non-Clinical Interventions (do(Precaution))
  5. Safety Red-Flag Guardrails (When to seek clinical medical evaluation)
"""

from typing import Dict, Any, List

CAUSAL_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    "Wheeze-dominant": {
        "pattern": "Wheeze-dominant",
        "description": "Continuous high-pitched musical sound produced by turbulent airflow passing through narrowed or constricted bronchial passages.",
        "pathophysiology": {
            "mechanism": "Bronchospasm & Mucosal Inflammation",
            "explanation": "Contraction of bronchial smooth muscle and localized mucosal swelling dynamically narrow small-to-medium airways, accelerating airflow velocity and creating continuous acoustic vibrations during expiration.",
            "target_airways": "Small to medium bronchi and bronchioles"
        },
        "causal_graph": {
            "root_causes": [
                {
                    "category": "Environmental Irritants",
                    "trigger": "Airborne Particulates & High AQI (PM2.5 / PM10)",
                    "impact": "Triggers immediate bronchial hypersensitivity and mucosal inflammation."
                },
                {
                    "category": "Allergen Exposure",
                    "trigger": "Bio-Allergens (Pollen, Dust Mites, Animal Dander, Fungal Spores)",
                    "impact": "Stimulates histamine release causing rapid airway smooth muscle constriction."
                },
                {
                    "category": "Thermal & Physical",
                    "trigger": "Cold Dry Air & Strenuous Sudden Exertion",
                    "impact": "Causes evaporative water loss and cooling of airway epithelium, stimulating reactive bronchoconstriction."
                },
                {
                    "category": "Chemical & Lifestyle",
                    "trigger": "Tobacco Smoke, Aerosols, Industrial Fumes",
                    "impact": "Paralyzes protective airway cilia and provokes persistent epithelial irritation."
                }
            ],
            "mediating_effect": "Dynamic Airway Narrowing (Bronchoconstriction & Mucosal Edema)",
            "acoustic_manifestation": "Wheeze-dominant respiratory sound (continuous high-pitch musical resonance, >100ms)",
            "interventional_mitigations": [
                "HEPA Air Filtration (Mitigates particulate triggers)",
                "Warm Inhaled Air Protection (Mitigates cold-air shock)",
                "Pursed-Lip Breathing (Stabilizes internal airway pressure)"
            ]
        },
        "precautions": [
            {
                "category": "🌿 Environmental & Air Quality",
                "recommendation": "Use a certified HEPA air purifier in primary living and sleeping spaces; keep windows closed during high-pollen or high-AQI periods."
            },
            {
                "category": "🧣 Thermal & Weather Protection",
                "recommendation": "Wear a breathable mask or scarf loosely covering the mouth and nose when going outside into cold or dry air to pre-warm and humidify inhaled air."
            },
            {
                "category": "🧘 Breathing & Physical Pacing",
                "recommendation": "Practice gentle pursed-lip exhalations (inhale through nose for 2 seconds, exhale through pursed lips for 4 seconds) to maintain positive end-expiratory pressure."
            },
            {
                "category": "💧 Mucosal Hydration",
                "recommendation": "Drink warm water or caffeine-free herbal teas throughout the day to prevent mucosal desiccation and thin any airway secretions."
            }
        ],
        "red_flag_warnings": [
            "Sudden severe shortness of breath at rest",
            "Inability to speak complete sentences without pausing for breath",
            "Bluish or gray tint on lips, tongue, or nail beds (cyanosis)",
            "Wheezing accompanied by rapid chest-tightening or dizziness"
        ]
    },
    "Crackle-dominant": {
        "pattern": "Crackle-dominant",
        "description": "Discontinuous, explosive popping sounds typically produced by the sudden reopening of collapsed, fluid-laden, or stiffened peripheral airways.",
        "pathophysiology": {
            "mechanism": "Alveolar Fluid Accumulation & Peripheral Airway Reopening",
            "explanation": "Hydrostatic pressure or inflammatory exudate introduces fluid into terminal bronchioles and alveoli. During inspiration, the rapid equalization of pressure causes collapsed moist airway walls to pop open, producing brief acoustic impulses.",
            "target_airways": "Terminal bronchioles and alveoli (lower lung parenchyma)"
        },
        "causal_graph": {
            "root_causes": [
                {
                    "category": "Infectious & Exudative",
                    "trigger": "Recent Lower Respiratory Tract Infection / Inflammation",
                    "impact": "Inflammatory exudates and cellular debris pool within terminal alveolar sacs."
                },
                {
                    "category": "Hemodynamic & Fluid",
                    "trigger": "Pulmonary Congestion / Elevated Hydrostatic Pressure",
                    "impact": "Excess microvascular fluid transudates into lung interstitium and alveolar spaces."
                },
                {
                    "category": "Postural & Stasis",
                    "trigger": "Prolonged Supine Immobility (Bed Rest)",
                    "impact": "Promotes dependent hypostatic fluid pooling in posterior lung bases."
                },
                {
                    "category": "Environmental & Irritant",
                    "trigger": "Micro-Aspiration or Inhaled Toxic Particulates",
                    "impact": "Causes localized capillary permeability increases."
                }
            ],
            "mediating_effect": "Alveolar Fluid Layering & Terminal Airway Collapse",
            "acoustic_manifestation": "Crackle-dominant respiratory sound (discontinuous popping clicks, <20ms, primarily inspiratory)",
            "interventional_mitigations": [
                "Elevated Posture / Semi-Fowler (Reduces dependent venous pooling)",
                "Controlled Huff-Coughing (Mobilizes peripheral secretions)",
                "Oxygen & Vitals Monitoring (Tracks gas-exchange efficiency)"
            ]
        },
        "precautions": [
            {
                "category": "🛌 Postural Adjustment",
                "recommendation": "Rest and sleep in a semi-upright or elevated posture (semi-Fowler position with head/chest elevated 30°–45°) to relieve hydrostatic pressure on lung bases."
            },
            {
                "category": "🌬️ Controlled Airway Clearance",
                "recommendation": "Practice gentle 'huff-coughing' (forced exhalation technique) rather than violent throat-clearing to mobilize dependent bronchial secretions safely."
            },
            {
                "category": "📊 Vital Signs Tracking",
                "recommendation": "Regularly monitor resting peripheral oxygen saturation (SpO2) with a finger pulse oximeter and track resting pulse rate."
            },
            {
                "category": "🍲 Dietary & Sodium Moderation",
                "recommendation": "Moderate dietary sodium and processed food intake to avoid fluid retention; avoid sudden large volume fluid intake before bedtime."
            }
        ],
        "red_flag_warnings": [
            "Presence of persistent high fever (>38°C / 100.4°F) or severe shaking chills",
            "Coughing up rust-colored, pink, or blood-streaked sputum",
            "Sharp, stabbing chest pain localized to one side during deep breathing",
            "Resting oxygen saturation (SpO2) consistently below 93%"
        ]
    },
    "Normal": {
        "pattern": "Normal",
        "description": "Smooth, uninterrupted laminar airflow through clear tracheobronchial and vesicular structures without acoustic obstruction.",
        "pathophysiology": {
            "mechanism": "Unobstructed Laminar Airflow & Clear Parenchyma",
            "explanation": "Airways maintain healthy caliber, cilia function smoothly, and alveolar sacs are elastic and fluid-free, allowing quiet laminar airflow.",
            "target_airways": "Full bronchial tree and pulmonary parenchyma"
        },
        "causal_graph": {
            "root_causes": [
                {
                    "category": "Aerobic Health",
                    "trigger": "Regular Aerobic Activity & Respiratory Conditioning",
                    "impact": "Maintains diaphragmatic strength and healthy alveolar recruitment."
                },
                {
                    "category": "Clean Air Environment",
                    "trigger": "Low Exposure to Particulate Pollution & Smoke",
                    "impact": "Preserves healthy mucosal ciliary clearance."
                },
                {
                    "category": "Hydration & Rest",
                    "trigger": "Adequate Systemic Hydration",
                    "impact": "Keeps airway surface liquid balanced and slippery."
                }
            ],
            "mediating_effect": "Unobstructed Airway Caliber & Elastic Compliance",
            "acoustic_manifestation": "Normal vesicular sound (soft, low-pitch, steady inspiration with quiet exhalation)",
            "interventional_mitigations": [
                "Continued Aerobic Conditioning",
                "Preventative Air Quality Awareness",
                "Annual Health Screening"
            ]
        },
        "precautions": [
            {
                "category": "🏃 Aerobic Maintenance",
                "recommendation": "Continue regular low-to-moderate aerobic exercise (walking, cycling, swimming) to sustain respiratory muscle endurance and vital capacity."
            },
            {
                "category": "💨 Preventative Air Hygiene",
                "recommendation": "Avoid direct and secondhand tobacco smoke, wood-burning smoke, and unventilated chemical aerosols to preserve delicate cilia."
            },
            {
                "category": "🧘 Deep Diaphragmatic Breathing",
                "recommendation": "Incorporate daily 5-minute deep diaphragmatic breathing sessions to promote full lung expansion and prevent lower-lobe atelectasis."
            },
            {
                "category": "💧 Consistent Hydration",
                "recommendation": "Maintain optimal daily water intake to ensure the respiratory mucociliary blanket remains thin and effective at trapping dust."
            }
        ],
        "red_flag_warnings": [
            "New onset of unexplained coughing lasting more than 2 weeks",
            "Development of wheezing or crackling sounds during physical exertion",
            "Unexplained daytime fatigue accompanied by shallow breathing or snoring"
        ]
    }
}


def get_causal_analysis(pattern: str) -> Dict[str, Any]:
    """
    Returns the Structural Causal Model (SCM) analysis for a given respiratory pattern.
    Falls back gracefully if the pattern is unknown or formatted differently.
    """
    clean_pattern = str(pattern).strip()

    # Match pattern case-insensitively or via substring
    matched_key = None
    if "wheeze" in clean_pattern.lower():
        matched_key = "Wheeze-dominant"
    elif "crackle" in clean_pattern.lower():
        matched_key = "Crackle-dominant"
    elif "normal" in clean_pattern.lower():
        matched_key = "Normal"
    else:
        matched_key = "Normal"

    causal_data = CAUSAL_KNOWLEDGE_BASE.get(matched_key, CAUSAL_KNOWLEDGE_BASE["Normal"])

    return {
        "success": True,
        "pattern": clean_pattern,
        "matched_class": matched_key,
        "causal_model": "Structural Causal Model (SCM) - Respiratory Acoustics",
        "description": causal_data["description"],
        "pathophysiology": causal_data["pathophysiology"],
        "causal_graph": causal_data["causal_graph"],
        "precautions": causal_data["precautions"],
        "red_flag_warnings": causal_data["red_flag_warnings"],
        "causal_disclaimer": "Causal AI analysis provides trigger attribution and non-clinical lifestyle precautions based on respiratory physiology literature. It does not provide medical diagnosis or replace consultation with a qualified healthcare professional."
    }
