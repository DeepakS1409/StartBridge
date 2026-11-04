import React from 'react';
import { ShieldCheck, Heart, Sparkles, Terminal, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070A12] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Branding & Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs">
                SB
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Start<span className="text-emerald-400">Bridge</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-slate-900 text-emerald-400 border border-slate-800 px-2 py-0.5 rounded-full">
                Pre-Seed India ₹
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              Empowering university student innovators to bridge the gap between classroom prototypes and verified early-stage angel checks.
            </p>
          </div>

          <div className="md:col-span-7 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Simulated Prototype Hub for Student Education</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              StartBridge features simulated financial transactions and self-reported IP status. All patent disclosures and funding commitments are prototypes designed for university training and demo pitch competitions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 StartBridge Technologies. Built with React 19, Tailwind CSS v4 & Gemini 3.8.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400/80 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Network Live in Indian Rupees (₹)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
