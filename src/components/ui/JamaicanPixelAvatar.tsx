import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import jamaicanAvatarImage from '@/assets/jamaican-avatar.jpg';

interface JamaicanPixelAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  emotion?: 'happy' | 'excited' | 'thinking' | 'greeting' | 'cool' | 'speaking';
  isSpeaking?: boolean;
  isThinking?: boolean;
  showParticles?: boolean;
  disableAnimation?: boolean;
  className?: string;
}

export const JamaicanPixelAvatar: React.FC<JamaicanPixelAvatarProps> = ({
  size = 'md',
  emotion = 'cool',
  isSpeaking = false,
  isThinking = false,
  showParticles = false,
  disableAnimation = false,
  className = ''
}) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [blinkTimer, setBlinkTimer] = useState(0);

  // Animation loop for blinking and movement
  useEffect(() => {
    if (disableAnimation) {
      return; // Don't start animation if disabled
    }
    
    let intervalRef: NodeJS.Timeout;
    
    intervalRef = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 60);
      setBlinkTimer(prev => (prev + 1) % 180);
    }, 100);

    return () => {
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  }, [disableAnimation]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const isBlinking = blinkTimer > 175;
  // Reduced bobbing animation - much subtler
  const bobOffset = disableAnimation ? 0 : Math.sin(animationFrame * 0.05) * 0.5;

  return (
    <div className={cn('relative inline-block', sizeClasses[size], className)}>
      {/* Main Avatar Container */}
      <div 
        className="relative w-full h-full overflow-hidden rounded-lg border-2 border-jamaica-green/50"
        style={{
          transform: `translateY(${bobOffset}px)`,
          imageRendering: 'pixelated',
          filter: emotion === 'excited' ? 'brightness(1.2) saturate(1.3)' : 'none'
        }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-jamaica-green/20 to-jamaica-yellow/20" />
        
        {/* Main Jamaican Face Image */}
        <img 
          src={jamaicanAvatarImage}
          alt="Jamaican Avatar"
          className="w-full h-full object-cover"
          style={{ 
            imageRendering: 'pixelated',
            filter: `${isBlinking ? 'brightness(0.8)' : 'brightness(1)'} ${
              emotion === 'thinking' ? 'sepia(0.3)' : ''
            }`
          }}
        />

        {/* Eye Blink Overlay */}
        {isBlinking && (
          <div className="absolute inset-0 bg-black/30" />
        )}

        {/* Emotion Overlays */}
        {emotion === 'happy' && (
          <div className="absolute inset-0 bg-yellow-400/10 animate-pulse" />
        )}
        
        {emotion === 'excited' && (
          <div className="absolute inset-0 bg-red-400/15 animate-bounce" />
        )}

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
          </div>
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Particle Effects */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-jamaica-yellow rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      )}

      {/* Cultural Glow Effect */}
      <div className="absolute inset-0 rounded-lg shadow-lg shadow-jamaica-green/20 pointer-events-none" />
    </div>
  );
};