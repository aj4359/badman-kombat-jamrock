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

  // Initialize audio context for iOS compatibility
  useEffect(() => {
    const initAudioContext = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      } catch (error) {
        console.warn('Audio context initialization failed:', error);
      }
    };

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudioContext();
      audioManager.initializeAudioContext();
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('mousedown', handleFirstInteraction);
    };

    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('mousedown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('mousedown', handleFirstInteraction);
    };
  }, [audioManager]);

  const processAudioEvent = useCallback((event: AudioEvent) => {
    // BELL ELIMINATION: All audio event processing disabled
    console.log('processAudioEvent disabled to prevent bell sounds:', event.type);
    return;
  }, []);

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
    // Enhanced round transition with dynamic audio
    processAudioEvent({ type: 'round-start' });
    
    // Add dramatic pause effect
    setTimeout(() => {
      createDynamicSoundEffect(523, 'square', 1.0, 0.4); // C note
    }, 500);
  }, [processAudioEvent, createDynamicSoundEffect]);

  const playVictoryFanfare = useCallback((winner: string) => {
    processAudioEvent({ type: 'round-end', winner });
    
    // Victory fanfare sequence
    const notes = [523, 659, 784, 1047]; // C, E, G, C octave
    notes.forEach((note, index) => {
      setTimeout(() => {
        createDynamicSoundEffect(note, 'triangle', 0.5, 0.3);
      }, index * 200);
    });
  }, [processAudioEvent, createDynamicSoundEffect]);

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