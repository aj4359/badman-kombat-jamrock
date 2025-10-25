import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EpicIntroSequence } from '@/components/landing/EpicIntroSequence';
import Hero from '@/components/Hero';
import FighterShowcase from '@/components/FighterShowcase';
import GameplayTrailer from '@/components/GameplayTrailer';
import KombatArena from '@/components/KombatArena';
import Footer from '@/components/Footer';
import { RastaChatbot } from '@/components/RastaChatbot';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <EpicIntroSequence onComplete={() => setShowIntro(false)} skipOnRepeat={false} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Action Buttons */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <Button 
          onClick={() => navigate('/3d-ultimate')}
          className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 text-white font-bold text-lg px-6 py-6 animate-pulse hover:scale-110 transition-transform"
        >
          <Zap className="mr-2" /> PLAY 3D ULTIMATE
        </Button>
        <Button 
          onClick={() => navigate('/fighter-generator')}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-bold px-6 py-3 hover:scale-110 transition-transform"
        >
          🎨 AI Fighter Generator
        </Button>
      </div>

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
