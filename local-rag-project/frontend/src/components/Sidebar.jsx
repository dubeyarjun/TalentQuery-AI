import React from 'react';
import { Upload, Key, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Sidebar = ({ apiKey, setApiKey, onUpload, uploadStatus, isUploading }) => {
  return (
    <div className="w-80 bg-slate-900/40 border-r border-slate-800/50 backdrop-blur-3xl p-6 flex flex-col h-screen text-slate-200">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
           <h1 className="text-xl font-bold tracking-tight text-white leading-tight">TalentQuery</h1>
           <p className="text-[10px] text-primary-400 font-bold uppercase tracking-[0.2em]">Local Intelligence</p>
        </div>
      </div>

      <div className="space-y-8 flex-1">
        {/* API Key Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
            <Key className="w-3.5 h-3.5 mb-0.5" /> Authentication
          </label>
          <div className="relative group">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter secure key..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-mono placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
            <Upload className="w-3.5 h-3.5 mb-0.5" /> Document Base
          </label>
          
          <div className="relative group">
            <input
              type="file"
              accept=".pdf"
              onChange={onUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
              isUploading 
                ? 'border-primary-500/30 bg-primary-500/5' 
                : 'border-slate-800 group-hover:border-primary-500/50 group-hover:bg-primary-500/5'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 ${
                isUploading ? 'bg-primary-500/10' : 'bg-slate-800 group-hover:scale-110 group-hover:bg-primary-500/20'
              }`}>
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-primary-400" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-300">
                  {isUploading ? 'Analyzing...' : 'Click to Upload'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">PDF Files up to 50MB</p>
              </div>
            </div>
          </div>

          {uploadStatus && (
            <div className={`flex items-start gap-3 p-4 rounded-xl text-sm animate-slide-up ${
              uploadStatus.type === 'success' 
                ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10' 
                : 'bg-red-500/5 text-red-400 border border-red-500/10'
            }`}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold">{uploadStatus.type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-xs opacity-80 mt-1 leading-relaxed">{uploadStatus.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-slate-800/50">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             Active
           </div>
           <span className="text-[10px] text-slate-600 font-mono">v1.0.0-PRO</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
