import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = 
          toast.type === 'success' ? CheckCircle2 :
          toast.type === 'error' ? AlertCircle : Info;

        const borderCol = 
          toast.type === 'success' ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-200' :
          toast.type === 'error' ? 'border-rose-500/50 bg-rose-950/80 text-rose-200' :
          'border-cyan-500/50 bg-slate-900/90 text-cyan-200';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-xl shadow-xl flex items-start gap-2.5 transition-all duration-300 animate-slide-in text-xs ${borderCol}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{toast.text}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
