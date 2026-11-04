import React, { useState } from 'react';
import { Investor, Project, UserRole, Category } from '../types';
import {
  Users,
  Search,
  CheckCircle2,
  MapPin,
  Briefcase,
  Send,
  Sparkles,
  TrendingUp,
  Filter
} from 'lucide-react';

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

  const themes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Sectors' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'agriculture', label: 'Agriculture' },
    { id: 'education', label: 'Education' },
    { id: 'environment', label: 'CleanTech' },
    { id: 'technology', label: 'DeepTech' },
  ];

  const filteredInvestors = investors.filter((inv) => {
    const matchesTheme = selectedTheme === 'all' || inv.preferredThemes.includes(selectedTheme as Category);
    const matchesSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.firm.toLowerCase().includes(search.toLowerCase()) ||
      inv.bio.toLowerCase().includes(search.toLowerCase()) ||
      inv.location.toLowerCase().includes(search.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Directory Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0C1222] to-slate-900 border border-slate-800/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Verified Pre-Seed Angel Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Angel Investors & Startup Mentors
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Directly connect with vetted venture angels looking to back university prototypes with ₹1,00,000 to ₹25,00,000 checks.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search angels, firms, or hubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* Sector Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          <span>Sector Filter:</span>
        </span>
        {themes.map((t) => {
          const isSelected = selectedTheme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Investor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInvestors.map((inv) => (
          <div
            key={inv.id}
            className="group bg-[#0D1321]/80 hover:bg-[#11192b] backdrop-blur-xl border border-slate-800/80 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(20,184,166,0.15)] flex flex-col justify-between space-y-5"
          >
            {/* Top Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={inv.avatar}
                      alt={inv.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700/80 group-hover:border-teal-400/80 transition-colors"
                    />
                    {inv.verified && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                        {inv.name}
                      </h3>
                    </div>
                    <div className="text-xs font-semibold text-teal-400">{inv.firm}</div>
                    <div className="text-[11px] text-slate-400">{inv.role}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Check Size Bracket</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 inline-block mt-0.5">
                    ₹{inv.minCheck.toLocaleString('en-IN')} – ₹{inv.maxCheck.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {inv.bio}
              </p>

              {/* Badges / Sector tags */}
              <div className="flex flex-wrap gap-1.5">
                {inv.preferredThemes.map((theme) => (
                  <span
                    key={theme}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-900 text-teal-300 border border-slate-800"
                  >
                    #{theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{inv.location}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-500" />
                  <span>{inv.portfolioCount} Deals Backed</span>
                </span>
              </div>

              <button
                onClick={() => onContactInvestor(inv)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-3 h-3" />
                <span>Pitch Startup</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
