
import React from 'react';

interface NavbarProps {
  setView?: (view: 'landing' | 'auth' | 'about' | 'terms') => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView }) => {
  const scrollToSection = (id: string) => {
    if (setView) {
      setView('landing');
      // Small delay to allow landing page to render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = () => {
    if (setView) {
      setView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <button 
          className="focus:outline-none" 
          onClick={handleHomeClick}
        >
          <span className="text-2xl font-black tracking-tighter text-black uppercase">GENIFY</span>
        </button>
        
        <div className="hidden md:flex items-center gap-10 text-xs font-medium text-zinc-500 uppercase tracking-widest">
          <button onClick={() => scrollToSection('process')} className="hover:text-black transition-colors">Process</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-black transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('enterprise')} className="hover:text-black transition-colors">Enterprise</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
