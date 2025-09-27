import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioManager } from '@/hooks/useAudioManager';
import Hero from '@/components/Hero';
import FighterShowcase from '@/components/FighterShowcase';
import GameplayTrailer from '@/components/GameplayTrailer';
import KombatArena from '@/components/KombatArena';
import Footer from '@/components/Footer';
import { RastaChatbot } from '@/components/RastaChatbot';
import { AdvancedAudioMixer } from '@/components/audio/AdvancedAudioMixer';
import { EpicTrailerCreator } from '@/components/trailer/EpicTrailerCreator';

const Index = () => {
  const navigate = useNavigate();
  const { playLayer, isLoaded } = useAudioManager();

  // Initialize ambient audio on home page
  useEffect(() => {
    if (isLoaded) {
      playLayer('ambient');
    }
  }, [isLoaded, playLayer]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />
      
      {/* Fighter Selection */}
      <FighterShowcase />
      
      {/* Gameplay Trailer */}
      <GameplayTrailer />
      
      {/* Kombat Arenas */}
      <KombatArena />
      
      {/* Footer */}
      <Footer />

      {/* Advanced Audio Controls */}
      <AdvancedAudioMixer />

      {/* Epic Trailer Creator */}
      <EpicTrailerCreator />

      {/* Rasta Chatbot Navigator */}
      <RastaChatbot 
        onNavigateToGame={() => navigate('/game')}
        onNavigateToCharacterSelect={() => navigate('/character-select')}
        onNavigateToHome={() => navigate('/')}
      />
    </div>
  );
};

export default Index;
