import React, { useState } from 'react';
import { Category, IPStatus, IPType, Project, ProjectStage } from '../types';
import {
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Code2,
  DollarSign,
  Video,
  User,
  Sparkles
} from 'lucide-react';

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newProject: Omit<Project, 'id' | 'rating' | 'reviews' | 'createdAt'>) => void;
}

export const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<Category>('healthcare');
  const [description, setDescription] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [languagesText, setLanguagesText] = useState('Python, C++, TypeScript');
  const [technologiesText, setTechnologiesText] = useState('React, FastAPI, OpenCV');
  const [hardwareText, setHardwareText] = useState('ESP32 Microcontroller, Sensor Board, 3D Printed Case');
  const [estimatedCost, setEstimatedCost] = useState<number>(30000);
  const [targetFunding, setTargetFunding] = useState<number>(350000);
  const [ipType, setIpType] = useState<IPType>('Provisional Patent');
  const [ipStatus, setIpStatus] = useState<IPStatus>('Filed');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  const [founderName, setFounderName] = useState('');
  const [founderRole, setFounderRole] = useState('Student Team Lead');
  const [founderInstitution, setFounderInstitution] = useState('College Innovation Club');
  const [stage, setStage] = useState<ProjectStage>('Working Prototype');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/hero_startup_developer_1792933234121.jpg');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const languages = languagesText
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const technologies = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const hardware = hardwareText
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    onSubmit({
      title: title.trim(),
      tagline: tagline.trim(),
      category,
      description: description.trim(),
      benefits: benefits.length > 0 ? benefits : ['Affordable for everyday adoption and easy to deploy.'],
      languages: languages.length > 0 ? languages : ['Python', 'TypeScript'],
      technologies: technologies.length > 0 ? technologies : ['React', 'FastAPI'],
      hardware: hardware.length > 0 ? hardware : ['Microcontroller Board'],
      estimatedCost: Number(estimatedCost) || 25000,
      targetFunding: Number(targetFunding) || 300000,
      ipType,
      ipStatus,
      videoUrl: videoUrl.trim(),
      founderName: founderName.trim() || 'Student Developer',
      founderRole: founderRole.trim() || 'Project Lead',
      founderInstitution: founderInstitution.trim() || 'Engineering College',
      imageUrl,
      stage,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#0B0F19] w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-800 text-slate-100 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0B0F19]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Pitch New Startup Prototype</h2>
              <p className="text-xs text-slate-400">List your hardware specifications and budget in Indian Rupees (₹)</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Prototype Core */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <span>1. Prototype Basics</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CardioMesh — Smart Wearable Heart Monitor"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">One-Line Tagline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A chest band that spots irregular heartbeats early without hospital visits"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none capitalize"
                  >
                    <option value="healthcare">Healthcare & Biotech</option>
                    <option value="education">Education Tech</option>
                    <option value="agriculture">AgriTech & Climate</option>
                    <option value="environment">CleanTech & Water</option>
                    <option value="technology">DeepTech & Robotics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Prototype Readiness Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ProjectStage)}
                    className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Concept">Idea Concept</option>
                    <option value="Working Prototype">Working Prototype</option>
                    <option value="MVP">MVP (Early Product)</option>
                    <option value="Field Tested">Field Tested with Users</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description & Purpose *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what problem your project solves in plain words..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications & BOM */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
              <span>2. Hardware Sensors & Tech Stack</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hardware & Sensors (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. ESP32 Microcontroller, Heart Rate Sensor, Battery Cell"
                  value={hardwareText}
                  onChange={(e) => setHardwareText(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Languages (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. C++, Python, TypeScript"
                    value={languagesText}
                    onChange={(e) => setLanguagesText(e.target.value)}
                    className="w-full bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Frameworks & Libraries</label>
                  <input
                    type="text"
                    placeholder="e.g. React, TinyML, FastAPI"
                    value={technologiesText}
                    onChange={(e) => setTechnologiesText(e.target.value)}
                    className="w-full bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Financials & IP Status in Indian Rupees */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <span>3. Financials in Indian Rupees (₹) & Patent Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estimated Build Cost (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₹</span>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Pre-Seed Funding (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₹</span>
                  <input
                    type="number"
                    min={10000}
                    step={25000}
                    required
                    value={targetFunding}
                    onChange={(e) => setTargetFunding(Number(e.target.value))}
                    className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Intellectual Property Type</label>
                <select
                  value={ipType}
                  onChange={(e) => setIpType(e.target.value as IPType)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Provisional Patent">Provisional Patent</option>
                  <option value="Utility Patent">Utility Patent</option>
                  <option value="Copyright">Copyright</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Trade Secret">Trade Secret</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">IP Filing Status</label>
                <select
                  value={ipStatus}
                  onChange={(e) => setIpStatus(e.target.value as IPStatus)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Filed">Filed</option>
                  <option value="Drafting">Drafting</option>
                  <option value="Granted">Granted</option>
                  <option value="Not Filed">Not Filed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Demo Video Link (YouTube Embed)</label>
              <input
                type="text"
                placeholder="https://www.youtube-nocookie.com/embed/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-[#070A12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Section 4: Founder Profile */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
              <span>4. Founder Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Founder / Team Lead Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aria Chen"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Founder Role</label>
                <input
                  type="text"
                  placeholder="e.g. Biomedical Student"
                  value={founderRole}
                  onChange={(e) => setFounderRole(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">College / Lab Name</label>
                <input
                  type="text"
                  placeholder="e.g. Collegiate BioDesign Lab"
                  value={founderInstitution}
                  onChange={(e) => setFounderInstitution(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Disclaimer & Action Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Ready to showcase to verified angel check-writers across India.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                Publish Prototype
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
