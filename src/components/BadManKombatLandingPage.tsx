import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, Volume2, VolumeX, Sparkles, Play, ChevronDown, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioManager } from '@/hooks/useAudioManager';
import { RastaChatbot } from '@/components/RastaChatbot';
import GameplayTrailer from '@/components/GameplayTrailer';
import leroySprite from '@/assets/leroy-sprite.png';
import jordanSprite from '@/assets/jordan-sprite.png';
import razorSprite from '@/assets/razor-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';
import rootsmanSprite from '@/assets/rootsman-sprite.png';
import ashaSprite from '@/assets/asha-sprite.png';
import kingstonStreet from '@/assets/kingston-street-scene-1.jpg';
import blueTemple from '@/assets/blue-mountains-temple.jpg';

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
    <div className="relative w-full bg-black overflow-x-hidden">
      {/* Rasta Chatbot Navigator */}
      <RastaChatbot 
        onNavigateToGame={() => navigate('/bmk-ultimate3d')}
        onNavigateToCharacterSelect={() => navigate('/character-select')}
      />

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-lg opacity-50" />
              <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 p-2 rounded">
                <Swords className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-[0.3em] text-cyan-400">BADMAN</div>
              <div className="text-lg font-black tracking-tight text-white">KOMBAT</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleAudio} className="text-white/50 hover:text-cyan-400 transition p-2">
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <Button 
              onClick={() => navigate('/bmk-ultimate3d')}
              className="relative group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 py-2.5 text-sm overflow-hidden"
            >
              <span className="relative z-10">PLAY NOW</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO: Marvel Rivals Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
          <img 
            src={kingstonStreet} 
            alt="Kingston" 
            className="w-full h-full object-cover opacity-30"
          />
          {/* Animated grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            animation: 'grid-flow 20s linear infinite'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-[0.3em] text-cyan-400">SEASON 1 • NOW LIVE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
            <span className="block text-white mb-2">BADMAN</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              KOMBAT
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Jamaica's most dangerous fighters clash in electrifying street combat. 
            Master devastating combos, special moves, and super powers across iconic locations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={() => navigate('/bmk-ultimate3d')}
              className="relative group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xl px-12 py-7 overflow-hidden"
            >
              <Play className="mr-2 inline w-6 h-6" />
              <span className="relative z-10">PLAY FREE NOW</span>
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 blur-xl opacity-50 group-hover:opacity-75 transition -z-10" />
            </Button>
            <Button
              onClick={() => document.getElementById('trailer')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-2 border-white/20 hover:border-cyan-400 text-white hover:text-cyan-400 font-bold text-xl px-12 py-7 bg-white/5 backdrop-blur-sm"
            >
              WATCH TRAILER
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">6</div>
              <div className="text-sm text-white/50 uppercase tracking-wider">Fighters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">5</div>
              <div className="text-sm text-white/50 uppercase tracking-wider">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-pink-400 mb-2">∞</div>
              <div className="text-sm text-white/50 uppercase tracking-wider">Combos</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400 mx-auto" />
          </div>
        </div>

        {/* Floating Fighter Images */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4 pointer-events-none opacity-20">
          {fighters.slice(0, 3).map((fighter, i) => (
            <img
              key={i}
              src={fighter.image}
              alt={fighter.name}
              className="h-96 object-contain"
              style={{
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* FIGHTER ROSTER - Marvel Rivals Grid */}
      <section className="relative py-32 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold tracking-[0.3em] text-purple-400">THE ROSTER</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              CHOOSE YOUR <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">WARRIOR</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Each fighter brings unique abilities, devastating combos, and their own fighting style to dominate the streets.
            </p>
          </div>

          {/* Fighter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fighters.map((fighter, index) => (
              <div
                key={fighter.name}
                className="group relative bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Fighter Image */}
                <div className="relative h-96 overflow-hidden bg-gradient-to-b from-transparent to-black/80">
                  <img
                    src={fighter.image}
                    alt={fighter.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    style={{
                      filter: `drop-shadow(0 0 30px ${fighter.accentColor}40)`
                    }}
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-3xl"
                    style={{ background: `radial-gradient(circle at center, ${fighter.accentColor}, transparent)` }}
                  />
                </div>

                {/* Fighter Info */}
                <div className="p-6">
                  <div className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: fighter.accentColor }}>
                    {fighter.title}
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">{fighter.name}</h3>
                  
                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">POWER</span>
                      <div className="flex-1 mx-3 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${fighter.stats.power}%`,
                            backgroundColor: fighter.accentColor
                          }}
                        />
                      </div>
                      <span className="text-white font-bold w-8 text-right">{fighter.stats.power}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">SPEED</span>
                      <div className="flex-1 mx-3 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${fighter.stats.speed}%`,
                            backgroundColor: fighter.accentColor
                          }}
                        />
                      </div>
                      <span className="text-white font-bold w-8 text-right">{fighter.stats.speed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">DEFENSE</span>
                      <div className="flex-1 mx-3 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${fighter.stats.defense}%`,
                            backgroundColor: fighter.accentColor
                          }}
                        />
                      </div>
                      <span className="text-white font-bold w-8 text-right">{fighter.stats.defense}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <Button
                    onClick={() => navigate('/bmk-ultimate3d')}
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold"
                  >
                    SELECT FIGHTER
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMEPLAY TRAILER */}
      <GameplayTrailer />

      {/* FEATURES - Location Showcase */}
      <section className="relative py-32 bg-gradient-to-b from-black via-cyan-950/10 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold tracking-[0.3em] text-cyan-400">BATTLEGROUNDS</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              FIGHT ACROSS <span className="bg-gradient-to-r from-cyan-400 to-green-500 bg-clip-text text-transparent">JAMAICA</span>
            </h2>
          </div>

          {/* Location Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative h-96 rounded-lg overflow-hidden cursor-pointer">
              <img src={kingstonStreet} alt="Kingston Streets" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-4xl font-black text-white mb-2">KINGSTON STREETS</h3>
                <p className="text-white/70">Fight through the heart of downtown Jamaica</p>
              </div>
            </div>
            <div className="group relative h-96 rounded-lg overflow-hidden cursor-pointer">
              <img src={blueTemple} alt="Blue Mountains" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-4xl font-black text-white mb-2">BLUE MOUNTAINS TEMPLE</h3>
                <p className="text-white/70">Ancient warrior grounds in the peaks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/30 to-black" />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-7xl md:text-9xl font-black mb-12 leading-none">
            <span className="block text-white mb-4">READY TO</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              FIGHT?
            </span>
          </h2>
          <Button
            onClick={() => navigate('/bmk-ultimate3d')}
            className="relative group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-3xl px-20 py-10 overflow-hidden"
          >
            <Sparkles className="mr-3 inline w-8 h-8 animate-pulse" />
            <span className="relative z-10">PLAY NOW</span>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 blur-2xl opacity-50 animate-pulse" />
          </Button>
          <p className="text-white/40 text-sm mt-8 uppercase tracking-widest">Free to Play • All Platforms</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <div>© 2025 BadMan Kombat. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition">Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes grid-flow {
          0% { transform: translateY(0); }
          100% { transform: translateY(100px); }
        }
      `}</style>
    </div>
  );
};

export default BadManKombatLandingPage;
