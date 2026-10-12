from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class QualityMetrics(BaseModel):
    is_valid_fundus: bool
    blur_score: float
    is_sharp: bool
    illumination_score: float
    is_well_illuminated: bool
    contrast_score: float
    is_adequate_contrast: bool
    rejection_reasons: List[str] = []
    overall_quality_passed: bool

class ProbabilityDistribution(BaseModel):
    no_dr: float = Field(..., alias="No DR")
    mild: float = Field(..., alias="Mild")
    moderate: float = Field(..., alias="Moderate")
    severe: float = Field(..., alias="Severe")
    proliferative: float = Field(..., alias="Proliferative DR")

    class Config:
        populate_by_name = True

class PredictionResult(BaseModel):
    analysis_id: str
    timestamp: str
    model_name: str
    model_version: str
    predicted_grade: int
    predicted_class: str
    class_probabilities: Dict[str, float]
    
    # Uncertainty & Selective Prediction
    epistemic_uncertainty: float
    predictive_entropy: float
    confidence_interval: List[float]
    prediction_accepted: bool
    rejection_reason: Optional[str] = None
    rejection_threshold: float
    
    # Image Quality
    quality_metrics: QualityMetrics
    
    # Processing stats
    processing_time_ms: float
    image_hash: str
    
    # Grad-CAM visualization
    gradcam_available: bool
    gradcam_image_base64: Optional[str] = None
    heatmap_only_base64: Optional[str] = None
    explanation_method: str = "Grad-CAM (Final Convolutional / Residual Layer)"

class HistoryItem(BaseModel):
    id: str
    timestamp: str
    model_name: str
    predicted_class: str
    predicted_grade: int
    confidence: float
    uncertainty: float
    prediction_accepted: bool
    quality_passed: bool
    processing_time_ms: float
    image_thumbnail_base64: Optional[str] = None

class ModelBenchmarkMetrics(BaseModel):
    model_name: str
    model_version: str
    parameters_million: float
    latency_ms: float
    accuracy: float
    macro_f1: float
    balanced_accuracy: float
    quadratic_weighted_kappa: float
    precision_macro: float
    recall_macro: float
    ece_before_calibration: float
    ece_after_calibration: float
    per_class_metrics: Dict[str, Dict[str, float]]
    confusion_matrix_raw: List[List[int]]
    confusion_matrix_normalized: List[List[float]]
    roc_curves: Dict[str, List[Dict[str, float]]]
    calibration_bins: List[Dict[str, float]]
    selective_prediction_curve: List[Dict[str, float]]

class DatasetEvaluation(BaseModel):
    dataset_name: str
    dataset_type: str # "Internal Validation (EyePACS)" or "External Independent Test (Messidor-2)"
    total_images: int
    grading_convention: str
    split_info: str
    models: Dict[str, ModelBenchmarkMetrics]
