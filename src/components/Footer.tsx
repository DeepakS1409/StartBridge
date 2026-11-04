import React from 'react';
import { ShieldAlert, Heart, ExternalLink, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black text-sm">
                SB
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Start<span className="text-teal-400">Bridge</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Connecting college student developers who build real prototypes with startup angel investors in India.
            </p>
          </div>

          {/* Impact Sectors */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Startup Sectors
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><span className="hover:text-teal-400 cursor-pointer">Healthcare & Medical Devices</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">Education & Learning Aids</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">Farming & Soil Sensors</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">Clean Water & Environment</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">Robotics & Smart Cameras</span></li>
            </ul>
          </div>

          {/* Student Innovator Resources in Simple English */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Student Resources
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><span className="hover:text-teal-400 cursor-pointer">How to Write a Parts List (BOM)</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">Provisional Patent Basics in India</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">College Project Funding Guide</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">Tips for Demo Videos</span></li>
            </ul>
          </div>

          {/* Compliance & Simulated Notice in Simple English */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Notice for Users
            </h4>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Simulated Educational Platform</span>
              </div>
              <p>
                StartBridge does not handle actual bank money transfers or verify official government patent papers. All project costs, investments, and reviews on this website are simulated for student learning.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} StartBridge. Built for college startup developers and angel investors.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Notice</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Student Club Partnerships</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
