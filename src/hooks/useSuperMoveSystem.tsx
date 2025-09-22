import { useCallback } from 'react';
import { SuperMove } from '@/types/gameTypes';
import { Fighter } from '@/hooks/useEnhancedGameEngine';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';

export const useSuperMoveSystem = () => {
  
  const checkSuperMoves = useCallback((fighter: Fighter): { move: SuperMove | null; newFighter: Fighter } => {
    const fighterData = ENHANCED_FIGHTER_DATA[fighter.id];
    if (!fighterData) return { move: null, newFighter: fighter };
    
    const inputString = fighter.inputBuffer.join(',');
    
    // Only allow super moves if super meter is full
    if (fighter.superMeter < fighter.maxSuperMeter) {
      return { move: null, newFighter: fighter };
    }
    
    for (const superMove of fighterData.superMoves) {
      if (inputString.includes(superMove.input)) {
        return {
          move: superMove,
          newFighter: {
            ...fighter,
            superMeter: 0, // Consume full super meter
            inputBuffer: [], // Clear buffer
            state: 'special',
            frameData: {
              ...fighter.frameData,
              invulnerable: superMove.invulnerable ? superMove.frames.startup : 0
            },
            animation: { 
              ...fighter.animation, 
              currentMove: superMove.name,
              timer: 0,
              duration: superMove.frames.startup + superMove.frames.active + superMove.frames.recovery
            }
          }
        };
      }
    }
    
    return { move: null, newFighter: fighter };
  }, []);

  const createSuperProjectile = useCallback((
    x: number,
    y: number,
    direction: 'left' | 'right',
    superMove: SuperMove,
    owner: string
  ) => {
    // Super projectiles are larger and more powerful
    return {
      id: `super-projectile-${Date.now()}-${Math.random()}`,
      x,
      y,
      width: 80, // Larger than normal projectiles
      height: 40,
      velocityX: direction === 'right' ? 12 : -12, // Faster than normal
      velocityY: 0,
      damage: superMove.damage,
      owner,
      color: owner === 'player1' ? 'hsl(180, 100%, 50%)' : 'hsl(270, 100%, 60%)',
      type: 'energy' as const,
      life: 180, // Longer lasting
      maxLife: 180,
      hitbox: {
        x,
        y,
        width: 80,
        height: 40
      }
    };
  }, []);

  const getVoiceLine = useCallback((fighterId: string, trigger: 'special' | 'super' | 'victory' | 'hurt' | 'ko') => {
    const fighterData = ENHANCED_FIGHTER_DATA[fighterId];
    if (!fighterData) return null;
    
    const voiceLine = fighterData.voiceLines.find(line => line.trigger === trigger);
    return voiceLine?.text || null;
  }, []);

  return {
    checkSuperMoves,
    createSuperProjectile,
    getVoiceLine
  };
};