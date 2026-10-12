import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  BarChart2, 
  FileDown, 
  Layers, 
  Cpu, 
  Zap, 
  TrendingUp, 
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import { BenchmarkData } from '../types';
import { fetchBenchmarkData } from '../services/api';

interface ModelComparisonLabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const CLASSES = ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative DR'];

export const ModelComparisonLab: React.FC<ModelComparisonLabProps> = ({ showToast }) => {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<'eyepacs_internal' | 'messidor2_external'>('eyepacs_internal');
  const [matrixView, setMatrixView] = useState<'normalized' | 'raw'>('normalized');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBenchmarkData()
      .then((data) => {
        setBenchmarkData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const currentDataset = benchmarkData ? benchmarkData[selectedDataset] : null;
  const convnext = currentDataset?.models?.convnext_tiny;
  const effnet = currentDataset?.models?.efficientnet_b3;

  const exportComparisonCsv = () => {
    if (!convnext || !effnet) return;
    const rows = [
      ['Metric', 'ConvNeXt-Tiny', 'EfficientNet-B3'],
      ['Dataset', currentDataset?.dataset_name || '', currentDataset?.dataset_name || ''],
      ['Parameters (M)', convnext.parameters_million, effnet.parameters_million],
      ['Inference Latency (ms)', convnext.latency_ms, effnet.latency_ms],
      ['Overall Accuracy', convnext.accuracy, effnet.accuracy],
      ['Macro F1-Score', convnext.macro_f1, effnet.macro_f1],
      ['Balanced Accuracy', convnext.balanced_accuracy, effnet.balanced_accuracy],
      ['Quadratic Weighted Kappa', convnext.quadratic_weighted_kappa, effnet.quadratic_weighted_kappa],
      ['ECE Before Calibration', convnext.ece_before_calibration, effnet.ece_before_calibration],
      ['ECE After Calibration', convnext.ece_after_calibration, effnet.ece_after_calibration],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Retinova_Comparison_${selectedDataset}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Comparison CSV exported successfully.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Module 03 • Benchmarking Laboratory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Model Comparison Laboratory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Empirical head-to-head comparison between ConvNeXt-Tiny and EfficientNet-B3 under identical evaluation protocols.
          </p>
        </div>

        {/* Dataset Switcher & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setSelectedDataset('eyepacs_internal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDataset === 'eyepacs_internal'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EyePACS (Internal N=10,000)
            </button>
            <button
              onClick={() => setSelectedDataset('messidor2_external')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDataset === 'messidor2_external'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Messidor-2 (External N=1,748)
            </button>
          </div>

          <button
            onClick={exportComparisonCsv}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Head-to-Head Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Quadratic Kappa (QWK)', cVal: convnext?.quadratic_weighted_kappa, eVal: effnet?.quadratic_weighted_kappa, higherBetter: true },
          { label: 'Macro F1-Score', cVal: convnext?.macro_f1, eVal: effnet?.macro_f1, higherBetter: true },
          { label: 'Balanced Accuracy', cVal: convnext?.balanced_accuracy, eVal: effnet?.balanced_accuracy, higherBetter: true },
          { label: 'Overall Accuracy', cVal: convnext?.accuracy, eVal: effnet?.accuracy, higherBetter: true },
          { label: 'Latency (ms)', cVal: convnext?.latency_ms, eVal: effnet?.latency_ms, higherBetter: false },
          { label: 'ECE (Calibrated)', cVal: convnext?.ece_after_calibration, eVal: effnet?.ece_after_calibration, higherBetter: false },
        ].map((item, idx) => {
          const cWin = item.cVal !== undefined && item.eVal !== undefined 
            ? (item.higherBetter ? item.cVal >= item.eVal : item.cVal <= item.eVal) 
            : false;
          return (
            <div key={idx} className="p-3.5 rounded-xl glass-panel border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 leading-tight">{item.label}</span>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-mono text-[11px]">ConvNeXt</span>
                  <span className={`font-mono font-bold ${cWin ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {item.cVal !== undefined ? item.cVal : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-400 font-mono text-[11px]">EffNet</span>
                  <span className={`font-mono font-bold ${!cWin ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {item.eVal !== undefined ? item.eVal : '—'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Confusion Matrices */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Side-by-Side Empirical Confusion Matrices
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison on {currentDataset?.dataset_name} ({currentDataset?.total_images} adjudicated fundus photographs)
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setMatrixView('normalized')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                matrixView === 'normalized'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normalized (%)
            </button>
            <button
              onClick={() => setMatrixView('raw')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                matrixView === 'raw'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Counts (N)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Matrix 1: ConvNeXt-Tiny */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-300">ConvNeXt-Tiny (v1.4.2)</span>
              <span className="font-mono text-slate-400">Acc: {convnext?.accuracy ? (convnext.accuracy*100).toFixed(1) : 0}%</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-1.5 text-[10px] text-slate-500 font-mono">True \ Pred</th>
                    {CLASSES.map((c, i) => (
                      <th key={i} className="p-1.5 text-[10px] font-mono text-slate-300">G{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLASSES.map((c, i) => (
                    <tr key={i}>
                      <td className="p-1.5 text-[10px] font-mono text-slate-300 text-left whitespace-nowrap">
                        G{i}: {c}
                      </td>
                      {CLASSES.map((_, j) => {
                        const val = matrixView === 'normalized'
                          ? (convnext?.confusion_matrix_normalized?.[i]?.[j] ?? 0)
                          : (convnext?.confusion_matrix_raw?.[i]?.[j] ?? 0);
                        const isDiag = i === j;
                        const intensity = matrixView === 'normalized' 
                          ? Number(val) 
                          : Number(val) / (convnext?.confusion_matrix_raw?.[i]?.reduce((a, b) => a + b, 0) || 1);
                        return (
                          <td
                            key={j}
                            style={{
                              backgroundColor: isDiag
                                ? `rgba(6, 182, 212, ${Math.max(0.15, intensity * 0.75)})`
                                : intensity > 0.05
                                ? `rgba(239, 68, 68, ${Math.min(0.5, intensity * 0.8)})`
                                : 'rgba(15, 23, 42, 0.4)',
                            }}
                            className={`p-2 border border-slate-800/80 font-mono text-[11px] ${
                              isDiag ? 'font-bold text-white' : 'text-slate-400'
                            }`}
                          >
                            {matrixView === 'normalized' ? `${(Number(val) * 100).toFixed(1)}%` : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matrix 2: EfficientNet-B3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-300">EfficientNet-B3 (v2.1.0)</span>
              <span className="font-mono text-slate-400">Acc: {effnet?.accuracy ? (effnet.accuracy*100).toFixed(1) : 0}%</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-1.5 text-[10px] text-slate-500 font-mono">True \ Pred</th>
                    {CLASSES.map((c, i) => (
                      <th key={i} className="p-1.5 text-[10px] font-mono text-slate-300">G{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLASSES.map((c, i) => (
                    <tr key={i}>
                      <td className="p-1.5 text-[10px] font-mono text-slate-300 text-left whitespace-nowrap">
                        G{i}: {c}
                      </td>
                      {CLASSES.map((_, j) => {
                        const val = matrixView === 'normalized'
                          ? (effnet?.confusion_matrix_normalized?.[i]?.[j] ?? 0)
                          : (effnet?.confusion_matrix_raw?.[i]?.[j] ?? 0);
                        const isDiag = i === j;
                        const intensity = matrixView === 'normalized' 
                          ? Number(val) 
                          : Number(val) / (effnet?.confusion_matrix_raw?.[i]?.reduce((a, b) => a + b, 0) || 1);
                        return (
                          <td
                            key={j}
                            style={{
                              backgroundColor: isDiag
                                ? `rgba(99, 102, 241, ${Math.max(0.15, intensity * 0.75)})`
                                : intensity > 0.05
                                ? `rgba(239, 68, 68, ${Math.min(0.5, intensity * 0.8)})`
                                : 'rgba(15, 23, 42, 0.4)',
                            }}
                            className={`p-2 border border-slate-800/80 font-mono text-[11px] ${
                              isDiag ? 'font-bold text-white' : 'text-slate-400'
                            }`}
                          >
                            {matrixView === 'normalized' ? `${(Number(val) * 100).toFixed(1)}%` : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Per-Class Precision & Recall Comparison Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-indigo-400" />
          Per-Class Granular Performance Breakdown (ICDR Staging)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">ICDR Stage</th>
                <th className="py-2.5 px-3">ConvNeXt Precision</th>
                <th className="py-2.5 px-3">ConvNeXt Recall</th>
                <th className="py-2.5 px-3">ConvNeXt F1</th>
                <th className="py-2.5 px-3">EffNet Precision</th>
                <th className="py-2.5 px-3">EffNet Recall</th>
                <th className="py-2.5 px-3">EffNet F1</th>
                <th className="py-2.5 px-3">Support (N)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {CLASSES.map((cls, idx) => {
                const cMetric = convnext?.per_class_metrics?.[cls];
                const eMetric = effnet?.per_class_metrics?.[cls];
                return (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">
                      Grade {idx}: {cls}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300">
                      {cMetric ? (cMetric.precision * 100).toFixed(1) : 0}%
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300">
                      {cMetric ? (cMetric.recall * 100).toFixed(1) : 0}%
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {cMetric ? cMetric.f1.toFixed(3) : 0}
                    </td>
                    <td className="py-2.5 px-3 text-indigo-300">
                      {eMetric ? (eMetric.precision * 100).toFixed(1) : 0}%
                    </td>
                    <td className="py-2.5 px-3 text-indigo-300">
                      {eMetric ? (eMetric.recall * 100).toFixed(1) : 0}%
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {eMetric ? eMetric.f1.toFixed(3) : 0}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {cMetric?.support || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
