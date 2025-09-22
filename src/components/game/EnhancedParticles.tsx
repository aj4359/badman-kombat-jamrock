import React from 'react';

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'impact' | 'special' | 'super' | 'spark' | 'energy';
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface EnhancedParticlesProps {
  particles: ParticleEffect[];
}

export const EnhancedParticles: React.FC<EnhancedParticlesProps> = ({ particles }) => {
  const getParticleStyle = (particle: ParticleEffect) => {
    const opacity = particle.life / particle.maxLife;
    const scale = particle.type === 'impact' ? 1 + (1 - opacity) * 0.5 : 1;
    
    const baseStyle = {
      position: 'absolute' as const,
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      opacity: opacity,
      transform: `scale(${scale})`,
      pointerEvents: 'none' as const,
      zIndex: 20,
    };

    switch (particle.type) {
      case 'impact':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${particle.color}, transparent)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          filter: 'blur(1px)',
        };
      
      case 'special':
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, ${particle.color}, transparent)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          animation: 'neon-pulse 0.5s ease-in-out',
        };
      
      case 'super':
        return {
          ...baseStyle,
          background: `conic-gradient(${particle.color}, transparent, ${particle.color})`,
          borderRadius: '50%',
          boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          animation: 'spin 1s linear infinite',
        };
      
      case 'spark':
        return {
          ...baseStyle,
          background: particle.color,
          borderRadius: '2px',
          transform: `scale(${scale}) rotate(${particle.life * 10}deg)`,
          boxShadow: `0 0 ${particle.size}px ${particle.color}`,
        };
      
      case 'energy':
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, transparent, ${particle.color}, transparent)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          filter: 'blur(0.5px)',
        };
      
      default:
        return baseStyle;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={getParticleStyle(particle)}
        />
      ))}
    </div>
  );
};