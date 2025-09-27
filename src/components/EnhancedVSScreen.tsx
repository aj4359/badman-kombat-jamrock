import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAudioManager } from '@/hooks/useAudioManager';

interface VSScreenProps {
  fighters?: {
    player1: any;
    player2: any;
  };
}

export const EnhancedVSScreen: React.FC<VSScreenProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playLayer, playEffect } = useAudioManager();
  const [countdown, setCountdown] = useState(3);
  const [showFighters, setShowFighters] = useState(false);

  // Get enhanced fighter data from character select
  const fighterData = location.state?.fighters || {
    player1: { 
      id: 'leroy', 
      name: 'Leroy "Cyber Storm"',
      colors: { primary: 'hsl(180, 100%, 50%)', secondary: 'hsl(180, 100%, 30%)' }
    },
    player2: { 
      id: 'jordan', 
      name: 'Jordan "Sound Master"',
      colors: { primary: 'hsl(270, 100%, 60%)', secondary: 'hsl(270, 100%, 40%)' }
    }
  };

  useEffect(() => {
    // Play Shaw Brothers intro ONCE (NO LOOP)
    playLayer('intro', false);
    
    // Show fighters with delay
    const showTimer = setTimeout(() => {
      setShowFighters(true);
    }, 500);

    // Start countdown (NO BELL SOUNDS)
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setTimeout(() => {
            navigate('/game', {
              state: {
                fighterData,
                integratedMode: true,
                gameMode: location.state?.gameMode || 'versus',
                startFight: true
              }
            });
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(countdownTimer);
    };
  }, [navigate, playLayer, fighterData, location.state]);

  return (
    <div className="min-h-screen bg-gradient-cyber flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-transparent to-neon-pink/20 animate-pulse" />
      </div>

      {/* VS Screen Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-retro font-bold text-neon-cyan mb-4 glitch animate-pulse" 
              data-text="VERSUS">
            VERSUS
          </h1>
          <div className="text-2xl font-retro text-neon-pink">
            KINGSTON KOMBAT RISING
          </div>
        </div>

        {/* Fighter Display */}
        <div className={`grid grid-cols-3 items-center gap-8 mb-12 transition-all duration-1000 ${
          showFighters ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          
          {/* Player 1 */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-lg border-4 border-neon-cyan bg-black/50 
                            flex items-center justify-center overflow-hidden">
                {fighterData.player1.image && (
                  <img 
                    src={fighterData.player1.image} 
                    alt={fighterData.player1.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-retro font-bold text-neon-cyan">
                {fighterData.player1.name}
              </h2>
              <p className="text-neon-cyan/80">
                {fighterData.player1.title}
              </p>
              <div className="text-sm text-foreground/60">
                PLAYER 1
              </div>
            </div>
          </div>

          {/* VS Symbol */}
          <div className="text-center">
            <div className="text-8xl font-retro font-bold text-neon-pink mb-4 animate-pulse">
              VS
            </div>
            
            {/* Countdown */}
            {countdown > 0 && (
              <div className="text-6xl font-retro font-bold text-neon-cyan animate-pulse">
                {countdown}
              </div>
            )}
            
            {countdown === 0 && (
              <div className="text-4xl font-retro font-bold text-neon-pink animate-pulse">
                FIGHT!
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-lg border-4 border-neon-pink bg-black/50 
                            flex items-center justify-center overflow-hidden">
                {fighterData.player2.image && (
                  <img 
                    src={fighterData.player2.image} 
                    alt={fighterData.player2.name}
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-retro font-bold text-neon-pink">
                {fighterData.player2.name}
              </h2>
              <p className="text-neon-pink/80">
                {fighterData.player2.title}
              </p>
              <div className="text-sm text-foreground/60">
                PLAYER 2
              </div>
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/game', { 
              state: { 
                fighterData, 
                integratedMode: true,
                gameMode: location.state?.gameMode || 'versus' 
              } 
            })}
            className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black 
                     transition-all duration-300"
          >
            Skip Intro
          </Button>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-neon-cyan rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};