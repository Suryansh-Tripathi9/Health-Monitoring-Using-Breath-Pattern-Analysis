import os
import json
import joblib
import math
import numpy as np
import pandas as pd

_ENOSE_MODEL_INSTANCE = None
_ENOSE_LABEL_MAPPING = None
_ENOSE_SAMPLE_PRESETS = None

FEATURE_NAMES = [f"feature {i}" for i in range(1, 11)]

def get_enose_model_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "models", "enose_nh3h2_random_forest.pkl")

def get_enose_mapping_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "models", "enose_label_mapping.json")

def get_enose_presets_path():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "models", "enose_sample_presets.json")

def load_enose_model():
    global _ENOSE_MODEL_INSTANCE
    if _ENOSE_MODEL_INSTANCE is None:
        model_path = get_enose_model_path()
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"E-nose model file not found at: {model_path}")
        _ENOSE_MODEL_INSTANCE = joblib.load(model_path)
        print(f"[ML Service] Loaded E-nose model: {model_path}")
    return _ENOSE_MODEL_INSTANCE

def load_enose_mapping():
    global _ENOSE_LABEL_MAPPING
    if _ENOSE_LABEL_MAPPING is None:
        mapping_path = get_enose_mapping_path()
        if os.path.exists(mapping_path):
            with open(mapping_path, "r", encoding="utf-8") as f:
                _ENOSE_LABEL_MAPPING = json.load(f)
        else:
            _ENOSE_LABEL_MAPPING = {}
    return _ENOSE_LABEL_MAPPING

def load_enose_presets():
    global _ENOSE_SAMPLE_PRESETS
    if _ENOSE_SAMPLE_PRESETS is None:
        presets_path = get_enose_presets_path()
        if os.path.exists(presets_path):
            with open(presets_path, "r", encoding="utf-8") as f:
                _ENOSE_SAMPLE_PRESETS = json.load(f)
        else:
            _ENOSE_SAMPLE_PRESETS = []
    return _ENOSE_SAMPLE_PRESETS

def validate_features(features):
    """
    Validates input features for E-nose model:
    - Must be a list or array
    - Exactly 10 items
    - All elements must be numeric, finite, non-NaN
    """
    if not isinstance(features, (list, tuple, np.ndarray)):
        raise ValueError("Features must be provided as a list or array.")
    
    if len(features) != 10:
        raise ValueError(f"E-nose model requires exactly 10 features, got {len(features)}.")
    
    clean_features = []
    for i, val in enumerate(features):
        try:
            val_float = float(val)
        except (ValueError, TypeError):
            raise ValueError(f"Feature at index {i} ('{val}') is not a valid numeric value.")
        
        if math.isnan(val_float) or math.isinf(val_float):
            raise ValueError(f"Feature at index {i} contains invalid numerical value (NaN or Inf).")
        
        clean_features.append(val_float)
        
    return clean_features

def predict_enose_features(features):
    """
    Executes Random Forest inference for E-nose gas sensor features.
    """
    clean_feats = validate_features(features)
    model = load_enose_model()
    mapping = load_enose_mapping()
    
    # Construct DataFrame with exact column names fitted during training
    df_input = pd.DataFrame([clean_feats], columns=FEATURE_NAMES)
    
    # Model prediction
    pred_raw = model.predict(df_input)[0]
    predicted_class = int(pred_raw)
    
    # Model probabilities
    probabilities = model.predict_proba(df_input)[0]
    
    # Associate probability using model.classes_
    class_idx = np.where(model.classes_ == predicted_class)[0]
    if len(class_idx) > 0:
        confidence = float(probabilities[class_idx[0]])
    else:
        confidence = float(np.max(probabilities))
        
    label_str = str(predicted_class)
    meta = mapping.get(label_str, {"gas_a": None, "gas_b": None})
    
    return {
        "success": True,
        "prediction": predicted_class,
        "label": predicted_class,
        "confidence": round(confidence, 4),
        "percentage": round(confidence * 100, 2),
        "model": "enose_nh3h2_random_forest",
        "n_features": 10,
        "features": clean_feats,
        "gas_a": meta.get("gas_a"),
        "gas_b": meta.get("gas_b"),
        "disclaimer": "This module performs gas-mixture classification using a reference e-nose dataset. It is a research prototype and does not provide medical diagnosis."
    }
