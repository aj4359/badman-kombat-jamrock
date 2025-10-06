import { useCallback, useRef, useEffect } from 'react';
import { useAudioManager } from './useAudioManager';
import { useCrowdAudio } from './useCrowdAudio';
import { useFightAudio } from './useFightAudio';

export interface AudioEvent {
  type: 'hit' | 'block' | 'special' | 'super' | 'combo' | 'ko' | 'round-start' | 'round-end';
  intensity?: 'light' | 'medium' | 'heavy';
  comboCount?: number;
  winner?: string;
}

export const useEnhancedAudioSystem = () => {
  const audioManager = useAudioManager();
  const crowdAudio = useCrowdAudio();
  const fightAudio = useFightAudio();
  
  const lastAudioEventRef = useRef<{ type: string; timestamp: number } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // PHASE 1: EMERGENCY AUDIO SILENCE - All AudioContext creation completely disabled
  useEffect(() => {
    console.log('🔇 BELL ELIMINATION: AudioContext initialization completely disabled');
    return;
  }, []);

  const processAudioEvent = useCallback((event: AudioEvent) => {
    const now = Date.now();
    const lastEvent = lastAudioEventRef.current;
    
    if (lastEvent && lastEvent.type === event.type && now - lastEvent.timestamp < 100) {
      return;
    }
    
    lastAudioEventRef.current = { type: event.type, timestamp: now };
    
    switch (event.type) {
      case 'hit':
        if (event.intensity) {
          fightAudio.onHit(event.intensity);
        }
        break;
      case 'combo':
        fightAudio.onComboStart();
        break;
      case 'special':
        fightAudio.onSpecialMove();
        break;
      case 'round-start':
        fightAudio.onRoundStart();
        break;
      case 'round-end':
        fightAudio.onRoundEnd(event.winner);
        break;
      case 'ko':
        fightAudio.onKnockdown();
        break;
    }
  }, [fightAudio]);

  const createDynamicSoundEffect = useCallback((
    frequency: number,
    type: OscillatorType = 'sine',
    duration: number = 0.2,
    volume: number = 0.3
  ) => {
    // BELL ELIMINATION: Completely disabled oscillator creation
    console.log('createDynamicSoundEffect disabled to prevent bell sounds');
    return;
  }, []);

  const playRoundTransition = useCallback(() => {
    processAudioEvent({ type: 'round-start' });
  }, [processAudioEvent]);

  const playVictoryFanfare = useCallback((winner: string) => {
    processAudioEvent({ type: 'round-end', winner });
  }, [processAudioEvent]);

  return {
    processAudioEvent,
    createDynamicSoundEffect,
    playRoundTransition,
    playVictoryFanfare,
    isLoaded: audioManager.isLoaded,
    currentLayer: audioManager.currentLayer,
    audioErrors: audioManager.audioErrors
  };
};