import React, { useState } from 'react';
import { Project, Investor, UserRole, ContactMessage } from '../types';
import { X, Send, CheckCircle2, DollarSign, User, Mail, Sparkles } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  targetInvestor?: Investor | null;
  activeRole: UserRole;
  onSendMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp'>) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  project,
  targetInvestor,
  activeRole,
  onSendMessage,
}) => {
  const [senderName, setSenderName] = useState(
    activeRole === 'investor' ? 'Dr. Vikram Patel' : 'Aria Chen'
  );
  const [senderEmail, setSenderEmail] = useState(
    activeRole === 'investor' ? 'vikram@biopulseangels.com' : 'aria.chen@college.edu'
  );
  const [intendedFunding, setIntendedFunding] = useState('₹1,00,000 – ₹5,00,000 Pre-Seed Check');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const recipientName = project
    ? project.founderName
    : targetInvestor
    ? targetInvestor.name
    : 'Team';

  const projectTitle = project
    ? project.title
    : targetInvestor
    ? `Direct Pitch to ${targetInvestor.name}`
    : 'Direct Inquiry';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage({
      projectId: project ? project.id : 'general',
      projectTitle,
      senderName: senderName.trim(),
      senderRole: activeRole === 'investor' ? 'Investor' : 'Developer',
      senderEmail: senderEmail.trim(),
      recipientName,
      message: message.trim(),
      intendedFunding,
      status: 'Pending',
    });

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-[#0B0F19] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-800 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B0F19]/95 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {activeRole === 'investor' ? 'Send Pre-Seed Inquiry' : 'Pitch to Angel Investor'}
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-xs">
                To: <span className="text-emerald-400 font-semibold">{recipientName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Inquiry Sent Successfully!</h3>
            <p className="text-xs text-slate-400">
              Delivered directly to {recipientName}&apos;s verified inbox on StartBridge.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Regarding Project / Proposal:</span>
              <div className="font-bold text-white truncate">{projectTitle}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Check Size / Pre-Seed Bracket
              </label>
              <select
                value={intendedFunding}
                onChange={(e) => setIntendedFunding(e.target.value)}
                className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
              >
                <option value="₹50,000 – ₹1,50,000 Micro-Grant">₹50,000 – ₹1,50,000 Micro-Grant</option>
                <option value="₹1,00,000 – ₹5,00,000 Pre-Seed Check">₹1,00,000 – ₹5,00,000 Pre-Seed Check</option>
                <option value="₹5,00,000 – ₹15,00,000 Angel Syndicate">₹5,00,000 – ₹15,00,000 Angel Syndicate</option>
                <option value="₹15,00,000+ Institutional Pre-Seed">₹15,00,000+ Institutional Pre-Seed</option>
                <option value="Mentorship & Lab Pilot Only">Mentorship & Lab Pilot Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Proposal & Pitch Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share why you are interested in backing or collaborating on this hardware prototype..."
                className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Deliver Message</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
