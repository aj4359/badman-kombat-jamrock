import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EpicIntroSequence } from '@/components/landing/EpicIntroSequence';
import Hero from '@/components/Hero';
import FighterShowcase from '@/components/FighterShowcase';
import GameplayTrailer from '@/components/GameplayTrailer';
import KombatArena from '@/components/KombatArena';
import Footer from '@/components/Footer';
import { RastaChatbot } from '@/components/RastaChatbot';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { SiteTourGuide } from '@/components/onboarding/SiteTourGuide';
import { useFirstTimeVisitor } from '@/hooks/useFirstTimeVisitor';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const { isFirstVisit, loading, markAsVisited, markSiteTourCompleted } = useFirstTimeVisitor();

  const handleIntroComplete = () => {
    setShowIntro(false);
    if (isFirstVisit && !loading) {
      setShowWelcome(true);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    markAsVisited();
  };

  const handleStartTutorial = () => {
    setShowWelcome(false);
    markAsVisited();
    navigate('/tutorial');
  };

  const handleStartQuickMatch = () => {
    setShowWelcome(false);
    markAsVisited();
    navigate('/3d-ultimate');
  };

  const handleStartTour = () => {
    setShowWelcome(false);
    markAsVisited();
    setShowTour(true);
  };

  const handleTourComplete = () => {
    setShowTour(false);
    markSiteTourCompleted();
  };

  if (showIntro) {
    return <EpicIntroSequence onComplete={handleIntroComplete} skipOnRepeat={false} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Action Buttons - Fixed positioning to avoid overlap */}
      <div className="fixed top-20 right-4 z-40 flex flex-col gap-3">
        <Button 
          onClick={() => navigate('/3d-ultimate')}
          className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 text-white font-bold text-lg px-6 py-4 animate-pulse hover:scale-110 transition-transform shadow-2xl"
        >
          <Zap className="mr-2 h-5 w-5" /> PLAY 3D ULTIMATE
        </Button>
        <Button 
          onClick={() => navigate('/fighter-generator')}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-bold px-6 py-3 hover:scale-110 transition-transform shadow-2xl"
        >
          🎨 AI Fighter Generator
        </Button>
        <Button 
          onClick={() => navigate('/tutorial')}
          className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold px-6 py-3 hover:scale-110 transition-transform shadow-2xl"
        >
          📖 Tutorial
        </Button>
      </div>

      {/* Hero Section */}
      <Hero isFirstVisit={isFirstVisit && !loading} />
      
      {/* Fighter Selection */}
      <FighterShowcase />
      
      {/* Gameplay Trailer */}
      <GameplayTrailer />
      
      {/* Kombat Arenas */}
      <KombatArena />
      
      {/* Footer */}
      <Footer />

      {/* Rasta Chatbot Navigator */}
      <RastaChatbot 
        onNavigateToGame={() => navigate('/game')}
        onNavigateToCharacterSelect={() => navigate('/character-select')}
        onNavigateToHome={() => navigate('/')}
        onNavigateToTutorial={() => navigate('/tutorial')}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        open={showWelcome}
        onClose={handleWelcomeClose}
        onStartTutorial={handleStartTutorial}
        onStartQuickMatch={handleStartQuickMatch}
        onStartTour={handleStartTour}
      />

      {/* Site Tour Guide */}
      <SiteTourGuide
        active={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourComplete}
      />
    </div>
  );
};

export default Index;
