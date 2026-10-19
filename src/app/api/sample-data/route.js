import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const samples = [
    {
      id: 'breathing-deep',
      title: 'Deep Normal Breathing',
      category: 'Breathing Patterns',
      expectedLabel: 'Normal',
      description: 'Clear, steady diaphragm movement with normal acoustic spectrum.',
      sampleVectorSummary: '102 extracted audio features',
      simulatedMetrics: {
        patternDetected: 'Normal Harmonic Respiratory Flow',
        estimatedFrequency: '0.22 Hz (Normal)',
        signalNoiseRatio: '26.4 dB',
        spectralCentroid: '1,380 Hz',
        zeroCrossingRate: '0.042'
      }
    },
    {
      id: 'breathing-shallow',
      title: 'Rapid Shallow Breathing',
      category: 'Breathing Patterns',
      expectedLabel: 'Wheeze-dominant',
      description: 'High-frequency micro-pauses and elevated acoustic rate.',
      sampleVectorSummary: '102 extracted audio features',
      simulatedMetrics: {
        patternDetected: 'Acoustic Disruption & High Respiration Rate',
        estimatedFrequency: '0.48 Hz (Elevated)',
        signalNoiseRatio: '22.1 dB',
        spectralCentroid: '2,410 Hz',
        zeroCrossingRate: '0.098'
      }
    },
    {
      id: 'cough-heavy',
      title: 'Heavy Persistent Cough',
      category: 'Cough Sound Analysis',
      expectedLabel: 'Crackle-dominant',
      description: 'High-amplitude transient burst with broad spectral energy distribution.',
      sampleVectorSummary: '102 extracted audio features',
      simulatedMetrics: {
        patternDetected: 'High Amplitude Acoustic Spikes & Turbulence',
        estimatedFrequency: '0.85 Hz (Spike)',
        signalNoiseRatio: '19.8 dB',
        spectralCentroid: '3,200 Hz',
        zeroCrossingRate: '0.145'
      }
    },
    {
      id: 'cough-shallow',
      title: 'Mild Clearing Cough',
      category: 'Cough Sound Analysis',
      expectedLabel: 'Normal',
      description: 'Short single burst clearing with rapid acoustic decay.',
      sampleVectorSummary: '102 extracted audio features',
      simulatedMetrics: {
        patternDetected: 'Transient Single-Phasic Burst',
        estimatedFrequency: '0.31 Hz (Transient)',
        signalNoiseRatio: '24.9 dB',
        spectralCentroid: '1,850 Hz',
        zeroCrossingRate: '0.061'
      }
    }
  ];

  return NextResponse.json({
    totalSamples: samples.length,
    samples
  });
}
