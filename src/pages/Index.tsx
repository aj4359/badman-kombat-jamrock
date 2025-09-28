import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/Hero';
import FighterShowcase from '@/components/FighterShowcase';
import GameplayTrailer from '@/components/GameplayTrailer';
import KombatArena from '@/components/KombatArena';
import Footer from '@/components/Footer';
import { RastaChatbot } from '@/components/RastaChatbot';

const Index = () => {
  const navigate = useNavigate();

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
