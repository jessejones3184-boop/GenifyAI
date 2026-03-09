
import React, { useState, useRef } from 'react';
import { analyzeLuxuryProduct } from '../services/geminiService';
import { AnalysisResult } from '../types';

const AnalysisTool: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const runAnalysis = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    
    try {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 95) return p;
          return p + (95 - p) * 0.1;
        });
      }, 300);

      const analysis = await analyzeLuxuryProduct(preview);
      
      clearInterval(timer);
      setProgress(100);
      setResult(analysis);
    } catch (err) {
      setError("Analysis interrupted. Please ensure you are uploading a standard image file.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceLevel = (score: number) => {
    if (score > 0.85) return 'High';
    if (score > 0.60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className={`bg-white rounded-[2.5rem] p-1 border transition-all duration-700 ${result?.isAI ? 'border-red-500/20' : 'border-zinc-100'}`}>
        <div className="bg-white rounded-[2.2rem] p-8 md:p-12">
          {!preview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative bg-zinc-50 rounded-[2rem] p-20 text-center cursor-pointer hover:bg-zinc-100 transition-all duration-500 border-2 border-dashed border-zinc-200"
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
              />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-black mb-4 tracking-tighter uppercase">Upload Asset</h3>
                <p className="text-zinc-400 max-w-xs mx-auto text-sm font-medium">
                  Drop high-resolution images of logos, stitching, or hardware for microscopic analysis.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7">
                <div className={`relative rounded-3xl overflow-hidden border bg-zinc-50 group transition-all duration-700 ${result?.isAI ? 'border-red-500/20' : 'border-zinc-100'}`}>
                  <img src={preview} alt="Input image" className={`w-full h-auto object-contain max-h-[500px] transition-all duration-700 ${result?.isAI ? 'grayscale' : ''}`} />
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="h-0.5 bg-black absolute w-full top-0 animate-[scan_3s_infinite]"></div>
                      <div className="absolute inset-0 bg-black/5 opacity-50"></div>
                    </div>
                  )}

                  {result && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className={`font-black text-4xl md:text-6xl tracking-tighter px-8 py-4 transform -rotate-6 border-4 shadow-2xl animate-in zoom-in duration-500 uppercase ${result.isAI ? 'bg-red-600 text-white border-white' : 'bg-black text-white border-white'}`}>
                          {result.isAI ? 'COUNTERFEIT' : 'AUTHENTIC'}
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col min-h-[400px]">
                {isAnalyzing ? (
                  <div className="flex flex-col justify-center h-full py-12">
                    <div className="mb-12">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Analyzing Texture</span>
                        <span className="text-2xl font-black text-black">{Math.floor(progress)}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
                        <div className="bg-black h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
                      <p className={`transition-opacity duration-300 ${progress > 10 ? 'opacity-100' : 'opacity-20'}`}>[INIT] Loading Forensic Engine</p>
                      <p className={`transition-opacity duration-300 ${progress > 40 ? 'opacity-100' : 'opacity-20'}`}>[SCAN] Mapping Grain Structure</p>
                      <p className={`transition-opacity duration-300 ${progress > 70 ? 'opacity-100' : 'opacity-20'}`}>[VERIFY] Checking Logo Geometry</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                    <div className={`mb-8 p-8 rounded-3xl flex justify-between items-center border transition-all duration-700 ${result.isAI ? 'bg-red-50 border-red-100' : 'bg-zinc-50 border-zinc-100'}`}>
                      <h4 className={`text-xl font-black tracking-tight leading-tight ${result.isAI ? 'text-red-600' : 'text-black'}`}>
                        {result.isAI ? 'Counterfeit Detected' : 'Authentic Asset Verified'}
                      </h4>
                      <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${result.isAI ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>
                        {result.confidence > 0.9 ? 'High Confidence' : 'Verified'}
                      </div>
                    </div>

                    <div className="space-y-6 mb-10">
                      <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                        <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Authenticity Score</span>
                        <span className={`text-lg font-black ${result.isAI ? 'text-red-600' : 'text-black'}`}>
                          {result.isAI ? (100 - result.confidence * 100).toFixed(1) : (result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                        <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Forensic Heatmap</span>
                        <span className="text-xs font-black text-black uppercase tracking-widest">Generated</span>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Expert Verdict</p>
                      <p className="text-zinc-500 text-sm leading-relaxed italic border-l-2 border-black/10 pl-5">"{result.verdict}"</p>
                    </div>

                    <div className="mt-auto flex gap-4">
                      <button 
                        onClick={() => { setPreview(null); setResult(null); }}
                        className="flex-1 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all"
                      >
                        New Scan
                      </button>
                      <button className="flex-1 border border-zinc-200 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-black hover:bg-zinc-50 transition-all">
                        Certificate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-zinc-100 bg-zinc-50 rounded-[2rem]">
                    <div className="mb-8 w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-zinc-100 shadow-sm">
                      <svg className="w-8 h-8 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-black text-black mb-4 tracking-tighter uppercase">Ready for Analysis</h3>
                    <p className="text-zinc-400 text-sm font-medium mb-10 max-w-xs">
                      Upload an image to begin the microscopic verification process.
                    </p>
                    <button 
                      onClick={runAnalysis}
                      disabled={!preview}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-20"
                    >
                      Authenticate Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTool;
