
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // For simplicity, we analyze the first photo as the primary reference
      // In a more advanced version, we could send multiple parts to Gemini
      const analysisResult = await analyzeLuxuryProduct(photos[0], notes);
      setResult(analysisResult);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-8 mb-16">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Authentication</h1>
        </div>

        <div className="space-y-8">
          {/* Batch Code */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Batch Code</label>
            <input 
              type="text"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="w-full p-6 bg-zinc-50 border-none focus:ring-2 focus:ring-black outline-none transition-all text-lg font-medium"
              placeholder="Enter batch code if available"
            />
          </div>

          {/* Seller / Source */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Seller / Source</label>
            <input 
              type="text"
              value={sellerSource}
              onChange={(e) => setSellerSource(e.target.value)}
              className="w-full p-6 bg-zinc-50 border-none focus:ring-2 focus:ring-black outline-none transition-all text-lg font-medium"
              placeholder="Where did you purchase this item?"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full p-6 bg-zinc-50 border-none focus:ring-2 focus:ring-black outline-none transition-all text-lg font-medium resize-none"
              placeholder="Any additional details or concerns..."
            />
          </div>

          {/* Photos */}
          <div className="pt-8 border-t border-zinc-100">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-sm font-black uppercase tracking-widest">Photos ({photos.length}/12)</h2>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                <Info size={12} />
                First photo is used for primary analysis
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Add Photo Button */}
              {photos.length < 12 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-4 hover:bg-zinc-100 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                </button>
              )}
              
              {/* Photo Previews */}
              {photos.map((base64, index) => (
                <div key={index} className="relative aspect-[3/4] bg-zinc-100 group overflow-hidden">
                  <img src={base64} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-1 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: Math.max(0, 4 - (photos.length + (photos.length < 12 ? 1 : 0))) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-[3/4] bg-zinc-50/50" />
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
          <div className="pt-12 flex justify-end">
            <button 
              onClick={handleAnalyze}
              disabled={photos.length === 0 || isAnalyzing}
              className="px-12 py-6 bg-black text-white rounded-none font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Analyzing with Gemini AI...
                </>
              ) : (
                'Initialize AI Analysis'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
