import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioManager } from '@/hooks/useAudioManager';

const VSScreen = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const { isLoaded, playLayer, playEffect } = useAudioManager();

  useEffect(() => {
    // Play Shaw Brothers intro when component mounts
    if (isLoaded) {
      playLayer('intro');
      playEffect('round-start');
    }
  }, [isLoaded, playLayer, playEffect]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Switch to gameplay music and navigate to game
          if (isLoaded) {
            playLayer('gameplay');
          }
          navigate('/game');
          return 0;
        }
        if (prev <= 3) {
          playEffect('round-start');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, isLoaded, playLayer, playEffect]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-background via-primary/10 to-secondary/20">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-cyber opacity-60" />
      <div className="absolute inset-0 retro-grid opacity-20" />
      
      {/* Lightning Effects */}
      <div className="absolute top-10 left-20 w-2 h-32 bg-gradient-to-b from-neon-cyan to-transparent animate-pulse opacity-60" />
      <div className="absolute bottom-10 right-20 w-2 h-32 bg-gradient-to-t from-neon-pink to-transparent animate-pulse opacity-60" />
      <div className="absolute top-1/3 right-10 w-1 h-24 bg-gradient-to-b from-neon-green to-transparent animate-pulse opacity-40" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* VS Display */}
        <div className="mb-12">
          <h1 className="font-retro text-8xl md:text-9xl font-black text-neon-cyan glitch animate-neon-pulse mb-8" data-text="VS">
            VS
          </h1>
        </div>

        {/* Fighter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Fighter 1 - LEROY */}
          <div className="combat-border rounded-lg p-6 bg-card/10 backdrop-blur-sm transform hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-neon-cyan to-neon-green rounded-lg flex items-center justify-center">
                <span className="font-retro text-4xl font-bold text-background">LR</span>
              </div>
              <h3 className="font-retro text-2xl text-neon-cyan mb-2">LEROY</h3>
              <p className="text-neon-green font-body text-sm">RUDE BOY WARRIOR</p>
              <p className="text-muted-foreground font-body text-xs mt-2">Downtown Kingston Champion</p>
            </div>
          </div>

          {/* Fighter 2 - RAZOR */}
          <div className="combat-border rounded-lg p-6 bg-card/10 backdrop-blur-sm transform hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-neon-pink to-neon-purple rounded-lg flex items-center justify-center">
                <span className="font-retro text-4xl font-bold text-background">RZ</span>
              </div>
              <h3 className="font-retro text-2xl text-neon-pink mb-2">RAZOR</h3>
              <p className="text-neon-purple font-body text-sm">BLADE DANCER</p>
              <p className="text-muted-foreground font-body text-xs mt-2">Half Way Tree Assassin</p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <div className="text-6xl font-retro font-black text-neon-green animate-pulse mb-4">
            {countdown}
          </div>
          <div className="text-2xl font-retro text-neon-cyan tracking-wider">
            GET READY FOR KOMBAT!
          </div>
        </div>

        {/* Stage Info */}
        <div className="combat-border rounded-lg p-6 bg-card/10 backdrop-blur-sm max-w-2xl mx-auto">
          <h4 className="font-retro text-xl text-neon-purple mb-2">STAGE: DOWNTOWN KINGSTON</h4>
          <p className="text-muted-foreground font-body text-sm">
            Battle in the neon-lit streets where sound systems clash and warriors prove their worth under the cyberpunk glow of 1980s Jamaica.
          </p>
        </div>
      </div>

      {/* Corner Effects */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-neon-cyan/20 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-radial from-neon-pink/20 to-transparent blur-3xl" />
    </div>
  );
};

export default VSScreen;