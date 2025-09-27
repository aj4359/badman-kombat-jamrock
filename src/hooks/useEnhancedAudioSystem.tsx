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
    const now = Date.now();
    
    // Prevent audio spam by limiting similar events
    if (lastAudioEventRef.current &&
        lastAudioEventRef.current.type === event.type &&
        now - lastAudioEventRef.current.timestamp < 100) {
      return;
    }

    lastAudioEventRef.current = { type: event.type, timestamp: now };

    switch (event.type) {
      case 'hit':
        fightAudio.onHit(event.intensity || 'medium');
        audioManager.playEffect('hit');
        crowdAudio.playCrowdReaction('cheer', 1000);
        break;

      case 'block':
        audioManager.playEffect('block');
        crowdAudio.playCrowdReaction('gasp', 800);
        break;

      case 'special':
        fightAudio.onSpecialMove();
        audioManager.playEffect('specialMove');
        crowdAudio.playCrowdReaction('cheer', 2000);
        crowdAudio.setIntensity('high');
        break;

      case 'super':
        fightAudio.onSpecialMove();
        audioManager.playEffect('special');
        crowdAudio.playCrowdReaction('cheer', 3000);
        crowdAudio.setIntensity('high');
        break;

      case 'combo':
        if (event.comboCount && event.comboCount > 1) {
          fightAudio.onComboStart();
          crowdAudio.playCrowdReaction('cheer', 2000 + (event.comboCount * 200));
          crowdAudio.setIntensity('high');
        }
        break;

      case 'ko':
        fightAudio.onRoundEnd(event.winner);
        audioManager.playEffect('ko');
        crowdAudio.playCrowdReaction('cheer', 4000);
        break;

      case 'round-start':
        fightAudio.onRoundStart();
        // REMOVED: audioManager.playEffect('round-start'); - This was the source of infinite bell sounds
        crowdAudio.playCrowdReaction('cheer', 2000);
        break;

      case 'round-end':
        fightAudio.onRoundEnd(event.winner);
        if (event.winner) {
          crowdAudio.playCrowdReaction('cheer', 4000);
        } else {
          crowdAudio.playCrowdReaction('boo', 2000);
        }
        crowdAudio.setIntensity('low');
        break;
    }
  }, [fightAudio, audioManager, crowdAudio]);

  const createDynamicSoundEffect = useCallback((
    frequency: number,
    type: OscillatorType = 'sine',
    duration: number = 0.2,
    volume: number = 0.3
  ) => {
    if (!audioContextRef.current || audioManager.settings.isMuted) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;
      
      const finalVolume = volume * audioManager.settings.effectsVolume * audioManager.settings.masterVolume;
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, audioContextRef.current.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.warn('Dynamic sound effect failed:', error);
    }
  }, [audioManager.settings]);

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