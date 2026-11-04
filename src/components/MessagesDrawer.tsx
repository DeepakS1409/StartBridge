import React, { useState } from 'react';
import { ContactMessage } from '../types';
import {
  X,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
  Mail,
  Briefcase,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface MessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ContactMessage[];
  onUpdateStatus: (id: string, newStatus: 'Pending' | 'In Discussion' | 'Connected') => void;
  onReply: (id: string, replyText: string) => void;
  embedded?: boolean;
}

export const MessagesDrawer: React.FC<MessagesDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onUpdateStatus,
  onReply,
  embedded = false,
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  if (!isOpen && !embedded) return null;

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    onReply(activeMessage.id, replyText.trim());
    setReplyText('');
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 3000);
  };

  const statusColors = {
    Pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'In Discussion': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    Connected: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0B0F19] text-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#0B0F19] px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Deal Flow & Pitches Hub</h2>
            <p className="text-xs text-slate-400">Direct conversations between founders and angel investors</p>
          </div>
        </div>
        {!embedded && (
          <button
            onClick={onClose}
            aria-label="Close inbox"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Split Layout: Left message list, Right active conversation */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left: Message List (5 cols) */}
        <div className="md:col-span-5 border-r border-slate-800/80 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No inquiries yet. When investors or founders reach out, messages appear here.
            </div>
          ) : (
            messages.map((m) => {
              const isSelected = activeMessage?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMessageId(m.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-inner'
                      : 'bg-slate-950/60 hover:bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white truncate max-w-[120px]">{m.senderName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{m.timestamp.slice(5)}</span>
                  </div>
                  <div className="text-[11px] font-medium text-emerald-400 truncate mb-1">
                    {m.projectTitle}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{m.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{m.intendedFunding || 'Discussion'}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        statusColors[m.status] || 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Active Thread Detail (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto p-5 bg-[#070A12]/80">
          {activeMessage ? (
            <div className="space-y-4">
              
              {/* Thread Info Bar */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeMessage.senderName}</h3>
                    <div className="text-xs text-slate-400">{activeMessage.senderEmail}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['Pending', 'In Discussion', 'Connected'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => onUpdateStatus(activeMessage.id, status)}
                        className={`text-[10px] font-mono px-2 py-1 rounded-md border transition-all ${
                          activeMessage.status === status
                            ? statusColors[status] + ' font-bold shadow-xs'
                            : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Check:</span>
                  <span className="text-emerald-400 font-bold">{activeMessage.intendedFunding}</span>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Pitch Note from {activeMessage.senderRole}:</span>
                  <span>{activeMessage.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  &quot;{activeMessage.message}&quot;
                </p>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 space-y-3">
                <label className="block text-xs font-medium text-slate-300">
                  Send Counter Proposal or Schedule Demo:
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="e.g. Thanks for the interest! We are running tests on ESP32 this Friday and can demo via Google Meet..."
                  className="w-full bg-[#0B0F19] border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  {replySuccess ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Reply dispatched!
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              Select a message from the list to view proposal details and respond.
            </div>
          )}
        </div>

      </div>

    </div>
  );

  if (embedded) {
    return (
      <div className="h-[650px] rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0B0F19] h-full shadow-2xl flex flex-col border-l border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
