
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface TermsPageProps {
  setView: (view: 'landing' | 'auth' | 'about' | 'terms') => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar setView={setView} />
      <main className="flex-grow pt-44 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-16 uppercase leading-none">
            Terms & Conditions
          </h1>
          
          <div className="space-y-16">
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">01. Acceptance of Terms</h2>
              <p className="text-xl font-bold leading-relaxed text-black">
                By accessing or using Genify, you agree to be bound by these Terms and Conditions. 
                Our services are provided "as is" and are intended for informational purposes only.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">02. AI Analysis & Accuracy</h2>
              <p className="text-xl font-bold leading-relaxed text-black">
                Genify uses advanced AI to detect counterfeits with 99.8% forensic accuracy. 
                However, results should be used as a technical audit and not as a legal guarantee of authenticity. 
                We are not liable for any financial losses incurred based on our analysis.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">03. User Responsibilities</h2>
              <p className="text-xl font-bold leading-relaxed text-black">
                Users must provide high-resolution, clear photos for accurate analysis. 
                Any attempt to manipulate the system or upload malicious content will result in immediate account termination.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">04. Payments & Refunds</h2>
              <p className="text-xl font-bold leading-relaxed text-black">
                All scans are final and non-refundable once the AI analysis has been initialized. 
                Payment processing is handled securely via Stripe.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">05. Intellectual Property</h2>
              <p className="text-xl font-bold leading-relaxed text-black">
                All forensic models, software, and branding are the exclusive property of Genify Technologies Inc. 
                Unauthorized reproduction or reverse engineering is strictly prohibited.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer setView={setView} />
    </div>
  );
};

export default TermsPage;
