import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Compass, 
  MessageSquare, 
  Sparkles, 
  PlusCircle, 
  Users, 
  Menu, 
  X, 
  Zap,
  Briefcase,
  Star,
  Home
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 6 navigation items requested by the user
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Projects' },
    { id: 'submit', label: 'Submit Project', action: onOpenSubmitModal },
    { id: 'investors', label: 'Investors' },
    { id: 'reviews', label: 'Ratings & Reviews' },
    { id: 'ai-assistant', label: 'AI Assistant', action: onOpenAiAssistant },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.action) {
      link.action();
    } else {
      onSelectTab(link.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-inner">
                <span className="text-lg tracking-tighter">SB</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  Start<span className="text-teal-400">Bridge</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider text-slate-400 font-medium border border-slate-700 rounded px-1.5 py-0.5">
                  India Pre-Seed Hub
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`transition-colors py-1 hover:text-white whitespace-nowrap shrink-0 text-left ${
                  activeTab === link.id
                    ? 'text-teal-400 font-bold border-b-2 border-teal-400'
                    : 'text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Interactive Role Switcher & Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Interactive Role Switcher */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => onRoleToggle('developer')}
                title="Switch to Developer Mode"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeRole === 'developer'
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Developer</span>
              </button>
              <button
                onClick={() => onRoleToggle('investor')}
                title="Switch to Investor Mode"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeRole === 'investor'
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Investor</span>
              </button>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/60 hover:bg-teal-900/80 border border-teal-700/60 rounded-lg transition-colors"
              title="Open Gemini AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">AI Assistant</span>
            </button>

            {/* Direct Messages Inbox Button */}
            <button
              onClick={onOpenMessages}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="View Pitches & Contact Requests"
              aria-label="View Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            {activeRole === 'developer' ? (
              <button
                onClick={onOpenSubmitModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Submit Project</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('explore')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-all shadow-sm active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Browse Deals</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === link.id
                  ? 'bg-slate-800 text-teal-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
