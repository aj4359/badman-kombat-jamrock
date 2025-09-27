import { useState, useRef, useCallback, useEffect } from 'react';

interface CrowdAudioState {
  isLoaded: boolean;
  isPlaying: boolean;
  volume: number;
  intensity: 'low' | 'medium' | 'high';
}

export const useCrowdAudio = () => {
  const [state, setState] = useState<CrowdAudioState>({
    isLoaded: false,
    isPlaying: false,
    volume: 0.3,
    intensity: 'low'
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const crowdSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  // Initialize audio context and load crowd sounds
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new AudioContext();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = state.volume;

        // Create synthetic crowd noise using white noise and filtering
        const bufferSize = audioContextRef.current.sampleRate * 2; // 2 seconds
        const buffer = audioContextRef.current.createBuffer(2, bufferSize, audioContextRef.current.sampleRate);
        
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          for (let i = 0; i < bufferSize; i++) {
            // Create crowd-like noise with varying intensity
            channelData[i] = (Math.random() * 2 - 1) * 0.1 * (1 + Math.sin(i / 1000) * 0.5);
          }
        }
        
        bufferRef.current = buffer;
        setState(prev => ({ ...prev, isLoaded: true }));
      } catch (error) {
        console.error('Failed to initialize crowd audio:', error);
      }
    };

    initAudio();

    return () => {
      if (crowdSourceRef.current) {
        crowdSourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playCrowdReaction = useCallback((type: 'cheer' | 'gasp' | 'boo' | 'silence', duration: number = 2000) => {
    if (!audioContextRef.current || !gainNodeRef.current || !bufferRef.current) return;

    // Stop current sound
    if (crowdSourceRef.current) {
      crowdSourceRef.current.stop();
    }

    if (type === 'silence') {
      setState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    const source = audioContextRef.current.createBufferSource();
    const filter = audioContextRef.current.createBiquadFilter();
    const compressor = audioContextRef.current.createDynamicsCompressor();
    
    source.buffer = bufferRef.current;
    source.loop = true;

    // Configure filter based on crowd reaction type
    switch (type) {
      case 'cheer':
        filter.type = 'highpass';
        filter.frequency.value = 200;
        gainNodeRef.current.gain.value = state.volume * 0.8;
        setState(prev => ({ ...prev, intensity: 'high' }));
        break;
      case 'gasp':
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 5;
        gainNodeRef.current.gain.value = state.volume * 0.4;
        setState(prev => ({ ...prev, intensity: 'medium' }));
        break;
      case 'boo':
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        gainNodeRef.current.gain.value = state.volume * 0.6;
        setState(prev => ({ ...prev, intensity: 'medium' }));
        break;
    }

    // Connect audio nodes
    source.connect(filter);
    filter.connect(compressor);
    compressor.connect(gainNodeRef.current);

    crowdSourceRef.current = source;
    source.start();
    setState(prev => ({ ...prev, isPlaying: true }));

    // Auto-stop after duration
    setTimeout(() => {
      if (source === crowdSourceRef.current) {
        source.stop();
        setState(prev => ({ ...prev, isPlaying: false, intensity: 'low' }));
        crowdSourceRef.current = null;
      }
    }, duration);
  }, [state.volume]);

  const setIntensity = useCallback((intensity: 'low' | 'medium' | 'high') => {
    setState(prev => ({ ...prev, intensity }));
    if (gainNodeRef.current) {
      const volumeMap = { low: 0.2, medium: 0.5, high: 0.8 };
      gainNodeRef.current.gain.value = state.volume * volumeMap[intensity];
    }
  }, [state.volume]);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, []);

  const stopCrowd = useCallback(() => {
    if (crowdSourceRef.current) {
      crowdSourceRef.current.stop();
      crowdSourceRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  return {
    ...state,
    playCrowdReaction,
    setIntensity,
    setVolume,
    stopCrowd
  };
};