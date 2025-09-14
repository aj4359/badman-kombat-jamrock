import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VSScreen = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/game');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-cyber flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 retro-grid opacity-20" />
      
      <div className="text-center z-10">
        {/* VS Logo */}
        <div className="mb-12">
          <h1 className="text-9xl font-retro font-bold text-neon-pink animate-neon-pulse glitch" data-text="VS">
            VS
          </h1>
        </div>

        {/* Fighter Cards */}
        <div className="flex items-center justify-center gap-16 mb-12">
          {/* Player 1 */}
          <div className="text-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-48 h-64 bg-gradient-to-b from-neon-cyan/20 to-card/80 border-2 border-neon-cyan rounded-lg p-6 backdrop-blur">
              <div className="w-32 h-40 bg-neon-cyan/30 rounded mb-4 mx-auto border border-neon-cyan/50" />
              <h3 className="text-xl font-retro font-bold text-neon-cyan">
                LEROY
              </h3>
              <p className="text-sm text-foreground/70">
                Cyber Storm
              </p>
            </div>
          </div>

          {/* Player 2 */}
          <div className="text-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-48 h-64 bg-gradient-to-b from-neon-pink/20 to-card/80 border-2 border-neon-pink rounded-lg p-6 backdrop-blur">
              <div className="w-32 h-40 bg-neon-pink/30 rounded mb-4 mx-auto border border-neon-pink/50" />
              <h3 className="text-xl font-retro font-bold text-neon-pink">
                RAZOR
              </h3>
              <p className="text-sm text-foreground/70">
                Neon Blade
              </p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-8">
          <div className="text-8xl font-retro font-bold text-neon-green animate-neon-pulse">
            {countdown}
          </div>
          <p className="text-xl font-body text-foreground/80 mt-4">
            GET READY FOR KOMBAT!
          </p>
        </div>

        {/* Stage Info */}
        <div className="bg-card/60 backdrop-blur border border-neon-cyan/30 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="text-lg font-retro text-neon-cyan mb-2">
            DOWNTOWN KINGSTON
          </h4>
          <p className="text-sm text-foreground/70">
            Fight in the neon-lit streets of 1980s Kingston
          </p>
        </div>
      </div>

      {/* Lightning Effects */}
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-neon-cyan to-transparent opacity-30 animate-pulse" />
      <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-neon-pink to-transparent opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
};

export default VSScreen;