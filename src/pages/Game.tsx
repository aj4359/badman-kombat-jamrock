import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhaserGameEngine } from '@/components/game/PhaserGameEngine';
import { RastaChatbot } from '@/components/RastaChatbot';
import { GameMenu } from '@/components/game/GameMenu';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaused, setIsPaused] = useState(false);
  
  // Get fighter data from location state or URL params
  const fighterData = location.state?.fighterData || {
    player1: { id: 'leroy', name: 'LEROY' },
    player2: { id: 'jordan', name: 'JORDAN' }
  };

  console.log('🎮 [GAME PAGE] Mounted');
  console.log('📦 [GAME PAGE] Fighter Data:', fighterData);
  console.log('📦 [GAME PAGE] Location State:', location.state);

  // ESC key handler for pause menu
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Exit Button */}
      <Button
        onClick={() => navigate('/character-select')}
        variant="outline"
        size="lg"
        className="fixed top-4 left-4 z-50 bg-black/80 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        EXIT
      </Button>
      
      <PhaserGameEngine fighterData={fighterData} />
      
      {/* Game Menu (Pause Menu) */}
      <GameMenu 
        onResume={() => setIsPaused(false)} 
        isPaused={isPaused} 
      />
      
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