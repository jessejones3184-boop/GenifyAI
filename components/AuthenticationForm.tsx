
import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && photos.length < 12) {
      const newPhotos = [...photos];
      for (let i = 0; i < files.length && newPhotos.length < 12; i++) {
        const url = URL.createObjectURL(files[i]);
        newPhotos.push(url);
      }
      setPhotos(newPhotos);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

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
              {photos.map((url, index) => (
                <div key={index} className="relative aspect-[3/4] bg-zinc-100 group overflow-hidden">
                  <img src={url} alt={`Upload ${index}`} className="w-full h-full object-cover" />
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
              onClick={() => onInitialize({ batchCode, sellerSource, notes, photos })}
              disabled={photos.length === 0}
              className="px-12 py-6 bg-black text-white rounded-none font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Initialize Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
