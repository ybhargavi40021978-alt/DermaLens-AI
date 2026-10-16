# DermaLens ML training and evaluation

## Dataset
The ZIP currently contains only one image under `backend/dataset/not_reliably_assessable/...`; that is not a labeled multi-class training set. Obtain a public dataset (for example, HAM10000 or another appropriately licensed dermatology dataset) and read its terms, label definitions, and intended-use restrictions. Do not treat a folder name or image as a clinical ground truth.

Organize labeled images as PyTorch `ImageFolder` directories:

```
data/skin-dataset/
  class_1/
    image001.jpg
  class_2/
    image002.jpg
```

For datasets whose labels are in a CSV, first create a reviewed mapping from image IDs to labels. Keep images from the same patient exclusively in one split where patient identifiers exist.

## Install and train
From `backend/` in a Python 3.10–3.12 environment:

```
pip install -r requirements-ml.txt
python -m ml.train_compare --data-dir ../data/skin-dataset --epochs 5
```

This trains a baseline CNN, a fine-tuned ResNet18 transfer-learning model, and a pretrained ResNet50 vision backbone. Results are written to `backend/ml_artifacts/comparison_metrics.json`; checkpoints are saved alongside it. Increase epochs and validate on a separate external dataset before drawing conclusions. Training downloads torchvision pretrained weights when needed.

## API
Start the existing FastAPI server as usual. `GET /api/ml/status` reports whether a checkpoint and evaluation report exist. `GET /api/ml/metrics` returns the actual generated comparison report. `POST /api/ml/predict` accepts an image upload and returns top class scores plus cautious next-step guidance. If no trained checkpoint exists, prediction returns HTTP 503 instead of fabricated output.

## Safety and limitations
This is an educational research/screening aid, not a diagnostic device. Do not use it to rule out skin cancer or defer clinical care. Report per-class recall and confusion matrices, examine errors across skin tones and image sources, check calibration, and use patient-level splits. Never claim a model is clinically validated based on internal test metrics alone.
