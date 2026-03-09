
import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { year: '2022', loss: 9.32 },
  { year: '2023', loss: 12.30 },
  { year: '2024', loss: 16.24 },
  { year: '2025', loss: 21.43 },
  { year: '2026', loss: 28.29 },
  { year: '2027', loss: 37.34 },
  { year: '2028', loss: 49.29 },
  { year: '2029', loss: 65.07 },
  { year: '2030', loss: 85.89 },
];

const IntelligenceSection: React.FC = () => {
  return (
    <section id="process" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black tracking-tighter mb-16 text-black">How the AI detects</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-black mb-4 text-black">Fabric & Grain Analysis</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Microscopic texture mapping to identify synthetic polymer structures vs authentic animal grains.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-black mb-4 text-black">Hardware & Logo Forensics</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Engraving depth, font weight consistency, and metallic alloy composition verification.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-black mb-4 text-black">Fragrance & Batch Validation</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Chemical signature matching for leather treatments and fragrance longevity patterns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceSection;
