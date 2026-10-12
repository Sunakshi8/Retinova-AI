import React, { useState, useRef } from 'react';
import { 
  Flame, 
  Sliders, 
  Layers, 
  Split, 
  Columns, 
  Maximize2, 
  RotateCcw, 
  Info, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Download
} from 'lucide-react';
import { PredictionResult } from '../types';

interface ExplainabilityLabProps {
  currentResult: PredictionResult | null;
  onNavigateToAnalysis: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExplainabilityLab: React.FC<ExplainabilityLabProps> = ({
  currentResult,
  onNavigateToAnalysis,
  showToast,
}) => {
  // View states
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide' | 'overlay' | 'heatmap' | 'original'>('slider');
  const [activeModel, setActiveModel] = useState<'convnext_tiny' | 'efficientnet_b3'>('convnext_tiny');
  const [sliderPos, setSliderPos] = useState<number>(50); // Split percentage 0 - 100
  const [opacity, setOpacity] = useState<number>(75);
  const [colormap, setColormap] = useState<'turbo' | 'viridis' | 'fire'>('turbo');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // References
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Drag interaction for Split Slider
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  // Fallback images if no analysis has been run yet
  const originalImageUrl = currentResult?.gradcam_available 
    ? `/samples/sample_${currentResult.predicted_grade >= 0 ? currentResult.predicted_grade : 0}_${['no_dr', 'mild_dr', 'moderate_dr', 'severe_dr', 'proliferative_dr'][currentResult.predicted_grade >= 0 ? currentResult.predicted_grade : 0]}.png`
    : '/samples/sample_2_moderate_dr.png';

  const overlayImageUrl = currentResult?.gradcam_image_base64 || '/samples/sample_2_moderate_dr.png';
  const heatmapImageUrl = currentResult?.heatmap_only_base64 || '/samples/sample_2_moderate_dr.png';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Module 02 • High-Resolution XAI
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Explainable AI Laboratory (Grad-CAM)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Receptive field activation mapping, interactive before/after split sliders, and cross-architecture saliency comparison.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'slider'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'overlay'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overlay
          </button>

          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'heatmap'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heatmap Only
          </button>
        </div>
      </div>

      {/* Control Panel: Model Comparison & Saliency Settings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        
        {/* Model Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Target Architecture</label>
          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveModel('convnext_tiny')}
              className={`flex-1 py-1 text-xs rounded font-medium transition-all ${
                activeModel === 'convnext_tiny'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ConvNeXt-Tiny
            </button>
            <button
              onClick={() => setActiveModel('efficientnet_b3')}
              className={`flex-1 py-1 text-xs rounded font-medium transition-all ${
                activeModel === 'efficientnet_b3'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EfficientNet-B3
            </button>
          </div>
        </div>

        {/* Heatmap Opacity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Overlay Opacity</span>
            <span className="font-mono text-amber-400">{opacity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Colormap Choice */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Spectral Colormap</label>
          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
            {(['turbo', 'viridis', 'fire'] as const).map((map) => (
              <button
                key={map}
                onClick={() => setColormap(map)}
                className={`flex-1 py-1 rounded capitalize font-medium transition-all ${
                  colormap === map
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {map}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Reset */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Optical Magnification</span>
            <span className="font-mono text-cyan-400">{Math.round(zoomLevel * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Interactive Stage */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
        
        {/* Seminar Feature: Drag Split Slider Mode */}
        {viewMode === 'slider' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Split className="w-4 h-4" />
                Drag slider to correlate anatomical lesions with Grad-CAM saliency
              </span>
              <span className="font-mono text-slate-400">
                Split: {Math.round(sliderPos)}% Original / {Math.round(100 - sliderPos)}% Saliency
              </span>
            </div>

            <div
              ref={sliderContainerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-square max-w-[620px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 select-none cursor-ew-resize group shadow-2xl"
            >
              {/* Layer 1: Grad-CAM Overlay (Full Underneath) */}
              <div 
                style={{ transform: `scale(${zoomLevel})` }}
                className="absolute inset-0 flex items-center justify-center transition-transform"
              >
                <img
                  src={overlayImageUrl}
                  alt="Grad-CAM Saliency Overlay"
                  className="max-w-full max-h-full object-contain"
                  style={{ opacity: opacity / 100 }}
                />
              </div>

              {/* Layer 2: Original Retinal Fundus (Clipped by slider position) */}
              <div
                style={{
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  transform: `scale(${zoomLevel})`,
                }}
                className="absolute inset-0 flex items-center justify-center transition-transform pointer-events-none"
              >
                <img
                  src={originalImageUrl}
                  alt="Original Retinal Fundus"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Vertical Slider Handle Line */}
              <div
                style={{ left: `${sliderPos}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-amber-400 to-rose-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] pointer-events-none"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 shadow-xl flex items-center justify-center text-amber-300">
                  <Split className="w-4 h-4" />
                </div>
              </div>

              {/* Floating Labels */}
              <div className="absolute bottom-4 left-4 text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 backdrop-blur-md pointer-events-none">
                Original Fundus
              </div>
              <div className="absolute bottom-4 right-4 text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-amber-300 backdrop-blur-md pointer-events-none">
                Grad-CAM Activation ({activeModel === 'convnext_tiny' ? 'ConvNeXt' : 'EfficientNet'})
              </div>
            </div>
          </div>
        )}

        {/* Side-by-Side Mode */}
        {viewMode === 'sideBySide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Original Retinal Photograph</div>
              <div className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <img
                  src={originalImageUrl}
                  alt="Original"
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Grad-CAM Activation Overlay</span>
                <span className="font-mono text-amber-400">{activeModel}</span>
              </div>
              <div className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <img
                  src={overlayImageUrl}
                  alt="Grad-CAM"
                  style={{ transform: `scale(${zoomLevel})`, opacity: opacity / 100 }}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Single View: Overlay or Heatmap */}
        {(viewMode === 'overlay' || viewMode === 'heatmap' || viewMode === 'original') && (
          <div className="relative aspect-square max-w-[560px] mx-auto bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <img
              src={
                viewMode === 'heatmap'
                  ? heatmapImageUrl
                  : viewMode === 'overlay'
                  ? overlayImageUrl
                  : originalImageUrl
              }
              alt="Visualization"
              style={{
                transform: `scale(${zoomLevel})`,
                opacity: viewMode === 'overlay' ? opacity / 100 : 1,
              }}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

      </div>

      {/* Scientific & Clinical Interpretability Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-300">
            Explainability Methodology & Clinical Interpretation Notice:
          </div>
          <p className="text-amber-200/90 leading-relaxed text-[11px]">
            Gradient-weighted Class Activation Mapping (Grad-CAM) computes the gradients of the predicted logit 
            with respect to the final convolutional feature maps (ConvNeXt-Tiny stage-3 / EfficientNet-B3 top conv). 
            High activation highlights salient spatial receptive fields that mathematically influenced model classification. 
            <strong> Saliency maps do not constitute pathological proof</strong>, and should be evaluated alongside dilated clinical biomicroscopy.
          </p>
        </div>
      </div>

    </div>
  );
};
