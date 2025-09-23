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
    ambient: new Audio('/assets/bmk-soundtrack.mp3'),
    effects: []
  });

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loadedFilesRef = useRef<Set<string>>(new Set());

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
        loadedFilesRef.current.add(name);
        
        // Check if all critical files are loaded
        if (loadedFilesRef.current.has('intro') || loadedFilesRef.current.has('gameplay')) {
          setIsLoaded(true);
        }
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
    intro.preload = 'auto';
    intro.volume = settings.musicVolume * settings.masterVolume;
    
    // Configure gameplay audio (loop)
    gameplay.loop = true;
    gameplay.preload = 'auto';
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

  const stopAllAudio = useCallback(() => {
    console.log('Force stopping all audio instances');
    const { intro, gameplay, ambient } = audioRefs.current;
    
    // Clear any ongoing crossfades
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    // Force stop all audio with proper cleanup
    [intro, gameplay, ambient].forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    });
    
    currentAudioRef.current = null;
    setIsPlaying(false);
    setIntroPlaying(false);
  }, []);

  const crossFade = useCallback((fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement, duration = 2000) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = 50;
    const stepTime = duration / steps;
    const fromStartVolume = fromAudio.volume;
    const toTargetVolume = settings.isMuted ? 0 : settings.musicVolume * settings.masterVolume;
    
    let step = 0;
    
    // Ensure clean start - stop other audio first
    stopAllAudio();
    
    // Start the new audio
    toAudio.currentTime = 0;
    toAudio.volume = 0;
    
    // Only play if audio element is valid
    toAudio.play().catch(error => {
      console.warn('Audio playback failed during crossfade:', error);
    });
    
    setIsPlaying(true);
    
    fadeIntervalRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      
      // Fade out current audio
      if (fromAudio && !fromAudio.paused) {
        fromAudio.volume = fromStartVolume * (1 - progress);
      }
      
      // Fade in new audio
      toAudio.volume = toTargetVolume * progress;
      
      if (step >= steps) {
        if (fromAudio && !fromAudio.paused) {
          fromAudio.pause();
          fromAudio.currentTime = 0;
        }
        toAudio.volume = toTargetVolume;
        currentAudioRef.current = toAudio;
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
      }
    }, stepTime);
  }, [settings, stopAllAudio]);

  const playLayer = useCallback((layer: 'intro' | 'gameplay' | 'ambient', immediate = false) => {
    console.log(`Attempting to play audio layer: ${layer}, isLoaded: ${isLoaded}, currentLayer: ${currentLayer}`);
    
    // Force stop all current audio to prevent doubling
    stopAllAudio();
    
    const { intro, gameplay, ambient } = audioRefs.current;
    let targetAudio: HTMLAudioElement;
    
    switch (layer) {
      case 'intro':
        targetAudio = intro;
        break;
      case 'gameplay':
        targetAudio = gameplay;
        break;
      case 'ambient':
      default:
        targetAudio = ambient;
        break;
    }
    
    // Check if the target audio file exists and is loadable
    if (!targetAudio.src || targetAudio.error) {
      console.warn(`Audio file not available for layer: ${layer}`);
      setAudioErrors(prev => [...prev, layer]);
      return;
    }
    
    console.log(`Playing audio layer: ${layer}`);
    setCurrentLayer(layer);
    
    if (layer === 'intro') {
      setIntroPlaying(true);
      console.log('Setting up Shaw Brothers intro with auto-transition');
      
      // Clear any previous event listeners
      intro.onended = null;
      
      // Shaw Brothers intro - enhanced auto-transition to gameplay
      const handleIntroEnd = () => {
        console.log('Shaw Brothers intro ended, transitioning to gameplay');
        setIntroPlaying(false);
        setCurrentLayer('gameplay');
        setTimeout(() => playLayer('gameplay', true), 100); // Small delay for smooth transition
      };
      
      intro.removeEventListener('ended', handleIntroEnd); // Remove any existing
      intro.addEventListener('ended', handleIntroEnd, { once: true });
    } else {
      setIntroPlaying(false);
    }
    
    // Enhanced immediate playback with proper cleanup
    if (immediate || !currentAudioRef.current) {
      // Reset and configure target audio
      targetAudio.currentTime = 0;
      targetAudio.volume = settings.isMuted ? 0 : settings.musicVolume * settings.masterVolume;
      
      // Special handling for ambient layer
      if (layer === 'ambient') {
        targetAudio.volume *= 0.6;
      }
      
      // Play target audio with comprehensive error handling
      targetAudio.play()
        .then(() => {
          console.log(`Successfully started playing ${layer} audio`);
          currentAudioRef.current = targetAudio;
          setIsPlaying(true);
        })
        .catch(error => {
          console.warn(`Failed to play ${layer} audio:`, error);
          setAudioErrors(prev => [...prev, `${layer}-playback`]);
        });
    } else if (currentAudioRef.current && currentAudioRef.current !== targetAudio) {
      // Use crossfade for smooth transitions
      crossFade(currentAudioRef.current, targetAudio);
    }
  }, [isLoaded, currentLayer, crossFade, stopAllAudio, settings]);

  const stopAll = useCallback(() => {
    stopAllAudio();
  }, [stopAllAudio]);

  const playEffect = useCallback((effectType: 'hit' | 'block' | 'whoosh' | 'special' | 'round-start' | 'ko' | 'specialMove') => {
    if (settings.isMuted) return;
    
    try {
      // Create better sound effects with Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create different types of sounds based on effect type
      if (effectType === 'hit' || effectType === 'block') {
        // Punch/impact sounds - use noise and filters
        const bufferSize = 4096;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate noise
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(effectType === 'hit' ? 800 : 400, audioContext.currentTime);
        
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(settings.effectsVolume * settings.masterVolume * 0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        noise.start(audioContext.currentTime);
        noise.stop(audioContext.currentTime + 0.15);
      } else {
        // Other effects - use oscillators with envelopes
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Enhanced frequencies and waveforms for different effects
        const soundConfig: Record<string, {frequency: number, type: OscillatorType, duration: number}> = {
          whoosh: { frequency: 300, type: 'sawtooth', duration: 0.3 },
          special: { frequency: 440, type: 'sine', duration: 0.5 },
          specialMove: { frequency: 660, type: 'triangle', duration: 0.8 },
          'round-start': { frequency: 523, type: 'square', duration: 1.0 },
          ko: { frequency: 110, type: 'sawtooth', duration: 1.5 }
        };
        
        const config = soundConfig[effectType] || { frequency: 220, type: 'sine', duration: 0.2 };
        
        oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        oscillator.type = config.type;
        
        // Add frequency modulation for more interesting sounds
        if (effectType === 'special' || effectType === 'specialMove') {
          oscillator.frequency.exponentialRampToValueAtTime(config.frequency * 1.5, audioContext.currentTime + config.duration / 2);
          oscillator.frequency.exponentialRampToValueAtTime(config.frequency * 0.8, audioContext.currentTime + config.duration);
        }
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(settings.effectsVolume * settings.masterVolume * 0.2, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + config.duration);
      }
      
      console.log(`Played enhanced ${effectType} sound effect`);
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
    isPlaying,
    playLayer,
    stopAll,
    playEffect,
    updateSettings,
    toggleMute,
    initializeAudioContext,
    audioRefs: audioRefs.current
  };
};