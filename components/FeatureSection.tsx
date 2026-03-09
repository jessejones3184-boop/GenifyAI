
import React from 'react';

const features = [
  {
    title: "Spot Fake Damage",
    tag: "Profit",
    description: "Buyers use AI to generate photos of broken screens or damaged goods to trigger automatic refunds on items that are perfectly fine. Our engine identifies these synthetic 'faults' by analyzing pixel inconsistency and lighting errors that the human eye misses.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  },
  {
    title: "Verify Every Listing",
    tag: "Reputation",
    description: "Don't let fake inventory ruin your marketplace's trust. Scammers generate professional-grade photos of items they don't even own. Our engine confirms if a photo was actually taken by a real camera, ensuring your buyers only see legitimate products.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "End Return Fraud",
    tag: "Profit",
    description: "The \"Item Not Received\" scam has gone high-tech. Buyers now edit delivery photos to claim a package was never dropped off. We verify the digital integrity of delivery proof in real-time, giving you the hard evidence you need to resolve disputes fairly.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
];

const FeatureSection: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-full mx-auto px-6 md:px-16 xl:px-24">
        <div className="mb-20 text-center">
          <p className="text-[#ff5c35] font-mono text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Your Defense Layer</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter max-w-4xl mx-auto leading-[1.1] text-black">
            WE HANDLE THE SCAMS <br />
            <span className="text-zinc-300">SO YOU CAN GROW YOUR BUSINESS.</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group glass p-10 rounded-[2rem] border-black/5 hover:border-[#ff5c35]/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-sm hover:shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-[2] pointer-events-none text-black">
                {f.icon}
              </div>
              
              <div className="inline-block px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-8">
                {f.tag}
              </div>
              
              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mb-8 border border-black/5 group-hover:border-[#ff5c35]/30 group-hover:bg-[#ff5c35]/10 group-hover:text-[#ff5c35] transition-all duration-500 text-zinc-400">
                {f.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-black transition-colors">{f.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm group-hover:text-zinc-600 transition-colors">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
