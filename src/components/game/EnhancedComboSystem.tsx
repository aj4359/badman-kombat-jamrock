import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ComboDisplayProps {
  comboCount: number;
  comboDamage: number;
  comboDecay: number;
  playerSide: 'left' | 'right';
  isActive: boolean;
}

interface ComboRating {
  text: string;
  color: string;
  threshold: number;
}

const COMBO_RATINGS: ComboRating[] = [
  { text: 'NICE!', color: 'text-neon-cyan', threshold: 2 },
  { text: 'GOOD!', color: 'text-neon-green', threshold: 4 },
  { text: 'GREAT!', color: 'text-neon-yellow', threshold: 6 },
  { text: 'EXCELLENT!', color: 'text-neon-orange', threshold: 8 },
  { text: 'AMAZING!', color: 'text-neon-pink', threshold: 12 },
  { text: 'INCREDIBLE!', color: 'text-neon-purple', threshold: 16 },
  { text: 'LEGENDARY!', color: 'text-red-400', threshold: 20 }
];

export const EnhancedComboDisplay: React.FC<ComboDisplayProps> = ({
  comboCount,
  comboDamage,
  comboDecay,
  playerSide,
  isActive
}) => {
  const [showRating, setShowRating] = useState(false);
  const [currentRating, setCurrentRating] = useState<ComboRating | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (comboCount >= 2) {
      const rating = COMBO_RATINGS
        .slice()
        .reverse()
        .find(r => comboCount >= r.threshold);
      
      if (rating && rating !== currentRating) {
        setCurrentRating(rating);
        setShowRating(true);
        setAnimationKey(prev => prev + 1);
        
        // Hide rating after 1.5 seconds
        setTimeout(() => setShowRating(false), 1500);
      }
    } else {
      setShowRating(false);
      setCurrentRating(null);
    }
  }, [comboCount, currentRating]);

  if (comboCount < 2) return null;

  const decayPercentage = (comboDecay / 60) * 100;
  
  return (
    <div className={cn(
      'absolute z-30 flex flex-col items-center transition-all duration-300',
      playerSide === 'left' ? 'left-8 top-32' : 'right-8 top-32',
      isActive ? 'scale-110' : 'scale-100'
    )}>
      {/* Main Combo Counter */}
      <div className={cn(
        'bg-black/80 backdrop-blur border-2 rounded-lg px-6 py-3 mb-2',
        playerSide === 'left' ? 'border-neon-cyan' : 'border-neon-pink',
        'animate-pulse'
      )}>
        <div className="text-center">
          <div className={cn(
            'text-3xl font-retro font-bold',
            playerSide === 'left' ? 'text-neon-cyan' : 'text-neon-pink'
          )}>
            {comboCount}
          </div>
          <div className="text-sm font-retro text-white/80">
            HIT COMBO
          </div>
          <div className="text-xs text-white/60">
            {comboDamage} DMG
          </div>
        </div>
        
        {/* Decay Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-100 rounded-full',
              playerSide === 'left' ? 'bg-neon-cyan' : 'bg-neon-pink'
            )}
            style={{ width: `${decayPercentage}%` }}
          />
        </div>
      </div>

      {/* Combo Rating */}
      {showRating && currentRating && (
        <div 
          key={animationKey}
          className={cn(
            'text-2xl font-retro font-bold animate-bounce',
            currentRating.color,
            'drop-shadow-lg'
          )}
          style={{
            animation: 'bounce 0.5s ease-out, fadeOut 1.5s ease-in 0.5s forwards'
          }}
        >
          {currentRating.text}
        </div>
      )}

      {/* Floating Damage Numbers */}
      {comboCount > 0 && (
        <style>
          {`
            @keyframes fadeOut {
              to {
                opacity: 0;
                transform: translateY(-20px);
              }
            }
          `}
        </style>
      )}
    </div>
  );
};

interface FloatingTextProps {
  text: string;
  x: number;
  y: number;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  x,
  y,
  color,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div
      className={cn(
        'absolute pointer-events-none z-40 font-retro font-bold',
        sizeClasses[size],
        color,
        'drop-shadow-lg animate-bounce'
      )}
      style={{
        left: x,
        top: y,
        animation: 'floatUp 1s ease-out forwards'
      }}
    >
      {text}
      <style>
        {`
          @keyframes floatUp {
            0% {
              opacity: 1;
              transform: translateY(0px) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateY(-30px) scale(1.2);
            }
            100% {
              opacity: 0;
              transform: translateY(-60px) scale(0.8);
            }
          }
        `}
      </style>
    </div>
  );
};

interface ComboFeedbackProps {
  comboEvents: Array<{
    id: string;
    type: 'hit' | 'special' | 'super' | 'perfect';
    damage: number;
    timestamp: number;
  }>;
}

export const ComboFeedback: React.FC<ComboFeedbackProps> = ({ comboEvents }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
      {comboEvents.map((event) => (
        <FloatingText
          key={event.id}
          text={`${event.damage}`}
          x={Math.random() * 100}
          y={0}
          color={
            event.type === 'super' ? 'text-red-400' :
            event.type === 'special' ? 'text-neon-yellow' :
            event.type === 'perfect' ? 'text-neon-green' :
            'text-white'
          }
          size={event.type === 'super' ? 'lg' : 'md'}
        />
      ))}
    </div>
  );
};