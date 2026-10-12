import React from 'react';
import { Eye3DCanvas } from './Eye3DCanvas';
import { 
  Activity, 
  Flame, 
  GitCompare, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  FileCheck2, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface LandingHeroProps {
  onNavigate: (tab: string) => void;
  lowPowerMode: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate, lowPowerMode }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background radial glow matching the logo's purple and cyan tones */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text, Value Prop & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-300 tracking-wider uppercase font-semibold">
                Clinical Research AI Platform
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                See Beyond the{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Retina.
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                Retinova AI integrates state-of-the-art pure-convolutional and compound-scaled architectures 
                (<span className="text-cyan-300 font-medium">ConvNeXt-Tiny</span> & <span className="text-indigo-300 font-medium">EfficientNet-B3</span>) 
                with automated multi-factor quality screening, MC-Dropout epistemic uncertainty estimation, 
                and high-resolution Grad-CAM explainability for diabetic retinopathy staging.
              </p>
            </div>

            {/* Key Action CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('analysis')}
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
              >
                <Activity className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Launch Analysis Workspace</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('xai')}
                className="px-5 py-3.5 rounded-xl text-sm font-semibold bg-slate-900/80 hover:bg-slate-850 text-slate-200 border border-slate-700/80 hover:border-indigo-400/60 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Explainability Lab (XAI)</span>
              </button>

              <button
                onClick={() => onNavigate('comparison')}
                className="px-4 py-3.5 rounded-xl text-sm font-medium bg-slate-900/40 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4 text-indigo-400" />
                <span>Model Benchmark</span>
              </button>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-xl font-bold font-mono text-cyan-400">0.892</div>
                <div className="text-[11px] text-slate-400">Quadratic Kappa (QWK)</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-xl font-bold font-mono text-indigo-400">38.4 ms</div>
                <div className="text-[11px] text-slate-400">Inference Latency</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-xl font-bold font-mono text-purple-400">5 Grades</div>
                <div className="text-[11px] text-slate-400">ICDR Clinical Scale</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <div className="text-xl font-bold font-mono text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-400">Quality Screening</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Anatomical Eye Viewport */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-square max-w-[540px] mx-auto rounded-3xl overflow-hidden glass-panel-glow p-2">
              
              {/* Corner tech indicators */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-slate-300">Retinal Geometry: Active</span>
              </div>
              
              <div className="absolute top-4 right-4 z-10 text-[11px] font-mono text-slate-400 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md">
                WebGL 2.0 • 60 FPS
              </div>

              {/* Three.js 3D Eye Canvas */}
              <Eye3DCanvas lowPowerMode={lowPowerMode} />

            </div>
          </div>

        </div>
      </section>

      {/* 4 Seminar Demonstration Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Interactive Seminar Demonstrations
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Rigorous Clinical Evaluation
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Four interactive laboratory stations showcasing state-of-the-art ophthalmic AI capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Feature 1: Model Comparison Switcher */}
          <div 
            onClick={() => onNavigate('comparison')}
            className="p-5 rounded-2xl glass-panel hover:glass-panel-glow cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/30">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Model Comparison Switcher
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Switch seamlessly between ConvNeXt-Tiny and EfficientNet-B3 to inspect side-by-side confusion matrices, per-class F1, and FLOP efficiency.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400 gap-1 group-hover:gap-2 transition-all">
              <span>Inspect Models</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 2: Explainability Image Slider */}
          <div 
            onClick={() => onNavigate('xai')}
            className="p-5 rounded-2xl glass-panel hover:glass-panel-glow cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Explainability Slider
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Interactive split comparison slider. Drag across the fundus to correlate clinical lesions (microaneurysms, exudates) directly with Grad-CAM heatmaps.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 gap-1 group-hover:gap-2 transition-all">
              <span>Open Split Slider</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 3: Interactive Evaluation Dashboard */}
          <div 
            onClick={() => onNavigate('research')}
            className="p-5 rounded-2xl glass-panel hover:glass-panel-glow cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Evaluation & Calibration
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Explore multi-class One-vs-Rest ROC curves, Expected Calibration Error (ECE) reliability diagrams, and external domain generalization on Messidor-2.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 gap-1 group-hover:gap-2 transition-all">
              <span>View ROC & Calibration</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 4: Selective Prediction & Audit Reports */}
          <div 
            onClick={() => onNavigate('analysis')}
            className="p-5 rounded-2xl glass-panel hover:glass-panel-glow cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Selective Prediction & PDF
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Automated abstention when epistemic uncertainty is elevated. Generates cryptographic SHA-256 traceable, clinical audit PDF reports with 1 click.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1 group-hover:gap-2 transition-all">
              <span>Test Selective AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Core Architectural Pipeline Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-3xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-slate-900/90 to-indigo-950/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Clinical Workflow
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Zero-Leakage Multi-Stage Diagnostic Flow
              </h3>
            </div>
            <button
              onClick={() => onNavigate('transparency')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Safety & Transparency Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">STAGE 1</div>
              <div className="text-sm font-bold text-white">Quality Screening</div>
              <p className="text-xs text-slate-400 mt-1">
                Automated screening for blur (Laplacian variance), illumination thresholds, and retinal circular aperture. Rejects corrupted inputs before inference.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono text-indigo-400 font-bold mb-1">STAGE 2</div>
              <div className="text-sm font-bold text-white">Neural Staging</div>
              <p className="text-xs text-slate-400 mt-1">
                Ben Graham local contrast normalization fed into ConvNeXt-Tiny or EfficientNet-B3 producing calibrated 5-class ICDR probability distributions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono text-purple-400 font-bold mb-1">STAGE 3</div>
              <div className="text-sm font-bold text-white">Uncertainty & Abstention</div>
              <p className="text-xs text-slate-400 mt-1">
                MC-Dropout stochastic passes measure epistemic entropy H(p). The selective prediction engine abstains whenever uncertainty exceeds validated thresholds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono text-emerald-400 font-bold mb-1">STAGE 4</div>
              <div className="text-sm font-bold text-white">Grad-CAM & Audit PDF</div>
              <p className="text-xs text-slate-400 mt-1">
                Backpropagated gradient saliency maps highlight microaneurysms and exudates. Exports reproducible, timestamped PDF reports with SHA-256 hashes.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
