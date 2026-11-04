import React, { useState } from 'react';
import { Investor, Project, UserRole } from '../types';
import { DollarSign, MapPin, Briefcase, CheckCircle2, ArrowRight, Filter, Search } from 'lucide-react';

interface InvestorDirectoryProps {
  investors: Investor[];
  projects: Project[];
  activeRole: UserRole;
  onSelectInvestor: (investor: Investor) => void;
  onContactInvestor: (investor: Investor) => void;
  onSelectProject: (project: Project) => void;
}

export const InvestorDirectory: React.FC<InvestorDirectoryProps> = ({
  investors,
  projects,
  activeRole,
  onSelectInvestor,
  onContactInvestor,
  onSelectProject,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredInvestors = investors.filter((inv) => {
    const matchesTheme = selectedTheme === 'all' || inv.preferredThemes.includes(selectedTheme as any);
    const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.firm.toLowerCase().includes(search.toLowerCase()) ||
      inv.bio.toLowerCase().includes(search.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  return (
    <section id="investors" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>Startup Capital & Mentorship</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Active Angel Investors & Startup Mentors
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Connect with verified startup angels and industry mentors looking for student technology prototypes to fund in Indian Rupees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search investors or firms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-slate-900 focus:outline-none placeholder-slate-400 w-40 sm:w-48 text-xs"
              />
            </div>

            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Sectors</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="agriculture">Agriculture</option>
              <option value="environment">Environment</option>
              <option value="technology">Technology</option>
            </select>
          </div>
        </div>

        {/* Investor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInvestors.map((investor) => {
            const matchedProjects = projects.filter((p) =>
              investor.preferredThemes.includes(p.category)
            );

            return (
              <div
                key={investor.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/50 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  
                  {/* Top Profile Lockup */}
                  <div className="flex items-start gap-4">
                    <img
                      src={investor.avatar}
                      alt={investor.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">
                          {investor.name}
                        </h3>
                        {investor.verified && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            <span>Verified Angel</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-700">
                        {investor.role} · <span className="text-teal-800">{investor.firm}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{investor.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio in Simple English */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-4">
                    {investor.bio}
                  </p>

                  {/* Check Size & Themes Strip in Indian Rupees */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Typical Funding Check
                      </span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                        ₹{investor.minCheck.toLocaleString('en-IN')} – ₹{investor.maxCheck.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Startups Supported
                      </span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                        {investor.portfolioCount} student startups
                      </span>
                    </div>
                  </div>

                  {/* Preferred Sectors */}
                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      Interested In:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.preferredThemes.map((theme) => (
                        <span
                          key={theme}
                          className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md capitalize"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Matched Startups in Catalog */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                      Matching Projects in Catalog ({matchedProjects.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedProjects.slice(0, 2).map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => onSelectProject(proj)}
                          className="text-left text-[11px] bg-slate-50 hover:bg-teal-50 hover:text-teal-900 text-slate-700 border border-slate-200 px-2 py-1 rounded transition-colors truncate max-w-full"
                        >
                          → {proj.title.split('—')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 italic">
                    Open for project submissions
                  </span>
                  <button
                    onClick={() => onContactInvestor(investor)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Send Pitch to {investor.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
