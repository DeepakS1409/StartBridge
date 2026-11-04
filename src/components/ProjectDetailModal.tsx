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
  Building
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-teal-400">
              <span className="uppercase tracking-wider">{project.category}</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-slate-300">{project.stage}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5 line-clamp-1">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 divide-y divide-slate-100">
          
          {/* Section 1: Overview & Video Demonstration */}
          <div className="space-y-6">
            
            {/* Tagline & Key Metrics in Indian Rupees */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Summary</span>
                <p className="text-sm font-medium text-slate-800 leading-snug">{project.tagline}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-slate-200 sm:pl-4">
                <div>
                  <div className="text-xs text-slate-500">Cost to Build</div>
                  <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                    ₹{project.estimatedCost.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Target Funding</div>
                  <div className="text-base font-bold text-teal-700 font-mono tabular-nums">
                    ₹{project.targetFunding.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Working-Model Video Player / Demo Embed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Video className="w-4 h-4 text-teal-600" />
                  <span>Working-Model Video & Live Demo</span>
                </div>
                {project.videoUrl && (
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                {project.videoUrl ? (
                  <iframe
                    src={project.videoUrl}
                    title={`${project.title} Working Model Video`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Video className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-xs">No video demo uploaded yet by founder.</p>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Note: Video shows the physical hardware working on testing tables, live sensors, and circuit signals.
              </p>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">What the Project Does</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Real-World Benefits */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Real Benefits for People</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 2: Technical Specifications & BOM */}
          <div className="pt-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>Technical Details & Parts List</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Programming Languages */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                  <Code2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Computer Languages Used</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.languages.map((lang) => (
                    <span key={lang} className="bg-white border border-slate-200 text-slate-800 font-mono text-xs px-2 py-0.5 rounded-md shadow-2xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Software Stack & Frameworks */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>Software & Frameworks</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="bg-white border border-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded-md shadow-2xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hardware Bill of Materials */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                  <Cpu className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hardware Parts List</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1">
                  {project.hardware.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Section 3: Intellectual Property Notice */}
          <div className="pt-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Patent & Intellectual Property (IP) Status</span>
            </h3>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Claimed Protection: {project.ipType}</span>
                </div>
                <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-mono font-medium">
                  Status: {project.ipStatus}
                </span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-amber-200/60 text-[11px] text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Legal Notice:</strong> This patent status is reported directly by the student team. StartBridge does not legally verify patent office papers.
                </span>
              </div>
            </div>

            {/* Founder Card */}
            <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                {project.founderAvatar ? (
                  <img src={project.founderAvatar} alt={project.founderName} className="w-full h-full object-cover" />
                ) : (
                  project.founderName.charAt(0)
                )}
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">{project.founderName}</div>
                <div className="text-slate-600">{project.founderRole} · {project.founderInstitution}</div>
              </div>
            </div>

          </div>

          {/* Section 4: Community Ratings & Peer Reviews */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Ratings & Reviews ({project.reviews.length})
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(project.rating) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold font-mono tabular-nums text-slate-800">{project.rating.toFixed(1)} / 5.0</span>
                  <span>average rating</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {project.reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.authorName}</span>
                      <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                        {rev.authorRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Simple Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Leave a Rating & Review for this Startup
              </span>

              {showReviewSuccess && (
                <div className="bg-teal-50 border border-teal-200 text-teal-900 text-xs p-2.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Review recorded successfully! Thank you for supporting student innovators.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Your Role</label>
                  <select
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Investor">Investor</option>
                    <option value="Peer Developer">Student Developer</option>
                    <option value="Mentor">Teacher / Mentor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Stars</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setNewRating(val)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            val <= newRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-slate-700 ml-1">{newRating} Stars</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Your Feedback & Advice</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Share simple, helpful thoughts on their prototype, cost, or idea..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Post Review
              </button>
            </form>

          </div>

        </div>

        {/* Modal Sticky Bottom Action Footer in Indian Rupees */}
        <div className="sticky bottom-0 z-10 bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-600 hidden sm:block">
            <span>Seeking <strong className="text-slate-900">₹{project.targetFunding.toLocaleString('en-IN')}</strong> startup funding</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onContact(project);
              }}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{activeRole === 'investor' ? 'Send Pitch Inquiry to Founder' : 'Connect with Founder'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
