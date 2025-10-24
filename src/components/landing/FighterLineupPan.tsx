import React, { useEffect, useState } from 'react';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';

interface FighterLineupPanProps {
  onComplete: () => void;
}

export const FighterLineupPan: React.FC<FighterLineupPanProps> = ({ onComplete }) => {
  const [currentFighter, setCurrentFighter] = useState(0);
  const fighters = Object.values(ENHANCED_FIGHTER_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFighter(prev => {
        if (prev >= fighters.length - 1) {
          setTimeout(onComplete, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [fighters.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-background via-card to-background overflow-hidden">
      {/* Title */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <h2 className="font-retro text-4xl md:text-6xl text-primary marvel-glow tracking-wider">
          CHOOSE YOUR FIGHTER
        </h2>
      </div>

      {/* Fighter lineup */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="flex items-end gap-8 md:gap-16 transition-transform duration-1000 ease-out"
          style={{
            transform: `translateX(${-currentFighter * 300}px)`
          }}
        >
          {fighters.map((fighter, index) => {
            const isActive = index === currentFighter;
            const isPast = index < currentFighter;
            const isFuture = index > currentFighter;

            return (
              <div
                key={fighter.id}
                className={`
                  flex flex-col items-center gap-4 transition-all duration-1000
                  ${isActive ? 'scale-125 opacity-100' : 'scale-75 opacity-40'}
                  ${isPast ? 'grayscale' : ''}
                  ${isFuture ? 'blur-sm' : ''}
                `}
              >
                {/* Fighter sprite */}
                <div className="relative">
                  {/* Glow effect */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 blur-3xl animate-neon-pulse"
                      style={{ backgroundColor: fighter.colors.primary, opacity: 0.6 }}
                    />
                  )}
                  
                  {/* Fighter image */}
                  <img
                    src={`/assets/${fighter.id}-sprite.png`}
                    alt={fighter.name}
                    className="relative w-48 h-48 md:w-64 md:h-64 object-contain pixelated"
                    style={{
                      imageRendering: 'pixelated',
                      filter: isActive ? 'drop-shadow(0 0 20px currentColor)' : 'none',
                      color: fighter.colors.primary
                    }}
                    onError={(e) => {
                      // Fallback for missing images
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Accent color glow under fighter */}
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 blur-xl animate-neon-pulse"
                      style={{ backgroundColor: fighter.colors.primary }}
                    />
                  )}
                </div>

                {/* Fighter name */}
                <div 
                  className={`
                    font-retro text-xl md:text-2xl font-bold text-center
                    transition-all duration-500
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{
                    color: fighter.colors.primary,
                    textShadow: isActive ? `0 0 20px ${fighter.colors.primary}` : 'none'
                  }}
                >
                  {fighter.name}
                </div>

                {/* Stats preview */}
                {isActive && (
                  <div className="flex gap-4 animate-fade-in">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{fighter.stats.power}</div>
                      <div className="text-xs text-muted-foreground">POWER</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{fighter.stats.speed}</div>
                      <div className="text-xs text-muted-foreground">SPEED</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{fighter.stats.defense}</div>
                      <div className="text-xs text-muted-foreground">DEFENSE</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {fighters.map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${index <= currentFighter ? 'bg-primary scale-100' : 'bg-muted scale-75'}
            `}
            style={{
              boxShadow: index <= currentFighter ? '0 0 10px hsl(var(--primary))' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
};
