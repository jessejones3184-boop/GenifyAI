
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

  const handleSelectPlan = React.useCallback((priceId: string, planName: string) => {
    if (priceId === 'demo') {
      setSelectedPlan({ id: priceId, name: planName });
      setView('auth');
      window.scrollTo(0, 0);
      return;
    }

    // Use static Stripe Payment Links provided by user
    // These open in the same tab (window.location.href)
    if (priceId === 'single') {
      window.location.href = "https://buy.stripe.com/28EfZiebd5JL8CR7cvd7q00";
    } else if (priceId === 'professional') {
      window.location.href = "https://buy.stripe.com/3cI8wQaZ17RT1apgN5d7q01";
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
    if (params.get('success') === 'true') {
      // In a real app, we'd verify the session here
      setView('auth');
      // Set a default plan name if we don't know which one was purchased
      setSelectedPlan({ id: 'paid', name: 'Paid Authentication' });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
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
