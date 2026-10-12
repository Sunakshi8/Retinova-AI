import { PredictionResult, SampleImage, HistoryRecord, BenchmarkData } from '../types';

const API_BASE = '/api';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchSampleImages(): Promise<SampleImage[]> {
  try {
    const res = await fetch(`${API_BASE}/samples`, { signal: AbortSignal.timeout(4000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using static sample manifest', e);
  }
  // Fallback sample list
  return [
    { id: 'sample-0', name: 'Normal Retina (Grade 0)', stage: 0, filename: 'sample_0_no_dr.png', poor: false, desc: 'Healthy fundus with distinct optic disc and sharp foveal reflex.' },
    { id: 'sample-1', name: 'Mild NPDR (Grade 1)', stage: 1, filename: 'sample_1_mild_dr.png', poor: false, desc: 'Earliest detectable stage exhibiting microaneurysms in temporal parafovea.' },
    { id: 'sample-2', name: 'Moderate NPDR (Grade 2)', stage: 2, filename: 'sample_2_moderate_dr.png', poor: false, desc: 'Macular exudates and intraretinal blot hemorrhages.' },
    { id: 'sample-3', name: 'Severe NPDR (Grade 3)', stage: 3, filename: 'sample_3_severe_dr.png', poor: false, desc: 'Extensive 4-quadrant hemorrhages and cotton-wool ischemia spots.' },
    { id: 'sample-4', name: 'Proliferative DR (Grade 4)', stage: 4, filename: 'sample_4_proliferative_dr.png', poor: false, desc: 'High-risk neovascularization of the optic disc (NVD).' },
    { id: 'sample-5', name: 'Suboptimal Quality (Rejected)', stage: 0, filename: 'sample_5_poor_quality.png', poor: true, desc: 'Motion-blurred & underexposed fundus triggering screening rejection.' }
  ];
}

export async function analyzeImage(
  fileOrSample: { file?: File; sampleId?: string },
  modelName: string = 'convnext_tiny',
  confidenceThreshold: number = 0.55,
  entropyThreshold: number = 0.72
): Promise<PredictionResult> {
  const formData = new FormData();
  if (fileOrSample.file) {
    formData.append('file', fileOrSample.file);
  } else if (fileOrSample.sampleId) {
    formData.append('sample_id', fileOrSample.sampleId);
  }
  formData.append('model_name', modelName);
  formData.append('confidence_threshold', confidenceThreshold.toString());
  formData.append('entropy_threshold', entropyThreshold.toString());

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(err.detail || 'Inference failed');
  }

  return await res.json();
}

export async function fetchBenchmarkData(): Promise<BenchmarkData> {
  const res = await fetch(`${API_BASE}/benchmark`);
  if (!res.ok) throw new Error('Failed to fetch benchmark datasets');
  return await res.json();
}

export async function fetchHistory(): Promise<HistoryRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Failed to fetch history from server', e);
  }
  return [];
}

export async function deleteHistoryRecord(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function downloadReportPdf(analysisResult: PredictionResult): Promise<Blob> {
  const res = await fetch(`${API_BASE}/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analysisResult),
  });

  if (!res.ok) {
    throw new Error('Failed to generate PDF report from server');
  }

  return await res.blob();
}
