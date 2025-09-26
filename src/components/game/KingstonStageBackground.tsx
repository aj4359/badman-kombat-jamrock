import React, { useState, useEffect } from 'react';
import kingstonStreetScene from '@/assets/kingston-street-scene-1.jpg';
import kingstonAlleyScene from '@/assets/kingston-alley-scene.jpg';
import kingstonCommunityScene from '@/assets/kingston-community-scene.jpg';
import kingstonCourtyardScene from '@/assets/kingston-courtyard-scene.jpg';

interface KingstonStageBackgroundProps {
  variant?: 'street' | 'alley' | 'community' | 'courtyard';
  className?: string;
}

export const KingstonStageBackground: React.FC<KingstonStageBackgroundProps> = ({ 
  variant = 'street', 
  className = '' 
}) => {
  const [currentVariant, setCurrentVariant] = useState(variant);

  const backgroundImages = {
    street: kingstonStreetScene,
    alley: kingstonAlleyScene,
    community: kingstonCommunityScene,
    courtyard: kingstonCourtyardScene
  };

  const stageConfigs = {
    street: {
      name: 'KINGSTON STREET',
      description: 'Authentic street vibes',
      overlay: 'from-jamaica-black/60 via-jamaica-black/40 to-jamaica-black/60'
    },
    alley: {
      name: 'TRENCH TOWN ALLEY',
      description: 'Urban battleground',
      overlay: 'from-jamaica-green/40 via-transparent to-jamaica-yellow/40'
    },
    community: {
      name: 'COMMUNITY YARD',
      description: 'Where legends gather',
      overlay: 'from-neon-cyan/30 via-transparent to-neon-pink/30'
    },
    courtyard: {
      name: 'KINGSTON COURTYARD',
      description: 'Cultural heart',
      overlay: 'from-jamaica-red/30 via-transparent to-jamaica-green/30'
    }
  };

  const config = stageConfigs[currentVariant];

  // Cycle through variants for dynamic backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      const variants = Object.keys(stageConfigs) as Array<keyof typeof stageConfigs>;
      const currentIndex = variants.indexOf(currentVariant);
      const nextIndex = (currentIndex + 1) % variants.length;
      setCurrentVariant(variants[nextIndex]);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, [currentVariant]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Main Background Image */}
      <div className="absolute inset-0">
        <img 
          src={backgroundImages[currentVariant]}
          alt={config.name}
          className="w-full h-full object-cover scale-110 animate-fade-in"
          style={{
            filter: 'brightness(0.8) contrast(1.2) saturate(1.1)'
          }}
        />
      </div>

      {/* Cyberpunk Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.overlay}`} />
      
      {/* Retro Grid Effect */}
      <div className="absolute inset-0 retro-grid opacity-20" />

      {/* Neon Accent Lighting */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neon-cyan/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neon-pink/20 to-transparent" />
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-jamaica-green/20 to-transparent" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-jamaica-yellow/20 to-transparent" />
      </div>

      {/* Stage Name Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-background/80 backdrop-blur border border-neon-cyan/30 px-4 py-2 rounded combat-border">
          <div className="text-center">
            <span className="font-retro text-sm text-neon-cyan block">{config.name}</span>
            <span className="font-body text-xs text-muted-foreground">{config.description}</span>
          </div>
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-green rounded-full animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Ground Shadow */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background/60 to-transparent" />
    </div>
  );
};