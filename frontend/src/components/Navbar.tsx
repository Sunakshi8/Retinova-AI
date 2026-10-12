import React from 'react';
import { 
  Eye, 
  Activity, 
  Flame, 
  GitCompare, 
  BarChart3, 
  History, 
  BookOpen, 
  Zap, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  backendOnline: boolean;
  lowPowerMode: boolean;
  setLowPowerMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  backendOnline,
  lowPowerMode,
  setLowPowerMode,
}) => {
  const navItems = [
    { id: 'landing', label: '3D Hub', icon: Eye },
    { id: 'analysis', label: 'Analysis Workspace', icon: Activity },
    { id: 'xai', label: 'XAI Lab', icon: Flame },
    { id: 'comparison', label: 'Model Comparison', icon: GitCompare },
    { id: 'research', label: 'Research & Evaluation', icon: BarChart3 },
    { id: 'history', label: 'Audit History', icon: History },
    { id: 'transparency', label: 'Transparency', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-500/15 bg-[#070913]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-indigo-500/40 p-0.5 bg-slate-900 shadow-lg shadow-indigo-500/20 group-hover:border-cyan-400 transition-all">
              <img 
                src="/retinova-logo.png" 
                alt="Retinova AI Logo" 
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Retinova AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">
                See Beyond the Retina.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Backend Status & Low-Power 3D toggle */}
          <div className="flex items-center gap-3">
            {/* Low-Power 3D Toggle */}
            <button
              onClick={() => setLowPowerMode(!lowPowerMode)}
              title={lowPowerMode ? "Switch to High-Fidelity 3D" : "Switch to Low-Power 3D"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                lowPowerMode
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{lowPowerMode ? 'Eco 3D' : 'HD 3D'}</span>
            </button>

            {/* Backend Health Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900/80 border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300 hidden sm:inline">
                {backendOnline ? 'API Ready' : 'Local Mode'}
              </span>
            </div>

            {/* Mobile / Tablet Launch CTA */}
            {activeTab === 'landing' && (
              <button
                onClick={() => setActiveTab('analysis')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Launch</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/40 text-cyan-300 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
