import { useState, useCallback, useRef, useEffect } from 'react';
import { useEnhancedGameEngine } from './useEnhancedGameEngine';
import { useEnhancedAudioSystem } from './useEnhancedAudioSystem';
import { useEnhancedCombatSystem } from './useEnhancedCombatSystem';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';
import { Fighter as FighterType } from '@/types/gameTypes';

export interface IntegratedFighter extends FighterType {
  selectedFromCharacterSelect?: boolean;
  characterSelectData?: any;
  aiPersonality?: {
    voiceLines: Array<{ trigger: string; text: string }>;
    combatStyle: 'aggressive' | 'defensive' | 'balanced';
  };
}

export interface GameIntegrationState {
  isInitialized: boolean;
  selectedFighters: {
    player1: string | null;
    player2: string | null;
  };
  gameMode: 'arcade' | 'versus' | 'training';
  difficulty: 'easy' | 'medium' | 'hard';
  matchStats: {
    combosLanded: number;
    specialMovesUsed: number;
    perfectRounds: number;
  };
}

export const useIntegratedGameSystem = () => {
  const gameEngine = useEnhancedGameEngine();
  const audioSystem = useEnhancedAudioSystem();
  const combatSystem = useEnhancedCombatSystem();
  
  const [integrationState, setIntegrationState] = useState<GameIntegrationState>({
    isInitialized: false,
    selectedFighters: { player1: null, player2: null },
    gameMode: 'versus',
    difficulty: 'medium',
    matchStats: { combosLanded: 0, specialMovesUsed: 0, perfectRounds: 0 }
  });

  // Integrated fighter initialization with character select data
  const initializeWithCharacterData = useCallback((
    player1Id: string, 
    player2Id: string,
    characterSelectData?: any
  ) => {
    console.log('Initializing integrated game system with:', { player1Id, player2Id });
    
    // Get enhanced fighter data
    const player1Data = ENHANCED_FIGHTER_DATA[player1Id] || ENHANCED_FIGHTER_DATA.leroy;
    const player2Data = ENHANCED_FIGHTER_DATA[player2Id] || ENHANCED_FIGHTER_DATA.jordan;
    
    // Initialize game engine with character data
    gameEngine.initializeFighters();
    
    // REMOVED: audioSystem.playRoundTransition(); - This was causing premature bell sounds
    
    // Update integration state
    setIntegrationState(prev => ({
      ...prev,
      isInitialized: true,
      selectedFighters: { player1: player1Id, player2: player2Id }
    }));
    
    console.log('Game system integrated successfully');
  }, [gameEngine, audioSystem]);

  // Enhanced hit processing with full integration
  const processIntegratedHit = useCallback((
    attacker: IntegratedFighter,
    defender: IntegratedFighter,
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super' = 'medium'
  ) => {
    // Process combat hit
    const { attacker: newAttacker, defender: newDefender } = combatSystem.processFighterHit(
      attacker, defender, attackType
    );
    
    // BELL ELIMINATION: All audio processing completely disabled
    console.log('🔇 PHASE 1: Integrated audio completely disabled to prevent bell sounds');
    
    // Update match statistics
    if (attackType === 'special' || attackType === 'super') {
      setIntegrationState(prev => ({
        ...prev,
        matchStats: {
          ...prev.matchStats,
          specialMovesUsed: prev.matchStats.specialMovesUsed + 1
        }
      }));
    }
    
    return { attacker: newAttacker, defender: newDefender };
  }, [combatSystem, audioSystem]);

  // Enhanced combo system with audio and visual feedback
  const processIntegratedCombo = useCallback((
    fighter: IntegratedFighter,
    comboCount: number
  ) => {
    // BELL ELIMINATION: All combo audio completely disabled  
    console.log('🔇 PHASE 1: Combo audio completely disabled to prevent bell sounds');
    
    // Update match stats
    setIntegrationState(prev => ({
      ...prev,
      matchStats: {
        ...prev.matchStats,
        combosLanded: prev.matchStats.combosLanded + 1
      }
    }));
    
    return fighter;
  }, [audioSystem]);

  // Victory processing with full integration
  const processVictory = useCallback((winner: string) => {
    // Check for perfect round
    const loser = winner === integrationState.selectedFighters.player1 
      ? gameEngine.gameState.fighters.player2 
      : gameEngine.gameState.fighters.player1;
    
    const isPerfect = loser?.health === 100;
    
    if (isPerfect) {
      setIntegrationState(prev => ({
        ...prev,
        matchStats: {
          ...prev.matchStats,
          perfectRounds: prev.matchStats.perfectRounds + 1
        }
      }));
    }
    
    // BELL ELIMINATION: All victory audio completely disabled
    console.log('🔇 PHASE 1: Victory audio completely disabled to prevent bell sounds');
    
    console.log('Victory processed:', { winner, isPerfect, stats: integrationState.matchStats });
  }, [audioSystem, integrationState, gameEngine.gameState]);

  // Reset system for new match
  const resetIntegratedSystem = useCallback(() => {
    setIntegrationState(prev => ({
      ...prev,
      matchStats: { combosLanded: 0, specialMovesUsed: 0, perfectRounds: 0 }
    }));
    
    console.log('Integrated system reset');
  }, []);

  return {
    // Game Engine
    gameState: gameEngine.gameState,
    canvasRef: gameEngine.canvasRef,
    handleMobileInput: gameEngine.handleMobileInput,
    
    // Audio System
    audioSystem,
    
    // Combat System
    combatSystem,
    
    // Integration State
    integrationState,
    
    // Integrated Methods
    initializeWithCharacterData,
    processIntegratedHit,
    processIntegratedCombo,
    processVictory,
    resetIntegratedSystem,
    
    // System Status
    isFullyLoaded: gameEngine.gameState.fighters.player1 && 
                   gameEngine.gameState.fighters.player2 && 
                   audioSystem.isLoaded &&
                   integrationState.isInitialized
  };
};