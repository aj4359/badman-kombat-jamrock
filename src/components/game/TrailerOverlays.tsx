import React, { useEffect, useState } from 'react';
import { AnimatedText } from '@/components/ui/AnimatedText';

interface TrailerOverlaysProps {
  phase: 'title' | 'intro' | 'gameplay' | 'victory' | 'credits' | 'none';
  fighterName?: string;
  comboCount?: number;
  isSlowMotion?: boolean;
}

export const TrailerOverlays: React.FC<TrailerOverlaysProps> = ({
  phase,
  fighterName,
  comboCount,
  isSlowMotion
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [phase]);

  if (phase === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Opening Title */}
      {phase === 'title' && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center animate-fade-in">
            <h1 className="text-8xl font-bold text-white mb-4 tracking-wider glitch-effect">
              BLUE MOUNTAIN
            </h1>
            <h2 className="text-6xl font-bold text-yellow-400 tracking-widest">
              KOMBAT
            </h2>
          </div>
        </div>
      )}

      {/* Fighter Introduction */}
      {phase === 'intro' && fighterName && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 px-8 py-4 border-4 border-yellow-400 animate-slide-in-right">
            <AnimatedText
              text={fighterName}
              className="text-4xl font-bold text-yellow-400 tracking-widest"
            />
          </div>
        </div>
      )}

      {/* Combo Counter (Enlarged) */}
      {phase === 'gameplay' && comboCount && comboCount > 1 && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
          <div className="text-center animate-scale-in">
            <div className="text-8xl font-bold text-yellow-400 stroke-text">
              {comboCount}
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              COMBO HITS!
            </div>
          </div>
        </div>
      )}

      {/* Slow Motion Indicator */}
      {isSlowMotion && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-9xl text-red-500 animate-pulse font-bold">
            !
          </div>
        </div>
      )}

      {/* Victory Phase */}
      {phase === 'victory' && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center animate-fade-in">
            <h2 className="text-7xl font-bold text-yellow-400 mb-4">
              VICTORY
            </h2>
          </div>
        </div>
      )}

      {/* Closing Credits */}
      {phase === 'credits' && (
        <div className="flex flex-col items-center justify-center h-full bg-black/90 animate-fade-in">
          <h2 className="text-6xl font-bold text-white mb-8 tracking-widest">
            COMING SOON
          </h2>
          <div className="text-2xl text-yellow-400 mb-4">
            WEB & MOBILE
          </div>
          <div className="text-xl text-white/70">
            @BlueMountainKombat
          </div>
        </div>
      )}

      {/* Recording Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white text-sm font-mono">[REC]</span>
      </div>
    </div>
  );
};
