import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  Compass,
  Target,
  Users,
  Star,
  MessageSquare,
  Bot,
  PlusCircle,
  Search,
  X,
  Menu,
  Code2,
  Briefcase,
  Zap,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleToggle: (newRole: UserRole) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadCount: number;
  onOpenMessages: () => void;
  onOpenAiAssistant: () => void;
  onOpenSubmitModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalProjects: number;
  totalInvestors: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleToggle,
  activeTab,
  onSelectTab,
  unreadCount,
  onOpenMessages,
  onOpenAiAssistant,
  onOpenSubmitModal,
  searchQuery,
  onSearchChange,
  totalProjects,
  totalInvestors,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    {
      id: 'explore',
      label: 'Explore Startups',
      icon: Compass,
      action: () => onSelectTab('explore'),
    },
    {
      id: 'matching',
      label: 'Smart Matchmaker',
      icon: Target,
      badge: 'AI HUD',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      action: () => onSelectTab('matching'),
    },
    {
      id: 'investors',
      label: 'Angel Network',
      icon: Users,
      action: () => onSelectTab('investors'),
    },
    {
      id: 'reviews',
      label: 'Ratings & Reviews',
      icon: Star,
      action: () => onSelectTab('reviews'),
    },
    {
      id: 'messages',
      label: 'Pitches & Inbox',
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold',
      action: () => onSelectTab('messages'),
    },
    {
      id: 'ai-assistant',
      label: 'AI Scout',
      icon: Bot,
      badge: 'Gemini',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold',
      action: onOpenAiAssistant,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('explore')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-black text-lg tracking-tighter">
                    SB
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B0F19] rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    Start<span className="text-emerald-400">Bridge</span>
                  </span>
                  <span className="text-[9px] font-mono tracking-wider text-emerald-400/90 font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    INDIA ₹
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation Bar with Badges */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                        item.badgeColor || 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Workspace Role Switcher + Search + Pitch CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Global Search Expandable Input */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search prototypes, sensors..."
                className="w-44 lg:w-56 bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800/80 text-[11px] font-semibold">
              <button
                onClick={() => onRoleToggle('developer')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  activeRole === 'developer'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Dev</span>
              </button>
              <button
                onClick={() => onRoleToggle('investor')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  activeRole === 'investor'
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Angel</span>
              </button>
            </div>

            {/* Pitch Button */}
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs tracking-tight shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Pitch Startup</span>
              <span className="sm:hidden">Pitch</span>
            </button>

            {/* Mobile / Compact Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Dropdown Sheet for Small/Medium Screens */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800/80 bg-[#0B0F19]/98 backdrop-blur-2xl p-4 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hardware, AI, sensors..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Role Switcher in Mobile */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Active Workspace:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onRoleToggle('developer')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeRole === 'developer'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400'
                }`}
              >
                Developer
              </button>
              <button
                onClick={() => onRoleToggle('investor')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeRole === 'investor'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400'
                }`}
              >
                Investor
              </button>
            </div>
          </div>

          {/* Mobile Navigation List */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900/70 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stats Bar in Mobile */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Pre-Seed Pipeline: <strong className="text-emerald-400">₹1.4 Cr+</strong></span>
            <span>{totalProjects} Startups · {totalInvestors} Angels</span>
          </div>

        </div>
      )}
    </header>
  );
};
