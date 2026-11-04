import React from 'react';
import { Project, UserRole } from '../types';
import { Star, Video, Cpu, ShieldCheck, ArrowUpRight } from 'lucide-react';

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
    healthcare: 'Healthcare',
    education: 'Education',
    agriculture: 'Agriculture',
    environment: 'Environment',
    technology: 'Technology',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-teal-500/60 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Project Thumbnail Image with Safe Fallback */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex items-center justify-center p-6 text-center">
              <Cpu className="w-10 h-10 text-teal-400/80 mb-2" />
              <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                {categoryLabels[project.category] || project.category}
              </div>
            </div>
          )}

          {/* Video indicator badge */}
          {project.videoUrl && (
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1 border border-slate-700/60">
              <Video className="w-3 h-3 text-teal-400" />
              <span>Demo Video</span>
            </div>
          )}

          {/* Stage tag */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md border border-slate-700/60">
            {project.stage}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          
          {/* Metadata with Indian Rupees */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-teal-700 font-semibold uppercase tracking-wider text-[11px]">
              {categoryLabels[project.category] || project.category}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums text-slate-800 font-bold">
              ₹{project.estimatedCost.toLocaleString('en-IN')} Build Cost
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-0.5 text-amber-600 font-mono tabular-nums font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{project.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[11px]">({project.reviews.length})</span>
            </div>
          </div>

          {/* Project Title */}
          <h3 
            onClick={() => onSelect(project)}
            className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors cursor-pointer line-clamp-1"
          >
            {project.title}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>

          {/* Simple Technical Summary */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            
            {/* Languages & Stack */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
              <span className="text-slate-400 font-medium">Tech:</span>
              {project.languages.slice(0, 3).map((lang) => (
                <span key={lang} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">
                  {lang}
                </span>
              ))}
              {project.technologies.slice(0, 2).map((tech) => (
                <span key={tech} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                  {tech}
                </span>
              ))}
            </div>

            {/* Hardware parts snippet */}
            {project.hardware.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                <span className="text-slate-400 font-medium shrink-0">Parts:</span>
                <span className="text-slate-700 truncate text-[11px]">
                  {project.hardware.slice(0, 2).join(', ')}
                  {project.hardware.length > 2 && ` +${project.hardware.length - 2} more`}
                </span>
              </div>
            )}

            {/* Intellectual Property Notice */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">
                {project.ipType} ({project.ipStatus})
              </span>
              <span className="text-[10px] text-slate-400 italic shrink-0">
                · Self-reported
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(project)}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors flex items-center gap-1"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onContact(project)}
          className="text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 px-3 py-1.5 rounded-lg transition-colors shadow-2xs active:scale-95"
        >
          {activeRole === 'investor' ? 'Pitch / Inquire' : 'Express Interest'}
        </button>
      </div>
    </div>
  );
};
