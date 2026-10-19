import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const mlServiceUrl = (process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  let mlServiceStatus = { status: 'down', model: 'kauh_breath_pattern_rf', features: 102 };

  try {
    const res = await fetch(`${mlServiceUrl}/health`, { cache: 'no-store' });
    if (res.ok) {
      mlServiceStatus = await res.json();
    }
  } catch (err) {
    console.warn('[Next.js Health API] ML service health check failed:', err.message);
  }

  const isHealthy = mlServiceStatus.status === 'ok';

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'degraded',
    gateway: 'Next.js API Gateway',
    timestamp: new Date().toISOString(),
    mlService: {
      url: mlServiceUrl,
      ...mlServiceStatus
    }
  });
}
