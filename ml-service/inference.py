import os
import joblib
import numpy as np
import librosa
import soundfile as sf
from scipy.signal import butter, sosfilt
import scipy.io.wavfile as wavfile

# Global model instance cached in memory
_MODEL_INSTANCE = None

def get_model_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "models", "breathing_random_forest.pkl")

def load_model():
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is None:
        model_path = get_model_path()
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        _MODEL_INSTANCE = joblib.load(model_path)
    return _MODEL_INSTANCE

def load_audio_safely(audio_input, target_sr=48000):
    """Safely loads audio input into float32 48kHz mono numpy array"""
    try:
        y, sr = librosa.load(audio_input, sr=target_sr, mono=True)
        if len(y) > 0:
            return y
    except Exception as e1:
        print(f"[inference.py] librosa load warning: {e1}, trying soundfile fallback...")
        try:
            data, sr = sf.read(audio_input)
            if len(data.shape) > 1:
                data = np.mean(data, axis=1)
            if sr != target_sr:
                data = librosa.resample(data, orig_sr=sr, target_sr=target_sr)
            return data.astype(np.float32)
        except Exception as e2:
            print(f"[inference.py] soundfile load warning: {e2}, trying scipy wavfile fallback...")
            try:
                sr, data = wavfile.read(audio_input)
                if data.dtype == np.int16:
                    data = data.astype(np.float32) / 32768.0
                elif data.dtype == np.int32:
                    data = data.astype(np.float32) / 2147483648.0
                if len(data.shape) > 1:
                    data = np.mean(data, axis=1)
                if sr != target_sr:
                    data = librosa.resample(data, orig_sr=sr, target_sr=target_sr)
                return data.astype(np.float32)
            except Exception as e3:
                raise ValueError(f"Unable to parse audio format ({e3})")

def extract_features_and_predict(audio_input):
    """
    Executes the exact 8-step ML input preprocessing pipeline:
    1. Load audio (mono=True, sr=48000 Hz)
    2. Butterworth Bandpass filter (order=4, 80Hz - 8000Hz, sosfilt)
    3. Mel Spectrogram (sr=48000, n_mels=128, n_fft=2048, hop_length=512, power=2.0)
    4. Convert to dB (librosa.power_to_db, ref=np.max)
    5. Fixed size 128 x 512 (clip or pad with -80 dB)
    6. Normalize: clip((mel_db + 80) / 80, 0, 1)
    7. Extract 512 features: [mean (128), std (128), max (128), min (128)]
    8. Random Forest model prediction probability
    """
    model = load_model()

    # Step 1: Load audio
    y = load_audio_safely(audio_input, target_sr=48000)
    if len(y) == 0:
        raise ValueError("Audio signal is empty.")

    # Step 2: Bandpass filter
    sos = butter(4, [80, 8000], btype='bandpass', fs=48000, output='sos')
    filtered_y = sosfilt(sos, y)

    # Step 3: Mel Spectrogram
    mel = librosa.feature.melspectrogram(
        y=filtered_y, sr=48000, n_mels=128, n_fft=2048, hop_length=512, power=2.0
    )

    # Step 4: Convert to dB
    mel_db = librosa.power_to_db(mel, ref=np.max)

    # Step 5: Fixed size (128 x 512), padding with -80 dB
    target_frames = 512
    n_frames = mel_db.shape[1]

    if n_frames >= target_frames:
        mel_fixed = mel_db[:, :target_frames]
    else:
        pad_width = target_frames - n_frames
        mel_fixed = np.pad(mel_db, ((0, 0), (0, pad_width)), mode='constant', constant_values=-80.0)

    # Step 6: Normalize
    mel_norm = np.clip((mel_fixed + 80.0) / 80.0, 0.0, 1.0)

    # Step 7: Extract 512 numerical features in EXACT order [mean, std, max, min]
    mean_feats = np.mean(mel_norm, axis=1)  # 128
    std_feats = np.std(mel_norm, axis=1)    # 128
    max_feats = np.max(mel_norm, axis=1)    # 128
    min_feats = np.min(mel_norm, axis=1)    # 128

    features = np.concatenate([mean_feats, std_feats, max_feats, min_feats])
    if len(features) != 512:
        raise ValueError(f"Feature vector dimension mismatch: expected 512, got {len(features)}")

    # Step 8: Predict using Random Forest
    features_2d = features.reshape(1, -1)
    probabilities = model.predict_proba(features_2d)[0]
    
    # Class 1 probability
    prob_class_1 = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
    prediction = 1 if prob_class_1 >= 0.5 else 0

    return {
        "prediction": prediction,
        "probability": round(prob_class_1, 4),
        "percentage": round(prob_class_1 * 100, 2),
        "spectrogram_shape": [128, 512],
        "n_features": 512
    }
