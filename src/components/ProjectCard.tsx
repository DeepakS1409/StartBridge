import React from 'react';
import { Project, UserRole } from '../types';
import {
  Star,
  Video,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Layers,
  Send,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  activeRole: UserRole;
  onSelect: (project: Project) => void;
  onContact: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  activeRole,
  onSelect,
  onContact,
}) => {
  const categoryLabels: Record<string, string> = {
    healthcare: 'Healthcare & Biotech',
    education: 'Education Tech',
    agriculture: 'AgriTech & Climate',
    environment: 'CleanTech & Water',
    technology: 'DeepTech & Robotics',
  };

  const stageBadgeColors: Record<string, string> = {
    'Field Tested': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    'Working Prototype': 'bg-teal-500/15 text-teal-300 border-teal-500/40',
    'MVP': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
    'Concept': 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  };

  // Progress towards simulated funding
  const fundingPercent = Math.min(Math.round((project.estimatedCost / project.targetFunding) * 100 * 4), 92);

  return (
    <div className="group relative flex flex-col justify-between bg-[#0D1321]/80 hover:bg-[#11192b]/95 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.2)] hover:-translate-y-1">
      
      {/* Top Image / Media Zone */}
      <div>
        <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-950 via-[#0B101E] to-teal-950/40 flex items-center justify-center p-6 text-center">
              <Cpu className="w-12 h-12 text-emerald-400/60 mb-2" />
            </div>
          )}

          {/* Dark luxury gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1321] via-transparent to-black/60 pointer-events-none" />

          {/* Top Badges Bar */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold bg-[#070A12]/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              {categoryLabels[project.category] || project.category}
            </span>

            {project.videoUrl && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60 shadow-sm">
                <Video className="w-3 h-3 text-emerald-400" />
                <span>Demo Video</span>
              </div>
            )}
          </div>

          {/* Stage tag */}
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-md ${
                stageBadgeColors[project.stage] || 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {project.stage}
            </span>
          </div>

          {/* Community Rating Pill */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{project.rating.toFixed(1)}</span>
            <span className="text-slate-500 font-normal text-[10px]">({project.reviews.length})</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          
          {/* Title & Tagline */}
          <div className="space-y-1.5">
            <h3
              onClick={() => onSelect(project)}
              className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer line-clamp-1 flex items-center gap-1.5"
            >
              <span>{project.title}</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity shrink-0" />
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
              {project.tagline}
            </p>
          </div>

          {/* Hardware & Tech Chips */}
          <div className="flex flex-wrap gap-1.5">
            {project.hardware.slice(0, 3).map((hw, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900/90 text-slate-300 border border-slate-800 truncate max-w-[150px]"
              >
                {hw}
              </span>
            ))}
            {project.hardware.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-900/60 text-slate-500 border border-slate-800">
                +{project.hardware.length - 3}
              </span>
            )}
          </div>

          {/* Financials & Target Progress in Indian Rupees */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Parts BOM Cost</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  ₹{project.estimatedCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Target Pre-Seed</span>
                <span className="text-sm font-mono font-bold text-slate-200">
                  ₹{project.targetFunding.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Target Funding Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${fundingPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Validation Stage</span>
                <span className="text-emerald-400 font-semibold">{fundingPercent}% Seed Ready</span>
              </div>
            </div>
          </div>

          {/* Founder Credit & IP Badge */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {project.founderAvatar ? (
                <img
                  src={project.founderAvatar}
                  alt={project.founderName}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-500/40 shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {project.founderName.charAt(0)}
                </div>
              )}
              <div className="truncate">
                <div className="text-slate-200 font-medium truncate text-[11px]">{project.founderName}</div>
                <div className="text-[10px] text-slate-500 truncate">{project.founderInstitution}</div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{project.ipStatus}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3 bg-slate-950/70 border-t border-slate-800/70 grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelect(project)}
          className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Inspect Specs</span>
        </button>

        <button
          onClick={() => onContact(project)}
          className="w-full py-2 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 group-hover:border-emerald-500/60"
        >
          <Send className="w-3 h-3 text-emerald-400" />
          <span>{activeRole === 'investor' ? 'Send Check' : 'Contact'}</span>
        </button>
      </div>

    </div>
  );
};
