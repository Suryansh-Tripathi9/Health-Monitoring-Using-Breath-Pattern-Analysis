import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Promise((resolve) => {
    const script = `
import joblib, json, numpy as np, os
path = os.path.join(os.getcwd(), 'breathing_random_forest.pkl')
if not os.path.exists(path):
    print(json.dumps({"error": "Model file missing"}))
    exit(0)
model = joblib.load(path)
fi = model.feature_importances_
top_idx = np.argsort(fi)[::-1][:15].tolist()
top_imp = [round(float(fi[i]), 6) for i in top_idx]

res = {
    "totalFeatures": 512,
    "featureBreakdown": {
        "melSpectrogramMean": "Features 0 - 127",
        "melSpectrogramStd": "Features 128 - 255",
        "melSpectrogramMax": "Features 256 - 383",
        "melSpectrogramMin": "Features 384 - 511"
    },
    "topFeatureIndices": top_idx,
    "topFeatureImportances": top_imp
}
print(json.dumps(res))
`;

    const py = spawn('python3', ['-c', script]);
    let out = '';
    py.stdout.on('data', d => out += d.toString());
    py.on('close', () => {
      try {
        const jsonMatch = out.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          resolve(NextResponse.json(JSON.parse(jsonMatch[0])));
        } else {
          resolve(NextResponse.json({ error: 'Failed to extract features' }, { status: 500 }));
        }
      } catch (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      }
    });
  });
}
