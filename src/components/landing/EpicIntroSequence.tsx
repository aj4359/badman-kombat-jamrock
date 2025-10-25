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

  // Background music with battlefield explosion at Shaw Brothers climax
  useEffect(() => {
    const battlefieldMusic = new Audio('/assets/audio/bmk-champion-loop.mp3');
    battlefieldMusic.volume = 0;
    battlefieldMusic.loop = true;
    
    const ambientMusic = new Audio('/assets/bmk-soundtrack.mp3');
    ambientMusic.volume = 0.3;
    ambientMusic.loop = true;
    
    const playBattlefieldMusic = () => {
      battlefieldMusic.play()
        .then(() => {
          console.log('[INTRO] 🔥 Battlefield music EXPLODING IN');
          // Explosive fade-in
          let volume = 0;
          const fadeIn = setInterval(() => {
            volume += 0.05;
            if (volume >= 0.8) {
              volume = 0.8;
              clearInterval(fadeIn);
            }
            battlefieldMusic.volume = volume;
          }, 50);
        })
        .catch((err) => console.warn('[INTRO] ⚠️ Battlefield music blocked:', err.message));
    };
    
    const playAmbientMusic = () => {
      ambientMusic.play()
        .then(() => console.log('[INTRO] 🎵 Ambient background music playing'))
        .catch((err) => console.warn('[INTRO] ⚠️ Music blocked:', err.message));
    };

    // Start battlefield music explosion at 25s mark during Shaw Brothers
    if (phase === 'shaw-brothers') {
      const explosionTimer = setTimeout(() => {
        console.log('[INTRO] 💥 TRIGGERING BATTLEFIELD MUSIC EXPLOSION');
        playBattlefieldMusic();
      }, 25000); // Explode at 25 seconds
      
      return () => {
        clearTimeout(explosionTimer);
        battlefieldMusic.pause();
        battlefieldMusic.currentTime = 0;
      };
    }
    
    // Continue battlefield music through title and fighter phases
    if (phase === 'title-reveal' || phase === 'fighter-lineup') {
      // Battlefield music should already be playing from Shaw Brothers phase
      console.log('[INTRO] Continuing battlefield music through', phase);
    }

    return () => {
      battlefieldMusic.pause();
      ambientMusic.pause();
      battlefieldMusic.currentTime = 0;
      ambientMusic.currentTime = 0;
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
