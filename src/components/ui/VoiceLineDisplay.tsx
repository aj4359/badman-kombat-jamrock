import React from 'react';

interface VoiceLineDisplayProps {
  text: string;
  player: 1 | 2;
  onComplete: () => void;
}

export const VoiceLineDisplay: React.FC<VoiceLineDisplayProps> = ({ text, player, onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2000); // Show for 2 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`absolute z-30 font-retro text-xl font-bold animate-fade-in ${
        player === 1 
          ? 'left-8 top-1/3 text-neon-cyan' 
          : 'right-8 top-1/3 text-neon-pink'
      }`}
      style={{
        textShadow: player === 1 
          ? '0 0 10px hsl(var(--neon-cyan))' 
          : '0 0 10px hsl(var(--neon-pink))',
        animation: 'fade-in 0.3s ease-out, scale-in 0.2s ease-out'
      }}
    >
      <div className="bg-background/80 backdrop-blur border border-current/30 rounded px-4 py-2">
        {text}
      </div>
    </div>
  );
};