"""Optional local PyTorch inference service. No model is fabricated if weights are absent."""
from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Any

BACKEND_DIR = Path(__file__).resolve().parents[2]
ARTIFACT_DIR = BACKEND_DIR / "ml_artifacts"
MODEL_PATH = Path(os.getenv("DERMALENS_MODEL_PATH", ARTIFACT_DIR / "best_model.pt"))
METRICS_PATH = Path(os.getenv("DERMALENS_METRICS_PATH", ARTIFACT_DIR / "comparison_metrics.json"))
DEVICE_NAME = os.getenv("DERMALENS_DEVICE", "cpu")

def load_metrics() -> dict[str, Any]:
    if not METRICS_PATH.exists():
        return {
            "status": "not_trained",
            "message": "No evaluation report found yet. Train and evaluate models using backend/ml/train_compare.py.",
            "models": [],
            "dataset_note": "Training requires a labeled public dermatology dataset arranged into class folders."
        }
    try:
        return json.loads(METRICS_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"status": "unavailable", "message": "Metrics report could not be read.", "models": []}

def model_status() -> dict[str, Any]:
    return {
        "available": MODEL_PATH.exists(),
        "model_path": str(MODEL_PATH),
        "metrics_path": str(METRICS_PATH),
        "metrics": load_metrics(),
        "prediction_note": "Predictions are research/screening support only and are not a diagnosis."
    }

def predict_image(image_bytes: bytes) -> dict[str, Any]:
    """Run inference only after a real trained checkpoint is supplied."""
    if not MODEL_PATH.exists():
        raise RuntimeError("No trained DermaLens model is installed. Train a model first; no synthetic prediction was generated.")
    try:
        import torch
        from PIL import Image
        from torchvision import transforms, models
        import io
        checkpoint = torch.load(MODEL_PATH, map_location=DEVICE_NAME, weights_only=False)
        classes = checkpoint["classes"]
        architecture = checkpoint.get("architecture", "resnet18")
        if architecture == "custom_cnn":
            from .train_models import CustomCNN
            model = CustomCNN(len(classes))
        elif architecture == "resnet50":
            model = models.resnet50(weights=None)
            model.fc = torch.nn.Linear(model.fc.in_features, len(classes))
        else:
            model = models.resnet18(weights=None)
            model.fc = torch.nn.Linear(model.fc.in_features, len(classes))
        model.load_state_dict(checkpoint["state_dict"])
        model.eval().to(DEVICE_NAME)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tfm = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
        ])
        with torch.no_grad():
            probs = torch.softmax(model(tfm(image).unsqueeze(0).to(DEVICE_NAME)), dim=1)[0].cpu()
        order = torch.argsort(probs, descending=True)[:min(3, len(classes))]
        top = [{"label": classes[int(i)], "confidence": round(float(probs[int(i)]), 4)} for i in order]
        confidence = top[0]["confidence"] if top else 0.0
        return {
            "status": "model_prediction",
            "model": architecture,
            "predicted_class": top[0]["label"] if top else None,
            "confidence": confidence,
            "confidence_percent": round(confidence * 100, 1),
            "top_predictions": top,
            "explanation": "The class and scores reflect learned image-pattern associations. They do not identify a condition with clinical certainty.",
            "next_steps": safe_guidance(confidence),
            "disclaimer": "Not a medical diagnosis. A dermatologist should assess concerning, changing, bleeding, painful, or non-healing skin lesions."
        }
    except Exception as exc:
        raise RuntimeError(f"Model inference failed: {exc}") from exc

def safe_guidance(confidence: float) -> list[str]:
    guidance = [
        "Do not use this result to self-diagnose or delay medical care.",
        "If the spot is new, changing, asymmetrical, has irregular borders or multiple colors, or is bleeding/non-healing, arrange assessment by a qualified clinician.",
        "Take clear, well-lit photos over time only as a supplement to professional care."
    ]
    if confidence < 0.60:
        guidance.insert(0, "The model is uncertain; do not interpret the highest score as a reliable identification.")
    return guidance
