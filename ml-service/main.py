import os
import tempfile
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from inference import load_model, extract_features_and_predict

app = FastAPI(
    title="RespiPattern Breath Analysis ML Service",
    description="Python FastAPI inference microservice for breathing_random_forest.pkl model",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Load model once when server starts"""
    try:
        load_model()
        print("[ML Service] Model loaded successfully on startup.")
    except Exception as e:
        print(f"[ML Service Error] Model load failed on startup: {e}")

@app.get("/health")
def health_check():
    """Health check endpoint required by spec"""
    try:
        load_model()
        return {
            "status": "ok",
            "model": "breathing_random_forest"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model loading error: {str(e)}"
        )

@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    """
    ML Prediction Endpoint
    Accepts uploaded audio file, executes exact 8-step feature extraction pipeline,
    and returns Random Forest model prediction.
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

        # Run exact 8-step ML pipeline
        result = extract_features_and_predict(temp_path)

        is_positive = result["prediction"] == 1
        label = "Positive-associated" if is_positive else "Reference"
        message = (
          "The audio pattern is associated with the positive class in the dataset."
          if is_positive
          else "The audio pattern is associated with the reference class in the dataset."
        )

        return {
            "success": True,
            "prediction": result["prediction"],
            "label": label,
            "probability": result["probability"],
            "percentage": result["percentage"],
            "spectrogram_shape": result["spectrogram_shape"],
            "message": message,
            "disclaimer": "This is a research prototype and not a medical diagnostic system."
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
