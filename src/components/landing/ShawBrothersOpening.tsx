import React, { useEffect, useState, useRef } from 'react';

interface ShawBrothersOpeningProps {
  onComplete: () => void;
}

export const ShawBrothersOpening: React.FC<ShawBrothersOpeningProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'fade-in' | 'hold' | 'fade-out'>('fade-in');
  const gongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('[INTRO] 🎬 Shaw Brothers phase started - EXTENDED 28s VERSION');
    
    // Create audio instance once
    gongAudioRef.current = new Audio('/assets/audio/shaw-brothers-intro.mp3');
    gongAudioRef.current.volume = 0.7;
    
    const playGong = () => {
      if (gongAudioRef.current) {
        gongAudioRef.current.currentTime = 0;
        gongAudioRef.current.play()
          .then(() => console.log('[INTRO] ✅ Gong playing'))
          .catch((err) => console.warn('[INTRO] ⚠️ Gong blocked:', err.message));
      }
    };
    
    playGong();
    
    // Loop gong every 3 seconds during hold phase
    const gongInterval = setInterval(() => {
      if (phase === 'hold') {
        playGong();
      }
    }, 3000);

    // Phase transitions - EXTENDED to 28 seconds total
    const timer1 = setTimeout(() => {
      console.log('[INTRO] Shaw Brothers: fade-in → hold');
      setPhase('hold');
    }, 1500);
    
    const timer2 = setTimeout(() => {
      console.log('[INTRO] Shaw Brothers: hold → fade-out');
      setPhase('fade-out');
    }, 25000); // Extended from 6s to 25s
    
    const timer3 = setTimeout(() => {
      console.log('[INTRO] ✅ Shaw Brothers complete');
      onComplete();
    }, 28000); // Extended from 8s to 28s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(gongInterval);
      if (gongAudioRef.current) {
        gongAudioRef.current.pause();
        gongAudioRef.current = null;
      }
    };
  }, [onComplete]);

  const opacity = phase === 'fade-in' ? 'opacity-0' : phase === 'hold' ? 'opacity-100' : 'opacity-0';
  const transition = 'transition-opacity duration-1000';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#8B0000] overflow-hidden">
      {/* Explosion flash at 25 second mark */}
      {phase === 'fade-out' && (
        <div className="absolute inset-0 bg-white animate-flash z-[100]" />
      )}
      
      <div className={`${opacity} ${transition} flex flex-col items-center gap-8 ${phase === 'hold' ? 'animate-pulse' : ''}`}>
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
            TA GURULABS
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
