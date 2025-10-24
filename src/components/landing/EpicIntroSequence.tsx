import React, { useEffect, useState } from 'react';
import { ShawBrothersOpening } from './ShawBrothersOpening';
import { CinematicTitleReveal } from './CinematicTitleReveal';
import { FighterLineupPan } from './FighterLineupPan';
import { useIntroSequencer } from '@/hooks/useIntroSequencer';
import { Button } from '@/components/ui/button';
import { SkipForward } from 'lucide-react';

interface EpicIntroSequenceProps {
  onComplete: () => void;
  skipOnRepeat?: boolean;
}

export const EpicIntroSequence: React.FC<EpicIntroSequenceProps> = ({ 
  onComplete,
  skipOnRepeat = true 
}) => {
  const { phase, skip, nextPhase, isComplete } = useIntroSequencer({ 
    onComplete,
    skipOnRepeat 
  });
  const [showSkipHint, setShowSkipHint] = useState(false);

  useEffect(() => {
    // Show skip hint after 2 seconds
    const timer = setTimeout(() => setShowSkipHint(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Background music
  useEffect(() => {
    const music = new Audio('/assets/bmk-soundtrack.mp3');
    music.volume = 0.3;
    music.loop = true;
    
    const playMusic = () => {
      music.play()
        .then(() => console.log('[INTRO] 🎵 Background music playing'))
        .catch((err) => console.warn('[INTRO] ⚠️ Music blocked:', err.message));
    };

    // Start music on title reveal
    if (phase === 'title-reveal') {
      console.log('[INTRO] Starting background music');
      playMusic();
    }

    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }, [phase]);

  if (isComplete) {
    return null;
  }

  return (
    <>
      {/* Skip button */}
      {showSkipHint && (
        <div className="fixed top-4 right-4 z-[60] animate-fade-in">
          <Button
            onClick={skip}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Intro
          </Button>
        </div>
      )}

      {/* Skip hint */}
      {showSkipHint && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <p className="text-sm text-muted-foreground text-center font-retro tracking-wider">
            Press SPACE or double-click to skip
          </p>
        </div>
      )}

      {/* Phases */}
      {phase === 'shaw-brothers' && (
        <ShawBrothersOpening onComplete={nextPhase} />
      )}
      
      {phase === 'title-reveal' && (
        <CinematicTitleReveal onComplete={nextPhase} />
      )}
      
      {phase === 'fighter-lineup' && (
        <FighterLineupPan onComplete={nextPhase} />
      )}
    </>
  );
};
