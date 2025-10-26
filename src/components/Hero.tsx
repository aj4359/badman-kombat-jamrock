import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useAudioManager } from "@/hooks/useAudioManager";
import { NavigationBeacon } from "@/components/onboarding/NavigationBeacon";
import heroImage from "@/assets/leroy-poster.png";
import gameLogoBg from "@/assets/game-logo-bg.jpg";

interface HeroProps {
  isFirstVisit?: boolean;
  tutorialCompleted?: boolean;
}

const Hero: React.FC<HeroProps> = ({ isFirstVisit = false, tutorialCompleted = false }) => {
  const navigate = useNavigate();
  const { isLoaded, currentLayer, settings, playLayer, emergencyAudioKillSwitch, toggleMute } = useAudioManager();
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync local state with AudioManager's global state
  useEffect(() => {
    setIsPlaying(currentLayer === 'gameplay' || currentLayer === 'intro' || currentLayer === 'ambient');
  }, [currentLayer]);

  const enableAudio = () => {
    try {
      playLayer('ambient');
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to enable audio:', error);
    }
  };

  const disableAudio = () => {
    try {
      emergencyAudioKillSwitch();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to disable audio:', error);
    }
  };

  const handleStartKombat = () => {
    // No automatic audio - user must enable it manually first
    navigate('/vs-screen');
  };

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${gameLogoBg})` }}
      />
      
      {/* Retro Grid Overlay */}
      <div className="absolute inset-0 retro-grid opacity-30" />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-cyber opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

      {/* Audio Controls - Positioned to not overlap with action buttons */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        {!isPlaying ? (
          <Button
            variant="cyber"
            size="lg"
            onClick={enableAudio}
            className="animate-neon-pulse px-6 py-2 text-sm"
          >
            <Play className="h-4 w-4 mr-2 text-neon-cyan" />
            ENABLE AUDIO
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="lg"
            onClick={disableAudio}
            className="px-6 py-2 text-sm"
          >
            <VolumeX className="h-4 w-4 mr-2" />
            DISABLE AUDIO
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Main Title */}
        <div className="mb-8">
          <h1 
            className="font-retro text-6xl md:text-8xl lg:text-9xl font-black mb-4 glitch text-neon-cyan"
            data-text="BADMAN KOMBAT"
          >
            BADMAN KOMBAT
          </h1>
          <div className="text-neon-pink font-retro text-xl md:text-2xl tracking-wider mb-2">
            KINGSTON STREET FIGHTER
          </div>
          <div className="text-neon-green font-body text-lg tracking-widest">
            JAMAICA • 1980's • CYBERPUNK
          </div>
        </div>

        {/* Hero Fighter Image */}
        <div className="mb-12 relative inline-block">
          <div className="combat-border rounded-lg p-2 bg-card/20 backdrop-blur-sm">
            <img 
              src={heroImage} 
              alt="BadMan Kombat Fighter"
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg"
            />
          </div>
          <div className="absolute -inset-4 bg-gradient-neon opacity-20 blur-xl rounded-full animate-pulse" />
        </div>

        {/* Action Buttons - Conditional based on tutorial status */}
        <div className="flex flex-col gap-4 items-center mb-12 max-w-2xl mx-auto">
          {!tutorialCompleted ? (
            <>
              {/* First-time visitor: Tutorial is primary CTA */}
              <NavigationBeacon show={isFirstVisit} label="Start here!" position="top">
                <Button 
                  variant="combat" 
                  size="lg" 
                  className="text-xl px-12 py-6 animate-neon-pulse w-full sm:w-auto min-w-[300px]"
                  onClick={() => navigate('/tutorial')}
                >
                  🎮 START TUTORIAL
                </Button>
              </NavigationBeacon>
              <p className="text-neon-green text-sm font-body">Learn the moves • Takes 5 minutes</p>
              
              {/* Secondary options */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-6 py-4"
                  onClick={() => navigate('/character-select')}
                >
                  SELECT FIGHTER
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-6 py-4"
                  onClick={() => {
                    const trailerSection = document.getElementById('trailer');
                    trailerSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  WATCH TRAILER
                </Button>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="text-base px-6 py-4 bg-black border-red-600 hover:bg-red-950"
                  onClick={() => navigate('/johnwick-drone')}
                >
                  🎬 JOHN WICK DRONE
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-6 py-4 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  onClick={() => navigate('/drone-trailer')}
                >
                  🚁 DRONE CAMERA
                </Button>
              </div>
              
              {/* Skip option for experienced players */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground text-sm mt-2"
                onClick={() => navigate('/game', {
                  state: {
                    fighterData: {
                      player1: { id: 'leroy', name: 'LEROY' },
                      player2: { id: 'jordan', name: 'JORDAN' }
                    }
                  }
                })}
              >
                Skip to Quick Match →
              </Button>
            </>
          ) : (
            <>
              {/* Returning player: Quick Match is primary CTA */}
              <Button 
                variant="combat" 
                size="lg" 
                className="text-xl px-12 py-6 animate-neon-pulse w-full sm:w-auto min-w-[300px]"
                onClick={() => navigate('/game', {
                  state: {
                    fighterData: {
                      player1: { id: 'leroy', name: 'LEROY' },
                      player2: { id: 'jordan', name: 'JORDAN' }
                    }
                  }
                })}
              >
                ⚡ QUICK MATCH ⚡
              </Button>
              <p className="text-neon-cyan text-sm font-body">Jump into battle</p>
              
              {/* Secondary options */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  variant="neon" 
                  size="lg" 
                  className="text-base px-6 py-4"
                  onClick={() => navigate('/character-select')}
                >
                  SELECT FIGHTER
                </Button>
                <Button 
                  variant="jamaica" 
                  size="lg" 
                  className="text-base px-6 py-4"
                  onClick={() => {
                    const trailerSection = document.getElementById('trailer');
                    trailerSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  WATCH TRAILER
                </Button>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="text-base px-6 py-4 bg-black border-red-600 hover:bg-red-950"
                  onClick={() => navigate('/johnwick-drone')}
                >
                  🎬 JOHN WICK DRONE
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-6 py-4 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  onClick={() => navigate('/drone-trailer')}
                >
                  🚁 DRONE CAMERA
                </Button>
                <Button 
                  variant="retro" 
                  size="lg" 
                  className="text-base px-6 py-4"
                  onClick={() => navigate('/tutorial')}
                >
                  TUTORIAL
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="combat-border rounded-lg p-6 bg-card/10 backdrop-blur-sm">
            <h3 className="text-neon-cyan font-retro text-xl mb-2">8 FIGHTERS</h3>
            <p className="text-muted-foreground font-body">
              Choose from badman warriors across Kingston
            </p>
          </div>
          <div className="combat-border rounded-lg p-6 bg-card/10 backdrop-blur-sm">
            <h3 className="text-neon-pink font-retro text-xl mb-2">NEON STAGES</h3>
            <p className="text-muted-foreground font-body">
              Fight in iconic 80's Jamaica locations
            </p>
          </div>
          <div className="combat-border rounded-lg p-6 bg-card/10 backdrop-blur-sm">
            <h3 className="text-neon-green font-retro text-xl mb-2">SPECIAL MOVES</h3>
            <p className="text-muted-foreground font-body">
              Master devastating combat combinations
            </p>
          </div>
        </div>
      </div>

      {/* Floating Combat Elements */}
      <div className="absolute top-20 left-10 text-neon-cyan font-retro text-2xl animate-pulse">
        ROUND 1
      </div>
      <div className="absolute bottom-20 right-10 text-neon-pink font-retro text-2xl animate-pulse">
        FIGHT!
      </div>
    </section>
  );
};

export default Hero;