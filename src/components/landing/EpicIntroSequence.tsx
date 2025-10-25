import React, { useEffect, useState, useRef } from 'react';
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
  const battlefieldMusicRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show skip hint after 2 seconds
    const timer = setTimeout(() => setShowSkipHint(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize audio instances once on mount
  useEffect(() => {
    battlefieldMusicRef.current = new Audio('/assets/audio/bmk-champion-loop.mp3');
    battlefieldMusicRef.current.volume = 0;
    battlefieldMusicRef.current.loop = true;
    
    return () => {
      if (battlefieldMusicRef.current) {
        battlefieldMusicRef.current.pause();
        battlefieldMusicRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Battlefield music phase control
  useEffect(() => {
    if (!battlefieldMusicRef.current) return;
    
    if (phase === 'shaw-brothers') {
      const explosionTimer = setTimeout(() => {
        console.log('[INTRO] 💥 TRIGGERING BATTLEFIELD MUSIC EXPLOSION');
        
        battlefieldMusicRef.current!.play()
          .then(() => {
            console.log('[INTRO] 🔥 Battlefield music EXPLODING IN');
            
            // Explosive fade-in
            let volume = 0;
            fadeIntervalRef.current = setInterval(() => {
              volume += 0.05;
              if (volume >= 0.8) {
                volume = 0.8;
                if (fadeIntervalRef.current) {
                  clearInterval(fadeIntervalRef.current);
                }
              }
              if (battlefieldMusicRef.current) {
                battlefieldMusicRef.current.volume = volume;
              }
            }, 50);
          })
          .catch((err) => console.warn('[INTRO] ⚠️ Battlefield music blocked:', err.message));
      }, 25000);
      
      return () => clearTimeout(explosionTimer);
    }
    
    if (phase === 'title-reveal' || phase === 'fighter-lineup') {
      console.log('[INTRO] Battlefield music continues through', phase);
    }
    
    if (phase === 'complete') {
      console.log('[INTRO] 🎵 Fading out battlefield music...');
      
      let volume = battlefieldMusicRef.current?.volume || 0;
      const fadeOut = setInterval(() => {
        volume -= 0.05;
        if (volume <= 0 || !battlefieldMusicRef.current) {
          clearInterval(fadeOut);
          if (battlefieldMusicRef.current) {
            battlefieldMusicRef.current.pause();
            battlefieldMusicRef.current.currentTime = 0;
          }
        } else {
          battlefieldMusicRef.current.volume = volume;
        }
      }, 50);
    }
  }, [phase]);

  // Handle skip - stop all audio immediately
  useEffect(() => {
    if (isComplete) {
      if (battlefieldMusicRef.current) {
        battlefieldMusicRef.current.pause();
        battlefieldMusicRef.current.currentTime = 0;
        battlefieldMusicRef.current.volume = 0;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    }
  }, [isComplete]);

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
