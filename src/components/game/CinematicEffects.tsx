import { useEffect, useState } from 'react';

interface CinematicEffectsProps {
  showFilmGrain?: boolean;
  showVignette?: boolean;
  colorGrade?: 'johnwick' | 'normal' | 'desaturated';
  bulletTime?: boolean;
  killCount?: number;
  comboCount?: number;
  showHeadshot?: boolean;
}

export const CinematicEffects = ({
  showFilmGrain = true,
  showVignette = true,
  colorGrade = 'johnwick',
  bulletTime = false,
  killCount = 0,
  comboCount = 0,
  showHeadshot = false
}: CinematicEffectsProps) => {
  const [headshotVisible, setHeadshotVisible] = useState(false);

  useEffect(() => {
    if (showHeadshot) {
      setHeadshotVisible(true);
      const timer = setTimeout(() => setHeadshotVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [showHeadshot]);

  return (
    <>
      {/* Film Grain */}
      {showFilmGrain && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
            animation: 'grain 0.5s steps(10) infinite'
          }}
        />
      )}

      {/* Vignette */}
      {showVignette && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)'
          }}
        />
      )}

      {/* Color Grade Overlay */}
      {colorGrade === 'johnwick' && (
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(139,0,0,0.3), rgba(255,140,0,0.2))'
          }}
        />
      )}

      {/* Bullet Time Effect */}
      {bulletTime && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-2xl">
            BULLET TIME
          </div>
        </div>
      )}

      {/* Kill Counter */}
      {killCount > 0 && (
        <div className="absolute top-8 right-8 bg-black/80 border-2 border-red-600 px-6 py-3 rounded">
          <div className="text-red-500 font-bold text-sm">ELIMINATIONS</div>
          <div className="text-white font-bold text-4xl text-center">{killCount}</div>
        </div>
      )}

      {/* Combo Counter */}
      {comboCount > 0 && (
        <div className="absolute top-32 right-8 bg-black/80 border-2 border-orange-600 px-6 py-3 rounded">
          <div className="text-orange-500 font-bold text-sm">COMBO</div>
          <div className="text-white font-bold text-4xl text-center animate-pulse">{comboCount}</div>
        </div>
      )}

      {/* Headshot Indicator */}
      {headshotVisible && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-scale-in">
          <div className="text-red-600 font-bold text-6xl tracking-wider drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]">
            💀 HEADSHOT 💀
          </div>
        </div>
      )}

      {/* Continental Logo Watermark */}
      <div className="absolute bottom-8 left-8 opacity-30">
        <div className="text-white font-serif text-xl">THE CONTINENTAL</div>
      </div>
    </>
  );
};
