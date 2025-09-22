import React from 'react';

interface StageBackgroundProps {
  stage: 'trench-town' | 'spanish-town' | 'kingston-harbor';
}

export const StageBackground: React.FC<StageBackgroundProps> = ({ stage }) => {
  const getStageConfig = () => {
    switch (stage) {
      case 'trench-town':
        return {
          name: 'TRENCH TOWN YARD',
          gradient: 'from-jamaica-green via-background to-jamaica-yellow',
          pattern: 'retro-grid',
          elements: [
            { type: 'building', x: 10, y: 60, width: 80, height: 40, color: 'muted' },
            { type: 'palm', x: 75, y: 40, width: 15, height: 60, color: 'jamaica-green' },
            { type: 'sound-system', x: 5, y: 80, width: 25, height: 20, color: 'neon-cyan' },
          ]
        };
      case 'spanish-town':
        return {
          name: 'SPANISH TOWN SQUARE',
          gradient: 'from-neon-orange via-background to-neon-pink',
          pattern: 'retro-grid',
          elements: [
            { type: 'church', x: 20, y: 30, width: 60, height: 70, color: 'muted' },
            { type: 'statue', x: 45, y: 70, width: 10, height: 30, color: 'accent' },
            { type: 'market', x: 5, y: 85, width: 30, height: 15, color: 'jamaica-red' },
          ]
        };
      case 'kingston-harbor':
        return {
          name: 'KINGSTON HARBOR',
          gradient: 'from-neon-cyan via-background to-neon-purple',
          pattern: 'retro-grid',
          elements: [
            { type: 'ship', x: 60, y: 70, width: 35, height: 20, color: 'muted' },
            { type: 'lighthouse', x: 5, y: 20, width: 12, height: 80, color: 'neon-pink' },
            { type: 'crane', x: 80, y: 40, width: 15, height: 60, color: 'accent' },
          ]
        };
      default:
        return getStageConfig();
    }
  };

  const config = getStageConfig();

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} ${config.pattern}`}>
      {/* Stage Name Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-background/80 backdrop-blur border border-neon-cyan/30 px-4 py-1 rounded">
          <span className="font-retro text-sm text-neon-cyan">{config.name}</span>
        </div>
      </div>

      {/* Stage Elements */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        {config.elements.map((element, index) => (
          <rect
            key={index}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            className={`fill-${element.color} opacity-60`}
            style={{
              filter: 'drop-shadow(0 0 10px currentColor)',
            }}
          />
        ))}
      </svg>

      {/* Atmospheric Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      
      {/* Stage-specific animated elements */}
      {stage === 'trench-town' && (
        <div className="absolute bottom-10 left-5 w-6 h-6 bg-neon-green rounded-full animate-pulse opacity-70" />
      )}
      {stage === 'kingston-harbor' && (
        <div className="absolute top-20 right-10 w-4 h-4 bg-neon-cyan rounded-full animate-ping opacity-50" />
      )}
    </div>
  );
};