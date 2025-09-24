import React, { useState, useEffect } from 'react';

interface RastaAvatarProps {
  isSpeaking?: boolean;
  isThinking?: boolean;
  emotion?: 'happy' | 'excited' | 'thinking' | 'greeting' | 'cool';
  size?: 'sm' | 'md' | 'lg';
  showParticles?: boolean;
}

export const RastaAvatar: React.FC<RastaAvatarProps> = ({
  isSpeaking = false,
  isThinking = false,
  emotion = 'cool',
  size = 'md',
  showParticles = true
}) => {
  const [eyesBlink, setEyesBlink] = useState(false);
  const [dreadsAnimation, setDreadsAnimation] = useState(0);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyesBlink(true);
      setTimeout(() => setEyesBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Dreads sway animation
  useEffect(() => {
    const swayInterval = setInterval(() => {
      setDreadsAnimation(prev => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(swayInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const getEyeState = () => {
    if (eyesBlink) return 'closed';
    if (isThinking) return 'looking-up';
    if (emotion === 'excited') return 'wide';
    return 'normal';
  };

  const getMouthState = () => {
    if (isSpeaking) return 'speaking';
    if (emotion === 'happy' || emotion === 'excited') return 'smile';
    if (emotion === 'thinking') return 'neutral';
    return 'cool';
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
      {/* Particle Effects */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
        {/* Musical Notes */}
        <div className="absolute -top-2 -right-1 animate-bounce delay-100" style={{ color: '#facc15' }}>♪</div>
        <div className="absolute -top-1 -left-2 animate-bounce delay-300" style={{ color: '#22c55e' }}>♫</div>
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 rounded-full blur-md animate-pulse" 
          style={{ 
            background: 'linear-gradient(to right, #22c55e, #facc15, #ef4444)',
            opacity: 0.2 
          }}
        ></div>
        </div>
      )}

      {/* Avatar SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`${sizeClasses[size]} transition-all duration-300 ${
          isSpeaking ? 'animate-bounce' : ''
        }`}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))'
        }}
      >
        {/* Head */}
        <circle
          cx="50"
          cy="45"
          r="22"
          fill="#8B4513"
          stroke="#facc15"
          strokeWidth="1"
        />

        {/* Dreadlocks */}
        <g className={`transition-all duration-500 ${
          dreadsAnimation % 2 === 0 ? 'translate-x-0.5' : '-translate-x-0.5'
        }`}>
          {/* Main dreads */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) - 180;
            const x = 50 + Math.cos(angle * Math.PI / 180) * 20;
            const y = 35 + Math.sin(angle * Math.PI / 180) * 20;
            const length = 15 + (i % 3) * 5;
            
            const colors = ['#22c55e', '#facc15', '#ef4444'];
            
            return (
              <g key={i}>
                <rect
                  x={x - 1.5}
                  y={y}
                  width="3"
                  height={length}
                  fill={colors[i % 3]}
                  rx="1.5"
                  className="animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    transformOrigin: `${x}px ${y}px`,
                    transform: `rotate(${Math.sin(dreadsAnimation + i) * 5}deg)`
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* Rasta Hat */}
        <ellipse
          cx="50"
          cy="25"
          rx="25"
          ry="8"
          fill="#ef4444"
          stroke="#facc15"
          strokeWidth="1"
        />
        <rect x="25" y="25" width="50" height="4" fill="#facc15" />
        <rect x="25" y="29" width="50" height="4" fill="#22c55e" />

        {/* Eyes */}
        <g>
          {getEyeState() === 'closed' ? (
            <>
              <path d="M 42 40 Q 45 42 48 40" stroke="#333" strokeWidth="2" fill="none" />
              <path d="M 52 40 Q 55 42 58 40" stroke="#333" strokeWidth="2" fill="none" />
            </>
          ) : (
            <>
              <circle cx="44" cy="41" r="3" fill="white" />
              <circle cx="56" cy="41" r="3" fill="white" />
              <circle 
                cx={getEyeState() === 'looking-up' ? "44" : "45"} 
                cy={getEyeState() === 'looking-up' ? "39" : "41"} 
                r={getEyeState() === 'wide' ? "2" : "1.5"} 
                fill="#333" 
              />
              <circle 
                cx={getEyeState() === 'looking-up' ? "56" : "55"} 
                cy={getEyeState() === 'looking-up' ? "39" : "41"} 
                r={getEyeState() === 'wide' ? "2" : "1.5"} 
                fill="#333" 
              />
            </>
          )}
        </g>

        {/* Mouth */}
        <g>
          {getMouthState() === 'speaking' && (
            <ellipse 
              cx="50" 
              cy="52" 
              rx="4" 
              ry="3" 
              fill="#333"
              className="animate-pulse"
            />
          )}
          {getMouthState() === 'smile' && (
            <path 
              d="M 45 50 Q 50 55 55 50" 
              stroke="#333" 
              strokeWidth="2" 
              fill="none"
            />
          )}
          {getMouthState() === 'cool' && (
            <path 
              d="M 47 52 L 53 52" 
              stroke="#333" 
              strokeWidth="2"
            />
          )}
          {getMouthState() === 'neutral' && (
            <circle cx="50" cy="52" r="1" fill="#333" />
          )}
        </g>

        {/* Nose */}
        <ellipse cx="50" cy="47" rx="2" ry="1.5" fill="#654321" />

        {/* Beard */}
        <path
          d="M 35 55 Q 50 65 65 55 Q 60 62 50 63 Q 40 62 35 55"
          fill="#333"
          className="transition-all duration-300"
          style={{
            transform: isSpeaking ? 'translateY(1px)' : 'translateY(0)'
          }}
        />

        {/* Sunglasses (when cool) */}
        {emotion === 'cool' && (
          <g>
            <rect x="38" y="38" width="24" height="8" rx="4" fill="#000" opacity="0.8" />
            <circle cx="44" cy="42" r="6" fill="#000" opacity="0.3" />
            <circle cx="56" cy="42" r="6" fill="#000" opacity="0.3" />
          </g>
        )}
      </svg>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -bottom-1 -right-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: '#22c55e' }}></div>
            <div className="w-1 h-1 rounded-full animate-bounce delay-100" style={{ backgroundColor: '#facc15' }}></div>
            <div className="w-1 h-1 rounded-full animate-bounce delay-200" style={{ backgroundColor: '#ef4444' }}></div>
          </div>
        </div>
      )}

      {/* Thinking indicator */}
      {isThinking && (
        <div className="absolute -top-2 -right-2">
          <div 
            className="backdrop-blur rounded-full px-2 py-1 text-xs border"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
              color: '#fff'
            }}
          >
            💭
          </div>
        </div>
      )}
    </div>
  );
};