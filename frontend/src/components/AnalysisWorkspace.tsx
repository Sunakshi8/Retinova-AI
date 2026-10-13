import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  FileDown, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sun, 
  Contrast, 
  Eye, 
  Layers, 
  Sliders, 
  HelpCircle,
  Copy,
  Check,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PredictionResult, SampleImage } from '../types';
import { analyzeImage, downloadReportPdf } from '../services/api';

interface AnalysisWorkspaceProps {
  sampleImages: SampleImage[];
  onAnalysisComplete: (result: PredictionResult) => void;
  onOpenXai: (result: PredictionResult) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const ICDR_CLASSES = [
  { grade: 0, name: 'No DR', desc: 'No microvascular abnormalities detected.', color: 'from-emerald-500 to-teal-600', textCol: 'text-emerald-400' },
  { grade: 1, name: 'Mild', desc: 'Isolated microaneurysms only.', color: 'from-sky-500 to-blue-600', textCol: 'text-sky-400' },
  { grade: 2, name: 'Moderate', desc: 'More than microaneurysms, but less than severe criteria.', color: 'from-amber-500 to-yellow-600', textCol: 'text-amber-400' },
  { grade: 3, name: 'Severe', desc: '>20 intraretinal hemorrhages in each of 4 quadrants, venous beading in 2+, or IRMA in 1+.', color: 'from-orange-500 to-rose-600', textCol: 'text-orange-400' },
  { grade: 4, name: 'Proliferative DR', desc: 'Neovascularization (NVD/NVE) or vitreous/preretinal hemorrhage.', color: 'from-red-600 to-rose-700', textCol: 'text-rose-400' },
];

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  sampleImages,
  onAnalysisComplete,
  onOpenXai,
  showToast,
}) => {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-0');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('/samples/sample_0_no_dr.png');
  const [modelName, setModelName] = useState<string>('convnext_tiny');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.55);
  const [entropyThreshold, setEntropyThreshold] = useState<number>(0.72);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Viewer image adjustments
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrastVal, setContrastVal] = useState<number>(100);
  const [isRedFree, setIsRedFree] = useState<boolean>(false); // Green channel enhancement

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToast('Only JPEG and PNG retinal images are supported.', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('File size exceeds 15MB limit.', 'error');
      return;
    }
    setSelectedFile(file);
    setSelectedSampleId('');
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);
    setResult(null);
  };

  // Select sample preset
  const handleSelectSample = (sample: SampleImage) => {
    setSelectedFile(null);
    setSelectedSampleId(sample.id);
    setImagePreviewUrl(`/samples/${sample.filename}`);
    setResult(null);
  };

  // Run analysis pipeline
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const payload = selectedFile 
        ? { file: selectedFile } 
        : { sampleId: selectedSampleId };

      const res = await analyzeImage(payload, modelName, confidenceThreshold, entropyThreshold);
      setResult(res);
      onAnalysisComplete(res);

      if (!res.quality_metrics.overall_quality_passed) {
        showToast('Image quality screening rejected the image. Inference abstained.', 'error');
      } else if (!res.prediction_accepted) {
        showToast('Prediction rejected: High epistemic uncertainty detected.', 'info');
      } else {
        showToast(`Analysis completed: Grade ${res.predicted_grade} (${res.predicted_class})`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Analysis failed', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger analysis on first load for instant demonstration
  useEffect(() => {
    if (!result && selectedSampleId === 'sample-0') {
      handleRunAnalysis();
    }
  }, []);

  const handleDownloadPdf = async () => {
    if (!result) return;
    setIsDownloadingPdf(true);
    try {
      const blob = await downloadReportPdf(result);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Retinova_Report_${result.analysis_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Research PDF report downloaded successfully.', 'success');
    } catch (err: any) {
      showToast('Failed to download PDF report', 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const copyImageHash = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.image_hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    showToast('SHA-256 Hash copied to clipboard', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-indigo-500/10 text-cyan-300 border border-indigo-500/30">
              Module 01 • Inference & Quality Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Retinal Analysis Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time multi-factor screening, 5-class ICDR staging, and MC-Dropout selective abstention.
          </p>
        </div>

        {/* Global Controls: Architecture Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setModelName('convnext_tiny')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modelName === 'convnext_tiny'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ConvNeXt-Tiny (224px)
              </button>
              <button
                onClick={() => setModelName('efficientnet_b3')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modelName === 'efficientnet_b3'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EfficientNet-B3 (300px)
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kaggle Weights Active: dr_convnext_tiny_weights.pth</span>
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Execute Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1-Click Clinical Sample Selector Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            1-Click Clinical Seminar Presets:
          </span>
          <span className="text-[11px] text-slate-500">
            Click any fundus to test staging & rejection instantly
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {sampleImages.map((sample) => {
            const isSelected = selectedSampleId === sample.id && !selectedFile;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/60 border-cyan-400/80 shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 bg-black">
                    <img src={`/samples/${sample.filename}`} alt={sample.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 truncate">{sample.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {sample.poor ? 'Defective' : `Grade ${sample.stage}`}
                    </div>
                  </div>
                </div>
                {sample.poor && (
                  <span className="mt-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 w-fit">
                    Rejection Test
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Grid: Left Image Viewer & Quality | Right Predictions & Uncertainty */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Viewer, Upload Area & Adjustments */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Retinal Fundus Viewer Card */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                Retinal Fundus Optical Viewer
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRedFree(!isRedFree)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                    isRedFree 
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Enhance green channel to maximize microaneurysm contrast"
                >
                  Green / Red-Free
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setBrightness(100);
                    setContrastVal(100);
                    setIsRedFree(false);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reset Adjustments"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas / Image Display Frame */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative w-full aspect-square max-h-[460px] bg-slate-950 rounded-xl overflow-hidden mt-3 border border-slate-800 flex items-center justify-center cursor-crosshair group"
            >
              <img
                src={imagePreviewUrl}
                alt="Retinal Fundus"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: `brightness(${brightness}%) contrast(${contrastVal}%) ${isRedFree ? 'hue-rotate(90deg) saturate(180%)' : ''}`,
                  transition: 'transform 0.15s ease-out, filter 0.2s ease',
                }}
                className="max-w-full max-h-full object-contain rounded-lg select-none"
              />

              {/* Quality overlay warning if failed */}
              {result && !result.quality_metrics.overall_quality_passed && (
                <div className="absolute inset-0 bg-red-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <ShieldAlert className="w-12 h-12 text-rose-400 animate-bounce mb-2" />
                  <div className="text-base font-bold text-white">Automated Screening Rejection</div>
                  <p className="text-xs text-rose-200 mt-1 max-w-sm">
                    {result.rejection_reason}
                  </p>
                  <div className="mt-4 text-[11px] font-mono bg-slate-900/90 text-slate-300 px-3 py-1.5 rounded-lg border border-rose-500/40">
                    Predictions prevented to protect clinical integrity
                  </div>
                </div>
              )}

              {/* Bottom Drag-and-drop indicator */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-md">
                  Zoom: {Math.round(zoomLevel * 100)}%
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-md">
                  Drag & Drop replacement photo anytime
                </span>
              </div>
            </div>

            {/* Viewer Slider Controls */}
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Zoom</span>
                  <span>{Math.round(zoomLevel * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1"><Contrast className="w-3 h-3" /> Contrast</span>
                  <span>{contrastVal}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={contrastVal}
                  onChange={(e) => setContrastVal(parseInt(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

          </div>

          {/* Upload Dropzone box */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="p-4 rounded-xl border border-dashed border-indigo-500/30 hover:border-cyan-400/60 bg-slate-900/40 hover:bg-slate-900/70 transition-all cursor-pointer flex items-center justify-center gap-3 text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processSelectedFile(e.target.files[0]);
                }
              }}
            />
            <Upload className="w-5 h-5 text-cyan-400" />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop custom fundus photo (JPG/PNG, up to 15MB)
            </div>
          </div>

        </div>

        {/* Right Column: Multi-Factor Quality Screening & Predictive Results */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Quality Screening Status Bar */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-indigo-400" />
                Image Quality Screening Audit
              </span>
              {result && (
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                  result.quality_metrics.overall_quality_passed
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                }`}>
                  {result.quality_metrics.overall_quality_passed ? 'Quality Passed' : 'Quality Rejected'}
                </span>
              )}
            </div>

            {/* Quality Factor Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Sharpness / Blur</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {result ? result.quality_metrics.blur_score : '—'}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Threshold: ≥ 8.0</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Illumination</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {result ? result.quality_metrics.illumination_score : '—'}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Range: 30 - 215</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Contrast</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {result ? result.quality_metrics.contrast_score : '—'}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Threshold: ≥ 20.0</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Retinal Field</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {result ? (result.quality_metrics.is_valid_fundus ? 'Valid' : 'Invalid') : '—'}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Aperture & Chromatic</div>
              </div>
            </div>

            {/* Rejection notice if quality failed */}
            {result && result.quality_metrics.rejection_reasons.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200">
                <div className="font-semibold text-rose-300">Failure Diagnostics:</div>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-rose-200/90">
                  {result.quality_metrics.rejection_reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Staging & Prediction Results Card */}
          <div className="glass-panel-glow rounded-2xl p-5 border border-indigo-500/30 space-y-5">
            
            {/* Predicted Class Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  ICDR Staging Result:
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {result ? (
                      result.predicted_grade >= 0 ? (
                        <>
                          <span className="text-cyan-400">Grade {result.predicted_grade}:</span>{' '}
                          {result.predicted_class}
                        </>
                      ) : (
                        <span className="text-rose-400">Abstained</span>
                      )
                    ) : (
                      'Ready for Analysis'
                    )}
                  </div>
                </div>
                {result && result.predicted_grade >= 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/70 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Model: {result.model_source || 'PyTorch ConvNeXt-Tiny (dr_convnext_tiny_weights.pth)'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950/70 text-purple-300 border border-purple-800/50">
                      Saliency: {result.explanation_method}
                    </span>
                  </div>
                )}
              </div>

              {/* Selective Prediction Acceptance Badge */}
              {result && result.predicted_grade >= 0 && (
                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                  result.prediction_accepted
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                    : 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                }`}>
                  {result.prediction_accepted ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold">Accepted (High Confidence)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold">Abstained (Uncertain)</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Posterior Probability Distribution Bars */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Class Probability Distribution</span>
                <span className="text-[11px] font-mono text-slate-400">Softmax Logits</span>
              </div>

              <div className="space-y-2">
                {ICDR_CLASSES.map((item) => {
                  const prob = result?.class_probabilities?.[item.name] || 0;
                  const isTop = result?.predicted_grade === item.grade && result.predicted_grade >= 0;
                  return (
                    <div key={item.grade} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${isTop ? 'text-white font-bold' : 'text-slate-400'}`}>
                          Grade {item.grade}: {item.name}
                        </span>
                        <span className="font-mono text-slate-300">
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                        <div
                          style={{ width: `${Math.max(prob * 100, 2)}%` }}
                          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${item.color} ${
                            isTop ? 'ring-1 ring-white/50 shadow-sm' : 'opacity-70'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Uncertainty Estimation Metrics Box */}
            {result && result.predicted_grade >= 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    MC-Dropout Epistemic Uncertainty
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    T=15 Passes
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Epistemic Variance</div>
                    <div className="text-xs font-bold font-mono text-white mt-0.5">
                      {result.epistemic_uncertainty.toFixed(4)}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Entropy H(p)</div>
                    <div className="text-xs font-bold font-mono text-white mt-0.5">
                      {result.predictive_entropy.toFixed(3)} bits
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">95% Conf. Interval</div>
                    <div className="text-xs font-bold font-mono text-white mt-0.5">
                      {(result.confidence_interval[0] * 100).toFixed(0)}% - {(result.confidence_interval[1] * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {result.rejection_reason && (
                  <p className="text-[11px] text-amber-300/90 italic pt-1">
                    Notice: {result.rejection_reason}
                  </p>
                )}
              </div>
            )}

            {/* Provenance & Action Buttons */}
            {result && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>ID: {result.analysis_id}</span>
                  <span>•</span>
                  <span>{result.processing_time_ms}ms</span>
                  <span>•</span>
                  <button
                    onClick={copyImageHash}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                    title="Copy SHA-256 Hash"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>SHA-256</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenXai(result)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/30 text-cyan-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition-all flex items-center gap-1.5"
                  >
                    <span>View in XAI Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5" />
                    )}
                    <span>Export Audit PDF</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
