
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntelligenceSection from './components/IntelligenceSection';
import StatsSection from './components/StatsSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthenticationForm from './components/AuthenticationForm';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string } | null>(null);

  const handleSelectPlan = async (priceId: string, planName: string) => {
    if (priceId === 'demo') {
      setSelectedPlan({ id: priceId, name: planName });
      setView('auth');
      window.scrollTo(0, 0);
      return;
    }

    // For paid plans, trigger Stripe Checkout immediately
    try {
      console.log('Initiating checkout for:', planName);
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
        let errorMessage = 'Failed to create checkout session';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const textError = await response.text();
            errorMessage = `Server error (${response.status}): ${textError.slice(0, 100)}`;
          }
        } catch (e) {
          errorMessage = `Network error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', text.slice(0, 100));
        throw new Error(`Server returned unexpected content type: ${contentType || 'unknown'}. This usually means the API route was missed.`);
      }

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleInitializeAnalysis = (formData: any) => {
    console.log('Analysis initialized with data:', formData);
    alert('Analysis initialized! Our experts will review your submission and provide a report within 24 hours.');
    setView('landing');
    setSelectedPlan(null);
  };

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

  if (view === 'auth' && selectedPlan) {
    return (
      <AuthenticationForm 
        planName={selectedPlan.name}
        onBack={() => setView('landing')}
        onInitialize={handleInitializeAnalysis}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <IntelligenceSection />
        <StatsSection onSelectPlan={handleSelectPlan} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;
