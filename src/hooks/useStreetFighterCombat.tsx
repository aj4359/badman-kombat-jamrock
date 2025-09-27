import { useCallback, useRef, useState } from 'react';
import { Fighter } from '@/types/gameTypes';
import { useVisualEffects } from './useVisualEffects';
import { useFightAudio } from './useFightAudio';
import { useAudioManager } from './useAudioManager';
import { createProjectile, updateProjectile, type Projectile } from '@/components/game/StreetFighterProjectiles';

export const useStreetFighterCombat = () => {
  const visualEffects = useVisualEffects();
  const fightAudio = useFightAudio();
  const audioManager = useAudioManager();
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  
  const lastHitTimerRef = useRef<Map<string, number>>(new Map());

  const executeStreetFighterHit = useCallback((
    attacker: Fighter,
    defender: Fighter,
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super' = 'medium'
  ): { attacker: Fighter; defender: Fighter } => {
    
    // Street Fighter damage scaling
    const damageMap = {
      light: 10,
      medium: 15,
      heavy: 25,
      special: 35,
      super: 50
    };
    
    const hitstunMap = {
      light: 8,
      medium: 12,
      heavy: 20,
      special: 30,
      super: 40
    };

    const damage = damageMap[attackType];
    const hitstun = hitstunMap[attackType];
    const newDefender = { ...defender };
    const newAttacker = { ...attacker };

    // Apply damage
    newDefender.health = Math.max(0, newDefender.health - damage);
    
    // Apply hitstun
    newDefender.state.current = 'hurt';
    newDefender.state.timer = hitstun;
    if (newDefender.combatState) {
      newDefender.combatState.hitstun = hitstun;
    }

    // Build super meter for attacker
    if (newAttacker.superMeter !== undefined && newAttacker.maxSuperMeter !== undefined) {
      const meterGain = attackType === 'super' ? 0 : damage * 1.5;
      newAttacker.superMeter = Math.min(newAttacker.maxSuperMeter, newAttacker.superMeter + meterGain);
    }

    // Street Fighter hit effects
    const sparkType = attackType === 'super' ? 'critical' : 
                     attackType === 'heavy' || attackType === 'special' ? 'impact' : 'impact';
    
    visualEffects.addHitSpark(
      defender.x + defender.width / 2, 
      defender.y + defender.height / 2, 
      sparkType
    );
    
    // Screen effects based on attack strength
    const shakeIntensity = attackType === 'super' ? 20 : 
                          attackType === 'heavy' || attackType === 'special' ? 12 : 8;
    const shakeDuration = attackType === 'super' ? 300 : 
                         attackType === 'heavy' || attackType === 'special' ? 150 : 100;
    
    visualEffects.addScreenShake(shakeIntensity, shakeDuration);
    
    // Super move flash
    if (attackType === 'super') {
      visualEffects.addFlashEffect('hsl(60, 100%, 80%)', 0.9, 400);
    }
    
    // Audio feedback
    fightAudio.onHit(attackType === 'heavy' || attackType === 'special' || attackType === 'super' ? 'heavy' : 'medium');
    audioManager.playEffect('hit');
    
    return { attacker: newAttacker, defender: newDefender };
  }, [visualEffects, fightAudio, audioManager]);

  const executeSpecialMove = useCallback((
    fighter: Fighter,
    moveName: string
  ): { fighter: Fighter; projectile?: Projectile } => {
    const specialMove = fighter.specialMoves.find(move => move.name === moveName);
    if (!specialMove || (fighter.stamina || 0) < specialMove.cost) {
      return { fighter };
    }

    const newFighter = { ...fighter };
    
    // Execute special move
    newFighter.state.current = 'special';
    if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
    newFighter.state.timer = specialMove.frames.startup + specialMove.frames.active + specialMove.frames.recovery;
    if (newFighter.stamina !== undefined) newFighter.stamina -= specialMove.cost;
    
    // Build super meter
    if (newFighter.superMeter !== undefined && newFighter.maxSuperMeter !== undefined) {
      newFighter.superMeter = Math.min(newFighter.maxSuperMeter, newFighter.superMeter + 20);
    }
    
    // Special move effects
    fightAudio.onSpecialMove();
    audioManager.playEffect('specialMove');
    visualEffects.addScreenShake(15, 200);
    
    // Create projectile for projectile-type moves
    let projectile: Projectile | undefined;
    if (specialMove.type === 'projectile') {
      const direction = newFighter.facing === 'right' ? 1 : -1;
      const projectileType = getProjectileTypeForFighter(newFighter.id);
      projectile = createProjectile(newFighter, projectileType, direction);
      
      // Enhanced projectile launch effect
      visualEffects.addHitSpark(
        newFighter.x + (newFighter.facing === 'right' ? newFighter.width : 0),
        newFighter.y + newFighter.height / 2,
        'critical'
      );
    }
    
    return { fighter: newFighter, projectile };
  }, [fightAudio, audioManager, visualEffects]);

  const executeSuperMove = useCallback((
    fighter: Fighter,
    moveName: string
  ): { fighter: Fighter; projectile?: Projectile } => {
    const superMove = fighter.superMoves.find(move => move.name === moveName);
    if (!superMove || (fighter.superMeter || 0) < superMove.cost) {
      return { fighter };
    }

    const newFighter = { ...fighter };
    
    // Execute super move
    newFighter.state.current = 'special';
    if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
    newFighter.state.timer = superMove.frames.startup + superMove.frames.active + superMove.frames.recovery;
    if (newFighter.superMeter !== undefined) newFighter.superMeter -= superMove.cost;
    
    // Add invulnerability
    if (superMove.invulnerable && newFighter.combatState) {
      newFighter.combatState.invulnerableFrames = superMove.frames.startup;
    }
    
    // Epic super move effects
    fightAudio.onSpecialMove();
    audioManager.playEffect('special');
    visualEffects.addScreenShake(25, 500);
    visualEffects.addFlashEffect('hsl(60, 100%, 80%)', 1.0, 300);
    
    // Create super projectile
    let projectile: Projectile | undefined;
    if (superMove.type === 'projectile') {
      const direction = newFighter.facing === 'right' ? 1 : -1;
      const projectileType = getSuperProjectileTypeForFighter(newFighter.id);
      projectile = createProjectile(newFighter, projectileType, direction);
      // Make super projectiles larger and more powerful
      if (projectile) {
        projectile.width = 48;
        projectile.height = 48;
        projectile.damage = 40;
        projectile.velocityX = direction * 12;
      }
    }
    
    return { fighter: newFighter, projectile };
  }, [fightAudio, audioManager, visualEffects]);

  const updateProjectiles = useCallback(() => {
    setProjectiles(prev => 
      prev
        .map(updateProjectile)
        .filter(p => p.life > 0 && p.x > -100 && p.x < 1200)
    );
  }, []);

  const addProjectile = useCallback((projectile: Projectile) => {
    setProjectiles(prev => [...prev, projectile]);
  }, []);

  const clearProjectiles = useCallback(() => {
    setProjectiles([]);
  }, []);

  return {
    executeStreetFighterHit,
    executeSpecialMove,
    executeSuperMove,
    projectiles,
    updateProjectiles,
    addProjectile,
    clearProjectiles
  };
};

function getProjectileTypeForFighter(fighterId: string): 'hadoken' | 'fireball' | 'sonic' | 'plasma' {
  switch (fighterId) {
    case 'jordan': return 'sonic';
    case 'sifu': return 'hadoken';
    case 'leroy': return 'plasma';
    case 'razor': return 'plasma';
    case 'rootsman': return 'fireball';
    default: return 'hadoken';
  }
}

function getSuperProjectileTypeForFighter(fighterId: string): 'hadoken' | 'fireball' | 'sonic' | 'plasma' {
  // Super versions are the same type but enhanced
  return getProjectileTypeForFighter(fighterId);
}