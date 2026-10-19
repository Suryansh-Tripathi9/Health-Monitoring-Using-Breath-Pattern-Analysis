import os
import json
import joblib
import numpy as np
import librosa
from scipy.signal import butter, sosfilt

_MODEL_INSTANCE = None
_CONDITION_MAPPING = None

# ============================================================
# KAUH MODEL CONFIGURATION
# ============================================================
TARGET_SR = 4000
LOW_FREQ = 20
HIGH_FREQ = 1800

N_MELS = 64
N_FFT = 512
HOP_LENGTH = 128

DEFAULT_CONDITION_MAPPING = {
    "Normal": [
        "Normal/reference respiratory pattern"
    ],
    "Wheeze-dominant": [
        "Asthma",
        "COPD"
    ],
    "Crackle-dominant": [
        "Heart Failure",
        "Pneumonia",
        "Lung Fibrosis",
        "BRON",
        "Pleural Effusion"
    ]
}


def get_model_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "models", "kauh_breath_pattern_rf.pkl")


def load_model():
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is None:
        model_path = get_model_path()
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        _MODEL_INSTANCE = joblib.load(model_path)
        print(f"[ML Service] Loaded KAUH model: {model_path}")
    return _MODEL_INSTANCE


def load_condition_mapping():
    global _CONDITION_MAPPING
    if _CONDITION_MAPPING is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        mapping_path = os.path.join(base_dir, "models", "pattern_condition_mapping.json")
        if os.path.exists(mapping_path):
            try:
                with open(mapping_path, "r", encoding="utf-8") as f:
                    _CONDITION_MAPPING = json.load(f)
            except Exception as e:
                print(f"[ML Service Warning] Failed to load condition mapping JSON: {e}")
                _CONDITION_MAPPING = DEFAULT_CONDITION_MAPPING
        else:
            _CONDITION_MAPPING = DEFAULT_CONDITION_MAPPING
    return _CONDITION_MAPPING


def load_audio(audio_input):
    """Loads audio input into float32 4000Hz mono numpy array"""
    audio, sr = librosa.load(audio_input, sr=TARGET_SR, mono=True)
    if len(audio) == 0:
        raise ValueError("Audio signal is empty.")
    return audio, sr


def bandpass_filter(audio, sr, low_freq, high_freq):
    """4th-order Butterworth bandpass filter (20Hz - 1800Hz)"""
    sos = butter(4, [low_freq, high_freq], btype="bandpass", fs=sr, output="sos")
    return sosfilt(sos, audio)


def extract_richer_features(file_path):
    """
    Extracts exactly 102 audio features based on the KAUH training pipeline:
    1. 20 MFCC coefficients (mean + std = 40)
    2. 20 MFCC delta coefficients (mean + std = 40)
    3. Spectral centroid (mean + std = 2)
    4. Spectral bandwidth (mean + std = 2)
    5. Spectral rolloff roll_percent=0.85 (mean + std = 2)
    6. Zero crossing rate (mean + std = 2)
    7. RMS energy (mean + std = 2)
    8. Spectral contrast n_bands=5 fmin=20 (mean + std = 12)
    Total features = 102
    """
    audio, sr = load_audio(file_path)
    audio = bandpass_filter(audio, sr, LOW_FREQ, HIGH_FREQ)

    features = []

    # 1. MFCCs (20 coefficients -> 20 mean + 20 std = 40)
    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=20,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH,
        n_mels=N_MELS
    )
    features.extend(np.mean(mfcc, axis=1))
    features.extend(np.std(mfcc, axis=1))

    # 2. MFCC Delta (20 mean + 20 std = 40)
    mfcc_delta = librosa.feature.delta(mfcc)
    features.extend(np.mean(mfcc_delta, axis=1))
    features.extend(np.std(mfcc_delta, axis=1))

    # 3. Spectral Features (5 features -> 5 mean + 5 std = 10)
    spectral_centroid = librosa.feature.spectral_centroid(
        y=audio, sr=sr, n_fft=N_FFT, hop_length=HOP_LENGTH
    )
    spectral_bandwidth = librosa.feature.spectral_bandwidth(
        y=audio, sr=sr, n_fft=N_FFT, hop_length=HOP_LENGTH
    )
    spectral_rolloff = librosa.feature.spectral_rolloff(
        y=audio, sr=sr, n_fft=N_FFT, hop_length=HOP_LENGTH, roll_percent=0.85
    )
    zcr = librosa.feature.zero_crossing_rate(
        audio, frame_length=N_FFT, hop_length=HOP_LENGTH
    )
    rms = librosa.feature.rms(
        y=audio, frame_length=N_FFT, hop_length=HOP_LENGTH
    )

    for feat in [spectral_centroid, spectral_bandwidth, spectral_rolloff, zcr, rms]:
        features.append(np.mean(feat))
        features.append(np.std(feat))

    # 4. Spectral Contrast (6 subbands -> 6 mean + 6 std = 12)
    contrast = librosa.feature.spectral_contrast(
        y=audio,
        sr=sr,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH,
        n_bands=5,
        fmin=20
    )
    features.extend(np.mean(contrast, axis=1))
    features.extend(np.std(contrast, axis=1))

    features = np.asarray(features, dtype=np.float32)

    if len(features) != 102:
        raise ValueError(f"Feature vector dimension mismatch: expected 102, got {len(features)}")

    return features


def extract_features_and_predict(audio_input):
    """
    Runs KAUH feature extraction and executes Random Forest inference.
    Returns pattern string directly, class probability, and dataset-derived condition associations.
    """
    model = load_model()
    condition_map = load_condition_mapping()

    features = extract_richer_features(audio_input)
    features_2d = features.reshape(1, -1)

    probabilities = model.predict_proba(features_2d)[0]
    predicted_index = int(np.argmax(probabilities))

    pattern = str(model.classes_[predicted_index])
    confidence = float(probabilities[predicted_index])

    possible_conditions = condition_map.get(pattern, ["Under investigation"])

    return {
        "prediction": pattern,
        "pattern": pattern,
        "probability": round(confidence, 4),
        "percentage": round(confidence * 100, 2),
        "n_features": 102,
        "possible_conditions": possible_conditions
    }