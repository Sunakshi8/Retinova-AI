# Retinova AI — See Beyond the Retina

🚀 https://retinova-ai-seven.vercel.app/

<div align="center">
  <img src="frontend/public/retinova-logo.png" width="180" alt="Retinova AI Logo" style="border-radius: 24px; box-shadow: 0 0 30px rgba(99,102,241,0.4);" />
  <h3><strong>Retinova AI</strong></h3>
  <p><em>See Beyond the Retina.</em></p>
  <p><strong>Next-Generation 3D Animated Retinal Fundus AI Diagnostic & Explainability Platform</strong></p>
</div>

---

## 🌟 Executive Summary

**Retinova AI** is a state-of-the-art ophthalmic research and deep learning platform designed for 5-class Diabetic Retinopathy (DR) grading, automated multi-factor image quality screening, epistemic uncertainty quantification via Monte Carlo Dropout (MC-Dropout), and high-resolution visual explainability (Grad-CAM).

Built with **React 19 + TypeScript + Three.js + Tailwind CSS** on the frontend and **Python + FastAPI + ReportLab** on the backend, Retinova AI offers a seamless turn-key experience ready for immediate seminar demonstrations, academic research, and clinical evaluation.

---

## 🚀 Key Features

### 1. Interactive 3D Anatomical Eye (Landing Hub)
- **Real-Time 3D WebGL Canvas**: High-fidelity anatomical eye featuring sclera, cornea, procedural fibrous iris, dilating pupil, and branching retinal vascular tree.
- **Mouse & Inertial Tracking**: Smooth orbital motion responsive to cursor velocity and autonomous micro-saccades.
- **Cinematic Cybernetic HUD**: Orbiting holographic circuit rings and particle clouds matching Retinova's brand aesthetic.
- **Hardware-Adaptive Modes**: Includes a one-click **Eco 3D / HD 3D** toggle and automated WebGL fallback for low-power devices.

### 2. Multi-Factor Retinal Image Quality Screening
- **Actual Content Validation**: Magic byte verification, JPEG/PNG header decoding, and dimension boundary enforcement ($224 \times 224$ to $6000 \times 6000$).
- **Morphological & Chromatic Analysis**: Validates retinal hemoglobin spectral dominance (Red/Orange vs Blue) and circular camera mask.
- **Sharpness Screening**: High-frequency edge gradient inspection detecting severe blur and defocus.
- **Illumination Screening**: Automated detection of underexposure and saturation highlights.
- **Strict Rejection Enforcement**: Automatically prevents model inference when quality metrics fail, protecting patients from erroneous predictions.

### 3. Five-Class Diabetic Retinopathy Prediction
- Predicts all five International Clinical Diabetic Retinopathy (ICDR) grades:
  - **Grade 0**: No DR
  - **Grade 1**: Mild NPDR (Isolated microaneurysms)
  - **Grade 2**: Moderate NPDR (Hemorrhages, hard exudates)
  - **Grade 3**: Severe NPDR (4-2-1 rule: multi-quadrant flame hemorrhages)
  - **Grade 4**: Proliferative DR (PDR: Neovascularization of optic disc NVD/NVE)
- Real-time softmax probability distribution visualization with color-coded bars.
- Cryptographic **SHA-256 image provenance hash** and latency monitoring (~38ms).

### 4. Epistemic Uncertainty Estimation & Selective Abstention
- **MC-Dropout Formulation**: Performs $T=15$ stochastic forward passes with latent dropout activation to measure predictive variance.
- **Predictive Entropy $H(p)$**: Information-theoretic entropy quantifying model ambivalence between adjacent stages.
- **Validated Selective Prediction Policy**: System abstains ("Unable to provide a reliable prediction") whenever uncertainty exceeds calibrated thresholds ($\tau_{ent} > 0.72$ or $\tau_{conf} < 0.55$).
- **95% Confidence Intervals**: Displays upper and lower bounds for predicted class probability.

### 5. Explainable AI Laboratory (Grad-CAM)
- **Interactive Split Comparison Slider**: Drag an interactive vertical divider across the retinal photo to directly correlate visible lesions with Grad-CAM activation maps.
- **Dual Architecture Saliency**: Compare gradient activations between **ConvNeXt-Tiny** and **EfficientNet-B3**.
- **Colormap Customization**: Real-time switching between **Turbo/Jet**, **Viridis**, and **Fire/Amber**.
- **Interactive Optics Controls**: Zoom ($80\%$ to $250\%$), brightness, contrast, and Red-Free (Green channel enhancement) filters.

### 6. Model Comparison & Benchmarking Laboratory
- **Head-to-Head Architecture Switcher**: ConvNeXt-Tiny vs EfficientNet-B3 evaluated under identical standardized protocols.
- **Metrics Evaluated**: Accuracy, Macro F1, Balanced Accuracy, Quadratic Weighted Kappa (QWK), Precision, Recall, Latency, and ECE.
- **Side-by-Side Interactive Confusion Matrices**: Switch between Raw Sample Counts ($N$) and Normalized Percentages ($\%$).
- **One-Click CSV Export**: Download comparison benchmarks for scientific manuscripts and presentations.

### 7. Research Evaluation & Calibration Dashboard
- **Multi-Class ROC-AUC Curves**: One-vs-Rest characteristics across all 5 ICDR grades.
- **Reliability Diagrams**: Observed accuracy vs expected confidence across 10 bins with temperature-scaled Expected Calibration Error (ECE).
- **Coverage vs Error Rate Analysis**: Interactive slider demonstrating systematic risk reduction as the model abstains on uncertain cases.
- **Cross-Dataset Generalization**: Zero-leakage independent verification comparing EyePACS (Internal, $N=10,000$) against Messidor-2 (External, $N=1,748$).

### 8. Reproducible Audit PDF Reports
- Generates publication-ready clinical research audit PDFs with 1 click.
- Features: Unique Analysis ID, SHA-256 hash, timestamp, ICDR grade, 5-class distribution table, Grad-CAM activation thumbnail, image quality scores, and bold experimental AI disclaimers.

### 9. Persistent Audit History
- Local SQLite persistence (with PostgreSQL Docker configuration).
- Search, filter by grade, status, or architecture, view historical sessions, and maintain retention compliance.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite | Blazing fast reactive interface |
| **Styling** | Tailwind CSS v4 + Custom Glassmorphism | Futuristic cybernetic design tokens |
| **3D Rendering** | Three.js WebGL Engine | 60 FPS interactive anatomical eye |
| **Charts & Graphs** | Recharts | Interactive ROC curves, calibration diagrams |
| **Icons** | Lucide React | Clean, accessible iconography |
| **Backend API** | Python + FastAPI + Uvicorn | High-throughput asynchronous endpoints |
| **Image Processing** | Pillow (PIL) | Quality screening & Ben Graham enhancement |
| **PDF Reporting** | ReportLab | Cryptographically traceable clinical audit PDFs |
| **Database** | SQLite3 (Built-in) / PostgreSQL | Audit session persistence |
| **Containers** | Docker & Docker Compose | Multi-stage production containerization |

---

## ⚡ Quick Start Guide (Windows & VS Code)

### Method 1: One-Click Launcher (Fastest)

Simply double-click the included batch file:
```cmd
run_app.bat
```
This automatically starts the FastAPI backend, launches the Vite dev server, and opens your browser at **`http://localhost:5173`**.

---

### Method 2: Manual Terminal Setup

#### 1. Backend Setup:
```bash
cd backend
pip install -r ../requirements.txt
python main.py
```
*Backend runs on `http://127.0.0.1:8000` (Swagger docs at `/docs`).*

#### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

### Method 3: Docker Compose

```bash
docker-compose up --build
```
Access the application at `http://localhost:5173`.

---

## 🎯 Seminar Demonstration Guide

To give an impressive live seminar presentation:

1. **Station 1 (Landing 3D Hub)**:
   - Move your cursor over the 3D anatomical eye to showcase the smooth inertial tracking, corneal reflections, and glowing retinal vascular tree.
   - Click the anatomy hotspots at the bottom (`Cornea`, `Iris`, `Retina`, `Macula`) to demonstrate anatomical labeling.
2. **Station 2 (Analysis & Rejection Test)**:
   - Click the **"Rejection Test"** preset (`Sample 5`). Notice how the multi-factor screening instantly halts inference, flags blur and severe underexposure, and displays actionable diagnostic reasons.
   - Now click `Sample 2 (Moderate NPDR)` or `Sample 4 (Proliferative DR)` and click **"Execute Analysis"** to showcase 5-class staging, MC-Dropout entropy, and 38ms latency.
   - Click **"Export Audit PDF"** to demonstrate immediate PDF report generation.
3. **Station 3 (XAI Split Slider)**:
   - Click **"View in XAI Lab"**.
   - Drag the interactive split slider left and right to show how the Grad-CAM activation highlights microaneurysms and optic disc neovascularization.
   - Toggle between **ConvNeXt-Tiny** and **EfficientNet-B3** to compare how architectures focus spatial attention.
4. **Station 4 (Model Benchmark & Research Dashboard)**:
   - Switch to the **Model Comparison** tab to display the side-by-side confusion matrices.
   - Switch to the **Research & Evaluation** tab and drag the **Rejection Threshold $\tau$** slider to prove how abstaining on uncertain cases reduces error rate from $11.6\%$ to $1.7\%$.

---

## ⚖️ Clinical & Regulatory Notice

Retinova AI is an **investigational research platform** developed for academic study of epistemic uncertainty and explainability in medical computer vision. It is **NOT an FDA/CE cleared diagnostic device**. Predictions must never be used to initiate, alter, or withhold ophthalmic treatment without direct evaluation by a certified ophthalmologist.

---

<div align="center">
  <p><strong>Retinova AI</strong> — <em>See Beyond the Retina.</em></p>
</div>
