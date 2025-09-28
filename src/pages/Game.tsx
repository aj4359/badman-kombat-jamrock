import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleGame } from '@/components/game/SimpleGame';
import { RastaChatbot } from '@/components/RastaChatbot';

const Game = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <SimpleGame />
      
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