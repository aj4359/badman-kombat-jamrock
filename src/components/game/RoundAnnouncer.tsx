import React, { useEffect, useState } from 'react';

interface RoundAnnouncerProps {
  round: number;
  phase: 'intro' | 'fight' | 'ko' | 'victory' | null;
  winner?: string;
  onComplete: () => void;
}

export const RoundAnnouncer: React.FC<RoundAnnouncerProps> = ({ round, phase, winner, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!phase) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300); // Allow fade out
    }, phase === 'intro' ? 2000 : phase === 'ko' ? 1500 : 3000);

    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (!phase || !visible) return null;

  const getContent = () => {
    switch (phase) {
      case 'intro':
        return {
          main: `ROUND ${round}`,
          sub: 'READY...',
          color: 'neon-cyan',
          size: 'text-6xl md:text-8xl'
        };
      case 'fight':
        return {
          main: 'FIGHT!',
          sub: '',
          color: 'neon-pink',
          size: 'text-7xl md:text-9xl'
        };
      case 'ko':
        return {
          main: 'K.O.!',
          sub: '',
          color: 'destructive',
          size: 'text-6xl md:text-8xl'
        };
      case 'victory':
        return {
          main: `${winner} WINS!`,
          sub: 'PERFECT!',
          color: 'neon-green',
          size: 'text-5xl md:text-7xl'
        };
      default:
        return { main: '', sub: '', color: 'neon-cyan', size: 'text-6xl' };
    }
  };

  const content = getContent();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="text-center">
        <div className={`font-retro font-black ${content.size} text-${content.color} animate-scale-in`}
             style={{
               textShadow: `0 0 20px hsl(var(--${content.color})), 0 0 40px hsl(var(--${content.color}))`,
               animation: 'fade-in 0.3s ease-out, scale-in 0.2s ease-out'
             }}>
          {content.main}
        </div>
        {content.sub && (
          <div className="font-retro text-xl md:text-2xl text-foreground/80 mt-2 animate-fade-in"
               style={{ animationDelay: '0.2s' }}>
            {content.sub}
          </div>
        )}
      </div>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" />
    </div>
  );
};