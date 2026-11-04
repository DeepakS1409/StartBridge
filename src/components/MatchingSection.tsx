import React, { useState } from 'react';
import { Investor, Project, UserRole, Category } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, Sliders, Target } from 'lucide-react';

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
    const matchesBudget = p.targetFunding <= maxBudget;
    return matchesSector && matchesBudget;
  });

  const matchedInvestors = investors.filter((inv) => {
    const matchesSector = inv.preferredThemes.includes(targetSector);
    const matchesBudget = inv.maxCheck >= maxBudget;
    return matchesSector && matchesBudget;
  });

  return (
    <section id="matching" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-teal-600" />
            <span>Automatic Matching Tool</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart Startup & Investor Matchmaker
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pick a sector and funding budget in Indian Rupees to see exactly which student projects and angel investors match.
          </p>
        </div>

        {/* Filter / Parameter Sliders in Indian Rupees */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Sector Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Choose Innovation Sector:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['healthcare', 'education', 'agriculture', 'environment', 'technology'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTargetSector(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                      targetSector === cat
                        ? 'bg-teal-400 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Check Size / Budget Slider in Indian Rupees */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider">
                  Target Funding Amount (in ₹):
                </span>
                <span className="font-mono tabular-nums font-bold text-teal-400 text-sm">
                  ₹{maxBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={1000000}
                step={25000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹1,00,000 (Starter)</span>
                <span>₹5,00,000 (Seed)</span>
                <span>₹10,00,000 (Angel Check)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Match Results Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Matched Projects Panel */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Matching Student Projects ({matchedProjects.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Projects in {targetSector} needing up to ₹{maxBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
                High Match
              </span>
            </div>

            {matchedProjects.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No active projects found in this budget range. Try moving the budget slider above!
              </div>
            ) : (
              <div className="space-y-3">
                {matchedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-500 transition-colors shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 hover:text-teal-700 cursor-pointer" onClick={() => onSelectProject(project)}>
                          {project.title}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {project.founderName} · {project.founderInstitution}
                        </div>
                      </div>
                      <span className="font-mono tabular-nums text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        ₹{project.targetFunding.toLocaleString('en-IN')} Target
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {project.tagline}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Build Cost: ₹{project.estimatedCost.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => onSelectProject(project)}
                        className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 text-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Matched Angels & Mentors Panel */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Matching Angel Investors ({matchedInvestors.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Investors funding up to ₹{maxBudget.toLocaleString('en-IN')} in {targetSector}
                </span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                Active Investors
              </span>
            </div>

            {matchedInvestors.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No investors found for this check size. Try adjusting the filter.
              </div>
            ) : (
              <div className="space-y-3">
                {matchedInvestors.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-500 transition-colors shadow-2xs space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.avatar}
                        alt={inv.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">
                            {inv.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-slate-800">
                            ₹{inv.minCheck.toLocaleString('en-IN')} – ₹{inv.maxCheck.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-xs text-teal-800 font-medium">
                          {inv.role} · {inv.firm}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {inv.bio}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-slate-500">
                        {inv.location}
                      </span>
                      <button
                        onClick={() => onContactInvestor(inv)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                      >
                        <span>Pitch {inv.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
