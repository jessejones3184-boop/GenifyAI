
import React from 'react';

const ThreatVisual: React.FC = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Cinematic Glow Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#ff5c35]/5 blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="max-w-full mx-auto px-6 md:px-16 xl:px-24">
        <div className="grid lg:grid-cols-12 items-center gap-12 lg:gap-24">
          
          <div className="lg:col-span-5 py-12">
            <div className="inline-block px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-8">
              Visual Forensics v4.0
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-[0.9] mb-10 uppercase">
              DETECTING THE <br />
              <span className="text-zinc-300 italic">UNDETECTABLE.</span>
            </h2>
            
            <p className="text-zinc-500 text-xl leading-relaxed mb-12 font-light">
              The moment an image is uploaded, Verto AI triggers a global check. We visualize the digital traces that deepfakes try to hide, giving you clarity instantly.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5 p-6 bg-zinc-50 rounded-3xl border border-black/[0.03] transition-all hover:bg-zinc-100 hover:border-[#ff5c35]/20 group">
                 <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-2xl flex items-center justify-center text-[#ff5c35] border border-[#ff5c35]/20 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-lg font-bold text-black uppercase tracking-tight">Instant Threat Mitigation</span>
                    <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Response Time: {"<"} 120ms</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-5 p-6 bg-zinc-50 rounded-3xl border border-black/[0.03] transition-all hover:bg-zinc-100 hover:border-black/10 group">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-400 border border-black/5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-lg font-bold text-black uppercase tracking-tight">Sub 100ms Latency</span>
                    <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Throughput: 4.2k req/sec</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative group">
            <div className="absolute inset-0 bg-[#ff5c35]/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 aspect-video lg:aspect-square xl:aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
                alt="Cybersecurity Interface Visualization" 
                className="w-full h-full object-cover grayscale brightness-110 hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Overlay HUD elements */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="font-mono text-[10px] text-white/80 space-y-1">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5c35] animate-ping"></span>
                    CORE_NODE_ACTIVE
                  </p>
                  <p>SCAN_RECURSION: 1.2M PIXELS</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                  <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#ff5c35]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ThreatVisual;
