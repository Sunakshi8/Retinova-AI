export interface QualityMetrics {
  is_valid_fundus: boolean;
  blur_score: number;
  is_sharp: boolean;
  illumination_score: number;
  is_well_illuminated: boolean;
  contrast_score: number;
  is_adequate_contrast: boolean;
  rejection_reasons: string[];
  overall_quality_passed: boolean;
}

export interface PredictionResult {
  analysis_id: string;
  timestamp: string;
  model_name: string;
  model_version: string;
  predicted_grade: number;
  predicted_class: string;
  class_probabilities: Record<string, number>;
  epistemic_uncertainty: number;
  predictive_entropy: number;
  confidence_interval: [number, number];
  prediction_accepted: boolean;
  rejection_reason: string | null;
  rejection_threshold: number;
  quality_metrics: QualityMetrics;
  processing_time_ms: number;
  image_hash: string;
  gradcam_available: boolean;
  gradcam_image_base64: string | null;
  heatmap_only_base64: string | null;
  explanation_method: string;
}

export interface SampleImage {
  id: string;
  name: string;
  stage: number;
  filename: string;
  poor: boolean;
  desc: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  image_hash: string;
  model_name: string;
  model_version: string;
  predicted_grade: number;
  predicted_class: string;
  confidence: number;
  class_probabilities: Record<string, number>;
  epistemic_uncertainty: number;
  predictive_entropy: number;
  prediction_accepted: boolean;
  rejection_reason: string | null;
  quality_passed: boolean;
  blur_score: number;
  illumination_score: number;
  processing_time_ms: number;
  image_thumbnail_base64?: string;
  gradcam_thumbnail_base64?: string;
}

export interface ModelMetrics {
  model_name: string;
  model_version: string;
  parameters_million: number;
  latency_ms: number;
  gflops: number;
  accuracy: number;
  macro_f1: number;
  balanced_accuracy: number;
  quadratic_weighted_kappa: number;
  precision_macro: number;
  recall_macro: number;
  ece_before_calibration: number;
  ece_after_calibration: number;
  per_class_metrics: Record<string, {
    precision: number;
    recall: number;
    f1: number;
    support: number;
    roc_auc: number;
  }>;
  confusion_matrix_raw: number[][];
  confusion_matrix_normalized: number[][];
  roc_curves: Record<string, Array<{ fpr: number; tpr: number }>>;
  calibration_bins: Array<{
    bin: string;
    confidence: number;
    accuracy: number;
    count: number;
  }>;
  selective_prediction_curve: Array<{
    coverage: number;
    error_rate: number;
    threshold: number;
  }>;
}

export interface DatasetBenchmark {
  dataset_name: string;
  dataset_type: string;
  total_images: number;
  grading_convention: string;
  split_info: string;
  source_devices: string[];
  class_distribution: Record<string, number>;
  models: {
    convnext_tiny: ModelMetrics;
    efficientnet_b3: ModelMetrics;
  };
}

export type BenchmarkData = Record<string, DatasetBenchmark>;
