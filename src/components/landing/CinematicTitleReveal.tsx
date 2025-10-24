import React, { useEffect, useState } from 'react';

interface CinematicTitleRevealProps {
  onComplete: () => void;
}

export const CinematicTitleReveal: React.FC<CinematicTitleRevealProps> = ({ onComplete }) => {
  const [letters, setLetters] = useState<string[]>([]);
  const [subtitle, setSubtitle] = useState('');
  const [shake, setShake] = useState(false);
  const [zoom, setZoom] = useState(1.5);

  const fullTitle = ['B', 'A', 'D', 'M', 'A', 'N', ' ', 'K', 'O', 'M', 'B', 'A', 'T'];
  const fullSubtitle = 'WHERE STREET FIGHTING MEETS JAMAICAN SOUL';

  useEffect(() => {
    console.log('[INTRO] 🔥 Title Reveal phase started');
    
    // Zoom in animation
    const zoomInterval = setInterval(() => {
      setZoom(prev => Math.max(1, prev - 0.01));
    }, 50);

    // Letter by letter reveal
    fullTitle.forEach((letter, index) => {
      setTimeout(() => {
        setLetters(prev => [...prev, letter]);
        if (index === 6) console.log('[INTRO] Title: BADMAN revealed');
        if (index === fullTitle.length - 1) console.log('[INTRO] Title: KOMBAT revealed');
        if (index === 6 || index === fullTitle.length - 1) {
          setShake(true);
          setTimeout(() => setShake(false), 200);
        }
      }, 500 + index * 150);
    });

    // Subtitle typewriter
    setTimeout(() => {
      console.log('[INTRO] Subtitle typing started');
      let currentText = '';
      fullSubtitle.split('').forEach((char, index) => {
        setTimeout(() => {
          currentText += char;
          setSubtitle(currentText);
        }, index * 50);
      });
    }, 3500);

    // Complete
    setTimeout(() => {
      console.log('[INTRO] ✅ Title Reveal complete');
      onComplete();
    }, 8000);

    return () => clearInterval(zoomInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background">
      {/* Background - Kingston Street Scene */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/kingston-street-scene-1.jpg)',
          transform: `scale(${zoom})`,
          transition: 'transform 0.05s linear',
          filter: 'brightness(0.3) blur(2px)'
        }}
      />

      {/* Particle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`transform ${shake ? 'animate-[wiggle_0.2s_ease-in-out]' : ''}`}>
          <h1 className="font-retro text-8xl md:text-[200px] font-black tracking-wider text-center leading-none">
            {letters.map((letter, index) => {
              const isSpace = letter === ' ';
              const colors = [
                'text-primary',
                'text-secondary', 
                'text-accent',
                'text-[hsl(var(--neon-orange))]',
                'text-[hsl(var(--neon-purple))]'
              ];
              const color = colors[index % colors.length];
              
              return (
                <span
                  key={index}
                  className={`inline-block ${isSpace ? 'w-8' : color} animate-scale-in`}
                  style={{
                    textShadow: `
                      0 0 20px currentColor,
                      0 0 40px currentColor,
                      0 0 60px currentColor,
                      0 0 80px currentColor
                    `,
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'backwards'
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </h1>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="font-retro text-xl md:text-3xl text-foreground/80 mt-8 tracking-[0.3em] text-center px-4"
             style={{ textShadow: '0 0 10px hsl(var(--primary))' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
