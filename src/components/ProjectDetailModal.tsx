import React, { useState } from 'react';
import { Project, Review, UserRole } from '../types';
import {
  X,
  Star,
  ShieldAlert,
  ShieldCheck,
  Video,
  Cpu,
  Code2,
  Layers,
  CheckCircle2,
  Send,
  ExternalLink,
  User,
  Building,
  DollarSign,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  activeRole: UserRole;
  onClose: () => void;
  onContact: (project: Project) => void;
  onAddReview: (projectId: string, newReview: Omit<Review, 'id' | 'projectId' | 'date'>) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  activeRole,
  onClose,
  onContact,
  onAddReview,
}) => {
  const [newRating, setNewRating] = useState<number>(5);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState<'Investor' | 'Peer Developer' | 'Mentor'>(
    activeRole === 'investor' ? 'Investor' : 'Peer Developer'
  );
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  if (!project) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    onAddReview(project.id, {
      authorName: authorName.trim(),
      authorRole,
      rating: newRating,
      comment: reviewComment.trim(),
    });

    setReviewComment('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#0B0F19] w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden my-6 flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="sticky top-0 z-10 bg-[#0B0F19]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400">
              <span className="uppercase tracking-wider">{project.category}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">{project.stage}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5 line-clamp-1">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Demo Video Banner or Preview */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video relative shadow-inner">
            {project.videoUrl ? (
              <iframe
                src={project.videoUrl}
                title={`${project.title} Demo Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Video className="w-12 h-12 text-slate-600" />
                <span className="text-xs font-mono">Hardware Video Demonstration</span>
              </div>
            )}
          </div>

          {/* 4 Financial & Tech Metric HUD Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Parts BOM Cost</span>
              <span className="text-base font-mono font-bold text-emerald-400">
                ₹{project.estimatedCost.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Target Pre-Seed</span>
              <span className="text-base font-mono font-bold text-teal-300">
                ₹{project.targetFunding.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Patent / IP Type</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{project.ipType}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">{project.ipStatus}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Community Trust</span>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{project.rating.toFixed(1)} / 5.0</span>
              </div>
              <span className="text-[10px] text-slate-400">{project.reviews.length} Verified Reviews</span>
            </div>
          </div>

          {/* Description & Core Impact */}
          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Prototype Blueprint & Social Benefit
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {project.description}
            </p>

            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">Key Advantages:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specifications: Hardware BOM & Software Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Hardware BOM */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Hardware Components & Sensors (BOM)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.hardware.map((hw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#070A12] text-slate-300 border border-slate-800"
                  >
                    {hw}
                  </span>
                ))}
              </div>
            </div>

            {/* Software Technologies */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Code2 className="w-4 h-4 text-teal-400" />
                <span>Software Stack & Programming Languages</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.languages.concat(project.technologies).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#070A12] text-teal-300 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Founder Identity Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.founderAvatar ? (
                <img
                  src={project.founderAvatar}
                  alt={project.founderName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                  {project.founderName.charAt(0)}
                </div>
              )}
              <div>
                <h5 className="text-sm font-bold text-white">{project.founderName}</h5>
                <p className="text-xs text-slate-400">{project.founderRole}</p>
                <p className="text-xs text-emerald-400/90 font-mono">{project.founderInstitution}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onContact(project);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Connect with Founder</span>
            </button>
          </div>

          {/* Community Reviews & Ratings Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Verified Peer & Investor Reviews</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">{project.reviews.length} entries</span>
            </div>

            {/* List of Reviews */}
            <div className="space-y-3">
              {project.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rev.authorName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-800">
                        {rev.authorRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{rev.comment}</p>
                  <span className="text-[10px] font-mono text-slate-500">{rev.date}</span>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-3">
              <h5 className="text-xs font-bold text-white">Leave Feedback or Milestone Validation</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Dr. Ramesh / Mentor)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />

                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Investor">Angel Investor</option>
                  <option value="Mentor">Startup Mentor</option>
                  <option value="Peer Developer">Peer Developer</option>
                </select>
              </div>

              {/* Rating Star Selection */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewRating(s)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Share constructive feedback on BOM cost, sensor selection, or market feasibility..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />

              <div className="flex items-center justify-between">
                {showReviewSuccess ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Review recorded!
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>

          </div>

        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={() => {
              onContact(project);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Pitch & Funding Inquiry</span>
          </button>
        </div>

      </div>
    </div>
  );
};
