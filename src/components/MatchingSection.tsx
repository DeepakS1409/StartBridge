import React, { useState } from 'react';
import { Investor, Project, UserRole, Category } from '../types';
import {
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  DollarSign,
  Cpu,
  ShieldCheck,
  Send,
  Zap
} from 'lucide-react';

interface MatchingSectionProps {
  projects: Project[];
  investors: Investor[];
  activeRole: UserRole;
  onSelectProject: (project: Project) => void;
  onContactInvestor: (investor: Investor) => void;
}

export const MatchingSection: React.FC<MatchingSectionProps> = ({
  projects,
  investors,
  activeRole,
  onSelectProject,
  onContactInvestor,
}) => {
  const [targetSector, setTargetSector] = useState<Category>('healthcare');
  const [maxBudget, setMaxBudget] = useState<number>(450000);

  // Compute matches based on sector and Indian Rupee budget
  const matchedProjects = projects.filter((p) => {
    const matchesSector = p.category === targetSector;
    const matchesBudget = p.targetFunding <= maxBudget * 1.35;
    return matchesSector && matchesBudget;
  });

  const matchedInvestors = investors.filter((inv) => {
    const matchesSector = inv.preferredThemes.includes(targetSector);
    const matchesBudget = inv.maxCheck >= maxBudget;
    return matchesSector && matchesBudget;
  });

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'healthcare', label: 'Healthcare & Biotech', icon: '🩺' },
    { id: 'education', label: 'Education Tech', icon: '🎓' },
    { id: 'agriculture', label: 'AgriTech & Water', icon: '🌾' },
    { id: 'environment', label: 'CleanTech & Climate', icon: '🌱' },
    { id: 'technology', label: 'DeepTech & Robotics', icon: '⚡' },
  ];

  return (
    <div className="space-y-8">
      
      {/* HUD Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0B1220]/95 to-slate-900/90 border border-slate-800/80 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Automated Pre-Seed Matchmaker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Venture Compatibility Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
            Select your technology sector and funding bracket in Indian Rupees (₹) to instantly discover compatible student prototypes and verified angel check-writers.
          </p>
        </div>

        {/* Interactive HUD Sliders & Selectors */}
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#070A12]/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6">
          
          {/* Sector Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Target Innovation Sector</span>
              <span className="text-emerald-400 font-bold capitalize">{targetSector}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTargetSector(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    targetSector === cat.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 scale-[1.02]'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range Slider (5 cols) */}
          <div className="lg:col-span-5 space-y-3 lg:border-l lg:border-slate-800/80 lg:pl-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase tracking-wider text-slate-400">Target Pre-Seed Check</span>
              <span className="font-mono font-bold text-base text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                ₹{maxBudget.toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min={50000}
              max={1500000}
              step={25000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>₹50,000 (Micro Seed)</span>
              <span>₹15,00,000 (Angel Syndicate)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Dual HUD Output: Matched Startups vs Matched Angels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Compatible Student Startups */}
        <div className="bg-[#0D1321]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {matchedProjects.length}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Compatible Startups</h3>
                <p className="text-[11px] text-slate-400">Within ₹{maxBudget.toLocaleString('en-IN')} target pre-seed</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              Radar Active
            </span>
          </div>

          {matchedProjects.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-dashed border-slate-800 space-y-2">
              <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">No startups currently in this bracket</div>
              <p className="text-[11px] text-slate-500">Try adjusting your check slider to ₹5,00,000+ or choose another sector.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="group p-4 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {p.title}
                      </span>
                      <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {p.stage}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{p.tagline}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold">₹{p.estimatedCost.toLocaleString('en-IN')} BOM</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300">Target ₹{p.targetFunding.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(p);
                    }}
                    className="p-2 rounded-lg bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-300 transition-all shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Compatible Angel Investors */}
        <div className="bg-[#0D1321]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                {matchedInvestors.length}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Matching Angel Investors</h3>
                <p className="text-[11px] text-slate-400">Backing {targetSector} with checks up to ₹25,00,000</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider bg-teal-950/50 px-2 py-0.5 rounded border border-teal-500/30">
              Verified Angels
            </span>
          </div>

          {matchedInvestors.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-dashed border-slate-800 space-y-2">
              <DollarSign className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">No angels matched for this exact range</div>
              <p className="text-[11px] text-slate-500">Try adjusting your budget or explore the full Angel Directory.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedInvestors.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={inv.avatar}
                      alt={inv.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{inv.name}</span>
                        {inv.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-teal-400 truncate">{inv.firm}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Check: ₹{inv.minCheck.toLocaleString('en-IN')} – ₹{inv.maxCheck.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onContactInvestor(inv)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-teal-500/15 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Pitch</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
