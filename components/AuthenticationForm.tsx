
import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, X, Loader2, ShieldCheck, ShieldAlert, Info } from 'lucide-react';
import { analyzeLuxuryProduct } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface AuthenticationFormProps {
  onBack: () => void;
  onInitialize: (data: any) => void;
  planName: string;
}

const AuthenticationForm: React.FC<AuthenticationFormProps> = ({ onBack, onInitialize, planName }) => {
  const [batchCode, setBatchCode] = useState('');
  const [sellerSource, setSellerSource] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for API key and free scan limit on mount
  React.useEffect(() => {
    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setConfigError("GEMINI_API_KEY is not configured. Please add it to your Netlify environment variables and trigger a new deploy (Clear cache and deploy).");
    }

    if (planName === 'Interactive Demo') {
      const freeScansUsed = localStorage.getItem('genify_free_scans_used');
      if (freeScansUsed && parseInt(freeScansUsed) >= 1) {
        alert("You have already used your one free authentication. Please purchase a plan to continue.");
        onBack();
      }
    }
  }, [planName, onBack]);

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && photos.length < 12) {
      const newPhotos = [...photos];
      for (let i = 0; i < files.length && newPhotos.length < 12; i++) {
        const file = files[i];
        const base64 = await convertToBase64(file);
        newPhotos.push(base64);
      }
      setPhotos(newPhotos);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleAnalyze = async () => {
    if (photos.length === 0) return;

    // Check for free scan limit
    if (planName === 'Interactive Demo') {
      const freeScansUsed = localStorage.getItem('genify_free_scans_used');
      if (freeScansUsed && parseInt(freeScansUsed) >= 1) {
        alert("You have already used your one free authentication. Please purchase a plan to continue.");
        onBack();
        return;
      }
    }
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // For simplicity, we analyze the first photo as the primary reference
      // In a more advanced version, we could send multiple parts to Gemini
      const analysisResult = await analyzeLuxuryProduct(photos[0], `Batch Code: ${batchCode}\n${notes}`);
      setResult(analysisResult);

      // Increment free scan count if applicable
      if (planName === 'Interactive Demo') {
        const currentCount = parseInt(localStorage.getItem('genify_free_scans_used') || '0');
        localStorage.setItem('genify_free_scans_used', (currentCount + 1).toString());
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-white text-black p-6 md:p-12 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-8 mb-16">
            <button 
              onClick={() => setResult(null)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={14} />
              Back to Form
            </button>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Analysis Result</h1>
          </div>

          <div className={`p-8 mb-12 flex items-center gap-6 ${result.isAI ? 'bg-red-50 border-l-4 border-red-600' : 'bg-emerald-50 border-l-4 border-emerald-600'}`}>
            {result.isAI ? <ShieldAlert className="text-red-600" size={48} /> : <ShieldCheck className="text-emerald-600" size={48} />}
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Verdict: {result.isAI ? 'Counterfeit / Replica' : 'Authentic'}
              </h2>
              <p className="text-sm font-medium opacity-70">Confidence Score: {(result.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Forensic Detections</h3>
              <div className="space-y-4">
                {result.detections.map((det, i) => (
                  <div key={i} className="p-6 bg-zinc-50 border border-zinc-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm uppercase">{det.type}</h4>
                      <span className={`text-[8px] font-black uppercase px-2 py-1 rounded ${
                        det.severity === 'high' ? 'bg-red-100 text-red-700' : 
                        det.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 
                        'bg-zinc-200 text-zinc-700'
                      }`}>
                        {det.severity}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{det.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Technical Report</h3>
              <div className="p-8 bg-zinc-900 text-zinc-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {result.forensicReport}
              </div>
              <div className="pt-8 flex justify-end">
                <button 
                  onClick={() => onInitialize({ result, photos })}
                  className="px-12 py-6 bg-black text-white rounded-none font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all"
                >
                  Finalize & Save Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors text-[10px] font-black uppercase tracking-widest border border-zinc-200"
          >
            Back
          </button>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Authentication</h1>
        </div>

        {configError && (
          <div className="mb-12 p-8 bg-red-50 border-l-4 border-red-600 flex items-start gap-6">
            <ShieldAlert className="text-red-600 shrink-0" size={32} />
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-red-600 mb-2">Configuration Error</h3>
              <p className="text-sm font-medium text-red-700 leading-relaxed">
                {configError}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Batch Code */}
          <div className="relative group">
            <div className="absolute top-6 left-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 z-10">Batch Code</div>
            <input 
              type="text"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="w-full pt-14 pb-8 px-8 bg-zinc-50 border-none focus:ring-0 outline-none transition-all text-xl font-bold uppercase placeholder:text-zinc-200"
              placeholder="Enter code"
            />
          </div>

          {/* Seller / Source */}
          <div className="relative group">
            <div className="absolute top-6 left-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 z-10">Seller / Source</div>
            <input 
              type="text"
              value={sellerSource}
              onChange={(e) => setSellerSource(e.target.value)}
              className="w-full pt-14 pb-8 px-8 bg-zinc-50 border-none focus:ring-0 outline-none transition-all text-xl font-bold uppercase placeholder:text-zinc-200"
              placeholder="Enter source"
            />
          </div>

          {/* Notes */}
          <div className="relative group">
            <div className="absolute top-6 left-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 z-10">Notes</div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="w-full pt-14 pb-8 px-8 bg-zinc-50 border-none focus:ring-0 outline-none transition-all text-xl font-bold uppercase resize-none placeholder:text-zinc-200"
              placeholder="Additional details"
            />
          </div>

          {/* Photos */}
          <div className="pt-12">
            <div className="flex justify-between items-end mb-8 border-b border-zinc-100 pb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Photos ({photos.length}/12)</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Add Photo Button */}
              {photos.length < 12 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center gap-4 hover:bg-zinc-100 transition-all group"
                >
                  <Plus size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                </button>
              )}
              
              {/* Photo Previews */}
              {photos.map((base64, index) => (
                <div key={index} className="relative aspect-[3/4] bg-zinc-100 group overflow-hidden">
                  <img src={base64} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-2 bg-black text-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {/* Empty Slots to match the design grid */}
              {Array.from({ length: Math.max(0, 4 - (photos.length + (photos.length < 12 ? 1 : 0))) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-[3/4] bg-zinc-50/30 border border-dashed border-zinc-100" />
              ))}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAddPhoto} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Footer Action */}
          <div className="pt-20 flex justify-end">
            <button 
              onClick={handleAnalyze}
              disabled={photos.length === 0 || isAnalyzing}
              className="px-16 py-6 bg-black text-white rounded-none font-black uppercase tracking-widest text-xs hover:bg-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Analyzing...
                </>
              ) : (
                'Initialize Analysis'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
