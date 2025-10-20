// PHASE 5: Hit Reactions & Impact System
import { useCallback } from 'react';
import { Fighter } from '@/types/gameTypes';
import { useVisualEffects } from './useVisualEffects';

export interface HitReaction {
  knockbackX: number;
  knockbackY: number;
  hitstun: number;
  screenFreeze: number;
  cameraZoom: number;
}

export const useHitReactionSystem = () => {
  const visualEffects = useVisualEffects();

  const calculateHitReaction = useCallback((
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super',
    attackerFacing: 'left' | 'right'
  ): HitReaction => {
    const reactions = {
      light: {
        knockbackX: 3,
        knockbackY: 0,
        hitstun: 8,
        screenFreeze: 2,
        cameraZoom: 1.0
      },
      medium: {
        knockbackX: 5,
        knockbackY: 0,
        hitstun: 12,
        screenFreeze: 4,
        cameraZoom: 1.05
      },
      heavy: {
        knockbackX: 8,
        knockbackY: -2,
        hitstun: 20,
        screenFreeze: 8,
        cameraZoom: 1.1
      },
      special: {
        knockbackX: 10,
        knockbackY: -4,
        hitstun: 30,
        screenFreeze: 12,
        cameraZoom: 1.15
      },
      super: {
        knockbackX: 15,
        knockbackY: -6,
        hitstun: 40,
        screenFreeze: 16,
        cameraZoom: 1.3
      }
    };

    const reaction = reactions[attackType];
    const direction = attackerFacing === 'right' ? 1 : -1;

    return {
      ...reaction,
      knockbackX: reaction.knockbackX * direction
    };
  }, []);

  const applyHitReaction = useCallback((
    defender: Fighter,
    attacker: Fighter,
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super'
  ): { defender: Fighter; hitFreeze: number; cameraZoom: number } => {
    const reaction = calculateHitReaction(attackType, attacker.facing);

    // Apply knockback
    const newDefender = {
      ...defender,
      velocityX: reaction.knockbackX,
      velocityY: reaction.knockbackY,
      state: {
        ...defender.state,
        current: 'hurt' as const,
        timer: reaction.hitstun
      }
    };

    // Visual effects
    visualEffects.addHitSpark(
      defender.x + defender.width / 2,
      defender.y + defender.height / 2,
      attackType === 'super' || attackType === 'heavy' ? 'critical' : 'impact'
    );

    const shakeIntensity = attackType === 'super' ? 20 :
                          attackType === 'heavy' ? 15 :
                          attackType === 'special' ? 12 : 8;
    
    visualEffects.addScreenShake(shakeIntensity, reaction.screenFreeze * 16);

    if (attackType === 'super') {
      visualEffects.addFlashEffect('hsl(60, 100%, 80%)', 0.9, 300);
    }

    return {
      defender: newDefender,
      hitFreeze: reaction.screenFreeze,
      cameraZoom: reaction.cameraZoom
    };
  }, [calculateHitReaction, visualEffects]);

  return {
    calculateHitReaction,
    applyHitReaction
  };
};
