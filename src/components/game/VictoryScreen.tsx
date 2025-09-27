import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFightAudio } from '@/hooks/useFightAudio';

interface VictoryScreenProps {
  winner: string | null;
  onRestart?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner, onRestart }) => {
  const navigate = useNavigate();
  const fightAudio = useFightAudio();

  useEffect(() => {
    if (winner && winner !== 'draw') {
      fightAudio.onRoundEnd(winner);
    }
  }, [winner, fightAudio]);

  if (!winner) return null;

  const getWinnerText = () => {
    switch (winner) {
      case 'player1':
        return 'PLAYER 1 WINS!';
      case 'player2':
        return 'PLAYER 2 WINS!';
      case 'draw':
        return 'DRAW!';
      default:
        return 'GAME OVER';
    }
  };

  const getWinnerColor = () => {
    switch (winner) {
      case 'player1':
        return 'text-neon-cyan';
      case 'player2':
        return 'text-neon-pink';
      default:
        return 'text-neon-green';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <div className={`font-retro text-6xl md:text-8xl font-black animate-neon-pulse ${getWinnerColor()}`}>
          {getWinnerText()}
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={onRestart}
            className="bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/40 font-retro text-lg px-8 py-4"
          >
            REMATCH
          </Button>
          
          <Button
            onClick={() => navigate('/character-select')}
            variant="outline"
            className="bg-neon-pink/20 border-neon-pink/50 text-neon-pink hover:bg-neon-pink/40 font-retro text-lg px-8 py-4"
          >
            SELECT FIGHTERS
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-neon-purple/20 border-neon-purple/50 text-neon-purple hover:bg-neon-purple/40 font-retro text-lg px-6 py-3"
          >
            MAIN MENU
          </Button>
        </div>
      </div>
    </div>
  );
};