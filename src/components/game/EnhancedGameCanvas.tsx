import React from 'react';
import { ViralStreetFighterCanvas } from './ViralStreetFighterCanvas';

interface EnhancedGameCanvasProps {
  fighterData?: {
    player1: any;
    player2: any;
  };
}

const EnhancedGameCanvas: React.FC<EnhancedGameCanvasProps> = ({ fighterData }) => {
  return <ViralStreetFighterCanvas fighterData={fighterData} />;
};

export default EnhancedGameCanvas;