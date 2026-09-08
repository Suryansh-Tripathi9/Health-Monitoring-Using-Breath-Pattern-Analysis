import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request content type. Please submit multipart/form-data with an "audio" file.'
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') || formData.get('file');

    if (!audioFile || typeof audioFile === 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'No audio file selected. Please choose or record an audio file.'
        },
        { status: 400 }
      );
    }

    // Size validation
    if (audioFile.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Uploaded audio file is empty (0 bytes).'
        },
        { status: 400 }
      );
    }

    if (audioFile.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Audio file size (${(audioFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 10MB.`
        },
        { status: 400 }
      );
    }

    // Forwarding audio to Python FastAPI ML service
    const mlServiceUrl = (process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    const targetUrl = `${mlServiceUrl}/predict`;

    const forwardFormData = new FormData();
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = audioFile.name || 'audio_sample.wav';
    const mimeType = audioFile.type || 'audio/wav';

    const fileBlob = new Blob([buffer], { type: mimeType });
    forwardFormData.append('file', fileBlob, fileName);

    let mlResponse;
    try {
      mlResponse = await fetch(targetUrl, {
        method: 'POST',
        body: forwardFormData,
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
      let errDetail = 'ML prediction failed';
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
    console.error('[Next.js API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during audio processing.'
      },
      { status: 500 }
    );
  }
}
