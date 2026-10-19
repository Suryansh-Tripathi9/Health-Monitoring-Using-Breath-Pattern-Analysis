import os
import tempfile
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from inference import load_model, extract_features_and_predict
from enose_inference import load_enose_model, predict_enose_features, load_enose_presets
from causal_engine import get_causal_analysis

app = FastAPI(
    title="Multimodal Health Sensing ML Service",
    description="Python FastAPI microservice serving KAUH Respiratory Audio Model and E-Nose Gas Sensor Model",
    version="2.1.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EnosePredictRequest(BaseModel):
    features: List[float] = Field(
        ..., 
        description="List of exactly 10 numerical gas sensor features (feature 1 to feature 10)",
        example=[0.989, 0.997, 1.007, 1.013, 1.031, 0.977, 1.007, 1.041, 0.968, 0.961]
    )

@app.on_event("startup")
def startup_event():
    """Load both models on startup"""
    try:
        load_model()
        print("[ML Service] KAUH Respiratory Model loaded successfully on startup.")
    except Exception as e:
        print(f"[ML Service Warning] KAUH Model load failed on startup: {e}")
        
    try:
        load_enose_model()
        print("[ML Service] E-Nose Gas Sensor Model loaded successfully on startup.")
    except Exception as e:
        print(f"[ML Service Warning] E-Nose Model load failed on startup: {e}")

@app.get("/health")
def health_check():
    """Health check endpoint returning metadata for both ML models"""
    respiration_status = "ok"
    enose_status = "ok"
    
    try:
        load_model()
    except Exception:
        respiration_status = "error"
        
    try:
        load_enose_model()
    except Exception:
        enose_status = "error"
        
    return {
        "status": "ok" if (respiration_status == "ok" and enose_status == "ok") else "degraded",
        "models": {
            "respiratory_audio": {
                "name": "kauh_breath_pattern_rf",
                "status": respiration_status,
                "n_features": 102
            },
            "enose_gas_sensor": {
                "name": "enose_nh3h2_random_forest",
                "status": enose_status,
                "n_features": 10
            }
        }
    }

@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    """
    KAUH Respiratory Audio Prediction Endpoint (Preserved)
    Accepts uploaded respiratory sound audio file, extracts 102 spectral/audio features,
    and returns Random Forest pattern prediction with dataset-derived condition associations.
    """
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No audio file was uploaded."
        )

    # Read uploaded bytes to check size
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded audio file is empty (0 bytes)."
        )

    # Save bytes to temporary file for librosa processing
    ext = os.path.splitext(file.filename)[1] or ".wav"
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    temp_path = temp_file.name

    try:
        temp_file.write(contents)
        temp_file.close()

        # Run 102-feature KAUH ML pipeline
        result = extract_features_and_predict(temp_path)
        causal = get_causal_analysis(result["pattern"])

        return {
            "success": True,
            "prediction": result["prediction"],
            "pattern": result["pattern"],
            "probability": result["probability"],
            "percentage": result["percentage"],
            "n_features": result["n_features"],
            "possible_conditions": result["possible_conditions"],
            "causal_analysis": causal,
            "message": "The model compares the recorded respiratory sound pattern with patterns learned from the KAUH reference dataset.",
            "disclaimer": "Research prototype for respiratory health monitoring. Possible associations are dataset-derived and are not a medical diagnosis."
        }

    except Exception as err:
        print(f"[ML Inference Error]: {err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Audio processing or inference failed: {str(err)}"
        )

    finally:
        if os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception:
                pass

@app.post("/predict/enose")
def predict_enose(payload: EnosePredictRequest):
    """
    E-Nose Gas Sensor Prediction Endpoint
    Accepts 10 numerical sensor features, passes them to E-Nose Random Forest model,
    and returns predicted gas-mixture class and reference dataset composition metadata.
    """
    if not payload or payload.features is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing payload or features array."
        )
        
    try:
        res = predict_enose_features(payload.features)
        return res
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        print(f"[E-Nose Inference Error]: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"E-nose inference failed: {str(err)}"
        )

@app.get("/enose/presets")
def get_enose_presets():
    """Returns preset samples from Private Dataset mix NH3H2.csv for demo testing"""
    try:
        presets = load_enose_presets()
        return {
            "success": True,
            "count": len(presets),
            "presets": presets
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load presets: {str(e)}"
        )

@app.get("/causal/analysis/{pattern}")
def get_pattern_causal_analysis(pattern: str):
    """
    Returns Structural Causal Model (SCM) analysis, root causes, biophysical mechanism,
    and targeted non-clinical precautions for a given respiratory pattern.
    """
    try:
        return get_causal_analysis(pattern)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Causal analysis failed: {str(e)}"
        )
