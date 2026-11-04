import React, { useState } from 'react';
import { ContactMessage } from '../types';
import { X, MessageSquare, Clock, CheckCircle2, Send, Mail, Briefcase, User } from 'lucide-react';

interface MessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ContactMessage[];
  onUpdateStatus: (id: string, newStatus: 'Pending' | 'In Discussion' | 'Connected') => void;
  onReply: (id: string, replyText: string) => void;
}

export const MessagesDrawer: React.FC<MessagesDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onUpdateStatus,
  onReply,
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  if (!isOpen) return null;

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    onReply(activeMessage.id, replyText.trim());
    setReplyText('');
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-white">Direct Pitch & Inquiry Inbox</h2>
              <p className="text-xs text-slate-400">Direct messages between startup founders and angel investors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split list and thread */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Messages List Column */}
          <div className="md:col-span-5 overflow-y-auto p-3 space-y-2 bg-slate-50">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              Active Inquiries ({messages.length})
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No messages yet. Send a pitch request from any project card!
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = activeMessage?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white border-teal-500 shadow-xs'
                        : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-900 truncate max-w-[120px]">
                        {msg.senderName}
                      </span>
                      <span className="text-slate-400 text-[10px]">{msg.timestamp.split(' ')[0]}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 truncate mb-1">
                      {msg.projectTitle}
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {msg.senderRole}
                      </span>
                      <span className={`font-medium ${
                        msg.status === 'Connected'
                          ? 'text-emerald-600'
                          : msg.status === 'In Discussion'
                          ? 'text-teal-700'
                          : 'text-amber-600'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Message Detail Column */}
          <div className="md:col-span-7 flex flex-col h-full bg-white overflow-hidden">
            {activeMessage ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Message Header */}
                <div className="p-4 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeMessage.senderName}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-medium text-teal-700">{activeMessage.senderRole}</span>
                        <span>·</span>
                        <span>{activeMessage.senderEmail}</span>
                      </div>
                    </div>

                    {/* Status dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Status:</span>
                      <select
                        value={activeMessage.status}
                        onChange={(e) => onUpdateStatus(activeMessage.id, e.target.value as any)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Connected">Connected</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-xs">
                    <div className="font-semibold text-slate-800">
                      Project: {activeMessage.projectTitle}
                    </div>
                    {activeMessage.intendedFunding && (
                      <div className="text-[11px] text-teal-800 font-mono mt-0.5">
                        Proposed Scope: {activeMessage.intendedFunding}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {activeMessage.message}
                  </div>

                  {replySuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Reply sent to {activeMessage.senderName}!</span>
                    </div>
                  )}
                </div>

                {/* Reply Form Footer */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                  <textarea
                    rows={2}
                    placeholder={`Reply to ${activeMessage.senderName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Direct channel simulation
                    </span>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Select a message to view the conversation.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
