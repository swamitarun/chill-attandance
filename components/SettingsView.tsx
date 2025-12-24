
import React, { useState } from 'react';
import { 
  Rocket, 
  Smartphone, 
  X, 
  QrCode as QrIcon, 
  CheckCircle2, 
  Download,
  Copy,
  Check,
  AlertTriangle,
  FileCode,
  Layout
} from 'lucide-react';
import { ApkFile, View } from '../types';

interface Props {
  apks: ApkFile[];
  setActiveView: (view: View) => void;
}

const SettingsView: React.FC<Props> = ({ apks, setActiveView }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&margin=10`;

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      <header>
        <h1 className="text-3xl font-bold text-white">Deployment & APK</h1>
        <p className="text-slate-400">Get your tracker on your phone home screen</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-700">
           <div className="bg-indigo-600/20 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
             <Smartphone className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">PWA Installation</h3>
           <p className="text-sm text-slate-400 mb-8">Best for Netlify. No conversion needed. Just open Chrome on Android and tap "Install App".</p>
           <button onClick={() => setShowQR(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2">
             <QrIcon className="w-5 h-5" /> Show QR Code
           </button>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-700">
           <div className="bg-emerald-600/20 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
             <FileCode className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">APK Builder Mode</h3>
           <p className="text-sm text-slate-400 mb-8">Use these details in "Website 2 APK Builder" or "CloudAPK" tools.</p>
           <div className="space-y-3 bg-[#0f172a] p-4 rounded-xl border border-slate-800 font-mono text-[10px]">
             <div className="flex justify-between"><span className="text-slate-500">App Name:</span> <span className="text-white">ClassMate</span></div>
             <div className="flex justify-between"><span className="text-slate-500">Package:</span> <span className="text-white">com.chill.tracker</span></div>
             <div className="flex justify-between"><span className="text-slate-500">URL:</span> <span className="text-indigo-400 truncate ml-2">{currentUrl}</span></div>
           </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
        <div className="text-sm text-amber-200/80">
          <p className="font-bold mb-1">Netlify Tip:</p>
          Once you deploy to Netlify, the "Install" button will automatically appear in Android Chrome because this app includes a valid manifest.json and Service Worker.
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-xl p-4">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-[3rem] border border-slate-700 p-10 text-center animate-slideUp">
            <button onClick={() => setShowQR(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold text-white mb-8">Scan to Open</h2>
            <div className="bg-white p-4 rounded-3xl inline-block mb-8">
              <img src={qrCodeUrl} alt="QR" className="w-48 h-48" />
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Ensure your phone is on the same network or use your Netlify link.</p>
            <button onClick={copyLink} className="text-indigo-400 font-bold text-sm underline">
              {copied ? 'Copied!' : 'Copy Link Manually'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
