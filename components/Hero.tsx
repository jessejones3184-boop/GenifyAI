
import React from 'react';

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-44 pb-32 flex flex-col items-center text-center px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-black">
          Luxury <br />
          Authentication <br />
          at Your Fingertips.
        </h1>
        
        <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Industry-leading forensic accuracy. Only $2.99 per scan. <br className="hidden md:block" />
          Trusted by the world's leading collectors.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => scrollToSection('demo-tool')}
            className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-800"
          >
            Try AI Demo
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="w-full sm:w-auto px-10 py-5 border border-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs text-black hover:bg-zinc-50 transition-all"
          >
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
