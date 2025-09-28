import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useAudioManager } from "@/hooks/useAudioManager";
import heroImage from "@/assets/fighter-hero.jpg";
import gameLogoBg from "@/assets/game-logo-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const { isLoaded, currentLayer, settings, playLayer, emergencyAudioKillSwitch, toggleMute } = useAudioManager();
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync local state with AudioManager's global state
  useEffect(() => {
    setIsPlaying(currentLayer === 'gameplay' || currentLayer === 'intro' || currentLayer === 'ambient');
  }, [currentLayer]);

  const enableAudio = () => {
    playLayer('ambient');
    setIsPlaying(true);
  };

  const disableAudio = () => {
    emergencyAudioKillSwitch();
    setIsPlaying(false);
  };

  const handleStartKombat = () => {
    // No automatic audio - user must enable it manually first
    navigate('/vs-screen');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      {/* Audio Controls */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            variant="combat" 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={handleStartKombat}
          >
            START KOMBAT
          </Button>
          <Button 
            variant="neon" 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => {
              const trailerSection = document.getElementById('trailer');
              trailerSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            WATCH TRAILER
          </Button>
          <Button 
            variant="jamaica" 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => navigate('/character-select')}
          >
            SELECT FIGHTER
          </Button>
          <Button 
            variant="retro" 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => navigate('/teaser')}
          >
            CREATE TEASER
          </Button>
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