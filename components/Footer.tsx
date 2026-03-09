
import React from 'react';

interface FooterProps {
  setView?: (view: 'landing' | 'auth' | 'about' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  const handleNav = (v: 'landing' | 'auth' | 'about' | 'terms') => {
    if (setView) {
      setView(v);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <span className="text-2xl font-black tracking-tighter uppercase mb-8 block">GENIFY</span>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Providing fast AI authentication for products using AI. Founded in 2026.
            </p>
          </div>
          
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Product</h5>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <button onClick={() => handleNav('landing')} className="text-left hover:text-zinc-300 transition-colors">How It Works</button>
              <button onClick={() => handleNav('landing')} className="text-left hover:text-zinc-300 transition-colors">Pricing</button>
            </div>
          </div>

          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Company</h5>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <button onClick={() => handleNav('about')} className="text-left hover:text-zinc-300 transition-colors">About Us</button>
              <button onClick={() => handleNav('terms')} className="text-left hover:text-zinc-300 transition-colors">Terms</button>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-600">
          © 2026 GENIFY TECHNOLOGIES INC. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
