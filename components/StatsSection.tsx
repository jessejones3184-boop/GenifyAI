
import React from 'react';

interface StatsSectionProps {
  onSelectPlan: (priceId: string, planName: string) => void;
}

const StatsSection: React.FC<StatsSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-32 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black tracking-tighter mb-16 text-center text-black">Choose Your Access</h2>
        
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Demo */}
          <div className="bg-white p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-bold mb-2 text-black">One demo authentication</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-black">$0</span>
              <span className="text-zinc-400 text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="text-zinc-500 text-sm">1 Free Demo Scan</li>
              <li className="text-zinc-500 text-sm">Basic Report (No Certificate)</li>
            </ul>
            <button 
              onClick={() => onSelectPlan('demo', 'Demo Scan')}
              className="w-full py-4 border border-zinc-200 rounded-full font-black uppercase tracking-widest text-[10px] text-black hover:bg-zinc-50 transition-all"
            >
              Get Started
            </button>
          </div>
          
          {/* Single Scan - Most Popular */}
          <div className="bg-black p-12 rounded-[2.5rem] shadow-2xl flex flex-col h-full relative transform scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
              Most Popular
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Single Scan</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-white">$2.99</span>
              <span className="text-zinc-500 text-sm">/scan</span>
            </div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="text-zinc-400 text-sm">Forensic Heatmap</li>
              <li className="text-zinc-400 text-sm">24/7 Expert Review</li>
            </ul>
            <button 
              onClick={() => onSelectPlan('single', 'Single Scan')}
              className="w-full py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-zinc-100 transition-all"
            >
              Authenticate Now
            </button>
          </div>
          
          {/* Professional */}
          <div className="bg-white p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-bold mb-2 text-black">Professional</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-black">$7.99</span>
              <span className="text-zinc-400 text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="text-zinc-500 text-sm">Unlimited Scans</li>
              <li className="text-zinc-500 text-sm">White Label Reports</li>
            </ul>
            <button 
              onClick={() => onSelectPlan('professional', 'Professional Plan')}
              className="w-full py-4 border border-zinc-200 rounded-full font-black uppercase tracking-widest text-[10px] text-black hover:bg-zinc-50 transition-all"
            >
              Start Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
