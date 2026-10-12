import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "retinova.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analysis_records (
        id TEXT PRIMARY KEY,
        created_at TEXT,
        image_hash TEXT,
        model_name TEXT,
        model_version TEXT,
        predicted_grade INTEGER,
        predicted_class TEXT,
        confidence REAL,
        class_probabilities_json TEXT,
        epistemic_uncertainty REAL,
        predictive_entropy REAL,
        prediction_accepted INTEGER,
        rejection_reason TEXT,
        quality_passed INTEGER,
        blur_score REAL,
        illumination_score REAL,
        rejection_reasons_json TEXT,
        processing_time_ms REAL,
        image_thumbnail_base64 TEXT,
        gradcam_thumbnail_base64 TEXT
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_created ON analysis_records(created_at DESC);")
    conn.commit()
    conn.close()

def add_record(record: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO analysis_records (
        id, created_at, image_hash, model_name, model_version,
        predicted_grade, predicted_class, confidence, class_probabilities_json,
        epistemic_uncertainty, predictive_entropy, prediction_accepted, rejection_reason,
        quality_passed, blur_score, illumination_score, rejection_reasons_json,
        processing_time_ms, image_thumbnail_base64, gradcam_thumbnail_base64
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        record["id"],
        record.get("timestamp") or datetime.utcnow().isoformat(),
        record.get("image_hash", ""),
        record.get("model_name", "ConvNeXt-Tiny"),
        record.get("model_version", "v1.4.2-retina"),
        record.get("predicted_grade", 0),
        record.get("predicted_class", "No DR"),
        record.get("confidence", 0.0),
        json.dumps(record.get("class_probabilities", {})),
        record.get("epistemic_uncertainty", 0.0),
        record.get("predictive_entropy", 0.0),
        1 if record.get("prediction_accepted", True) else 0,
        record.get("rejection_reason"),
        1 if record.get("quality_passed", True) else 0,
        record.get("blur_score", 0.0),
        record.get("illumination_score", 0.0),
        json.dumps(record.get("rejection_reasons", [])),
        record.get("processing_time_ms", 0.0),
        record.get("image_thumbnail_base64"),
        record.get("gradcam_thumbnail_base64")
    ))
    conn.commit()
    conn.close()

def get_records(
    search: Optional[str] = None,
    grade: Optional[int] = None,
    accepted_only: Optional[bool] = None,
    limit: int = 50
) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM analysis_records WHERE 1=1"
    params = []
    
    if search:
        query += " AND (id LIKE ? OR predicted_class LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    if grade is not None:
        query += " AND predicted_grade = ?"
        params.append(grade)
    if accepted_only is not None:
        query += " AND prediction_accepted = ?"
        params.append(1 if accepted_only else 0)
        
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "timestamp": r["created_at"],
            "image_hash": r["image_hash"],
            "model_name": r["model_name"],
            "model_version": r["model_version"],
            "predicted_grade": r["predicted_grade"],
            "predicted_class": r["predicted_class"],
            "confidence": r["confidence"],
            "class_probabilities": json.loads(r["class_probabilities_json"]) if r["class_probabilities_json"] else {},
            "epistemic_uncertainty": r["epistemic_uncertainty"],
            "predictive_entropy": r["predictive_entropy"],
            "prediction_accepted": bool(r["prediction_accepted"]),
            "rejection_reason": r["rejection_reason"],
            "quality_passed": bool(r["quality_passed"]),
            "blur_score": r["blur_score"],
            "illumination_score": r["illumination_score"],
            "processing_time_ms": r["processing_time_ms"],
            "image_thumbnail_base64": r["image_thumbnail_base64"],
            "gradcam_thumbnail_base64": r["gradcam_thumbnail_base64"],
        })
    conn.close()
    return results

def delete_record(record_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analysis_records WHERE id = ?", (record_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
