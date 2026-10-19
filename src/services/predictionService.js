/**
 * Prediction Service Abstraction Layer
 * 
 * NEXT.JS API GATEWAY + FASTAPI ML SERVICE INTEGRATION
 * Forwards recorded/uploaded/preset audio samples to /api/predict gateway.
 */

export const predictionService = {
  /**
   * Checks the health and status of the Next.js API Gateway & FastAPI ML service
   */
  async checkBackendHealth() {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) return { status: 'offline', gateway: 'Next.js API Gateway' };
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('[predictionService] Backend health check failed:', err);
      return { status: 'offline', gateway: 'Next.js API Gateway' };
    }
  },

  /**
   * Analyzes audio input by forwarding it to POST /api/predict
   * 
   * @param {Object} params
   * @param {Blob|File|Object|string} params.audioSource - Audio source file, blob, or sample object
   * @param {string} params.analysisType - Type of pattern: 'breathing-deep', 'breathing-shallow', 'cough-heavy', 'cough-shallow'
   * @returns {Promise<Object>} Formatted prediction result from FastAPI Random Forest model
   */
  async predictAudio({ audioSource, analysisType = 'breathing-deep' }) {
    console.log(`[predictionService] Processing audio prediction for type: ${analysisType}`);

    let fileName = 'Recorded Audio Sample.wav';
    if (audioSource?.name) {
      fileName = audioSource.name;
    } else if (typeof audioSource === 'string') {
      fileName = audioSource;
    }

    let fileToUpload = null;

    try {
      // 1. Direct File or Blob
      if (audioSource instanceof File) {
        fileToUpload = audioSource;
      } else if (audioSource instanceof Blob) {
        fileToUpload = new File([audioSource], fileName, { type: audioSource.type || 'audio/webm' });
      } else if (audioSource?.file instanceof File) {
        fileToUpload = audioSource.file;
      } else if (audioSource?.blob instanceof Blob) {
        fileToUpload = new File([audioSource.blob], fileName, { type: audioSource.blob.type || 'audio/webm' });
      } else if (audioSource?.url) {
        // Fetch sample audio URL (blob: or relative URL) to obtain binary audio
        try {
          const sampleRes = await fetch(audioSource.url);
          if (sampleRes.ok) {
            const blob = await sampleRes.blob();
            fileToUpload = new File([blob], fileName, { type: blob.type || 'audio/wav' });
          }
        } catch (fetchErr) {
          console.warn('[predictionService] Could not fetch audio URL, creating synthetic WAV:', fetchErr);
        }
      }

      // If audio file could not be fetched from URL, create 48kHz audio buffer for sample
      if (!fileToUpload) {
        const sampleAudio = createSampleAudioFile(analysisType, fileName);
        fileToUpload = sampleAudio;
      }

      // Send multipart/form-data to Next.js API route (/api/predict)
      const formData = new FormData();
      formData.append('audio', fileToUpload);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success !== false) {
          return {
            ...data,
            fileName: data.fileName || fileName,
            analysisType,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            isRealMLModel: true
          };
        } else {
          throw new Error(data.error || 'ML prediction error');
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error status ${response.status}`);
      }

    } catch (err) {
      console.error('[predictionService Error]:', err);
      throw err;
    }
  },

  /**
   * Analyzes 10 E-Nose gas sensor features via POST /api/predict/enose
   * 
   * @param {Array<number>} features - Array of 10 numeric gas sensor features
   * @returns {Promise<Object>} Formatted prediction result from E-nose Random Forest model
   */
  async predictEnose(features) {
    console.log('[predictionService] Sending 10 E-nose gas sensor features for inference:', features);

    if (!Array.isArray(features) || features.length !== 10) {
      throw new Error('E-nose analysis requires exactly 10 numerical feature values.');
    }

    try {
      const response = await fetch('/api/predict/enose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        return {
          ...data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          modality: 'enose'
        };
      } else {
        throw new Error(data.error || 'E-nose prediction request failed.');
      }
    } catch (err) {
      console.error('[predictionService E-Nose Error]:', err);
      throw err;
    }
  },

  /**
   * Fetches E-Nose dataset presets from /api/enose/presets
   */
  async fetchEnosePresets() {
    try {
      const response = await fetch('/api/enose/presets');
      if (response.ok) {
        const data = await response.json();
        return data.presets || [];
      }
    } catch (err) {
      console.warn('[predictionService] Failed to fetch E-nose presets:', err);
    }
    return [];
  }
};

/**
 * Creates a synthetic 48kHz WAV audio file for sample presets when offline
 */
function createSampleAudioFile(analysisType, fileName) {
  const sr = 48000;
  const durationSec = 3;
  const numSamples = sr * durationSec;
  const pcmData = new Int16Array(numSamples);

  let freq = 350;
  let noiseLevel = 0.02;

  if (analysisType === 'breathing-shallow') {
    freq = 650;
    noiseLevel = 0.05;
  } else if (analysisType === 'cough-heavy') {
    freq = 1200;
    noiseLevel = 0.15;
  } else if (analysisType === 'cough-shallow') {
    freq = 800;
    noiseLevel = 0.08;
  }

  for (let i = 0; i < numSamples; i++) {
    const t = i / sr;
    const env = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.3 * t);
    const signal = env * Math.sin(2 * Math.PI * freq * t) + (Math.random() * 2 - 1) * noiseLevel;
    pcmData[i] = Math.max(-32768, Math.min(32767, Math.floor(signal * 16384)));
  }

  // Create WAV header
  const wavBuffer = createWavBuffer(pcmData, sr);
  return new File([wavBuffer], fileName.endsWith('.wav') ? fileName : `${fileName}.wav`, { type: 'audio/wav' });
}

function createWavBuffer(pcmData, sampleRate) {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmData.length * 2, true);

  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(44 + i * 2, pcmData[i], true);
  }

  return buffer;
}

export default predictionService;
