import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  FileDown, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';
import { HistoryRecord, PredictionResult } from '../types';
import { fetchHistory, deleteHistoryRecord, downloadReportPdf } from '../services/api';

interface AuditHistoryProps {
  onSelectRecord: (record: HistoryRecord) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({ onSelectRecord, showToast }) => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setRecords(data);
    } catch {
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete record ${id} from persistent storage?`)) return;
    const success = await deleteHistoryRecord(id);
    if (success) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast(`Record ${id} removed from database.`, 'info');
    } else {
      showToast('Failed to delete record', 'error');
    }
  };

  // Filter logic
  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.predicted_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.model_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || r.predicted_grade.toString() === selectedGrade;
    const matchesStatus = 
      selectedStatus === 'all' ||
      (selectedStatus === 'accepted' && r.prediction_accepted && r.quality_passed) ||
      (selectedStatus === 'abstained' && !r.prediction_accepted && r.quality_passed) ||
      (selectedStatus === 'rejected' && !r.quality_passed);

    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Module 05 • Regulatory & Clinical Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Analysis History & Audit Trail
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Searchable, timestamped audit repository of historical inference sessions with SHA-256 provenance hashes.
          </p>
        </div>

        <button
          onClick={loadRecords}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl glass-panel border border-slate-800">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, class, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Grade Filter */}
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Grades (0 - 4)</option>
          <option value="0">Grade 0: No DR</option>
          <option value="1">Grade 1: Mild NPDR</option>
          <option value="2">Grade 2: Moderate NPDR</option>
          <option value="3">Grade 3: Severe NPDR</option>
          <option value="4">Grade 4: Proliferative DR</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Verification Statuses</option>
          <option value="accepted">Accepted (High Confidence)</option>
          <option value="abstained">Abstained (Epistemic Uncertainty)</option>
          <option value="rejected">Quality Screening Rejected</option>
        </select>
      </div>

      {/* History Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                <th className="py-3 px-4">Thumbnail</th>
                <th className="py-3 px-4">Analysis ID</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">ICDR Staging</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Decision Policy</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="w-9 h-9 rounded-lg bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                        {r.image_thumbnail_base64 ? (
                          <img src={r.image_thumbnail_base64} alt="Thumb" className="w-full h-full object-cover" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-cyan-300">
                      {r.id}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                      {r.timestamp ? r.timestamp.replace('T', ' ').slice(0, 19) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {r.model_name}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-white">
                      {r.predicted_grade >= 0 ? `Grade ${r.predicted_grade}: ${r.predicted_class}` : 'Unsuitable'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-300">
                      {(r.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4">
                      {r.quality_passed ? (
                        r.prediction_accepted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                            Accepted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-500/40">
                            Abstained
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-500/40">
                          Quality Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete from Audit Trail"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No historical analysis records matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Audit Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Longitudinal Tracking Policy:</strong> Do not infer chronological disease progression between separate sessions 
          without verified patient identification matching and calibrated interval fundus examinations. 
          Audit records are preserved in accordance with data retention specifications.
        </p>
      </div>

    </div>
  );
};
