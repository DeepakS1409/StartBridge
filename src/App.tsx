/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
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
  Filter, 
  SlidersHorizontal, 
  Compass, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Star,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';

export default function App() {
  // Global State
  const [activeRole, setActiveRole] = useState<UserRole>('developer');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [investors, setInvestors] = useState<Investor[]>(INITIAL_INVESTORS);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  
  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'cost-asc' | 'cost-desc' | 'newest'>('rating');

  // Modals & Drawers
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactTarget, setContactTarget] = useState<{ project?: Project; investor?: Investor } | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // User notification toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Role toggle
  const handleRoleToggle = (newRole: UserRole) => {
    setActiveRole(newRole);
    showToast(`Switched to ${newRole === 'developer' ? 'Developer Mode (Submit projects & check investor messages)' : 'Investor Mode (Browse projects & send funding inquiries)'}`);
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
    showToast(`Project "${newProject.title}" added to StartBridge!`);
    
    // Automatically open to view details
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

    // Keep selectedProject state in sync
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

    showToast('Your rating and review have been recorded!');
  };

  // Send contact inquiry / pitch
  const handleSendMessage = (msgData: Omit<ContactMessage, 'id' | 'timestamp'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast(`Message delivered to ${msgData.recipientName}!`);
  };

  // Update message status in drawer
  const handleUpdateMessageStatus = (id: string, newStatus: 'Pending' | 'In Discussion' | 'Connected') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    showToast(`Message status changed to "${newStatus}"`);
  };

  // Reply to message
  const handleReplyMessage = (id: string, replyText: string) => {
    showToast(`Reply sent to student team!`);
  };

  // Navigation tab handler
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(tab);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
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

  const categoriesList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Sectors' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'agriculture', label: 'Agriculture' },
    { id: 'environment', label: 'Environment' },
    { id: 'technology', label: 'Technology' },
  ];

  // Collect all community reviews across projects for the dedicated Reviews section
  const allCommunityReviews = projects.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, projectTitle: p.title, projectObj: p }))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white border border-teal-500/80 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation with 6 Requested Menu Items */}
      <Navbar
        activeRole={activeRole}
        onRoleToggle={handleRoleToggle}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        unreadCount={messages.filter((m) => m.status === 'Pending').length}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />

      {/* Hero Section with Smart AI Matching Box */}
      <div id="home">
        <HeroSection
          activeRole={activeRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          onExploreClick={() => handleSelectTab('explore')}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 space-y-16">
        
        {/* Explore Projects Catalog Section */}
        <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-6">
          
          {/* Section Header in Simple English */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
                <span>Student Startup Project Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Startup Projects
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Browse student technology projects with parts list, demo videos, and build costs in Indian Rupees (₹).
              </p>
            </div>

            {/* Quick Submit CTA */}
            {activeRole === 'developer' && (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit New Project</span>
              </button>
            )}
          </div>

          {/* Interactive Filters Bar (Segmented Buttons) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            
            {/* Sector Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
                  Sector:
                </span>
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
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] font-mono px-1 rounded ${
                        isSelected ? 'bg-teal-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Stage & Sort Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Readiness Stage Selector */}
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">All Stages</option>
                  <option value="Concept">Idea Concept</option>
                  <option value="Working Prototype">Working Prototype</option>
                  <option value="MVP">MVP (Early Product)</option>
                  <option value="Field Tested">Field Tested with Users</option>
                </select>

                {/* Sort Order Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="cost-asc">Build Cost: Low to High</option>
                  <option value="cost-desc">Build Cost: High to Low</option>
                  <option value="newest">Recently Published</option>
                </select>

              </div>
            </div>

            {/* Active Search Filter Indicator */}
            {(searchQuery || selectedCategory !== 'all' || selectedStage !== 'all') && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing <strong>{sortedProjects.length}</strong> matching projects
                  {searchQuery && <> for &quot;{searchQuery}&quot;</>}
                  {selectedCategory !== 'all' && <> in {selectedCategory}</>}
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStage('all');
                  }}
                  className="text-teal-700 hover:text-teal-800 font-semibold"
                >
                  Reset all filters
                </button>
              </div>
            )}

          </div>

          {/* Project Cards Grid */}
          {sortedProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No projects found with these filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search terms or picking &quot;All Sectors&quot; to see all projects.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStage('all');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Clear Filters
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

        </section>

        {/* Smart Compatibility Matchmaker Section */}
        <section id="matching">
          <MatchingSection
            projects={projects}
            investors={investors}
            activeRole={activeRole}
            onSelectProject={(p) => setSelectedProject(p)}
            onContactInvestor={(inv) => setContactTarget({ investor: inv })}
          />
        </section>

        {/* Investor Profiles Directory Section */}
        <section id="investors">
          <InvestorDirectory
            investors={investors}
            projects={projects}
            activeRole={activeRole}
            onSelectInvestor={(inv) => setContactTarget({ investor: inv })}
            onContactInvestor={(inv) => setContactTarget({ investor: inv })}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        </section>

        {/* Dedicated Ratings & Reviews Section (Requested in Navigation Menu) */}
        <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Community Feedback</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Ratings & Reviews
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Read genuine reviews from angel investors, university teachers, and fellow student developers.
                </p>
              </div>
              <button
                onClick={() => handleSelectTab('explore')}
                className="self-start sm:self-auto text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Browse all {projects.length} startups to review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {allCommunityReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-500/60 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{rev.authorName}</div>
                      <div className="text-[11px] text-slate-500">{rev.authorRole}</div>
                    </div>
                    <button
                      onClick={() => setSelectedProject(rev.projectObj)}
                      className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 underline underline-offset-2"
                    >
                      View Startup →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple English Guide: How It Works */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800 space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                Beginner Guide for Students
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How StartBridge Works in 4 Simple Steps
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                A simple guide for first-year college developers to get their projects noticed and funded.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-sm font-bold text-white">List Your Parts</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Write down your hardware sensors, chips (like ESP32 or Arduino), and computer code.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-sm font-bold text-white">Add a Demo Video</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Record a short video on your phone or lab table showing your prototype working in real life.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-sm font-bold text-white">Set Budget in ₹ Rupees</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  State how much your prototype cost to build and how much startup money you need in Indian Rupees.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="text-sm font-bold text-white">Talk to Investors</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Receive direct messages from angel investors who want to support your startup with mentorship and checks.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>All transactions on this learning website are simulated prototypes for student education.</span>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg transition-colors"
              >
                Submit Your Project Now
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Interactive Drawers */}
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
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
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
