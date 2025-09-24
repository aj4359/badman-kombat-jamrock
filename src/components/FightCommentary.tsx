import React, { useState, useEffect } from 'react';

interface FightCommentaryProps {
  isVisible: boolean;
  onComplete: () => void;
}

const JAMAICAN_SHOUTS = [
  "RASSCLAART!",
  "BOMBOCLAART!",
  "BUMBACLAART!",
  "PUSSYCLAART!", 
  "MI CORN TOE!",
  "SUCK YA MUDDA!",
  "WOI YOI YOI!",
  "BIG UP!",
  "MADNESS!",
  "BLOODFIRE!",
  "WAH GWAAN!",
  "IRIE TING!",
  "BOOM SHAKALAKA!"
];

export const FightCommentary: React.FC<FightCommentaryProps> = ({ 
  isVisible, 
  onComplete 
}) => {
  const [currentShout, setCurrentShout] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const randomShout = JAMAICAN_SHOUTS[Math.floor(Math.random() * JAMAICAN_SHOUTS.length)];
      setCurrentShout(randomShout);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible || !currentShout) return null;

  return (
    <div 
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none ${
        isAnimating ? 'animate-pulse' : ''
      }`}
    >
      <div 
        className="text-6xl font-black text-center"
        style={{
          color: '#FFD700',
          textShadow: `
            4px 4px 0px #FF4500,
            -4px -4px 0px #FF4500,
            4px -4px 0px #FF4500,
            -4px 4px 0px #FF4500,
            0px 0px 20px #FFFF00,
            0px 0px 40px #FF4500
          `,
          filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
          transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
          transition: 'all 0.3s ease-out'
        }}
      >
        {currentShout}
      </div>
      
      {/* Reggae colors background effect */}
      <div 
        className="absolute inset-0 -z-10 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, #FF4500 50%, #00FF00 100%)',
          filter: 'blur(20px)',
          transform: 'scale(2)',
          animation: isAnimating ? 'pulse 0.5s infinite' : 'none'
        }}
      />
    </div>
  );
};