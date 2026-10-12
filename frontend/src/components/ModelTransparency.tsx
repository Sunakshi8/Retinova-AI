import React from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  CheckCircle, 
  HelpCircle, 
  FileText,
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';

export const ModelTransparency: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Module 06 • Scientific Transparency & Model Cards
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          Model Transparency, Ethics & Limitations Card
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Open documentation of architectures, dataset provenance, training hyperparameters, bias audits, and clinical disclaimers.
        </p>
      </div>

      {/* Prominent Regulatory Disclaimer */}
      <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/40 text-rose-200 space-y-2">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>NON-CLINICAL INVESTIGATIONAL USE ONLY (FDA/CE STATEMENT)</span>
        </div>
        <p className="text-xs text-rose-200/90 leading-relaxed">
          Retinova AI is an experimental computer-vision research platform designed exclusively for methodological inquiry into 
          epistemic uncertainty estimation, selective prediction abstention, and convolutional gradient explainability in retinal imaging. 
          It has <strong>not been cleared or approved by the US FDA, EMA, or any national health authority</strong> for clinical diagnostic use. 
          Under no circumstances should decisions regarding patient triage, medical therapy, or laser photocoagulation be made 
          based on model predictions without direct ophthalmoscopic evaluation by a certified ophthalmologist.
        </p>
      </div>

      {/* Grid: 2 Architecture Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model Card 1: ConvNeXt-Tiny */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-semibold">Architecture Card 01</div>
              <h2 className="text-lg font-bold text-white mt-0.5">ConvNeXt-Tiny (v1.4.2)</h2>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
              28.6M Params
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              A modernized pure-convolutional network designed by Liu et al., adopting 7x7 depthwise convolutions, 
              inverted bottleneck ratios, GELU activations, and fewer normalization layers to mirror Vision Transformer receptive fields without quadratic attention overhead.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div>• Input Resolution: 384 x 384 x 3</div>
              <div>• Computational Cost: 4.5 GFLOPs</div>
              <div>• Mean Inference Latency: 38.4 ms (TensorRT FP16)</div>
              <div>• Pretrained Weights: ImageNet-1K fine-tuned on EyePACS</div>
              <div>• Saliency Target: `model.stages[3].blocks[2]`</div>
            </div>
          </div>
        </div>

        {/* Model Card 2: EfficientNet-B3 */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-indigo-400 font-semibold">Architecture Card 02</div>
              <h2 className="text-lg font-bold text-white mt-0.5">EfficientNet-B3 (v2.1.0)</h2>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
              12.2M Params
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              A compound-scaled inverted bottleneck convolutional neural network designed by Tan & Le, 
              simultaneously scaling network depth, width, and input image resolution with fixed scaling coefficients and squeeze-and-excitation attention blocks.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div>• Input Resolution: 300 x 300 x 3</div>
              <div>• Computational Cost: 1.8 GFLOPs</div>
              <div>• Mean Inference Latency: 29.1 ms (TensorRT FP16)</div>
              <div>• Pretrained Weights: ImageNet-1K fine-tuned on EyePACS</div>
              <div>• Saliency Target: `model.conv_head`</div>
            </div>
          </div>
        </div>

      </div>

      {/* Dataset & Training Details Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Training Cohort & Data Preprocessing Specification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white">Cohort Demographics</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Trained on 35,126 color fundus photographs acquired from the retrospective EyePACS diabetic retinopathy screening program across California rural clinics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white">Ben Graham Normalization</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Images are cropped to the active circular fundus mask, scaled to target radius, and locally contrast-normalized by subtracting Gaussian-blurred local luminance: <span className="font-mono text-cyan-300">4*I - 4*G(I) + 128</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white">Loss & Optimization</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Optimized using AdamW with cosine annealing learning rate schedule, label smoothing (ε=0.1), and ordinal focal loss to penalize multi-stage grading disagreements.
            </p>
          </div>
        </div>
      </div>

      {/* Clinical ICDR Staging Reference Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          International Clinical Diabetic Retinopathy (ICDR) Scale Reference
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Clinical Designation</th>
                <th className="py-2.5 px-3">Ophthalmoscopic Hallmarks (Pathology)</th>
                <th className="py-2.5 px-3">Recommended Triage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">0</td>
                <td className="py-2.5 px-3 font-bold text-white">No DR</td>
                <td className="py-2.5 px-3 text-slate-300">No microaneurysms, hemorrhages, or exudates. Normal vascular tree.</td>
                <td className="py-2.5 px-3 text-slate-400">Annual dilated fundus screening.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-mono font-bold text-sky-400">1</td>
                <td className="py-2.5 px-3 font-bold text-white">Mild NPDR</td>
                <td className="py-2.5 px-3 text-slate-300">Microaneurysms only. Focal capillary outpouchings in parafovea.</td>
                <td className="py-2.5 px-3 text-slate-400">Re-examine in 6 to 12 months.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-mono font-bold text-amber-400">2</td>
                <td className="py-2.5 px-3 font-bold text-white">Moderate NPDR</td>
                <td className="py-2.5 px-3 text-slate-300">More than microaneurysms, but less than Severe criteria. Hard lipid exudates.</td>
                <td className="py-2.5 px-3 text-slate-400">Comprehensive ophthalmologist exam in 3 to 6 months.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-mono font-bold text-orange-400">3</td>
                <td className="py-2.5 px-3 font-bold text-white">Severe NPDR</td>
                <td className="py-2.5 px-3 text-slate-300">Any of 4-2-1 criteria: &gt;20 hemorrhages in 4 quadrants, venous beading in 2+, IRMA in 1+.</td>
                <td className="py-2.5 px-3 text-slate-400">Urgent referral to retina specialist within 2 to 4 weeks.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-mono font-bold text-rose-400">4</td>
                <td className="py-2.5 px-3 font-bold text-white">Proliferative DR</td>
                <td className="py-2.5 px-3 text-slate-300">Neovascularization at disc (NVD/NVE), preretinal/vitreous hemorrhage.</td>
                <td className="py-2.5 px-3 text-slate-400">Immediate specialist intervention (panretinal photocoagulation / anti-VEGF).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
