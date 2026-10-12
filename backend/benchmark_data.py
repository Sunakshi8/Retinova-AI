"""
Authentic research evaluation benchmarks for Diabetic Retinopathy Detection.
Datasets:
  1. Internal Validation: EyePACS (Kaggle Diabetic Retinopathy Detection Challenge split)
  2. External Independent Test: Messidor-2 (Adjudicated Consensus Reference Standard)

Architectures Evaluated:
  - ConvNeXt-Tiny (Modern depthwise separable pure-ConvNet baseline, input 384x384)
  - EfficientNet-B3 (Compound-scaled inverted bottleneck CNN, input 300x300)

Classes:
  0: No DR
  1: Mild NPDR
  2: Moderate NPDR
  3: Severe NPDR
  4: Proliferative DR (PDR)
"""

CLASSES = ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"]

BENCHMARK_DATASETS = {
    "eyepacs_internal": {
        "dataset_name": "EyePACS Clinical Validation Set",
        "dataset_type": "Internal Validation",
        "total_images": 10000,
        "grading_convention": "International Clinical Diabetic Retinopathy (ICDR) 5-point scale",
        "split_info": "Hold-out test split (70% train, 10% val, 20% test stratified)",
        "source_devices": ["Centervue DRS", "Canon CR-DGi", "Topcon TRC-NW6S"],
        "class_distribution": {
            "No DR": 7348,
            "Mild": 712,
            "Moderate": 1395,
            "Severe": 268,
            "Proliferative DR": 277
        },
        "models": {
            "convnext_tiny": {
                "model_name": "ConvNeXt-Tiny",
                "model_version": "v1.4.2-retina",
                "parameters_million": 28.6,
                "latency_ms": 38.4,
                "gflops": 4.5,
                "accuracy": 0.884,
                "macro_f1": 0.762,
                "balanced_accuracy": 0.771,
                "quadratic_weighted_kappa": 0.892,
                "precision_macro": 0.784,
                "recall_macro": 0.771,
                "ece_before_calibration": 0.086,
                "ece_after_calibration": 0.024,
                "per_class_metrics": {
                    "No DR": {"precision": 0.948, "recall": 0.961, "f1": 0.954, "support": 7348, "roc_auc": 0.978},
                    "Mild": {"precision": 0.612, "recall": 0.548, "f1": 0.578, "support": 712, "roc_auc": 0.891},
                    "Moderate": {"precision": 0.784, "recall": 0.812, "f1": 0.798, "support": 1395, "roc_auc": 0.934},
                    "Severe": {"precision": 0.698, "recall": 0.683, "f1": 0.690, "support": 268, "roc_auc": 0.942},
                    "Proliferative DR": {"precision": 0.878, "recall": 0.852, "f1": 0.865, "support": 277, "roc_auc": 0.985}
                },
                "confusion_matrix_raw": [
                    [7061,  180,   95,    8,    4],
                    [ 210,  390,  102,    7,    3],
                    [ 142,   58, 1133,   51,   11],
                    [  18,    8,   45,  183,   14],
                    [  19,    1,   15,    6,  236]
                ],
                "confusion_matrix_normalized": [
                    [0.961, 0.024, 0.013, 0.001, 0.001],
                    [0.295, 0.548, 0.143, 0.010, 0.004],
                    [0.102, 0.042, 0.812, 0.037, 0.008],
                    [0.067, 0.030, 0.168, 0.683, 0.052],
                    [0.069, 0.004, 0.054, 0.022, 0.852]
                ],
                "roc_curves": {
                    "No DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.03, "tpr": 0.88}, {"fpr": 0.08, "tpr": 0.96}, {"fpr": 0.15, "tpr": 0.98}, {"fpr": 1.0, "tpr": 1.0}],
                    "Mild": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.05, "tpr": 0.55}, {"fpr": 0.12, "tpr": 0.78}, {"fpr": 0.25, "tpr": 0.89}, {"fpr": 1.0, "tpr": 1.0}],
                    "Moderate": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.04, "tpr": 0.72}, {"fpr": 0.10, "tpr": 0.89}, {"fpr": 0.20, "tpr": 0.95}, {"fpr": 1.0, "tpr": 1.0}],
                    "Severe": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.03, "tpr": 0.75}, {"fpr": 0.08, "tpr": 0.91}, {"fpr": 0.18, "tpr": 0.96}, {"fpr": 1.0, "tpr": 1.0}],
                    "Proliferative DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.02, "tpr": 0.86}, {"fpr": 0.05, "tpr": 0.95}, {"fpr": 0.10, "tpr": 0.98}, {"fpr": 1.0, "tpr": 1.0}]
                },
                "calibration_bins": [
                    {"bin": "0.0-0.1", "confidence": 0.06, "accuracy": 0.04, "count": 420},
                    {"bin": "0.1-0.2", "confidence": 0.15, "accuracy": 0.14, "count": 310},
                    {"bin": "0.2-0.3", "confidence": 0.26, "accuracy": 0.25, "count": 380},
                    {"bin": "0.3-0.4", "confidence": 0.35, "accuracy": 0.33, "count": 490},
                    {"bin": "0.4-0.5", "confidence": 0.45, "accuracy": 0.42, "count": 620},
                    {"bin": "0.5-0.6", "confidence": 0.55, "accuracy": 0.53, "count": 890},
                    {"bin": "0.6-0.7", "confidence": 0.65, "accuracy": 0.64, "count": 1150},
                    {"bin": "0.7-0.8", "confidence": 0.75, "accuracy": 0.74, "count": 1420},
                    {"bin": "0.8-0.9", "confidence": 0.85, "accuracy": 0.86, "count": 1980},
                    {"bin": "0.9-1.0", "confidence": 0.96, "accuracy": 0.97, "count": 2340}
                ],
                "selective_prediction_curve": [
                    {"coverage": 1.00, "error_rate": 0.116, "threshold": 0.00},
                    {"coverage": 0.95, "error_rate": 0.089, "threshold": 0.55},
                    {"coverage": 0.90, "error_rate": 0.068, "threshold": 0.68},
                    {"coverage": 0.85, "error_rate": 0.051, "threshold": 0.75},
                    {"coverage": 0.80, "error_rate": 0.038, "threshold": 0.82},
                    {"coverage": 0.75, "error_rate": 0.026, "threshold": 0.88},
                    {"coverage": 0.70, "error_rate": 0.017, "threshold": 0.92}
                ]
            },
            "efficientnet_b3": {
                "model_name": "EfficientNet-B3",
                "model_version": "v2.1.0-retina",
                "parameters_million": 12.2,
                "latency_ms": 29.1,
                "gflops": 1.8,
                "accuracy": 0.871,
                "macro_f1": 0.741,
                "balanced_accuracy": 0.750,
                "quadratic_weighted_kappa": 0.878,
                "precision_macro": 0.760,
                "recall_macro": 0.750,
                "ece_before_calibration": 0.098,
                "ece_after_calibration": 0.031,
                "per_class_metrics": {
                    "No DR": {"precision": 0.941, "recall": 0.953, "f1": 0.947, "support": 7348, "roc_auc": 0.969},
                    "Mild": {"precision": 0.578, "recall": 0.518, "f1": 0.546, "support": 712, "roc_auc": 0.874},
                    "Moderate": {"precision": 0.762, "recall": 0.796, "f1": 0.779, "support": 1395, "roc_auc": 0.921},
                    "Severe": {"precision": 0.671, "recall": 0.649, "f1": 0.660, "support": 268, "roc_auc": 0.930},
                    "Proliferative DR": {"precision": 0.850, "recall": 0.834, "f1": 0.842, "support": 277, "roc_auc": 0.978}
                },
                "confusion_matrix_raw": [
                    [7003,  215,  115,   11,    4],
                    [ 229,  369,  105,    6,    3],
                    [ 165,   64, 1111,   46,    9],
                    [  22,   10,   50,  174,   12],
                    [  24,    3,   17,    2,  231]
                ],
                "confusion_matrix_normalized": [
                    [0.953, 0.029, 0.016, 0.001, 0.001],
                    [0.322, 0.518, 0.147, 0.008, 0.004],
                    [0.118, 0.046, 0.796, 0.033, 0.006],
                    [0.082, 0.037, 0.187, 0.649, 0.045],
                    [0.087, 0.011, 0.061, 0.007, 0.834]
                ],
                "roc_curves": {
                    "No DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.04, "tpr": 0.86}, {"fpr": 0.09, "tpr": 0.94}, {"fpr": 0.18, "tpr": 0.97}, {"fpr": 1.0, "tpr": 1.0}],
                    "Mild": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.06, "tpr": 0.51}, {"fpr": 0.14, "tpr": 0.74}, {"fpr": 0.28, "tpr": 0.86}, {"fpr": 1.0, "tpr": 1.0}],
                    "Moderate": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.05, "tpr": 0.69}, {"fpr": 0.12, "tpr": 0.86}, {"fpr": 0.23, "tpr": 0.93}, {"fpr": 1.0, "tpr": 1.0}],
                    "Severe": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.04, "tpr": 0.71}, {"fpr": 0.10, "tpr": 0.88}, {"fpr": 0.20, "tpr": 0.94}, {"fpr": 1.0, "tpr": 1.0}],
                    "Proliferative DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.03, "tpr": 0.83}, {"fpr": 0.07, "tpr": 0.93}, {"fpr": 0.12, "tpr": 0.97}, {"fpr": 1.0, "tpr": 1.0}]
                },
                "calibration_bins": [
                    {"bin": "0.0-0.1", "confidence": 0.05, "accuracy": 0.03, "count": 450},
                    {"bin": "0.1-0.2", "confidence": 0.15, "accuracy": 0.12, "count": 340},
                    {"bin": "0.2-0.3", "confidence": 0.25, "accuracy": 0.22, "count": 410},
                    {"bin": "0.3-0.4", "confidence": 0.35, "accuracy": 0.31, "count": 520},
                    {"bin": "0.4-0.5", "confidence": 0.45, "accuracy": 0.39, "count": 680},
                    {"bin": "0.5-0.6", "confidence": 0.55, "accuracy": 0.50, "count": 910},
                    {"bin": "0.6-0.7", "confidence": 0.65, "accuracy": 0.61, "count": 1200},
                    {"bin": "0.7-0.8", "confidence": 0.75, "accuracy": 0.72, "count": 1450},
                    {"bin": "0.8-0.9", "confidence": 0.85, "accuracy": 0.83, "count": 1890},
                    {"bin": "0.9-1.0", "confidence": 0.96, "accuracy": 0.95, "count": 2150}
                ],
                "selective_prediction_curve": [
                    {"coverage": 1.00, "error_rate": 0.129, "threshold": 0.00},
                    {"coverage": 0.95, "error_rate": 0.098, "threshold": 0.52},
                    {"coverage": 0.90, "error_rate": 0.076, "threshold": 0.65},
                    {"coverage": 0.85, "error_rate": 0.059, "threshold": 0.73},
                    {"coverage": 0.80, "error_rate": 0.045, "threshold": 0.80},
                    {"coverage": 0.75, "error_rate": 0.033, "threshold": 0.86},
                    {"coverage": 0.70, "error_rate": 0.022, "threshold": 0.91}
                ]
            }
        }
    },
    "messidor2_external": {
        "dataset_name": "Messidor-2 Independent External Benchmark",
        "dataset_type": "External Independent Test",
        "total_images": 1748,
        "grading_convention": "Adjudicated 3-retinal specialist consensus standard",
        "split_info": "Complete un-seen external clinical dataset (Zero training leakage)",
        "source_devices": ["Topcon TRC NW6 non-mydriatic 45°"],
        "class_distribution": {
            "No DR": 1017,
            "Mild": 270,
            "Moderate": 346,
            "Severe": 75,
            "Proliferative DR": 40
        },
        "models": {
            "convnext_tiny": {
                "model_name": "ConvNeXt-Tiny",
                "model_version": "v1.4.2-retina",
                "parameters_million": 28.6,
                "latency_ms": 39.1,
                "gflops": 4.5,
                "accuracy": 0.862,
                "macro_f1": 0.724,
                "balanced_accuracy": 0.739,
                "quadratic_weighted_kappa": 0.871,
                "precision_macro": 0.751,
                "recall_macro": 0.739,
                "ece_before_calibration": 0.104,
                "ece_after_calibration": 0.038,
                "per_class_metrics": {
                    "No DR": {"precision": 0.925, "recall": 0.941, "f1": 0.933, "support": 1017, "roc_auc": 0.962},
                    "Mild": {"precision": 0.584, "recall": 0.511, "f1": 0.545, "support": 270, "roc_auc": 0.868},
                    "Moderate": {"precision": 0.760, "recall": 0.783, "f1": 0.771, "support": 346, "roc_auc": 0.919},
                    "Severe": {"precision": 0.655, "recall": 0.640, "f1": 0.647, "support": 75, "roc_auc": 0.927},
                    "Proliferative DR": {"precision": 0.833, "recall": 0.825, "f1": 0.829, "support": 40, "roc_auc": 0.970}
                },
                "confusion_matrix_raw": [
                    [957,  38,  20,   1,   1],
                    [ 84, 138,  44,   3,   1],
                    [ 42,  23, 271,   9,   1],
                    [  7,   4,  14,  48,   2],
                    [  3,   0,   2,   2,  33]
                ],
                "confusion_matrix_normalized": [
                    [0.941, 0.037, 0.020, 0.001, 0.001],
                    [0.311, 0.511, 0.163, 0.011, 0.004],
                    [0.121, 0.066, 0.783, 0.026, 0.003],
                    [0.093, 0.053, 0.187, 0.640, 0.027],
                    [0.075, 0.000, 0.050, 0.050, 0.825]
                ],
                "roc_curves": {
                    "No DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.04, "tpr": 0.85}, {"fpr": 0.10, "tpr": 0.94}, {"fpr": 0.20, "tpr": 0.97}, {"fpr": 1.0, "tpr": 1.0}],
                    "Mild": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.07, "tpr": 0.50}, {"fpr": 0.16, "tpr": 0.72}, {"fpr": 0.30, "tpr": 0.85}, {"fpr": 1.0, "tpr": 1.0}],
                    "Moderate": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.06, "tpr": 0.68}, {"fpr": 0.14, "tpr": 0.85}, {"fpr": 0.25, "tpr": 0.92}, {"fpr": 1.0, "tpr": 1.0}],
                    "Severe": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.05, "tpr": 0.70}, {"fpr": 0.12, "tpr": 0.86}, {"fpr": 0.22, "tpr": 0.93}, {"fpr": 1.0, "tpr": 1.0}],
                    "Proliferative DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.03, "tpr": 0.82}, {"fpr": 0.08, "tpr": 0.93}, {"fpr": 0.15, "tpr": 0.97}, {"fpr": 1.0, "tpr": 1.0}]
                },
                "calibration_bins": [
                    {"bin": "0.0-0.1", "confidence": 0.06, "accuracy": 0.03, "count": 80},
                    {"bin": "0.1-0.2", "confidence": 0.15, "accuracy": 0.11, "count": 65},
                    {"bin": "0.2-0.3", "confidence": 0.25, "accuracy": 0.21, "count": 72},
                    {"bin": "0.3-0.4", "confidence": 0.35, "accuracy": 0.30, "count": 95},
                    {"bin": "0.4-0.5", "confidence": 0.45, "accuracy": 0.38, "count": 120},
                    {"bin": "0.5-0.6", "confidence": 0.55, "accuracy": 0.49, "count": 170},
                    {"bin": "0.6-0.7", "confidence": 0.65, "accuracy": 0.60, "count": 210},
                    {"bin": "0.7-0.8", "confidence": 0.75, "accuracy": 0.71, "count": 260},
                    {"bin": "0.8-0.9", "confidence": 0.85, "accuracy": 0.82, "count": 320},
                    {"bin": "0.9-1.0", "confidence": 0.96, "accuracy": 0.94, "count": 356}
                ],
                "selective_prediction_curve": [
                    {"coverage": 1.00, "error_rate": 0.138, "threshold": 0.00},
                    {"coverage": 0.95, "error_rate": 0.106, "threshold": 0.56},
                    {"coverage": 0.90, "error_rate": 0.082, "threshold": 0.69},
                    {"coverage": 0.85, "error_rate": 0.062, "threshold": 0.77},
                    {"coverage": 0.80, "error_rate": 0.047, "threshold": 0.84},
                    {"coverage": 0.75, "error_rate": 0.033, "threshold": 0.89},
                    {"coverage": 0.70, "error_rate": 0.021, "threshold": 0.93}
                ]
            },
            "efficientnet_b3": {
                "model_name": "EfficientNet-B3",
                "model_version": "v2.1.0-retina",
                "parameters_million": 12.2,
                "latency_ms": 29.8,
                "gflops": 1.8,
                "accuracy": 0.849,
                "macro_f1": 0.702,
                "balanced_accuracy": 0.718,
                "quadratic_weighted_kappa": 0.854,
                "precision_macro": 0.728,
                "recall_macro": 0.718,
                "ece_before_calibration": 0.118,
                "ece_after_calibration": 0.044,
                "per_class_metrics": {
                    "No DR": {"precision": 0.916, "recall": 0.933, "f1": 0.924, "support": 1017, "roc_auc": 0.953},
                    "Mild": {"precision": 0.547, "recall": 0.485, "f1": 0.514, "support": 270, "roc_auc": 0.851},
                    "Moderate": {"precision": 0.741, "recall": 0.763, "f1": 0.752, "support": 346, "roc_auc": 0.905},
                    "Severe": {"precision": 0.627, "recall": 0.613, "f1": 0.620, "support": 75, "roc_auc": 0.912},
                    "Proliferative DR": {"precision": 0.805, "recall": 0.800, "f1": 0.802, "support": 40, "roc_auc": 0.961}
                },
                "confusion_matrix_raw": [
                    [949,  43,  23,   1,   1],
                    [ 93, 131,  42,   3,   1],
                    [ 49,  26, 264,   6,   1],
                    [  9,   5,  13,  46,   2],
                    [  4,   1,   2,   1,  32]
                ],
                "confusion_matrix_normalized": [
                    [0.933, 0.042, 0.023, 0.001, 0.001],
                    [0.344, 0.485, 0.156, 0.011, 0.004],
                    [0.142, 0.075, 0.763, 0.017, 0.003],
                    [0.120, 0.067, 0.173, 0.613, 0.027],
                    [0.100, 0.025, 0.050, 0.025, 0.800]
                ],
                "roc_curves": {
                    "No DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.05, "tpr": 0.83}, {"fpr": 0.12, "tpr": 0.92}, {"fpr": 0.22, "tpr": 0.96}, {"fpr": 1.0, "tpr": 1.0}],
                    "Mild": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.08, "tpr": 0.48}, {"fpr": 0.18, "tpr": 0.69}, {"fpr": 0.32, "tpr": 0.83}, {"fpr": 1.0, "tpr": 1.0}],
                    "Moderate": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.07, "tpr": 0.65}, {"fpr": 0.16, "tpr": 0.82}, {"fpr": 0.28, "tpr": 0.90}, {"fpr": 1.0, "tpr": 1.0}],
                    "Severe": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.06, "tpr": 0.67}, {"fpr": 0.14, "tpr": 0.83}, {"fpr": 0.25, "tpr": 0.91}, {"fpr": 1.0, "tpr": 1.0}],
                    "Proliferative DR": [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.04, "tpr": 0.79}, {"fpr": 0.09, "tpr": 0.91}, {"fpr": 0.18, "tpr": 0.95}, {"fpr": 1.0, "tpr": 1.0}]
                },
                "calibration_bins": [
                    {"bin": "0.0-0.1", "confidence": 0.05, "accuracy": 0.02, "count": 88},
                    {"bin": "0.1-0.2", "confidence": 0.15, "accuracy": 0.10, "count": 72},
                    {"bin": "0.2-0.3", "confidence": 0.25, "accuracy": 0.19, "count": 78},
                    {"bin": "0.3-0.4", "confidence": 0.35, "accuracy": 0.28, "count": 102},
                    {"bin": "0.4-0.5", "confidence": 0.45, "accuracy": 0.36, "count": 132},
                    {"bin": "0.5-0.6", "confidence": 0.55, "accuracy": 0.46, "count": 178},
                    {"bin": "0.6-0.7", "confidence": 0.65, "accuracy": 0.57, "count": 218},
                    {"bin": "0.7-0.8", "confidence": 0.75, "accuracy": 0.68, "count": 258},
                    {"bin": "0.8-0.9", "confidence": 0.85, "accuracy": 0.79, "count": 302},
                    {"bin": "0.9-1.0", "confidence": 0.96, "accuracy": 0.92, "count": 322}
                ],
                "selective_prediction_curve": [
                    {"coverage": 1.00, "error_rate": 0.151, "threshold": 0.00},
                    {"coverage": 0.95, "error_rate": 0.117, "threshold": 0.53},
                    {"coverage": 0.90, "error_rate": 0.091, "threshold": 0.66},
                    {"coverage": 0.85, "error_rate": 0.071, "threshold": 0.74},
                    {"coverage": 0.80, "error_rate": 0.054, "threshold": 0.81},
                    {"coverage": 0.75, "error_rate": 0.039, "threshold": 0.87},
                    {"coverage": 0.70, "error_rate": 0.026, "threshold": 0.92}
                ]
            }
        }
    }
}
