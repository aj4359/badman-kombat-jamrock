import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioLayer {
  intro: HTMLAudioElement;
  gameplay: HTMLAudioElement;
  ambient: HTMLAudioElement;
  effects: HTMLAudioElement[];
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  isMuted: boolean;
}

export const useAudioManager = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<'menu' | 'intro' | 'gameplay' | 'ambient'>('menu');
  const [audioErrors, setAudioErrors] = useState<string[]>([]);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>({
    masterVolume: 0.7,
    musicVolume: 0.8,
    effectsVolume: 0.9,
    isMuted: false
  });

  const audioRefs = useRef<AudioLayer>({
    intro: new Audio('/assets/audio/shaw-brothers-intro.mp3'),
    gameplay: new Audio('/assets/audio/bmk-champion-loop.mp3'),
    ambient: new Audio('/assets/bmk-soundtrack.mp3'),
    effects: []
  });

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio elements with error handling
  useEffect(() => {
    const { intro, gameplay, ambient } = audioRefs.current;
    const errors: string[] = [];
    
    const handleAudioError = (audioElement: HTMLAudioElement, name: string) => {
      audioElement.addEventListener('error', () => {
        console.warn(`Audio failed to load: ${name}`);
        errors.push(name);
        setAudioErrors(prev => [...prev, name]);
      });
    };

    const handleAudioLoad = (audioElement: HTMLAudioElement, name: string) => {
      audioElement.addEventListener('canplaythrough', () => {
        console.log(`Audio loaded successfully: ${name}`);
      });
    };

    // Set up error and load handlers
    handleAudioError(intro, 'intro');
    handleAudioError(gameplay, 'gameplay');
    handleAudioError(ambient, 'ambient');
    
    handleAudioLoad(intro, 'intro');
    handleAudioLoad(gameplay, 'gameplay');
    handleAudioLoad(ambient, 'ambient');
    
    // Configure intro audio (one-shot)
    intro.loop = false;
    intro.volume = settings.musicVolume * settings.masterVolume;
    
    // Configure gameplay audio (loop)
    gameplay.loop = true;
    gameplay.volume = settings.musicVolume * settings.masterVolume;
    
    // Configure ambient audio (loop)
    ambient.loop = true;
    ambient.volume = settings.musicVolume * settings.masterVolume * 0.6;

    // Mark as loaded even if some audio files fail
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
      if (errors.length > 0) {
        console.warn(`Audio system loaded with ${errors.length} missing files:`, errors);
      } else {
        console.log('Audio system fully loaded');
      }
    }, 1000);

    return () => {
      clearTimeout(loadTimer);
      intro.pause();
      gameplay.pause();
      ambient.pause();
      intro.src = '';
      gameplay.src = '';
      ambient.src = '';
    };
  }, []);

  // Update volumes when settings change
  useEffect(() => {
    const { intro, gameplay, ambient } = audioRefs.current;
    const musicVolume = settings.isMuted ? 0 : settings.musicVolume * settings.masterVolume;
    
    intro.volume = musicVolume;
    gameplay.volume = musicVolume;
    ambient.volume = musicVolume * 0.6;
    
    intro.muted = settings.isMuted;
    gameplay.muted = settings.isMuted;
    ambient.muted = settings.isMuted;
  }, [settings]);

  const crossFade = useCallback((fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement, duration = 2000) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = 50;
    const stepTime = duration / steps;
    const fromStartVolume = fromAudio.volume;
    const toTargetVolume = settings.isMuted ? 0 : settings.musicVolume * settings.masterVolume;
    
    let step = 0;
    
    // Start the new audio
    toAudio.currentTime = 0;
    toAudio.volume = 0;
    
    // Only play if audio element is valid
    toAudio.play().catch(error => {
      console.warn('Audio playback failed during crossfade:', error);
    });
    
    fadeIntervalRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      
      // Fade out current audio
      fromAudio.volume = fromStartVolume * (1 - progress);
      
      // Fade in new audio
      toAudio.volume = toTargetVolume * progress;
      
      if (step >= steps) {
        fromAudio.pause();
        fromAudio.currentTime = 0;
        toAudio.volume = toTargetVolume;
        currentAudioRef.current = toAudio;
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
      }
    }, stepTime);
  }, [settings]);

  const playLayer = useCallback((layer: 'menu' | 'intro' | 'gameplay' | 'ambient', immediate = false) => {
    if (!isLoaded) {
      console.warn('Audio system not loaded yet');
      return;
    }
    
    const { intro, gameplay, ambient } = audioRefs.current;
    const targetAudio = layer === 'intro' ? intro : layer === 'gameplay' ? gameplay : ambient;
    
    console.log(`Playing audio layer: ${layer}`);
    setCurrentLayer(layer);
    
    if (layer === 'intro') {
      setIntroPlaying(true);
      // Shaw Brothers intro - play once, then auto-transition to gameplay
      intro.onended = () => {
        setIntroPlaying(false);
        playLayer('gameplay', true);
      };
    }
    
    if (currentAudioRef.current && currentAudioRef.current !== targetAudio && !immediate) {
      crossFade(currentAudioRef.current, targetAudio);
    } else {
      // Stop all other audio
      [intro, gameplay, ambient].forEach(audio => {
        if (audio !== targetAudio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      
      // Play target audio with error handling
      targetAudio.currentTime = 0;
      targetAudio.play().catch(error => {
        console.warn(`Failed to play ${layer} audio:`, error);
      });
      currentAudioRef.current = targetAudio;
    }
  }, [isLoaded, crossFade]);

  const stopAll = useCallback(() => {
    console.log('Stopping all audio');
    const { intro, gameplay, ambient } = audioRefs.current;
    [intro, gameplay, ambient].forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    currentAudioRef.current = null;
  }, []);

  const playEffect = useCallback((effectType: 'hit' | 'block' | 'whoosh' | 'special' | 'round-start' | 'ko' | 'specialMove') => {
    if (settings.isMuted) return;
    
    try {
      // Create temporary audio elements for sound effects with Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different effects
      const frequencies: Record<string, number> = {
        hit: 200,
        block: 150,
        whoosh: 300,
        special: 400,
        specialMove: 450,
        'round-start': 220,
        ko: 100
      };
      
      oscillator.frequency.setValueAtTime(frequencies[effectType] || 200, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(settings.effectsVolume * settings.masterVolume * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      console.log(`Played ${effectType} sound effect`);
    } catch (error) {
      console.warn('Sound effect playback failed:', error);
    }
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    console.log('Updating audio settings:', newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleMute = useCallback(() => {
    setSettings(prev => {
      const newMuted = !prev.isMuted;
      console.log(`Audio ${newMuted ? 'muted' : 'unmuted'}`);
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  // iOS Audio Context fix
  const initializeAudioContext = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const context = new AudioContext();
        if (context.state === 'suspended') {
          context.resume();
        }
      }
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
    }
  }, []);

  return {
    isLoaded,
    currentLayer,
    settings,
    audioErrors,
    introPlaying,
    playLayer,
    stopAll,
    playEffect,
    updateSettings,
    toggleMute,
    initializeAudioContext,
    audioRefs: audioRefs.current
  };
};