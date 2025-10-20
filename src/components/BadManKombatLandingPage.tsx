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
        onNavigateToGame={() => navigate('/3d-ultimate')}
        onNavigateToCharacterSelect={() => navigate('/character-select')}
        onNavigateToHome={() => navigate('/')}
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

      {/* HERO: Epic Marvel Rivals Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-black to-black z-10" />
          <img 
            src={kingstonStreet} 
            alt="Kingston" 
            className="w-full h-full object-cover opacity-40 scale-110 animate-[zoom_30s_ease-in-out_infinite]"
          />
          {/* Dynamic light rays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent animate-pulse" />
        </div>

        {/* Epic Content */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-6 text-center pt-24">
          {/* Season Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-2 border-cyan-400/30 rounded-full mb-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,212,255,0.3)]">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(0,212,255,0.8)]" />
            <span className="text-sm font-bold tracking-[0.4em] text-cyan-300 font-['Orbitron']">SEASON 1 • KINGSTON NIGHTS</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>

          {/* Epic Title with 3D effect */}
          <h1 className="mb-8 leading-none">
            <div className="text-[120px] md:text-[180px] font-black mb-4 font-['Bebas_Neue'] tracking-tight">
              <span className="block text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">BADMAN</span>
            </div>
            <div className="text-[100px] md:text-[160px] font-black font-['Bebas_Neue'] tracking-wider">
              <span className="inline-block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(0,212,255,0.6)] animate-[shimmer_3s_ease-in-out_infinite]">
                KOMBAT
              </span>
            </div>
          </h1>

          <p className="text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto mb-16 leading-relaxed font-['Inter'] font-medium tracking-wide">
            <span className="text-cyan-400 font-bold">Jamaica's Finest</span> clash in explosive street combat.<br/>
            Master <span className="text-purple-400">devastating combos</span> and <span className="text-pink-400">super powers</span> across iconic locations.
          </p>

          {/* Epic CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button
              onClick={() => navigate('/bmk-ultimate3d')}
              className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black text-2xl px-16 py-8 rounded-full overflow-hidden shadow-[0_0_60px_rgba(0,212,255,0.5)] hover:shadow-[0_0_100px_rgba(0,212,255,0.8)] transition-all duration-300 border-2 border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Play className="mr-3 inline w-8 h-8 drop-shadow-lg" />
              <span className="relative z-10 font-['Orbitron']">PLAY FREE NOW</span>
            </Button>
            <Button
              onClick={() => document.getElementById('trailer')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-3 border-cyan-400/50 hover:border-cyan-400 text-white hover:text-cyan-400 font-bold text-2xl px-16 py-8 bg-black/40 backdrop-blur-lg hover:bg-black/60 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:shadow-[0_0_60px_rgba(0,212,255,0.4)]"
            >
              <span className="font-['Orbitron']">WATCH TRAILER</span>
            </Button>
          </div>

          {/* Epic Stats Grid */}
          <div className="grid grid-cols-3 gap-12 max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative text-center p-6 border border-cyan-500/30 rounded-lg backdrop-blur-sm bg-black/30">
                <div className="text-6xl font-black text-cyan-400 mb-3 font-['Orbitron'] drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]">6</div>
                <div className="text-sm text-white/70 uppercase tracking-[0.3em] font-bold">LEGENDS</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative text-center p-6 border border-purple-500/30 rounded-lg backdrop-blur-sm bg-black/30">
                <div className="text-6xl font-black text-purple-400 mb-3 font-['Orbitron'] drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">5</div>
                <div className="text-sm text-white/70 uppercase tracking-[0.3em] font-bold">ARENAS</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 to-transparent blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative text-center p-6 border border-pink-500/30 rounded-lg backdrop-blur-sm bg-black/30">
                <div className="text-6xl font-black text-pink-400 mb-3 font-['Orbitron'] drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">∞</div>
                <div className="text-sm text-white/70 uppercase tracking-[0.3em] font-bold">COMBOS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Fighter Showcase - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[600px] flex items-end justify-center pointer-events-none z-10">
          <div className="flex items-end justify-center gap-12 pb-0">
            {fighters.slice(0, 3).map((fighter, i) => (
              <div key={i} className="relative" style={{ animation: `float ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
                <div className="absolute inset-0 blur-3xl opacity-60" style={{ background: `radial-gradient(circle, ${fighter.accentColor}, transparent)` }} />
                <img
                  src={fighter.image}
                  alt={fighter.name}
                  className="relative h-[500px] object-contain drop-shadow-[0_0_60px_rgba(0,0,0,0.8)]"
                  style={{ filter: `drop-shadow(0 0 40px ${fighter.accentColor}80)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIGHTER ROSTER - Marvel Rivals Premium Grid */}
      <section className="relative py-40 bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-[1600px] mx-auto px-6">
          {/* Epic Section Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 rounded-full mb-8 backdrop-blur-md">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold tracking-[0.4em] text-purple-300 font-['Orbitron']">THE LEGENDS</span>
            </div>
            <h2 className="text-7xl md:text-8xl font-black mb-8 font-['Bebas_Neue'] tracking-tight">
              <span className="text-white">ASSEMBLE YOUR </span>
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                TEAM
              </span>
            </h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto font-['Inter'] leading-relaxed">
              Master unique abilities, devastating special moves, and game-changing super powers
            </p>
          </div>

          {/* Premium Fighter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fighters.map((fighter, index) => (
              <div
                key={fighter.name}
                className="group relative bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent border-2 border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_80px_rgba(0,212,255,0.3)]"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  backdropFilter: 'blur(20px)'
                }}
              >
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${fighter.accentColor}40, transparent)` }}
                />

                {/* Fighter Image */}
                <div className="relative h-[480px] overflow-hidden bg-gradient-to-b from-transparent via-black/20 to-black/90">
                  <img
                    src={fighter.image}
                    alt={fighter.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_50px_rgba(0,0,0,0.9)]"
                    style={{
                      filter: `drop-shadow(0 0 40px ${fighter.accentColor}60)`
                    }}
                  />
                  
                  {/* Animated accent glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-3xl"
                    style={{ background: `radial-gradient(ellipse at bottom, ${fighter.accentColor}, transparent 70%)` }}
                  />
                  
                  {/* Top gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
                </div>

                {/* Fighter Info */}
                <div className="relative p-8 bg-gradient-to-b from-black/80 to-black/95">
                  {/* Title Badge */}
                  <div 
                    className="inline-block text-xs font-bold tracking-[0.3em] mb-3 px-3 py-1 rounded-full border font-['Orbitron']" 
                    style={{ 
                      color: fighter.accentColor,
                      borderColor: `${fighter.accentColor}40`,
                      backgroundColor: `${fighter.accentColor}10`
                    }}
                  >
                    {fighter.title}
                  </div>
                  
                  <h3 className="text-4xl font-black text-white mb-6 font-['Bebas_Neue'] tracking-wide drop-shadow-lg">
                    {fighter.name}
                  </h3>
                  
                  {/* Epic Stats with glow */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60 font-['Inter'] font-semibold">POWER</span>
                      <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]"
                          style={{ 
                            width: `${fighter.stats.power}%`,
                            backgroundColor: fighter.accentColor
                          }}
                        />
                      </div>
                      <span className="text-white font-bold w-10 text-right font-['Orbitron']">{fighter.stats.power}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60 font-['Inter'] font-semibold">SPEED</span>
                      <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]"
                          style={{ 
                            width: `${fighter.stats.speed}%`,
                            backgroundColor: fighter.accentColor
                          }}
                        />
                      </div>
                      <span className="text-white font-bold w-10 text-right font-['Orbitron']">{fighter.stats.speed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60 font-['Inter'] font-semibold">DEFENSE</span>
                      <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]"
                          style={{ 
                            width: `${fighter.stats.defense}%`,
                            backgroundColor: fighter.accentColor
                          }}
                        />
                      </div>
                      <span className="text-white font-bold w-10 text-right font-['Orbitron']">{fighter.stats.defense}</span>
                    </div>
                  </div>
                </div>

                {/* Premium Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-12">
                  <Button
                    onClick={() => navigate('/bmk-ultimate3d')}
                    className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-full text-lg shadow-[0_0_30px_rgba(0,212,255,0.5)] border-2 border-white/20 font-['Orbitron']"
                  >
                    <span className="relative z-10">SELECT FIGHTER</span>
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
