import json
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime
from datetime import datetime
from database import Base

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    image_hash = Column(String, index=True)
    model_name = Column(String, index=True)
    model_version = Column(String)
    predicted_grade = Column(Integer)
    predicted_class = Column(String, index=True)
    confidence = Column(Float)
    class_probabilities_json = Column(Text)
    
    # Uncertainty
    epistemic_uncertainty = Column(Float)
    predictive_entropy = Column(Float)
    prediction_accepted = Column(Boolean, index=True)
    rejection_reason = Column(String, nullable=True)
    
    # Quality Screening
    quality_passed = Column(Boolean)
    blur_score = Column(Float)
    illumination_score = Column(Float)
    rejection_reasons_json = Column(Text, default="[]")
    
    # Latency & details
    processing_time_ms = Column(Float)
    image_thumbnail_base64 = Column(Text, nullable=True)
    gradcam_thumbnail_base64 = Column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.created_at.isoformat() if self.created_at else "",
            "image_hash": self.image_hash,
            "model_name": self.model_name,
            "model_version": self.model_version,
            "predicted_grade": self.predicted_grade,
            "predicted_class": self.predicted_class,
            "confidence": self.confidence,
            "class_probabilities": json.loads(self.class_probabilities_json) if self.class_probabilities_json else {},
            "epistemic_uncertainty": self.epistemic_uncertainty,
            "predictive_entropy": self.predictive_entropy,
            "prediction_accepted": self.prediction_accepted,
            "rejection_reason": self.rejection_reason,
            "quality_passed": self.quality_passed,
            "blur_score": self.blur_score,
            "illumination_score": self.illumination_score,
            "processing_time_ms": self.processing_time_ms,
            "image_thumbnail_base64": self.image_thumbnail_base64
        }
