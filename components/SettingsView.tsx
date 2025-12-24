
import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Smartphone, 
  X, 
  QrCode as QrIcon, 
  CheckCircle2, 
  // Fix: Added missing 'Check' icon import
  Check,
  Copy,
  AlertTriangle,
  FileCode,
  Globe,
  Zap
} from 'lucide-react';
import { ApkFile, View } from '../types';

interface Props {
  apks: ApkFile[];
  setActiveView: (view: View) => void;
}

const SettingsView: React.FC<Props> = ({ apks, setActiveView }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPwaSupported, setIsPwaSupported] = useState(false);
  
  const currentUrl = window.location.origin + window.location.pathname;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&margin=10`;

  useEffect(() => {
    setIsPwaSupported('serviceWorker' in navigator);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Deployment</h1>
          <p className="text-slate-400 font-medium">Netlify & APK Configuration</p>
        </div>
        {isPwaSupported && (
          <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20 text-xs font-black">
            <Zap className="w-4 h-4" /> PWA READY
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PWA / Netlify Section */}
        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe className="w-32 h-32" />
           </div>
           <div className="bg-indigo-600/20 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
             <Rocket className="w-7 h-7" />
           </div>
           <h3 className="text-2xl font-black text-white mb-3">Netlify Hosted</h3>
           <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
             This app is fully optimized for Netlify. Once deployed, users can visit your URL and install it directly via the browser (Add to Home Screen).
           </p>
           <button onClick={() => setShowQR(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 active:scale-[0.98]">
             <QrIcon className="w-5 h-5" /> Generate QR for Phone
           </button>
        </div>

        {/* APK Builder Section */}
        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Smartphone className="w-32 h-32" />
           </div>
           <div className="bg-emerald-600/20 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
             <FileCode className="w-7 h-7" />
           </div>
           <h3 className="text-2xl font-black text-white mb-3">APK Parameters</h3>
           <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
             Using a "Web to APK" builder? Use these verified settings for the highest compatibility and splash screen quality.
           </p>
           <div className="space-y-3 bg-[#0f172a] p-5 rounded-2xl border border-slate-800 font-mono text-[11px] shadow-inner">
             <div className="flex justify-between items-center"><span className="text-slate-500 font-bold uppercase tracking-widest">App Name</span> <span className="text-white font-black">chill</span></div>
             <div className="flex justify-between items-center"><span className="text-slate-500 font-bold uppercase tracking-widest">ID</span> <span className="text-white font-black">com.chill.tracker</span></div>
             <div className="flex justify-between items-center border-t border-slate-800 pt-3 mt-1"><span className="text-slate-500 font-bold uppercase tracking-widest">Source</span> <span className="text-indigo-400 truncate ml-4 max-w-[140px] font-black">{currentUrl}</span></div>
           </div>
        </div>
      </div>

      {/* Netlify Alert */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-sm">
        <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-900/20">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-sm">
          <p className="font-black text-white mb-2 uppercase tracking-wider text-xs">Deployment Success Guide</p>
          <ul className="space-y-2 text-slate-400 font-medium list-disc pl-4">
            <li>Ensure the <code className="text-indigo-400">_redirects</code> file is in your build root.</li>
            <li>Netlify's default HTTPS ensures the Service Worker can activate.</li>
            <li>For the best APK experience, use "Full Screen" or "Standalone" mode in your builder.</li>
          </ul>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-xl p-4">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-[3.5rem] border border-slate-700 p-10 text-center animate-slideUp shadow-2xl relative">
            <button onClick={() => setShowQR(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-white mb-2">Scan & Open</h2>
            <p className="text-sm text-slate-400 mb-8 font-medium">Point your camera to browse on mobile</p>
            
            <div className="bg-white p-6 rounded-[2.5rem] inline-block mb-8 shadow-2xl">
              <img src={qrCodeUrl} alt="QR" className="w-48 h-48" />
            </div>
            
            <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium">
              After opening, tap "Install" or "Add to Home Screen" in your mobile browser.
            </p>
            
            <button onClick={copyLink} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-800 text-white font-black text-sm hover:bg-slate-700 transition-all">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copied' : 'Copy Public URL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
