import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, Trophy, Swords, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioManager } from '@/hooks/useAudioManager';
import ParticleSystem from '@/components/ui/ParticleSystem';
import VideoBackground from '@/components/ui/VideoBackground';
import CharacterCard3D from '@/components/ui/CharacterCard3D';
import leroySprite from '@/assets/leroy-sprite.png';
import jordanSprite from '@/assets/jordan-sprite.png';
import razorSprite from '@/assets/razor-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';
import rootsmanSprite from '@/assets/rootsman-sprite.png';
import ashaSprite from '@/assets/asha-sprite.png';

const BadManKombatLandingPage = () => {
  const navigate = useNavigate();
  const { playLayer, stopAllAudio, isPlaying } = useAudioManager();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const fighters = [
    { 
      name: "LEROY", 
      title: "DIGITAL DREAD",
      image: leroySprite, 
      accentColor: "#00d4ff",
      stats: { power: 85, speed: 90, defense: 75 }
    },
    { 
      name: "JORDAN", 
      title: "BASSLINE WARRIOR",
      image: jordanSprite, 
      accentColor: "#8b00ff",
      stats: { power: 75, speed: 95, defense: 75 }
    },
    { 
      name: "RAZOR", 
      title: "CYBER SAMURAI",
      image: razorSprite, 
      accentColor: "#00ff7f",
      stats: { power: 95, speed: 80, defense: 70 }
    },
    { 
      name: "SIFU", 
      title: "ANCIENT WISDOM",
      image: sifuSprite, 
      accentColor: "#ffd700",
      stats: { power: 90, speed: 85, defense: 95 }
    },
    { 
      name: "ASHA", 
      title: "LIGHTNING FURY",
      image: ashaSprite, 
      accentColor: "#ff1493",
      stats: { power: 88, speed: 92, defense: 70 }
    },
    { 
      name: "ROOTSMAN", 
      title: "NATURE'S VOICE",
      image: rootsmanSprite, 
      accentColor: "#32cd32",
      stats: { power: 85, speed: 90, defense: 80 }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % fighters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [fighters.length]);

  const toggleAudio = () => {
    if (isAudioEnabled) {
      stopAllAudio();
      setIsAudioEnabled(false);
    } else {
      playLayer('ambient');
      setIsAudioEnabled(true);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Particle System */}
      <ParticleSystem />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-md border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded flex items-center justify-center">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs text-cyan-400 font-bold tracking-wider">BADMAN</div>
            <div className="text-sm text-white font-black tracking-tight">KOMBAT</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleAudio} className="text-white/60 hover:text-cyan-400 transition-colors p-2">
            {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <Button 
            onClick={() => navigate('/3d-ultimate')}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold px-6 py-2 text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            PLAY FREE
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <VideoBackground type="hero" overlay="dark" />
        
        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center pt-20">
          {/* Small centered logo */}
          <div className="mb-12 animate-fade-in">
            <div className="inline-block px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
              <span className="text-xs font-bold tracking-widest text-cyan-400">BADMAN KOMBAT</span>
            </div>
          </div>

          {/* Large rotating fighter */}
          <div className="relative w-full max-w-2xl h-96 mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={fighters[currentSlide].image} 
                alt={fighters[currentSlide].name}
                className="h-full w-auto object-contain animate-fade-in filter drop-shadow-2xl"
                style={{
                  filter: `drop-shadow(0 0 60px ${fighters[currentSlide].accentColor})`,
                }}
              />
            </div>
            {/* Character glow */}
            <div 
              className="absolute inset-0 blur-3xl opacity-30"
              style={{
                background: `radial-gradient(circle at center, ${fighters[currentSlide].accentColor} 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* Character name */}
          <div className="mb-8">
            <div className="text-sm font-bold tracking-widest mb-2" style={{ color: fighters[currentSlide].accentColor }}>
              {fighters[currentSlide].title}
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white">
              {fighters[currentSlide].name}
            </h1>
          </div>

          {/* CTA Button with glow */}
          <Button
            onClick={() => navigate('/3d-ultimate')}
            className="relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-black text-xl px-12 py-6 mb-8 hover:scale-105 transition-all group"
          >
            <Sparkles className="mr-2 inline animate-pulse" />
            PLAY NOW
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-lg opacity-30 group-hover:opacity-60 transition-opacity -z-10" />
          </Button>

          <p className="text-cyan-400 text-sm mb-12">FREE TO PLAY • ALL PLATFORMS • 6 UNIQUE FIGHTERS</p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <div className="text-xs text-white/40 tracking-widest">SCROLL</div>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Fighter Showcase Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        <div className="relative z-10 w-full max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
              <span className="text-xs font-bold tracking-widest text-cyan-400">CHOOSE YOUR CHAMPION</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white">
              THE <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">ROSTER</span>
            </h2>
          </div>

          {/* Character Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {fighters.map((fighter) => (
              <CharacterCard3D
                key={fighter.name}
                name={fighter.name}
                title={fighter.title}
                image={fighter.image}
                accentColor={fighter.accentColor}
                stats={fighter.stats}
                onClick={() => navigate('/character-select')}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/character-select')}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-black text-lg px-10 py-5 hover:scale-105 transition-all hover:shadow-lg hover:shadow-cyan-500/50"
            >
              SELECT FIGHTER
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section - Split Screen */}
      <div className="relative">
        {/* Feature 1 */}
        <div className="relative min-h-screen flex items-center">
          <VideoBackground type="section" overlay="darker" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
                <span className="text-xs font-bold tracking-widest text-cyan-400">COMBAT SYSTEM</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                SPECIAL <span className="text-cyan-400">MOVES</span>
              </h3>
              <p className="text-lg text-white/70 mb-6">
                Execute devastating combos with Street Fighter-style motion inputs. Master unique special moves, projectiles, and super attacks for each fighter.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <span className="text-sm text-cyan-400">MOTION INPUTS</span>
                </div>
                <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <span className="text-sm text-cyan-400">COMBO SYSTEM</span>
                </div>
                <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <span className="text-sm text-cyan-400">SUPER MOVES</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <img src={fighters[0].image} alt="Combat" className="h-96 w-auto filter drop-shadow-2xl" />
                <div className="absolute inset-0 blur-3xl opacity-40 bg-cyan-500/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="relative min-h-screen flex items-center">
          <VideoBackground type="section" overlay="darker" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <img src={fighters[1].image} alt="Team Battles" className="h-96 w-auto filter drop-shadow-2xl" />
                <div className="absolute inset-0 blur-3xl opacity-40 bg-purple-500/50" />
              </div>
            </div>
            <div>
              <div className="inline-block px-4 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                <span className="text-xs font-bold tracking-widest text-purple-400">MULTIPLAYER</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                TEAM <span className="text-purple-400">BATTLES</span>
              </h3>
              <p className="text-lg text-white/70 mb-6">
                Fight solo or team up in epic 3v3 showdowns. Battle across cinematic Jamaican locations with dynamic stages and interactive environments.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <span className="text-sm text-purple-400">1V1 MODE</span>
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <span className="text-sm text-purple-400">3V3 BATTLES</span>
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <span className="text-sm text-purple-400">TAG SYSTEM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <VideoBackground type="section" overlay="dark" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
            <span className="text-xs font-bold tracking-widest text-red-400">THE STORY</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
            PROJECT <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">CYBER YARD</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            In a dystopian future Jamaica, the government's Project CYBER YARD creates super-soldiers to control the streets. 
            But when test subject Leroy "Digital Dread" King escapes, he rallies a team of cyber-enhanced fighters to take down the corrupt system.
          </p>
          
          {/* Character quote with glitch effect */}
          <div className="relative mb-12">
            <div className="absolute inset-0 blur-2xl opacity-40 bg-cyan-500/50" />
            <div className="relative">
              <img 
                src={fighters[0].image} 
                alt="Leroy" 
                className="h-64 w-auto mx-auto mb-6 filter drop-shadow-2xl"
                style={{ filter: `drop-shadow(0 0 40px ${fighters[0].accentColor})` }}
              />
              <blockquote className="text-2xl md:text-3xl font-black text-cyan-400 mb-2">
                "WI NAH GO DOWN WITHOUT A FIGHT!"
              </blockquote>
              <cite className="text-sm text-white/60 not-italic">— Leroy "Digital Dread" King</cite>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-black font-black text-lg px-10 py-5 hover:scale-105 transition-all hover:shadow-lg hover:shadow-yellow-500/50"
          >
            EXPERIENCE THE STORY
          </Button>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <VideoBackground type="hero" overlay="darker" />
        
        <div className="relative z-10 text-center px-4">
          {/* Massive text */}
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-12 leading-none">
            READY TO<br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              FIGHT?
            </span>
          </h2>
          
          {/* Pulsing button with massive glow */}
          <div className="relative inline-block mb-8">
            <Button
              onClick={() => navigate('/3d-ultimate')}
              className="relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-black text-2xl md:text-4xl px-16 py-8 hover:scale-110 transition-all z-10"
            >
              <Sparkles className="mr-3 inline animate-pulse" />
              PLAY NOW
            </Button>
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-2xl opacity-50 animate-pulse" />
          </div>
          
          <p className="text-white/40 text-sm">Free to Play • All Platforms • 6 Unique Fighters</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/10 py-8 px-8 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <div>© 2025 BadMan Kombat. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BadManKombatLandingPage;
