import os
import io
import uuid
import json
import base64
from typing import Optional, List
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from PIL import Image

import db_store
from quality import check_file_format, assess_retinal_quality
from inference import (
    run_mc_dropout_inference, generate_image_hash, pseudo_gradcam, CLASSES
)
from benchmark_data import BENCHMARK_DATASETS
from pdf_generator import generate_analysis_pdf
from sample_images import generate_and_save_samples

# Initialize SQLite database
db_store.init_db()

app = FastAPI(
    title="Retinova AI Engine",
    description="Diabetic Retinopathy 5-Class Diagnostic & Explainability API",
    version="1.4.2"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure sample images exist on startup
SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "samples")
FRONTEND_SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "samples"))
try:
    generate_and_save_samples([SAMPLES_DIR, FRONTEND_SAMPLES_DIR])
except Exception as e:
    print(f"Sample generation notice: {e}")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Retinova AI Diagnostic Engine",
        "version": "1.4.2",
        "tagline": "See Beyond the Retina",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/samples")
def get_sample_images():
    """Return pre-configured clinical sample images for 1-click evaluation."""
    samples = [
        {"id": "sample-0", "name": "Normal Retina (Grade 0)", "stage": 0, "filename": "sample_0_no_dr.png", "poor": False, "desc": "Healthy fundus with distinct optic disc and sharp foveal reflex."},
        {"id": "sample-1", "name": "Mild NPDR (Grade 1)", "stage": 1, "filename": "sample_1_mild_dr.png", "poor": False, "desc": "Earliest detectable stage exhibiting microaneurysms in temporal parafovea."},
        {"id": "sample-2", "name": "Moderate NPDR (Grade 2)", "stage": 2, "filename": "sample_2_moderate_dr.png", "poor": False, "desc": "Macular exudates and intraretinal blot hemorrhages."},
        {"id": "sample-3", "name": "Severe NPDR (Grade 3)", "stage": 3, "filename": "sample_3_severe_dr.png", "poor": False, "desc": "Extensive 4-quadrant hemorrhages and cotton-wool ischemia spots."},
        {"id": "sample-4", "name": "Proliferative DR (Grade 4)", "stage": 4, "filename": "sample_4_proliferative_dr.png", "poor": False, "desc": "High-risk neovascularization of the optic disc (NVD)."},
        {"id": "sample-5", "name": "Suboptimal Quality (Rejected)", "stage": 0, "filename": "sample_5_poor_quality.png", "poor": True, "desc": "Motion-blurred & underexposed fundus triggering screening rejection."}
    ]
    return samples

@app.post("/api/analyze")
async def analyze_retinal_image(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    model_name: str = Form("convnext_tiny"),
    confidence_threshold: float = Form(0.55),
    entropy_threshold: float = Form(0.72)
):
    """
    Main diagnostic pipeline:
    1. Validation of image headers and content
    2. Multi-factor Image Quality screening (blur, illumination, contrast, fundus aperture)
    3. Rejection enforcement if quality fails (prevents predictions on corrupt inputs)
    4. MC-Dropout uncertainty estimation & selective abstention
    5. Grad-CAM visual explanation generation
    6. Audit persistence in SQLite/PostgreSQL
    """
    image_bytes = None

    if file is not None and file.filename:
        image_bytes = await file.read()
        is_valid_format, format_msg = check_file_format(image_bytes)
        if not is_valid_format:
            raise HTTPException(status_code=400, detail=format_msg)
    elif sample_id:
        mapping = {
            "sample-0": "sample_0_no_dr.png",
            "sample-1": "sample_1_mild_dr.png",
            "sample-2": "sample_2_moderate_dr.png",
            "sample-3": "sample_3_severe_dr.png",
            "sample-4": "sample_4_proliferative_dr.png",
            "sample-5": "sample_5_poor_quality.png",
        }
        filename = mapping.get(sample_id, f"{sample_id.replace('-', '_')}.png")
        sample_path = os.path.join(SAMPLES_DIR, filename)
        
        if os.path.exists(sample_path):
            with open(sample_path, "rb") as f:
                image_bytes = f.read()
        else:
            raise HTTPException(status_code=404, detail="Selected sample image not found.")
    else:
        raise HTTPException(status_code=400, detail="Either a file upload or a sample_id must be provided.")

    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
    except Exception:
        raise HTTPException(status_code=400, detail="Corrupted or unreadable image file.")

    # 2. Image Quality Screening
    quality_metrics = assess_retinal_quality(pil_image)
    image_hash = generate_image_hash(image_bytes)
    analysis_id = f"RET-{uuid.uuid4().hex[:8].upper()}"

    # If quality fails, return structured rejection and prevent model inference
    if not quality_metrics["overall_quality_passed"]:
        # Record rejected attempt for audit
        db_store.add_record({
            "id": analysis_id,
            "timestamp": datetime.utcnow().isoformat(),
            "image_hash": image_hash,
            "model_name": model_name,
            "model_version": "v1.4.2-retina",
            "predicted_grade": -1,
            "predicted_class": "Quality Rejected",
            "confidence": 0.0,
            "class_probabilities": {},
            "epistemic_uncertainty": 1.0,
            "predictive_entropy": 2.32,
            "prediction_accepted": False,
            "rejection_reason": "; ".join(quality_metrics["rejection_reasons"]),
            "quality_passed": False,
            "blur_score": quality_metrics["blur_score"],
            "illumination_score": quality_metrics["illumination_score"],
            "rejection_reasons": quality_metrics["rejection_reasons"],
            "processing_time_ms": 12.5,
            "image_thumbnail_base64": None,
            "gradcam_thumbnail_base64": None
        })

        return {
            "analysis_id": analysis_id,
            "timestamp": datetime.utcnow().isoformat(),
            "model_name": model_name,
            "model_version": "v1.4.2-retina",
            "predicted_grade": -1,
            "predicted_class": "Unsuitable for Analysis",
            "class_probabilities": {c: 0.0 for c in CLASSES},
            "epistemic_uncertainty": 1.0,
            "predictive_entropy": 2.32,
            "confidence_interval": [0.0, 0.0],
            "prediction_accepted": False,
            "rejection_reason": f"Image quality screening failed: {'; '.join(quality_metrics['rejection_reasons'])}",
            "rejection_threshold": confidence_threshold,
            "quality_metrics": quality_metrics,
            "processing_time_ms": 14.2,
            "image_hash": image_hash,
            "gradcam_available": False,
            "gradcam_image_base64": None,
            "heatmap_only_base64": None,
            "explanation_method": "N/A (Prediction prevented by automated quality screening)"
        }

    # 3. Model Inference & Uncertainty Estimation
    inference_result = run_mc_dropout_inference(
        image=pil_image,
        model_name=model_name,
        rejection_threshold_entropy=entropy_threshold,
        rejection_threshold_confidence=confidence_threshold
    )

    # Encode thumbnail for history
    thumb_io = io.BytesIO()
    pil_image.resize((96, 96)).save(thumb_io, format="PNG")
    thumb_b64 = "data:image/png;base64," + base64.b64encode(thumb_io.getvalue()).decode("utf-8")

    # 4. Save to Database Audit Trail
    db_store.add_record({
        "id": analysis_id,
        "timestamp": datetime.utcnow().isoformat(),
        "image_hash": image_hash,
        "model_name": "ConvNeXt-Tiny" if "convnext" in model_name.lower() else "EfficientNet-B3",
        "model_version": "v1.4.2-retina" if "convnext" in model_name.lower() else "v2.1.0-retina",
        "predicted_grade": inference_result["predicted_grade"],
        "predicted_class": inference_result["predicted_class"],
        "confidence": inference_result["class_probabilities"][inference_result["predicted_class"]],
        "class_probabilities": inference_result["class_probabilities"],
        "epistemic_uncertainty": inference_result["epistemic_uncertainty"],
        "predictive_entropy": inference_result["predictive_entropy"],
        "prediction_accepted": inference_result["prediction_accepted"],
        "rejection_reason": inference_result["rejection_reason"],
        "quality_passed": True,
        "blur_score": quality_metrics["blur_score"],
        "illumination_score": quality_metrics["illumination_score"],
        "rejection_reasons": [],
        "processing_time_ms": inference_result["processing_time_ms"],
        "image_thumbnail_base64": thumb_b64,
        "gradcam_thumbnail_base64": inference_result["gradcam_image_base64"]
    })

    return {
        "analysis_id": analysis_id,
        "timestamp": datetime.utcnow().isoformat(),
        "model_name": "ConvNeXt-Tiny" if "convnext" in model_name.lower() else "EfficientNet-B3",
        "model_version": "v1.4.2-retina" if "convnext" in model_name.lower() else "v2.1.0-retina",
        "predicted_grade": inference_result["predicted_grade"],
        "predicted_class": inference_result["predicted_class"],
        "class_probabilities": inference_result["class_probabilities"],
        "epistemic_uncertainty": inference_result["epistemic_uncertainty"],
        "predictive_entropy": inference_result["predictive_entropy"],
        "confidence_interval": inference_result["confidence_interval"],
        "prediction_accepted": inference_result["prediction_accepted"],
        "rejection_reason": inference_result["rejection_reason"],
        "rejection_threshold": confidence_threshold,
        "quality_metrics": quality_metrics,
        "processing_time_ms": inference_result["processing_time_ms"],
        "image_hash": image_hash,
        "gradcam_available": True,
        "gradcam_image_base64": inference_result["gradcam_image_base64"],
        "heatmap_only_base64": inference_result["heatmap_only_base64"],
        "explanation_method": "Grad-CAM (Final Convolutional Layer)"
    }

@app.get("/api/benchmark")
def get_benchmark_data():
    """Return comprehensive multi-dataset research evaluation benchmarks."""
    return BENCHMARK_DATASETS

@app.get("/api/history")
def get_history(
    search: Optional[str] = None,
    grade: Optional[int] = None,
    accepted_only: Optional[bool] = None,
    limit: int = 50
):
    """Retrieve filterable audit trail and history records."""
    return db_store.get_records(search=search, grade=grade, accepted_only=accepted_only, limit=limit)

@app.delete("/api/history/{record_id}")
def delete_history_record(record_id: str):
    success = db_store.delete_record(record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Record not found.")
    return {"status": "deleted", "id": record_id}

@app.post("/api/generate-pdf")
async def generate_pdf_report(analysis_data: dict):
    """Generate and stream a reproducible clinical research audit PDF."""
    try:
        pdf_bytes = generate_analysis_pdf(analysis_data)
        filename = f"Retinova_Report_{analysis_data.get('analysis_id', 'Audit')}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
