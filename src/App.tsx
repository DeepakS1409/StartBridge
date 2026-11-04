/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LoginPage from './loginpage';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SubmitProjectModal } from './components/SubmitProjectModal';
import { ContactModal } from './components/ContactModal';
import { MessagesDrawer } from './components/MessagesDrawer';
import { InvestorDirectory } from './components/InvestorDirectory';
import { MatchingSection } from './components/MatchingSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Footer } from './components/Footer';

import { INITIAL_PROJECTS, INITIAL_INVESTORS, INITIAL_MESSAGES } from './data/mockData';
import { Project, Investor, ContactMessage, Category, UserRole, Review } from './types';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Star,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Code2,
  Briefcase,
  Users,
  PlusCircle
} from 'lucide-react';

export default function App() {
  // Global State
  const [activeRole, setActiveRole] = useState<UserRole>('developer');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [investors, setInvestors] = useState<Investor[]>(INITIAL_INVESTORS);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'cost-asc' | 'cost-desc' | 'newest'>('rating');

  // Modals & Drawers State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactTarget, setContactTarget] = useState<{ project?: Project; investor?: Investor } | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Role toggle
  const handleRoleToggle = (newRole: UserRole) => {
    setActiveRole(newRole);
    showToast(`Switched to ${newRole === 'developer' ? 'Developer Mode (Submit & Pitch)' : 'Investor Mode (Venture Scouting)'}`);
  };

  // Add new project from submission modal
  const handleAddProject = (newProjectData: Omit<Project, 'id' | 'rating' | 'reviews' | 'createdAt'>) => {
    const newProject: Project = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
      rating: 5.0,
      reviews: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) => [newProject, ...prev]);
    showToast(`Project "${newProject.title}" published to StartBridge!`);
    setSelectedProject(newProject);
  };

  // Add review to a project
  const handleAddReview = (projectId: string, newReview: Omit<Review, 'id' | 'projectId' | 'date'>) => {
    const reviewObj: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      projectId,
      date: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedReviews = [reviewObj, ...p.reviews];
          const avgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            rating: Number(avgRating.toFixed(1)),
          };
        }
        return p;
      })
    );

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => {
        if (!prev) return null;
        const updatedReviews = [reviewObj, ...prev.reviews];
        const avgRating =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...prev,
          reviews: updatedReviews,
          rating: Number(avgRating.toFixed(1)),
        };
      });
    }

    showToast('Your milestone review has been recorded!');
  };

  // Send contact inquiry / pitch
  const handleSendMessage = (msgData: Omit<ContactMessage, 'id' | 'timestamp'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast(`Pitch delivered to ${msgData.recipientName}!`);
  };

  // Update message status
  const handleUpdateMessageStatus = (id: string, newStatus: 'Pending' | 'In Discussion' | 'Connected') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    showToast(`Deal status updated to "${newStatus}"`);
  };

  // Reply to message
  const handleReplyMessage = (id: string, replyText: string) => {
    showToast('Counter proposal dispatched to founder inbox!');
  };

  // Filter & Search computation
  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory;

    const matchesStage =
      selectedStage === 'all' || project.stage === selectedStage;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.tagline.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.languages.some((l) => l.toLowerCase().includes(q)) ||
      project.technologies.some((t) => t.toLowerCase().includes(q)) ||
      project.hardware.some((h) => h.toLowerCase().includes(q));

    return matchesCategory && matchesStage && matchesSearch;
  });

  // Sort computation
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'cost-asc') return a.estimatedCost - b.estimatedCost;
    if (sortBy === 'cost-desc') return b.estimatedCost - a.estimatedCost;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const categoriesList: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Sectors', icon: '🌐' },
    { id: 'healthcare', label: 'Healthcare & Biotech', icon: '🩺' },
    { id: 'agriculture', label: 'AgriTech & Climate', icon: '🌾' },
    { id: 'education', label: 'Education Tech', icon: '🎓' },
    { id: 'environment', label: 'CleanTech & Water', icon: '🌱' },
    { id: 'technology', label: 'DeepTech & Robotics', icon: '⚡' },
  ];

  const allCommunityReviews = projects.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, projectTitle: p.title, projectObj: p }))
  );

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B0F19]/95 text-white border border-emerald-500/60 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-300 backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Fixed Top Navigation Bar with All Menus */}
      <Navbar
        activeRole={activeRole}
        onRoleToggle={handleRoleToggle}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadCount={messages.filter((m) => m.status === 'Pending').length}
        onOpenMessages={() => setIsMessagesDrawerOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalProjects={projects.length}
        totalInvestors={investors.length}
      />

      {/* Main Workspace Frame (Full-width with pt-20 for Fixed Top Navbar) */}
      <div className="flex-1 flex flex-col pt-20">

        {/* View Routing & Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* VIEW 1: EXPLORE STARTUPS VIEW */}
          {activeTab === 'explore' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* High-Energy Dark Luxury Hero Showcase */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0C1322]/95 to-slate-900/90 border border-slate-800/80 p-6 sm:p-10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>India Pre-Seed Innovation Network</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    Where Student Prototypes Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Angel Capital</span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
                    Discover and back early-stage hardware sensors, AI microcontrollers, and university software with transparent BOM build costs and direct investor check brackets in Indian Rupees (₹).
                  </p>

                  {/* 4 Stat Badges Grid */}
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl">
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Pre-Seed Pipeline</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">₹1.4 Cr+</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Startups</span>
                      <span className="text-lg font-mono font-bold text-teal-300">{projects.length} Prototypes</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Verified Angels</span>
                      <span className="text-lg font-mono font-bold text-cyan-300">{investors.length} Syndicates</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">AI Scout Status</span>
                      <span className="text-lg font-mono font-bold text-amber-300 flex items-center gap-1">
                        <Zap className="w-4 h-4 fill-amber-300" />
                        <span>Online</span>
                      </span>
                    </div>
                  </div>

                  {/* CTA Bar */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Pitch Your Startup Now</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('matching')}
                      className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Launch AI Compatibility Radar</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Sector Pills & Filter Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1321]/80 backdrop-blur-xl border border-slate-800/80 space-y-4">
                
                {/* Sector Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {categoriesList.map((cat) => {
                      const count =
                        cat.id === 'all'
                          ? projects.length
                          : projects.filter((p) => p.category === cat.id).length;
                      const isSelected = selectedCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 scale-[1.02]'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-slate-950 text-emerald-300 font-bold'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Stage & Sort Selectors */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="bg-[#070A12] border border-slate-800 text-xs font-medium text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all">All Stages</option>
                      <option value="Concept">Idea Concept</option>
                      <option value="Working Prototype">Working Prototype</option>
                      <option value="MVP">MVP (Early Product)</option>
                      <option value="Field Tested">Field Tested</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#070A12] border border-slate-800 text-xs font-medium text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="rating">Highest Rated</option>
                      <option value="cost-asc">BOM: Low to High</option>
                      <option value="cost-desc">BOM: High to Low</option>
                      <option value="newest">Recently Published</option>
                    </select>
                  </div>
                </div>

                {/* Filter Status Reset Strip */}
                {(searchQuery || selectedCategory !== 'all' || selectedStage !== 'all') && (
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Showing <strong>{sortedProjects.length}</strong> matching startups
                      {searchQuery && <> for &quot;{searchQuery}&quot;</>}
                      {selectedCategory !== 'all' && <> in {selectedCategory}</>}
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedStage('all');
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Startup Cards Grid */}
              {sortedProjects.length === 0 ? (
                <div className="bg-[#0D1321]/80 rounded-3xl border border-slate-800 p-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-slate-900 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No startups match your search</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting your search terms or switch to &quot;All Sectors&quot; to discover all active collegiate prototypes.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedStage('all');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-xl text-xs font-bold"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      activeRole={activeRole}
                      onSelect={(p) => setSelectedProject(p)}
                      onContact={(p) => setContactTarget({ project: p })}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* VIEW 2: SMART MATCHMAKER VIEW */}
          {activeTab === 'matching' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <MatchingSection
                projects={projects}
                investors={investors}
                activeRole={activeRole}
                onSelectProject={(p) => setSelectedProject(p)}
                onContactInvestor={(inv) => setContactTarget({ investor: inv })}
              />
            </div>
          )}

          {/* VIEW 3: ANGEL INVESTORS DIRECTORY VIEW */}
          {activeTab === 'investors' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <InvestorDirectory
                investors={investors}
                projects={projects}
                activeRole={activeRole}
                onSelectInvestor={(inv) => setContactTarget({ investor: inv })}
                onContactInvestor={(inv) => setContactTarget({ investor: inv })}
                onSelectProject={(p) => setSelectedProject(p)}
              />
            </div>
          )}

          {/* VIEW 4: RATINGS & REVIEWS WALL VIEW */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0C1222] to-slate-900 border border-slate-800/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Verified Milestone Feedback</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Ratings & Reviews Wall
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                    Genuine evaluations from angel check-writers, university professors, and peer engineers across India.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <span>Browse Startups to Review</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {allCommunityReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#0D1321]/80 hover:bg-[#11192b] backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{rev.date}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic font-sans">
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white text-[11px]">{rev.authorName}</div>
                        <div className="text-[10px] font-mono text-teal-400">{rev.authorRole}</div>
                      </div>

                      <button
                        onClick={() => setSelectedProject(rev.projectObj)}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                      >
                        <span>View Prototype</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* VIEW 5: MESSAGES & INBOX VIEW */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <MessagesDrawer
                isOpen={true}
                onClose={() => {}}
                messages={messages}
                onUpdateStatus={handleUpdateMessageStatus}
                onReply={handleReplyMessage}
                embedded={true}
              />
            </div>
          )}

        </main>

        {/* Modern Footer */}
        <Footer />

      </div>

      {/* Global Modals & Drawers */}
      <ProjectDetailModal
        project={selectedProject}
        activeRole={activeRole}
        onClose={() => setSelectedProject(null)}
        onContact={(proj) => {
          setSelectedProject(null);
          setContactTarget({ project: proj });
        }}
        onAddReview={handleAddReview}
      />

      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleAddProject}
      />

      <ContactModal
        isOpen={contactTarget !== null}
        onClose={() => setContactTarget(null)}
        project={contactTarget?.project || null}
        targetInvestor={contactTarget?.investor || null}
        activeRole={activeRole}
        onSendMessage={handleSendMessage}
      />

      <MessagesDrawer
        isOpen={isMessagesDrawerOpen}
        onClose={() => setIsMessagesDrawerOpen(false)}
        messages={messages}
        onUpdateStatus={handleUpdateMessageStatus}
        onReply={handleReplyMessage}
      />

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        activeRole={activeRole}
        currentCategory={selectedCategory}
      />

    </div>
  );
}
