// PHASE 4: Animation Controller Integration
import { useCallback, useRef } from 'react';
import { Fighter } from '@/types/gameTypes';

export interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimationSequence {
  name: string;
  frames: AnimationFrame[];
  duration: number;
  loop: boolean;
}

// Map fighter states to animation names
export const getAnimationForState = (state: string): string => {
  const stateMap: Record<string, string> = {
    idle: 'idle',
    walking: 'walking',
    running: 'walking',
    jumping: 'jumping',
    crouching: 'crouching',
    attacking: 'attacking',
    special: 'special',
    hurt: 'hit',
    stunned: 'hit',
    blocking: 'blocking',
    ko: 'ko'
  };
  return stateMap[state] || 'idle';
};

export const useAnimationSystem = () => {
  const animationTimers = useRef<Map<string, number>>(new Map());
  const currentAnimations = useRef<Map<string, string>>(new Map());

  const updateFighterAnimation = useCallback((fighter: Fighter): Fighter => {
    const fighterId = fighter.id;
    const targetAnimation = getAnimationForState(fighter.state.current);
    const currentAnimation = currentAnimations.current.get(fighterId);

    // Reset timer if animation changed
    if (currentAnimation !== targetAnimation) {
      animationTimers.current.set(fighterId, 0);
      currentAnimations.current.set(fighterId, targetAnimation);
    } else {
      // Increment timer
      const currentTimer = animationTimers.current.get(fighterId) || 0;
      animationTimers.current.set(fighterId, currentTimer + 1);
    }

    return {
      ...fighter,
      animation: {
        ...fighter.animation,
        sequence: targetAnimation,
        frameTimer: animationTimers.current.get(fighterId) || 0
      }
    };
  }, []);

  const getAnimationFrame = useCallback((
    fighter: Fighter,
    totalFrames: number = 8
  ): number => {
    const timer = animationTimers.current.get(fighter.id) || 0;
    const frameRate = 10; // PHASE 1: Slower animation (was 6, now 10 - 66% slower)
    return Math.floor(timer / frameRate) % totalFrames;
  }, []);

  return {
    updateFighterAnimation,
    getAnimationFrame,
    getAnimationForState
  };
};
