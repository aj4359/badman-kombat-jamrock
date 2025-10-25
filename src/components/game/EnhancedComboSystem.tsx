import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ParticleBurst } from './ParticleBurst';

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
        
        setTimeout(() => setShowRating(false), 1500);
      }
    } else {
      setShowRating(false);
      setCurrentRating(null);
    }
  }, [comboCount, currentRating]);

  if (comboCount < 2) return null;

  const decayPercentage = (comboDecay / 60) * 100;
  const scale = 1 + Math.min(comboCount * 0.05, 0.8);
  const pulseScale = 1 + Math.sin(Date.now() / 100) * 0.15;
  const isLegendary = comboCount >= 20;
  
  return (
    <>
      {/* Legendary Screen-Wide Banner */}
      {isLegendary && (
        <div className="fixed top-0 left-0 right-0 z-[100] animate-fade-in">
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 py-6 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl font-black text-white animate-pulse uppercase tracking-widest"
                   style={{ 
                     textShadow: '0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.8), 0 4px 10px rgba(0,0,0,0.5)',
                     animation: 'bounce 0.5s infinite'
                   }}>
                ⚡⚡⚡ LEGENDARY COMBO ACTIVATED ⚡⚡⚡
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Combo Display - CENTER-TOP, HUGE SIZE */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
           style={{ 
             transform: `translate(-50%, 0) scale(${scale * pulseScale})`,
             transition: 'transform 0.1s ease-out'
           }}>
        <div className="relative">
          {/* Intense Glow Background - Pulsing */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/70 to-orange-500/70 blur-3xl animate-pulse" 
               style={{ transform: `scale(${pulseScale * 1.2})` }} />
          
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-400/40 via-orange-500/20 to-transparent blur-2xl"
               style={{ transform: `scale(${pulseScale * 1.5})` }} />
          
          {/* Main Display Container */}
          <div className="relative bg-gradient-to-b from-black/95 to-black/90 rounded-3xl px-16 py-8 border-8 border-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.8)]">
            {/* Combo Count - MASSIVE 180px */}
            <div className="text-center">
              <div className="text-[180px] font-black text-yellow-300 leading-none"
                   style={{ 
                     textShadow: '0 0 40px currentColor, 0 0 80px currentColor, 0 8px 20px rgba(0,0,0,0.8)',
                     WebkitTextStroke: '4px rgba(0,0,0,0.5)'
                   }}>
                {comboCount}
              </div>
              
              {/* Rating Text - Bigger and bolder */}
              <div className="text-4xl font-black tracking-widest uppercase text-orange-400 mt-2"
                   style={{ textShadow: '0 0 20px currentColor, 0 4px 8px rgba(0,0,0,0.8)' }}>
                {currentRating?.text || 'COMBO!'}
              </div>
              
              {/* Damage Display - More prominent */}
              <div className="text-white text-3xl font-bold mt-3"
                   style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                {comboDamage.toFixed(0)} DAMAGE
              </div>
            </div>
            
            {/* Combo Decay Bar - Larger and more visible */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-80 h-4 bg-gray-900/80 rounded-full overflow-hidden border-2 border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 transition-all duration-100 shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                style={{ width: `${decayPercentage}%` }}
              />
            </div>
            
            {/* Milestone Indicators */}
            {comboCount >= 5 && comboCount % 5 === 0 && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="text-6xl">🌟</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Particle Burst on Milestone */}
      {comboCount % 5 === 0 && comboCount >= 5 && (
        <ParticleBurst count={comboCount} />
      )}
    </>
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