import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mlServiceUrl = (process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    const targetUrl = `${mlServiceUrl}/enose/presets`;

    try {
      const res = await fetch(targetUrl, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn('[Next.js API Gateway] FastAPI unreachable for presets, returning fallback presets');
    }

    // Fallback presets if FastAPI is starting up
    return NextResponse.json({
      success: true,
      count: 5,
      presets: [
        {
          id: 'sample_1',
          name: 'Preset Class 1 (Gas A: 75.0, Gas B: 0.0)',
          label: 1,
          gas_a: 75.0,
          gas_b: 0.0,
          features: [0.989, 0.997, 1.007, 1.013, 1.031, 0.977, 1.007, 1.041, 0.968, 0.961]
        },
        {
          id: 'sample_7',
          name: 'Preset Class 7 (Gas A: 0.0, Gas B: 75.0)',
          label: 7,
          gas_a: 0.0,
          gas_b: 75.0,
          features: [1.02, 1.015, 1.008, 1.03, 1.045, 0.985, 1.012, 1.035, 0.975, 0.968]
        },
        {
          id: 'sample_18',
          name: 'Preset Class 18 (Gas A: 100.0, Gas B: 100.0)',
          label: 18,
          gas_a: 100.0,
          gas_b: 100.0,
          features: [1.103, 1.04, 1.096, 1.227, 1.679, 2.631, 6.375, 46.279, 41.942, 30.382]
        },
        {
          id: 'sample_25',
          name: 'Preset Class 25 (Gas A: 150.0, Gas B: 150.0)',
          label: 25,
          gas_a: 150.0,
          gas_b: 150.0,
          features: [1.15, 1.08, 1.12, 1.35, 2.10, 3.80, 10.5, 65.2, 58.4, 42.1]
        },
        {
          id: 'sample_35',
          name: 'Preset Class 35 (Gas A: 0.0, Gas B: 350.0)',
          label: 35,
          gas_a: 0.0,
          gas_b: 350.0,
          features: [1.25, 1.14, 1.28, 1.65, 3.40, 7.90, 22.1, 110.5, 95.2, 74.8]
        }
      ]
    });

  } catch (error) {
    console.error('[Next.js Presets API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch E-nose presets' },
      { status: 500 }
    );
  }
}
