import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { AnalysisWorkspace } from './components/AnalysisWorkspace';
import { ExplainabilityLab } from './components/ExplainabilityLab';
import { ModelComparisonLab } from './components/ModelComparisonLab';
import { ResearchDashboard } from './components/ResearchDashboard';
import { AuditHistory } from './components/AuditHistory';
import { ModelTransparency } from './components/ModelTransparency';
import { Toast, ToastMessage } from './components/Toast';
import { PredictionResult, SampleImage, HistoryRecord } from './types';
import { checkBackendHealth, fetchSampleImages } from './services/api';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [lowPowerMode, setLowPowerMode] = useState<boolean>(false);
  const [sampleImages, setSampleImages] = useState<SampleImage[]>([]);
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // Health check
    checkBackendHealth().then((online) => {
      setBackendOnline(online);
      if (online) {
        showToast('Connected to Retinova AI neural backend (v1.4.2)', 'success');
      } else {
        showToast('Running in standalone browser mode with preloaded clinical cohorts', 'info');
      }
    });

    // Sample images
    fetchSampleImages().then(setSampleImages).catch(console.error);
  }, []);

  const handleAnalysisComplete = (res: PredictionResult) => {
    setCurrentResult(res);
  };

  const handleOpenXai = (res: PredictionResult) => {
    setCurrentResult(res);
    setActiveTab('xai');
  };

  const handleSelectHistoryRecord = (rec: HistoryRecord) => {
    // Can navigate to analysis or viewer
    setActiveTab('analysis');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Glassmorphic Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        lowPowerMode={lowPowerMode}
        setLowPowerMode={setLowPowerMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingHero
            onNavigate={setActiveTab}
            lowPowerMode={lowPowerMode}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisWorkspace
            sampleImages={sampleImages}
            onAnalysisComplete={handleAnalysisComplete}
            onOpenXai={handleOpenXai}
            showToast={showToast}
          />
        )}

        {activeTab === 'xai' && (
          <ExplainabilityLab
            currentResult={currentResult}
            onNavigateToAnalysis={() => setActiveTab('analysis')}
            showToast={showToast}
          />
        )}

        {activeTab === 'comparison' && (
          <ModelComparisonLab showToast={showToast} />
        )}

        {activeTab === 'research' && (
          <ResearchDashboard />
        )}

        {activeTab === 'history' && (
          <AuditHistory
            onSelectRecord={handleSelectHistoryRecord}
            showToast={showToast}
          />
        )}

        {activeTab === 'transparency' && (
          <ModelTransparency />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-indigo-500/40">
                <img src="/retinova-logo.png" alt="Retinova Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-slate-200 tracking-tight">Retinova AI</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-medium">See Beyond the Retina.</span>
            </div>

            <div className="text-[11px] text-slate-500 text-center">
              Investigational Ophthalmic AI Platform • ConvNeXt-Tiny & EfficientNet-B3 • Non-Clinical Research Device
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <button 
                onClick={() => setActiveTab('transparency')}
                className="hover:text-cyan-400 transition-colors"
              >
                Ethics & Safety
              </button>
              <button 
                onClick={() => setActiveTab('research')}
                className="hover:text-cyan-400 transition-colors"
              >
                Benchmarks
              </button>
              <span className="font-mono text-[10px] text-cyan-400">v1.4.2-retina</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}

export default App;
