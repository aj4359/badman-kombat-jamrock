import { useCallback, useRef, useEffect } from 'react';

export const useCrowdAudio = () => {
  const crowdCheer = useRef<HTMLAudioElement | null>(null);
  const crowdBoo = useRef<HTMLAudioElement | null>(null);
  const crowdGasp = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize crowd audio elements
    crowdCheer.current = new Audio('/assets/audio/crowd-cheer.mp3');
    crowdBoo.current = new Audio('/assets/audio/crowd-boo.mp3');
    crowdGasp.current = new Audio('/assets/audio/crowd-gasp.mp3');

    // Set volume and loop for ambient crowd
    [crowdCheer.current, crowdBoo.current, crowdGasp.current].forEach(audio => {
      if (audio) {
        audio.volume = 0.3;
        audio.preload = 'auto';
      }
    });

    return () => {
      // Cleanup audio on unmount
      [crowdCheer.current, crowdBoo.current, crowdGasp.current].forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playCheer = useCallback(() => {
    if (crowdCheer.current) {
      crowdCheer.current.currentTime = 0;
      crowdCheer.current.play().catch(console.warn);
    }
  }, []);

  const playBoo = useCallback(() => {
    if (crowdBoo.current) {
      crowdBoo.current.currentTime = 0;
      crowdBoo.current.play().catch(console.warn);
    }
  }, []);

  const playGasp = useCallback(() => {
    if (crowdGasp.current) {
      crowdGasp.current.currentTime = 0;
      crowdGasp.current.play().catch(console.warn);
    }
  }, []);

  const playCrowdReaction = useCallback((type: 'cheer' | 'boo' | 'gasp', duration?: number) => {
    switch (type) {
      case 'cheer': playCheer(); break;
      case 'boo': playBoo(); break;  
      case 'gasp': playGasp(); break;
    }
    // Duration parameter is for future implementation of timed reactions
  }, [playCheer, playBoo, playGasp]);

  const setIntensity = useCallback((intensity: string | number) => {
    // Adjust crowd volume based on fight intensity
    let volume = 0.3;
    if (typeof intensity === 'string') {
      switch (intensity) {
        case 'low': volume = 0.2; break;
        case 'medium': volume = 0.4; break;
        case 'high': volume = 0.6; break;
      }
    } else {
      volume = Math.min(0.6, 0.2 + intensity * 0.4);
    }
    
    [crowdCheer.current, crowdBoo.current, crowdGasp.current].forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });
  }, []);

  return {
    playCheer,
    playBoo,
    playGasp,
    playCrowdReaction,
    setIntensity
  };
};