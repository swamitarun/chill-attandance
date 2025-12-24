
import React, { useState, useRef } from 'react';
import { ApkFile } from '../types';
import { Package, Upload, Trash2, ExternalLink, Download, FileCode, Search, Info } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  apks: ApkFile[];
  setApks: React.Dispatch<React.SetStateAction<ApkFile[]>>;
}

const ApkView: React.FC<Props> = ({ apks, setApks }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedApk, setSelectedApk] = useState<ApkFile | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.apk')) {
        alert('Please select a valid .apk file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newApk: ApkFile = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          type: 'application/vnd.android.package-archive',
          content: event.target?.result as string
        };
        setApks(prev => [newApk, ...prev]);
        setSelectedApk(newApk);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Permanently remove this package from browser storage?')) {
      setApks(prev => prev.filter(a => a.id !== id));
      if (selectedApk?.id === id) setSelectedApk(null);
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-200 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">APK Manager</h1>
          <p className="text-slate-400 font-medium">Browser-based package vault</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-900/40 transition-all active:scale-[0.97]"
        >
          <Upload className="w-5 h-5" />
          Upload New Package
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".apk"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1e293b] rounded-3xl border border-slate-700 p-2 flex items-center px-4">
            <Search className="w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter packages..." 
              className="bg-transparent border-none outline-none w-full p-4 text-sm font-medium text-white placeholder:text-slate-600"
            />
          </div>

          {apks.length === 0 ? (
            <div className="bg-[#1e293b] border-2 border-dashed border-slate-700/50 rounded-[3rem] p-20 text-center shadow-xl">
              <div className="bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <Package className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-300">Vault Empty</h3>
              <p className="text-slate-500 mt-3 font-medium max-w-xs mx-auto">Upload an APK to store it locally in your browser's persistent memory.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apks.map(apk => (
                <div 
                  key={apk.id}
                  onClick={() => setSelectedApk(apk)}
                  className={`group bg-[#1e293b] p-5 rounded-[2rem] border flex items-center justify-between cursor-pointer transition-all shadow-lg ${selectedApk?.id === apk.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-[#1e293b]/50' : 'border-slate-700 hover:border-slate-600'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl transition-colors ${selectedApk?.id === apk.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                      <FileCode className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg truncate max-w-[200px] md:max-w-md">{apk.name}</h3>
                      <p className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-2 mt-1 uppercase">
                        {formatSize(apk.size)} <span className="text-slate-700">•</span> {format(new Date(apk.uploadDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleDelete(apk.id, e)}
                      className="p-3 text-slate-500 hover:text-rose-400 rounded-2xl hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className={`p-2 rounded-lg ${selectedApk?.id === apk.id ? 'text-indigo-400' : 'text-slate-700'}`}>
                       <ExternalLink className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Inspector */}
        <div className="lg:col-span-1">
          <div className="bg-[#1e293b] rounded-[3rem] border border-slate-700 shadow-2xl p-10 sticky top-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Package className="w-40 h-40" />
            </div>
            
            <h2 className="text-xs font-black text-indigo-400 mb-10 uppercase tracking-[0.2em] flex items-center gap-3">
              <Info className="w-4 h-4" />
              Inspector
            </h2>
            
            {selectedApk ? (
              <div className="space-y-10 animate-fadeIn">
                <div className="flex flex-col items-center text-center">
                   <div className="bg-indigo-600 w-24 h-24 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-2xl shadow-indigo-900/50">
                     <FileCode className="w-12 h-12" />
                   </div>
                   <h3 className="font-black text-white break-all text-xl mb-2 px-2 leading-tight">{selectedApk.name}</h3>
                   <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full font-black text-[10px] tracking-widest uppercase border border-indigo-500/20">
                      Verified Binary
                   </div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'File Size', val: formatSize(selectedApk.size) },
                    { label: 'Installed', val: format(new Date(selectedApk.uploadDate), 'MMM d, HH:mm') },
                    { label: 'Hash ID', val: selectedApk.id.slice(-8), mono: true }
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{row.label}</span>
                      <span className={`font-black text-slate-200 ${row.mono ? 'font-mono' : ''}`}>{row.val}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <a 
                    href={selectedApk.content} 
                    download={selectedApk.name}
                    className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-900/50 transition-all active:scale-[0.96]"
                  >
                    <Download className="w-6 h-6" />
                    Download APK
                  </a>
                </div>

                <p className="text-[10px] text-slate-500 text-center font-bold leading-relaxed px-4 opacity-50 uppercase tracking-tighter">
                  Secured via Browser Sandbox
                </p>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500 space-y-6">
                <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-bold text-slate-600 text-sm max-w-[140px] mx-auto leading-relaxed uppercase tracking-widest">Select a package to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApkView;
