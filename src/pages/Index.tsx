import React from 'react';
import Hero from '@/components/Hero';
import FighterShowcase from '@/components/FighterShowcase';
import GameplayTrailer from '@/components/GameplayTrailer';
import KombatArena from '@/components/KombatArena';
import Footer from '@/components/Footer';

const Index = () => {
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
    </div>
  );
};

export default Index;
