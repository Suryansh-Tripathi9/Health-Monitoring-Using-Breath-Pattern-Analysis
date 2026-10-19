import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.features)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request payload. Expected JSON object with a "features" array of 10 numerical values.'
        },
        { status: 400 }
      );
    }

    if (body.features.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          error: `E-nose prediction requires exactly 10 features. Received ${body.features.length}.`
        },
        { status: 400 }
      );
    }

    const mlServiceUrl = (process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    const targetUrl = `${mlServiceUrl}/predict/enose`;

    let mlResponse;
    try {
      mlResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: body.features }),
      });
    } catch (connectionErr) {
      console.error('[Next.js API Gateway Error] ML Service unreachable:', connectionErr);
      return NextResponse.json(
        {
          success: false,
          error: 'ML Prediction Service is currently unreachable. Please ensure the Python FastAPI service is running on port 8000.',
          mlServiceUrl
        },
        { status: 503 }
      );
    }

    if (!mlResponse.ok) {
      let errDetail = 'E-nose ML prediction failed';
      try {
        const errJson = await mlResponse.json();
        errDetail = errJson.detail || errDetail;
      } catch {}

      return NextResponse.json(
        {
          success: false,
          error: errDetail
        },
        { status: mlResponse.status }
      );
    }

    const predictionData = await mlResponse.json();
    return NextResponse.json(predictionData);

  } catch (error) {
    console.error('[Next.js E-Nose API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during E-nose sensor processing.'
      },
      { status: 500 }
    );
  }
}
