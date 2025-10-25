import { useCallback, useRef } from 'react';
import { Fighter } from '@/types/gameTypes';
import { CombatSystem, CombatState } from '@/components/game/CombatSystem';
import { useVisualEffects } from './useVisualEffects';
import { useFightAudio } from './useFightAudio';
import { useAudioManager } from './useAudioManager';
import { useColorGrading } from './useColorGrading';

export const useEnhancedCombatSystem = () => {
  const visualEffects = useVisualEffects();
  const fightAudio = useFightAudio();
  const audioManager = useAudioManager();
  const { setColorGradingMode } = useColorGrading();
  
  const lastHitTimerRef = useRef<Map<string, number>>(new Map());

  const processFighterHit = useCallback((
    attacker: Fighter,
    defender: Fighter,
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super' = 'medium'
  ): { attacker: Fighter; defender: Fighter } => {
    
    // Determine damage and hitstun based on attack type
    const damageMap = {
      light: 8,
      medium: 12,
      heavy: 18,
      special: 25,
      super: 40
    };
    
    const hitstunMap = {
      light: 8,
      medium: 12,
      heavy: 18,
      special: 25,
      super: 35
    };

    const damage = damageMap[attackType];
    const hitstun = hitstunMap[attackType];

    // Check if defender is blocking
    if (defender.state.current === 'blocking') {
      const blockResult = CombatSystem.applyBlock(attacker, defender, damage, Math.floor(hitstun * 0.6));
      
      // Block feedback
      audioManager.playEffect('block');
      visualEffects.addHitSpark(
        defender.x + defender.width / 2, 
        defender.y + defender.height / 2, 
        'block'
      );
      visualEffects.addScreenShake(3, 80);
      
      return blockResult;
    } else {
      // Successful hit
      const hitResult = CombatSystem.applyHit(attacker, defender, damage, hitstun, attackType);
      
      // Enhanced feedback based on combo count and attack type
      const comboCount = hitResult.defender.combatState.comboCount;
      
      if (comboCount > 1) {
        fightAudio.onComboStart();
        visualEffects.createComboEffect(
          defender.x + defender.width / 2, 
          defender.y + 30, 
          comboCount
        );
        // Trigger combo color grading
        setColorGradingMode('combo', 1000);
      } else {
        fightAudio.onHit(attackType === 'heavy' || attackType === 'special' || attackType === 'super' ? 'heavy' : 'medium');
      }
      
      // Audio and visual feedback based on attack strength
      audioManager.playEffect('hit');
      
      const sparkType = attackType === 'super' ? 'critical' : 
                       attackType === 'heavy' || attackType === 'special' ? 'impact' : 'impact';
      
      visualEffects.addHitSpark(
        defender.x + defender.width / 2, 
        defender.y + defender.height / 2, 
        sparkType
      );
      
      const shakeIntensity = attackType === 'super' ? 15 : 
                           attackType === 'heavy' || attackType === 'special' ? 8 : 6;
      const shakeDuration = attackType === 'super' ? 200 : 
                          attackType === 'heavy' || attackType === 'special' ? 120 : 80;
      
      visualEffects.addScreenShake(shakeIntensity, shakeDuration);
      
      // Special effects for super moves
      if (attackType === 'super') {
        visualEffects.addFlashEffect('hsl(60, 100%, 80%)', 0.8, 300);
        setColorGradingMode('special', 1500);
      } else if (attackType === 'special') {
        setColorGradingMode('special', 1000);
      }
      
      return hitResult;
    }
  }, [visualEffects, fightAudio, audioManager]);

  const checkKnockdown = useCallback((fighter: Fighter): boolean => {
    // Check if fighter should be knocked down based on combo count and damage
    const { comboCount, comboDamage } = fighter.combatState;
    
    if (comboCount >= 5 || comboDamage >= 50) {
      fightAudio.onKnockdown();
      return true;
    }
    
    return false;
  }, [fightAudio]);

  const applyKnockdown = useCallback((fighter: Fighter): Fighter => {
    const newFighter = { ...fighter };
    
    // Set knockdown state
    newFighter.state.current = 'hurt';
    newFighter.state.timer = 60; // Extended recovery time
    newFighter.combatState.hitstun = 60;
    
    // Reset combo
    newFighter.combatState.comboCount = 0;
    newFighter.combatState.comboDamage = 0;
    newFighter.combatState.comboScaling = 1.0;
    
    // Enhanced knockdown effects
    visualEffects.addScreenShake(12, 250);
    visualEffects.addFlashEffect('hsl(0, 80%, 60%)', 0.6, 150);
    
    return newFighter;
  }, [visualEffects]);

  const processSpecialMove = useCallback((
    fighter: Fighter,
    moveName: string
  ): Fighter => {
    const specialMove = fighter.specialMoves.find(move => move.name === moveName);
    if (!specialMove || (fighter.stamina || 0) < specialMove.cost) {
      return fighter;
    }

    const newFighter = { ...fighter };
    
    // Execute special move
    newFighter.state.current = 'special';
    if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
    newFighter.state.timer = specialMove.frames.startup + specialMove.frames.active + specialMove.frames.recovery;
    if (newFighter.stamina !== undefined) newFighter.stamina -= specialMove.cost;
    if (newFighter.superMeter !== undefined && newFighter.maxSuperMeter !== undefined) {
      newFighter.superMeter = Math.min(newFighter.maxSuperMeter, newFighter.superMeter + 15);
    }
    
    // Clear input buffer
    if (newFighter.inputBufferSystem) newFighter.inputBufferSystem = CombatSystem.initializeInputBuffer();
    
    // Special move feedback
    fightAudio.onSpecialMove();
    audioManager.playEffect('specialMove');
    visualEffects.addScreenShake(10, 150);
    
    // Projectile creation for projectile-type special moves
    if (specialMove.type === 'projectile' && specialMove.projectile) {
      const direction = newFighter.facing === 'right' ? 1 : -1;
      const projectileX = newFighter.x + (newFighter.facing === 'right' ? newFighter.width : 0);
      const projectileY = newFighter.y + newFighter.height / 2;
      
      // Enhanced projectile effects
      visualEffects.addHitSpark(projectileX, projectileY, 'critical');
    }
    
    return newFighter;
  }, [fightAudio, audioManager, visualEffects]);

  const processSuperMove = useCallback((
    fighter: Fighter,
    moveName: string
  ): Fighter => {
    const superMove = fighter.superMoves.find(move => move.name === moveName);
    if (!superMove || (fighter.superMeter || 0) < superMove.cost) {
      return fighter;
    }

    const newFighter = { ...fighter };
    
    // Execute super move
    newFighter.state.current = 'special';
    if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
    newFighter.state.timer = superMove.frames.startup + superMove.frames.active + superMove.frames.recovery;
    if (newFighter.superMeter !== undefined) newFighter.superMeter -= superMove.cost;
    
    // Add invulnerability frames
    if (superMove.invulnerable && newFighter.combatState) {
      newFighter.combatState.invulnerableFrames = superMove.frames.startup;
    }
    
    // Clear input buffer
    if (newFighter.inputBufferSystem) newFighter.inputBufferSystem = CombatSystem.initializeInputBuffer();
    
    // Epic super move feedback
    fightAudio.onSpecialMove();
    audioManager.playEffect('special');
    visualEffects.addScreenShake(15, 300);
    visualEffects.addFlashEffect('hsl(60, 100%, 80%)', 0.8, 200);
    visualEffects.createComboEffect(
      newFighter.x + newFighter.width / 2, 
      newFighter.y + 30, 
      10
    );
    // Trigger special color grading for super moves
    setColorGradingMode('special', 2000);
    
    return newFighter;
  }, [fightAudio, audioManager, visualEffects]);

  return {
    processFighterHit,
    checkKnockdown,
    applyKnockdown,
    processSpecialMove,
    processSuperMove
  };
};