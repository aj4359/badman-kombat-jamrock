import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ViralStreetFighterCanvas } from '@/components/game/ViralStreetFighterCanvas';
import { RastaChatbot } from '@/components/RastaChatbot';

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get fighter data from location state or URL params
  const fighterData = location.state?.fighterData || {
    player1: { id: 'leroy', name: 'LEROY' },
    player2: { id: 'jordan', name: 'JORDAN' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <ViralStreetFighterCanvas fighterData={fighterData} />
      
      {/* Rasta Chatbot for navigation */}
      <RastaChatbot 
        onNavigateToGame={() => navigate('/game')}
        onNavigateToCharacterSelect={() => navigate('/character-select')}
        onNavigateToHome={() => navigate('/')}
      />
    </div>
  );
};

export default Game;