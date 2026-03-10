
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface AboutPageProps {
  setView: (view: 'landing' | 'auth' | 'about' | 'terms') => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar setView={setView} />
      <main className="flex-grow pt-44 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-16 uppercase leading-none">
            About Us
          </h1>
          
          <div className="space-y-12">
            <div className="p-12 bg-zinc-50 border border-zinc-100">
              <p className="text-2xl md:text-3xl font-bold leading-tight text-black">
                Founded in 2026 in Melbourne, Australia, by young entrepreneur Jesse Jones.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                  Jesse came up with the idea after repeatedly getting scammed on Facebook for fakes. 
                  Frustrated by the lack of accessible, high-accuracy verification tools for everyday collectors, 
                  he envisioned a world where anyone could authenticate luxury assets with microscopic clarity.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-zinc-500 leading-relaxed font-medium">
                  Today, Genify stands as the industry leader in AI-driven forensic analysis, 
                  providing 99.8% accurate detections for the world's most valuable products. 
                  Our mission is to eliminate counterfeit fraud and restore trust in the secondary market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer setView={setView} />
    </div>
  );
};

export default AboutPage;
