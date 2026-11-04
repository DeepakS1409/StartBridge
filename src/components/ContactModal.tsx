import React, { useState } from 'react';
import { Project, Investor, UserRole, ContactMessage } from '../types';
import { X, Send, CheckCircle2 } from 'lucide-react';

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
  const [intendedFunding, setIntendedFunding] = useState('₹1,00,000 – ₹5,00,000 Seed Check');
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
    ? `Investor Outreach to ${targetInvestor.name}`
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
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Send Direct Message
            </span>
            <h2 className="text-base font-bold text-white">
              Connect with {recipientName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {isSent ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your message has been delivered to the StartBridge message inbox. The founder can reply to you directly.
              </p>
            </div>
          ) : (
            <>
              {/* Regarding Notice */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Regarding:</span>{' '}
                <span className="text-slate-800">{projectTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Your Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Proposed Funding / Collaboration Scope (in ₹ Rupees)
                </label>
                <select
                  value={intendedFunding}
                  onChange={(e) => setIntendedFunding(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="₹50,000 – ₹1,00,000 Starter Angel Check">₹50,000 – ₹1,00,000 Starter Angel Check</option>
                  <option value="₹1,00,000 – ₹5,00,000 Seed Investment">₹1,00,000 – ₹5,00,000 Seed Investment</option>
                  <option value="₹5,00,000 – ₹15,00,000 Syndicate Funding">₹5,00,000 – ₹15,00,000 Syndicate Funding</option>
                  <option value="College Grant Matching & Co-Development">College Grant Matching & Co-Development</option>
                  <option value="Mentorship & Technical Advice">Mentorship & Technical Advice</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Your Message to the Founder *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Introduce yourself, say what you like about this project, and ask any questions you have for the student team..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
};
