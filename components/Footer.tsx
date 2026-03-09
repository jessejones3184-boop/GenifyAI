
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <span className="text-2xl font-black tracking-tighter uppercase mb-8 block">GENIFY</span>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Providing microscopic clarity for the world's most valuable assets. Founded in 2026.
            </p>
          </div>
          
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Product</h5>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <a href="#" className="hover:text-zinc-300 transition-colors">How It Works</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Pricing</a>
            </div>
          </div>

          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Company</h5>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <a href="#" className="hover:text-zinc-300 transition-colors">About Us</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
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
