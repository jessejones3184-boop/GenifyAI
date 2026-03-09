
import React, { useState } from 'react';

const faqs = [
  {
    question: "How accurate is Genify?",
    answer: "Genify uses state-of-the-art neural networks trained on millions of authentic and counterfeit luxury goods. Our forensic accuracy exceeds 99.8% for supported brands."
  },
  {
    question: "What luxury brands are supported?",
    answer: "We support over 500+ luxury brands including Hermes, Louis Vuitton, Chanel, Gucci, Rolex, and many more across categories like handbags, watches, and sneakers."
  },
  {
    question: "Can I use it for resale sites like Grailed or StockX?",
    answer: "Absolutely. Genify is designed specifically for collectors and resellers to verify items before purchase or listing on major secondary markets."
  },
  {
    question: "Does every authentication come with a digital certificate?",
    answer: "Yes, every Genify authentication (except for our free demo) generates a tamper-proof digital certificate that serves as a comprehensive technical audit of your asset."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(3); // Default open the last one as in image

  return (
    <section className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-black tracking-tighter mb-16 text-center text-black">Common Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-50 rounded-3xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-8 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="text-lg font-bold text-black">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 text-zinc-400 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
