
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
      <div className="bg-white">
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative bg-zinc-50 aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-all duration-500 border border-dashed border-zinc-200"
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
            />
            <div className="w-20 h-20 border border-black flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500">
              <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-black mb-2 tracking-tighter uppercase">Upload Asset</h3>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              High resolution forensic input
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <div className="relative bg-zinc-50 border border-zinc-100 overflow-hidden">
                  <img src={preview} alt="Input image" className={`w-full h-auto object-contain max-h-[600px] ${result?.isAI ? 'grayscale' : ''}`} />
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="h-1 bg-black absolute w-full top-0 animate-[scan_3s_infinite] shadow-[0_0_20px_rgba(0,0,0,0.5)]"></div>
                    </div>
                  )}

                  {result && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className={`font-black text-4xl md:text-6xl tracking-tighter px-10 py-5 transform -rotate-6 border-8 shadow-2xl animate-in zoom-in duration-500 uppercase ${result.isAI ? 'bg-red-600 text-white border-white' : 'bg-black text-white border-white'}`}>
                          {result.isAI ? 'COUNTERFEIT' : 'AUTHENTIC'}
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                {isAnalyzing ? (
                  <div className="bg-zinc-50 p-12 flex flex-col justify-center min-h-[400px]">
                    <div className="mb-12">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Forensic Scan</span>
                        <span className="text-4xl font-black text-black">{Math.floor(progress)}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-1 overflow-hidden">
                        <div className="bg-black h-1 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                      <p className={`transition-opacity duration-300 ${progress > 10 ? 'opacity-100' : 'opacity-20'}`}>[INIT] Loading Engine</p>
                      <p className={`transition-opacity duration-300 ${progress > 40 ? 'opacity-100' : 'opacity-20'}`}>[SCAN] Grain Analysis</p>
                      <p className={`transition-opacity duration-300 ${progress > 70 ? 'opacity-100' : 'opacity-20'}`}>[VERIFY] Logo Geometry</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className={`p-10 border transition-all duration-700 ${result.isAI ? 'bg-red-50 border-red-100' : 'bg-zinc-50 border-zinc-100'}`}>
                      <h4 className={`text-2xl font-black tracking-tighter uppercase mb-2 ${result.isAI ? 'text-red-600' : 'text-black'}`}>
                        {result.isAI ? 'Counterfeit Detected' : 'Authentic Verified'}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                    </div>

                    <div className="bg-zinc-50 p-10 space-y-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Expert Verdict</p>
                        <p className="text-black text-lg font-bold leading-tight uppercase">"{result.verdict}"</p>
                      </div>
                      
                      <div className="pt-8 border-t border-zinc-200">
                        <button 
                          onClick={() => { setPreview(null); setResult(null); }}
                          className="w-full py-6 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-zinc-900 transition-all"
                        >
                          New Analysis
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-50 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <h3 className="text-2xl font-black text-black mb-4 tracking-tighter uppercase">Ready</h3>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-12">
                      Microscopic verification pending
                    </p>
                    <button 
                      onClick={runAnalysis}
                      disabled={!preview}
                      className="w-full bg-black text-white py-6 font-black uppercase text-xs tracking-widest hover:bg-zinc-900 transition-all disabled:opacity-20"
                    >
                      Initialize Scan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisTool;
