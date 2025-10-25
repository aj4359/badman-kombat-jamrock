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
import { TutorialPromptBanner } from '@/components/onboarding/TutorialPromptBanner';
import { useFirstTimeVisitor } from '@/hooks/useFirstTimeVisitor';

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
      {/* Hero Section */}
      <Hero isFirstVisit={isFirstVisit && !loading} tutorialCompleted={!isFirstVisit} />
      
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

      {/* Tutorial Prompt Banner - Only show for users who haven't completed tutorial */}
      {!loading && isFirstVisit && !showWelcome && (
        <TutorialPromptBanner onStartTutorial={() => navigate('/tutorial')} />
      )}
    </div>
  );
};

export default Index;
