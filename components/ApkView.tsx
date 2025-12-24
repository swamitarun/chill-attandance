
import React, { useState, useRef } from 'react';
import { ApkFile } from '../types';
import { Package, Upload, Trash2, ExternalLink, Download, FileCode } from 'lucide-react';
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
          type: file.type,
          content: event.target?.result as string
        };
        setApks(prev => [newApk, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApks(prev => prev.filter(a => a.id !== id));
    if (selectedApk?.id === id) setSelectedApk(null);
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleOpen = (apk: ApkFile) => {
    setSelectedApk(apk);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">APK Manager</h1>
          <p className="text-slate-400">Store and manage your Android application packages</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-900/40 transition-all"
        >
          <Upload className="w-5 h-5" />
          Upload APK
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
        <div className="lg:col-span-2 space-y-4">
          {apks.length === 0 ? (
            <div className="bg-[#1e293b] border-2 border-dashed border-slate-700 rounded-3xl p-16 text-center shadow-xl">
              <Package className="w-20 h-20 text-slate-700 mx-auto mb-6 opacity-30" />
              <h3 className="text-xl font-bold text-slate-300">No Packages Found</h3>
              <p className="text-slate-500 mt-2 font-medium">Drag or upload an APK file to simulate browser storage.</p>
            </div>
          ) : (
            apks.map(apk => (
              <div 
                key={apk.id}
                onClick={() => handleOpen(apk)}
                className={`bg-[#1e293b] p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-lg ${selectedApk?.id === apk.id ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-[#1e293b]/50' : 'border-slate-700 hover:border-slate-500'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400 border border-indigo-500/10">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white truncate max-w-[180px] md:max-w-md">{apk.name}</h3>
                    <p className="text-xs font-bold text-slate-500 tracking-wide">
                      {formatSize(apk.size)} • {format(new Date(apk.uploadDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDelete(apk.id, e)}
                    className="p-2.5 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <ExternalLink className="w-5 h-5 text-slate-700" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#1e293b] rounded-3xl border border-slate-700 shadow-2xl p-8 sticky top-8">
            <h2 className="text-lg font-black text-white mb-8 flex items-center gap-2 uppercase tracking-widest">
              <Package className="w-5 h-5 text-indigo-400" />
              Package Inspector
            </h2>
            
            {selectedApk ? (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-[#0f172a] rounded-2xl p-6 flex flex-col items-center text-center border border-slate-700 shadow-inner">
                   <div className="bg-indigo-600 p-5 rounded-2xl text-white mb-5 shadow-2xl shadow-indigo-900/50">
                     <FileCode className="w-12 h-12" />
                   </div>
                   <h3 className="font-bold text-white break-all text-lg mb-2">{selectedApk.name}</h3>
                   <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-black tracking-widest uppercase border border-indigo-500/20">
                      Standard APK
                   </span>
                </div>

                <div className="space-y-5">
                  {[
                    { label: 'File Size', val: formatSize(selectedApk.size) },
                    { label: 'Date Added', val: format(new Date(selectedApk.uploadDate), 'PPp') },
                    { label: 'Manifest ID', val: selectedApk.id, mono: true }
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-800 pb-4">
                      <span className="text-slate-500 font-semibold">{row.label}</span>
                      <span className={`font-bold text-slate-200 ${row.mono ? 'font-mono text-[10px] opacity-40' : ''}`}>{row.val}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href={selectedApk.content} 
                  download={selectedApk.name}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-900/50 transition-all active:scale-95 mt-6"
                >
                  <Download className="w-6 h-6" />
                  Download Package
                </a>

                <p className="text-[10px] text-slate-500 text-center italic leading-relaxed px-4">
                  Files are stored locally in browser indexedDB. No server upload occurs.
                </p>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 space-y-4">
                <Package className="w-16 h-16 mx-auto opacity-5" />
                <p className="font-medium text-slate-600">Select a file to inspect metadata and extract binary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApkView;
