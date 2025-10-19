import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, Trophy, Swords, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioManager } from '@/hooks/useAudioManager';

const BadManKombatLandingPage = () => {
  const navigate = useNavigate();
  const { playLayer, stopAllAudio, isPlaying } = useAudioManager();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const fighters = [
    { name: "Leroy", icon: "🌿", color: "from-cyan-500 to-cyan-700" },
    { name: "Jordan", icon: "🎧", color: "from-purple-500 to-purple-700" },
    { name: "Sifu", icon: "🔮", color: "from-yellow-500 to-yellow-700" },
    { name: "Razor", icon: "⚔️", color: "from-green-500 to-green-700" },
    { name: "Asha", icon: "⚡", color: "from-red-500 to-red-700" },
    { name: "Rootsman", icon: "🌿", color: "from-green-600 to-green-800" }
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
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-purple-950 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-green-500/20 to-red-500/20 animate-pulse" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <Swords className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold text-white">BADMAN KOMBAT</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleAudio} className="text-white hover:text-yellow-400 transition-colors">
            {isAudioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
          <Button 
            onClick={() => navigate('/3d-ultimate')}
            className="bg-yellow-400 text-black font-bold px-8 py-3 text-lg hover:bg-yellow-500 hover:scale-105 transition-all"
          >
            DOWNLOAD
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="text-red-600 font-bold text-xl mb-2 tracking-widest">BADMAN</div>
          <div className="relative">
            <h1 className="text-[120px] md:text-[180px] lg:text-[220px] font-black text-white leading-none tracking-tighter transform -skew-y-2 drop-shadow-2xl">
              KOMBAT
            </h1>
            <div className="absolute inset-0 text-[120px] md:text-[180px] lg:text-[220px] font-black leading-none tracking-tighter transform -skew-y-2 bg-gradient-to-r from-yellow-400 via-green-400 to-red-500 bg-clip-text text-transparent blur-sm opacity-50" />
          </div>
        </div>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-4xl text-white font-bold mb-4 tracking-wide">
          THE CYBER-RASTA TEAM-BASED FIGHTING GAME
        </h2>
        
        <p className="text-3xl md:text-5xl font-black text-yellow-400 mb-12 animate-pulse tracking-wider">
          ALL FIGHTERS ARE FREE TO PLAY!
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => navigate('/3d-ultimate')}
          className="bg-yellow-400 text-black font-black text-2xl px-16 py-8 mb-12 hover:bg-yellow-500 hover:scale-110 transition-all shadow-2xl"
        >
          PLAY NOW
        </Button>

        {/* Platform Icons */}
        <div className="flex items-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">🖥️</div>
            <span>WEB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">📱</div>
            <span>MOBILE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">🎮</div>
            <span>CONSOLE</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-sm flex flex-col items-center gap-2 animate-bounce">
          <span className="tracking-widest">SWIPE TO BROWSE</span>
          <div className="text-2xl">↓</div>
        </div>
      </div>

      {/* Fighter Showcase Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <h2 className="text-6xl font-black text-white mb-16 text-center">
          CHOOSE YOUR <span className="text-yellow-400">FIGHTER</span>
        </h2>

        {/* Fighter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mb-12">
          {fighters.map((fighter, idx) => (
            <div
              key={fighter.name}
              className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                idx === currentSlide ? 'scale-110 ring-4 ring-yellow-400' : ''
              }`}
              onClick={() => setCurrentSlide(idx)}
            >
              <div className={`bg-gradient-to-br ${fighter.color} p-8 rounded-2xl border-2 border-white/20 hover:border-yellow-400 transition-all`}>
                <div className="text-7xl mb-4 transform group-hover:scale-125 transition-transform">
                  {fighter.icon}
                </div>
                <div className="text-white font-bold text-lg">{fighter.name}</div>
              </div>
              {idx === currentSlide && (
                <div className="absolute -inset-2 bg-yellow-400/20 rounded-2xl blur-xl -z-10 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate('/character-select')}
          className="bg-gradient-to-r from-yellow-400 to-red-500 text-black font-black text-xl px-12 py-6 hover:scale-105 transition-all"
        >
          VIEW ALL FIGHTERS
        </Button>
      </div>

      {/* Features Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-transparent via-black/50 to-transparent">
        <h2 className="text-6xl font-black text-white mb-16 text-center">
          GAME <span className="text-green-400">FEATURES</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-700/20 backdrop-blur-sm p-8 rounded-2xl border-2 border-cyan-400/50 hover:border-cyan-400 transition-all group">
            <Zap className="w-16 h-16 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">SPECIAL MOVES</h3>
            <p className="text-white/80">Execute devastating combos with Street Fighter-style motion inputs and unleash ultimate attacks!</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-400/50 hover:border-purple-400 transition-all group">
            <Users className="w-16 h-16 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">TEAM BATTLES</h3>
            <p className="text-white/80">Fight solo or team up in epic 3v3 showdowns across cinematic Jamaican battlefields!</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 backdrop-blur-sm p-8 rounded-2xl border-2 border-yellow-400/50 hover:border-yellow-400 transition-all group">
            <Trophy className="w-16 h-16 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">TOURNAMENTS</h3>
            <p className="text-white/80">Compete in ranked matches and tournaments to become the ultimate BadMan Kombat champion!</p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 font-bold text-xl mb-4 tracking-widest">THE STORY</div>
          <h2 className="text-6xl font-black text-white mb-8">
            PROJECT <span className="text-yellow-400">CYBER YARD</span>
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            In a dystopian future Jamaica, the government's Project CYBER YARD creates super-soldiers to control the streets. 
            But when test subject Leroy "Tek-9" King escapes, he rallies a team of cyber-enhanced fighters to take down the corrupt system.
          </p>
          <p className="text-2xl text-green-400 font-bold mb-12">
            "WI NAH GO DOWN WITHOUT A FIGHT!" - Leroy King
          </p>
          <Button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-green-400 to-cyan-400 text-black font-black text-xl px-12 py-6 hover:scale-105 transition-all"
          >
            EXPERIENCE THE STORY
          </Button>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-t from-black via-transparent to-transparent">
        <h2 className="text-7xl md:text-9xl font-black text-white mb-8 text-center leading-none">
          READY TO
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-500 bg-clip-text text-transparent">
            FIGHT?
          </span>
        </h2>
        <Button
          onClick={() => navigate('/3d-ultimate')}
          className="bg-yellow-400 text-black font-black text-3xl px-20 py-10 mb-8 hover:bg-yellow-500 hover:scale-110 transition-all shadow-2xl animate-pulse"
        >
          PLAY NOW
        </Button>
        <p className="text-white/60 text-sm">Free to Play • No Download Required • All Platforms</p>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm">
          <div>© 2025 BadMan Kombat. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BadManKombatLandingPage;
