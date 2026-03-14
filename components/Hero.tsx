
import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-44 pb-64 flex flex-col items-center justify-center text-center px-6 bg-white min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-black uppercase">
          What will you detect today?
        </h1>
        
        <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Industry Leading authentication powered by AI. <br className="hidden md:block" />
          Trusted by the world's leading collectors.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-800"
          >
            Get Started
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
