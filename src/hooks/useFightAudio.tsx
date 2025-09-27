import { useCallback } from 'react';
import { useCrowdAudio } from './useCrowdAudio';
import { useAudioManager } from './useAudioManager';

export const useFightAudio = () => {
  const { playCrowdReaction, setIntensity } = useCrowdAudio();
  const { playEffect, playLayer } = useAudioManager();

  const onHit = useCallback((intensity: 'light' | 'medium' | 'heavy') => {
    // Play hit sound effect
    playEffect('hit');
    
    // Crowd reaction based on hit intensity
    if (intensity === 'heavy') {
      playCrowdReaction('cheer', 1500);
      setIntensity('high');
    } else if (intensity === 'medium') {
      playCrowdReaction('gasp', 1000);
      setIntensity('medium');
    }
  }, [playEffect, playCrowdReaction, setIntensity]);

  const onComboStart = useCallback(() => {
    playCrowdReaction('cheer', 3000);
    setIntensity('high');
  }, [playCrowdReaction, setIntensity]);

  const onSpecialMove = useCallback(() => {
    playEffect('special');
    playCrowdReaction('cheer', 2000);
    setIntensity('high');
  }, [playEffect, playCrowdReaction, setIntensity]);

  const onRoundStart = useCallback(() => {
    playLayer('gameplay', false);
    playCrowdReaction('cheer', 2000);
  }, [playLayer, playCrowdReaction]);

  const onRoundEnd = useCallback((winner?: string) => {
    if (winner) {
      playCrowdReaction('cheer', 4000);
    } else {
      playCrowdReaction('boo', 2000);
    }
    setIntensity('low');
  }, [playCrowdReaction, setIntensity]);

  const onKnockdown = useCallback(() => {
    playCrowdReaction('gasp', 2000);
    setIntensity('medium');
  }, [playCrowdReaction, setIntensity]);

  return {
    onHit,
    onComboStart,
    onSpecialMove,
    onRoundStart,
    onRoundEnd,
    onKnockdown
  };
};