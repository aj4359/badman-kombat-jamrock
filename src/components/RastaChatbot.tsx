// Enhanced Rasta Chatbot with Voice Integration and Extended Navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedRastaChatbot } from '@/components/ui/EnhancedRastaChatbot';

interface RastaChatbotProps {
  onNavigateToGame?: () => void;
  onNavigateToCharacterSelect?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToTutorial?: () => void;
}

export const RastaChatbot: React.FC<RastaChatbotProps> = (props) => {
  const navigate = useNavigate();

  return (
    <EnhancedRastaChatbot
      {...props}
      onNavigateToTutorial={() => navigate('/tutorial')}
      onNavigateToDroneTrailer={() => navigate('/drone-trailer')}
      onNavigateToFighterGenerator={() => navigate('/fighter-generator')}
      onNavigateToArcade={() => navigate('/arcade')}
      onNavigateToRankings={() => navigate('/rankings')}
    />
  );
};