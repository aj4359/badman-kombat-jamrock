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
  const [currentLayer, setCurrentLayer] = useState<'intro' | 'gameplay' | 'ambient'>('ambient');
  const [audioErrors, setAudioErrors] = useState<string[]>([]);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>({
    masterVolume: 0.7,
    musicVolume: 0.8,
    effectsVolume: 0.9,
    isMuted: false
  });

  const audioRefs = useRef<AudioLayer>({
    intro: new Audio('/assets/audio/shaw-brothers-intro.mp3'),
    gameplay: new Audio('/assets/audio/bmk-champion-loop.mp3'),
    ambient: new Audio('/assets/audio/reggae-drum-bass.mp3'),
    effects: []
  });

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  
  // Single shared AudioContext and oscillator tracking for complete cleanup
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorsRef = useRef<Set<OscillatorNode>>(new Set());
  const activeGainNodesRef = useRef<Set<GainNode>>(new Set());
  const allAudioContextsRef = useRef<Set<AudioContext>>(new Set());

  // Initialize audio elements with error handling
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

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
        // Audio loaded successfully - no console spam
      }, { once: true });
    };
    
    handleAudioError(intro, 'intro');
    handleAudioError(gameplay, 'gameplay');
    handleAudioError(ambient, 'ambient');
    
    handleAudioLoad(intro, 'intro');
    handleAudioLoad(gameplay, 'gameplay');
    handleAudioLoad(ambient, 'ambient');
    
    // Configure intro audio (one-shot)
    intro.loop = false;
    intro.preload = 'auto';
    intro.volume = settings.musicVolume * settings.masterVolume;
    
    // Configure gameplay audio (loop)
    gameplay.loop = true;
    gameplay.preload = 'auto';
    gameplay.volume = settings.musicVolume * settings.masterVolume;
    
    // Configure ambient audio (loop)
    ambient.loop = true;
    ambient.volume = settings.musicVolume * settings.masterVolume * 0.6;

    // Mark as loaded after delay
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
      if (errors.length > 0) {
        console.warn(`Audio system loaded with ${errors.length} missing files`);
      }
    }, 1000);

    return () => {
      clearTimeout(loadTimer);
      intro.pause();
      gameplay.pause();
      ambient.pause();
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

  const stopAllAudio = useCallback(() => {
    const { intro, gameplay, ambient } = audioRefs.current;
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    intro.pause();
    gameplay.pause();
    ambient.pause();
    
    intro.currentTime = 0;
    gameplay.currentTime = 0;
    ambient.currentTime = 0;
    
    setIsPlaying(false);
    setIntroPlaying(false);
    currentAudioRef.current = null;
  }, []);

  const crossFade = useCallback((fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement, duration: number = 2000) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    const fadeSteps = 50;
    const stepTime = duration / fadeSteps;
    const volumeStep = 1 / fadeSteps;
    
    let currentStep = 0;
    
    toAudio.volume = 0;
    toAudio.play();
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      
      fromAudio.volume = Math.max(0, 1 - (currentStep * volumeStep));
      toAudio.volume = Math.min(1, currentStep * volumeStep) * settings.musicVolume * settings.masterVolume;
      
      if (currentStep >= fadeSteps) {
        fromAudio.pause();
        fromAudio.currentTime = 0;
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
      }
    }, stepTime);
  }, [settings]);

  const playLayer = useCallback((layer: 'intro' | 'gameplay' | 'ambient', autoTransition: boolean = true) => {
    const { intro, gameplay, ambient } = audioRefs.current;
    
    if (currentLayer === layer && isPlaying) return;
    
    const targetAudio = audioRefs.current[layer];
    
    if (currentAudioRef.current && currentAudioRef.current !== targetAudio) {
      if (autoTransition) {
        crossFade(currentAudioRef.current, targetAudio);
      } else {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        targetAudio.play();
      }
    } else {
      targetAudio.play();
    }
    
    currentAudioRef.current = targetAudio;
    setCurrentLayer(layer);
    setIsPlaying(true);
    
    if (layer === 'intro') {
      setIntroPlaying(true);
      
      // Auto-transition to gameplay when intro ends
      if (autoTransition) {
        targetAudio.addEventListener('ended', () => {
          setIntroPlaying(false);
          playLayer('gameplay', false);
        }, { once: true });
      }
    }
  }, [currentLayer, isPlaying, crossFade]);

  const playEffect = useCallback((effectType: string) => {
    // BELL ELIMINATION: All audio effects completely disabled
    console.log('playEffect disabled to prevent double bell ringing:', effectType);
    return;
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleMute = useCallback(() => {
    setSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const emergencyAudioKillSwitch = useCallback(() => {
    console.log('🚨 NUCLEAR AUDIO KILL SWITCH ACTIVATED - ELIMINATING ALL AUDIO');
    
    // Clear all timers and intervals
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    // Stop all HTML audio elements
    const { intro, gameplay, ambient } = audioRefs.current;
    [intro, gameplay, ambient].forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = true;
      audio.volume = 0;
    });
    
    // STOP ALL WEB AUDIO API OSCILLATORS
    activeOscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    activeOscillatorsRef.current.clear();
    
    // DISCONNECT ALL GAIN NODES
    activeGainNodesRef.current.forEach(gainNode => {
      try {
        gainNode.disconnect();
      } catch (e) {
        // Gain node might already be disconnected
      }
    });
    activeGainNodesRef.current.clear();
    
    // CLOSE ALL AUDIO CONTEXTS
    allAudioContextsRef.current.forEach(context => {
      try {
        context.close();
      } catch (e) {
        // Context might already be closed
      }
    });
    allAudioContextsRef.current.clear();
    audioContextRef.current = null;
    
    setIsPlaying(false);
    setIntroPlaying(false);
    currentAudioRef.current = null;
    
    console.log('✅ ALL AUDIO SYSTEMS COMPLETELY DESTROYED - BELL ELIMINATED');
  }, []);

  const initializeAudioContext = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
    }
  }, []);

  return {
    isLoaded,
    currentLayer,
    introPlaying,
    isPlaying,
    audioErrors,
    settings,
    audioRefs,
    playLayer,
    stopAll: stopAllAudio,
    stopAllAudio,
    playEffect,
    updateSettings,
    toggleMute,
    initializeAudioContext,
    emergencyAudioKillSwitch
  };
};