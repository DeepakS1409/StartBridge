import React, { useState } from 'react';
import { Category, IPStatus, IPType, Project, ProjectStage } from '../types';
import { X, Plus, AlertCircle, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

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
      benefits: benefits.length > 0 ? benefits : ['Affordable for people to buy and easy to use daily.'],
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Developer Portal
            </span>
            <h2 className="text-lg font-bold text-white">
              Submit Your Startup Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Simple English Notice */}
          <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong>Quick Guide for Students:</strong> Fill in your project information, parts list, and costs in Indian Rupees (₹). Your project will be displayed on the website right away for investors to see.
            </div>
          </div>

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Project Name & Description
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Solar Soil Water Sensor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Sector *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="environment">Environment</option>
                  <option value="technology">Technology</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Stage *
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as ProjectStage)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Concept">Idea Concept</option>
                  <option value="Working Prototype">Working Prototype</option>
                  <option value="MVP">MVP (Early Product)</option>
                  <option value="Field Tested">Field Tested with Users</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                One-Sentence Summary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A solar-powered sensor that helps farmers save water by checking soil moisture..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Full Description (in simple words) *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain what problem your startup solves and how your prototype works..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Key Benefits for Users (One per line)
              </label>
              <textarea
                rows={2}
                placeholder="Saves 40% of irrigation water&#10;Works completely on solar power with no battery changes&#10;Alerts farmers on their mobile phones"
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 2: Technical Specifications & BOM */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Technologies & Hardware Parts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Programming Languages (separated by commas) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Python, C++, TypeScript"
                  value={languagesText}
                  onChange={(e) => setLanguagesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Software & Tools (separated by commas) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, FastAPI, OpenCV"
                  value={technologiesText}
                  onChange={(e) => setTechnologiesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Hardware Parts & Sensors (separated by commas) *
              </label>
              <input
                type="text"
                required
                placeholder="ESP32 Chip, Soil Probe, Solar Panel, Battery, 3D Printed Case"
                value={hardwareText}
                onChange={(e) => setHardwareText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 3: Financials in Indian Rupees */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Budget in Indian Rupees (₹) & Patents
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Estimated Build Cost (₹ Rupees) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={500}
                  placeholder="30000"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Startup Funding (₹ Rupees) *
                </label>
                <input
                  type="number"
                  required
                  min={25000}
                  step={10000}
                  placeholder="350000"
                  value={targetFunding}
                  onChange={(e) => setTargetFunding(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Patent or Copyright Type *
                </label>
                <select
                  value={ipType}
                  onChange={(e) => setIpType(e.target.value as IPType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Provisional Patent">Provisional Patent</option>
                  <option value="Utility Patent">Full Utility Patent</option>
                  <option value="Copyright">Software Copyright</option>
                  <option value="Trade Secret">Trade Secret</option>
                  <option value="Open Source">Open Source (Public Free License)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Patent Filing Status *
                </label>
                <select
                  value={ipStatus}
                  onChange={(e) => setIpStatus(e.target.value as IPStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Filed">Filed with Patent Office</option>
                  <option value="Drafting">Currently Preparing Papers</option>
                  <option value="Granted">Granted & Approved</option>
                  <option value="Not Filed">Not Filed Yet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Working-Model Video Embed Link (YouTube or Vimeo)
              </label>
              <input
                type="url"
                placeholder="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 4: Developer Credentials */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Founder & College Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2nd Year Computer Science"
                  value={founderRole}
                  onChange={(e) => setFounderRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  College or Institution *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SECE Innovation Center"
                  value={founderInstitution}
                  onChange={(e) => setFounderInstitution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
            >
              Publish Project to StartBridge
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
