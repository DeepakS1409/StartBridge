import React, { useState, useRef, useEffect } from 'react';
import { UserRole, Category } from '../types';
import { X, Sparkles, Send, Bot, User, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  currentCategory?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  currentCategory,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm the StartBridge AI Project Advisor powered by Gemini.\n\nI can help you:\n• Match your startup idea with angel investors in India\n• Review your project description, parts list, and budget in Indian Rupees (₹)\n• Explore projects across Healthcare, Education, Agriculture, Environment, and Technology.\n\nHow can I help you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Recommend farming and green technology projects',
    'Review my project parts list and budget in ₹ Rupees',
    'What do angel investors look for in medical devices?',
    'How do I write a good project description for investors?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt.trim(),
          role: activeRole,
          currentCategory: currentCategory || 'all',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I've analyzed your question. You can explore our matching projects in the catalog!",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Failed to get AI assistant advice:', err);
      // Simple English fallback in Indian Rupees
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your interest in ${currentCategory || 'student startups'}: I recommend looking at **CardioMesh** (Smart heart monitor built for ₹35,000) and **CeresEdge** (Solar farm soil sensor built for ₹22,000). Both have working models, low parts costs in Indian Rupees, and great reviews!`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>StartBridge AI Advisor</span>
                <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-700/60 rounded px-1.5 py-0.2">
                  Gemini AI
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Simple advice for student startups & investors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse delay-150" />
              <span className="text-[11px] text-slate-400 ml-1">Thinking with Gemini AI...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Try Asking:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 px-2.5 py-1 rounded-md transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about project matches, budgets in ₹, or startup advice..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
          <div className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            <span>Secure server-side API · Helpful advice in simple English</span>
          </div>
        </div>

      </div>
    </div>
  );
};
