import { useState, useEffect, useCallback } from 'react';

export type IntroPhase = 'shaw-brothers' | 'title-reveal' | 'fighter-lineup' | 'complete';

interface IntroSequencerOptions {
  onComplete: () => void;
  skipOnRepeat?: boolean;
}

export const useIntroSequencer = ({ onComplete, skipOnRepeat = true }: IntroSequencerOptions) => {
  const [phase, setPhase] = useState<IntroPhase>('shaw-brothers');
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // Check if intro has been seen before
    if (skipOnRepeat) {
      const hasSeenIntro = localStorage.getItem('bmk-intro-seen');
      if (hasSeenIntro === 'true') {
        skip();
      }
    }
  }, [skipOnRepeat]);

  const skip = useCallback(() => {
    setIsSkipped(true);
    setPhase('complete');
    onComplete();
  }, [onComplete]);

  const nextPhase = useCallback(() => {
    setPhase(current => {
      switch (current) {
        case 'shaw-brothers':
          return 'title-reveal';
        case 'title-reveal':
          return 'fighter-lineup';
        case 'fighter-lineup':
          // Mark intro as seen
          localStorage.setItem('bmk-intro-seen', 'true');
          setTimeout(onComplete, 0);
          return 'complete';
        default:
          return 'complete';
      }
    });
  }, [onComplete]);

  // Keyboard skip handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
        e.preventDefault();
        skip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [skip]);

  // Mouse click skip handler
  useEffect(() => {
    let clickCount = 0;
    const handleClick = () => {
      clickCount++;
      if (clickCount >= 2) {
        skip();
      }
      setTimeout(() => { clickCount = 0; }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [skip]);

  return {
    phase,
    isSkipped,
    skip,
    nextPhase,
    isComplete: phase === 'complete'
  };
};
