import React, { useEffect, useState } from 'react';

interface ShawBrothersOpeningProps {
  onComplete: () => void;
}

export const ShawBrothersOpening: React.FC<ShawBrothersOpeningProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'fade-in' | 'hold' | 'fade-out'>('fade-in');

  useEffect(() => {
    // Play gong sound
    const audio = new Audio('/assets/audio/shaw-brothers-intro.mp3');
    audio.volume = 0.7;
    audio.play().catch(() => console.log('Audio blocked'));

    // Phase transitions
    const timer1 = setTimeout(() => setPhase('hold'), 1000);
    const timer2 = setTimeout(() => setPhase('fade-out'), 3500);
    const timer3 = setTimeout(onComplete, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      audio.pause();
    };
  }, [onComplete]);

  const opacity = phase === 'fade-in' ? 'opacity-0' : phase === 'hold' ? 'opacity-100' : 'opacity-0';
  const transition = 'transition-opacity duration-1000';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#8B0000]">
      <div className={`${opacity} ${transition} flex flex-col items-center gap-8`}>
        {/* Shaw Brothers Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#FFD700] blur-3xl opacity-50 animate-neon-pulse" />
          <div className="relative border-4 border-[#FFD700] px-16 py-8 bg-[#8B0000]">
            <h1 className="font-retro text-7xl md:text-9xl font-black text-[#FFD700] tracking-wider"
                style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.5)' }}>
              邵氏兄弟
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-center space-y-2">
          <p className="font-retro text-2xl md:text-4xl text-[#FFD700] tracking-widest"
             style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}>
            KINGSTON FILMS
          </p>
          <p className="font-body text-xl md:text-2xl text-[#FFD700]/80 tracking-wider">
            PRESENTS
          </p>
        </div>

        {/* Decorative lines */}
        <div className="flex gap-4 items-center">
          <div className="w-32 h-px bg-[#FFD700]" />
          <div className="w-3 h-3 bg-[#FFD700] rotate-45" />
          <div className="w-32 h-px bg-[#FFD700]" />
        </div>
      </div>
    </div>
  );
};
