
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntelligenceSection from './components/IntelligenceSection';
import StatsSection from './components/StatsSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthenticationForm from './components/AuthenticationForm';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'about' | 'terms'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string } | null>(null);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleSelectPlan = React.useCallback(async (priceId: string, planName: string) => {
    if (priceId === 'demo') {
      setSelectedPlan({ id: priceId, name: planName });
      setView('auth');
      window.scrollTo(0, 0);
      return;
    }

    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          origin: window.location.origin
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      console.error('Payment Error:', error);
      alert(`Payment Error: ${error.message}. Please ensure STRIPE_SECRET_KEY is configured in Settings.`);
      setIsProcessingPayment(false);
    }
  }, []);

  const handleInitializeAnalysis = React.useCallback((data: any) => {
    console.log('Analysis finalized with data:', data);
    alert(`Analysis Complete! The forensic report has been saved to your account. Verdict: ${data.result.isAI ? 'Counterfeit' : 'Authentic'}`);
    setView('landing');
    setSelectedPlan(null);
  }, []);

  const handleBack = React.useCallback(() => {
    setView('landing');
    setSelectedPlan(null);
  }, []);

  // Check for success URL parameter to show auth form after payment
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true';
    
    if (isSuccess) {
      console.log('Payment success detected, switching to auth view');
      setView('auth');
      setSelectedPlan({ id: 'paid', name: 'Paid Authentication' });
      
      // Clean up URL without refreshing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  if (view === 'about') {
    return <AboutPage setView={setView} />;
  }

  if (view === 'terms') {
    return <TermsPage setView={setView} />;
  }

  if (view === 'auth' && selectedPlan) {
    return (
      <AuthenticationForm 
        planName={selectedPlan.name}
        onBack={handleBack}
        onInitialize={handleInitializeAnalysis}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <Navbar setView={setView} />
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-black uppercase tracking-widest">Securing Connection...</h2>
          <p className="text-xs opacity-50 mt-2 uppercase tracking-widest">Redirecting to Stripe</p>
        </div>
      )}
      <main className="flex-grow">
        <Hero onGetStarted={() => handleSelectPlan('demo', 'Interactive Demo')} />
        <IntelligenceSection />
        <StatsSection onSelectPlan={handleSelectPlan} />
        <FAQ />
      </main>
      <Footer setView={setView} />
    </div>
  );
};

export default App;
