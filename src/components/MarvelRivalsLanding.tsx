import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Swords, Sparkles } from 'lucide-react';
import ParticleSystem from '@/components/ui/ParticleSystem';
import leroyPoster from '@/assets/leroy-poster.png';
import fighterLineup from '@/assets/fighter-lineup.png';
import leroySprite from '@/assets/leroy-sprite.png';
import razorSprite from '@/assets/razor-sprite.png';
import voltageSprite from '@/assets/voltage-sprite.png';
import jordanSprite from '@/assets/jordan-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';
import rootsmanSprite from '@/assets/rootsman-sprite.png';

const MarvelRivalsLanding = () => {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shouldLoadHeavyContent, setShouldLoadHeavyContent] = useState(false);

  useEffect(() => {
    // Delay heavy content loading to ensure page renders first
    const timer = setTimeout(() => {
      setShouldLoadHeavyContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fighters = [
    { id: 'leroy', name: 'LEROY', img: leroySprite, title: 'Cyber Storm' },
    { id: 'jordan', name: 'JORDAN', img: jordanSprite, title: 'Sound Master' },
    { id: 'razor', name: 'RAZOR', img: razorSprite, title: 'Neon Blade' },
    { id: 'rootsman', name: 'ROOTSMAN', img: rootsmanSprite, title: 'Tech-Nature' },
    { id: 'sifu', name: 'SIFU', img: sifuSprite, title: 'Steel Wire' },
    { id: 'voltage', name: 'VOLTAGE', img: voltageSprite, title: 'Electric Queen' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Particle Background */}
      {shouldLoadHeavyContent && <ParticleSystem />}

      {/* Video Background */}
      {shouldLoadHeavyContent && (
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
            onLoadedData={() => setVideoLoaded(true)}
            onError={(e) => {
              console.warn('Video loading failed, continuing without video:', e);
              setVideoLoaded(true);
            }}
          >
            <source src="/assets/bmk-trailer.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 animate-pulse" />
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <h1 className="text-7xl md:text-9xl font-bold leading-tight animate-fade-in">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  BADMAN
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                  KOMBAT
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-200 max-w-xl font-bold drop-shadow-lg">
                Kingston Rises. The Streets Remember. Choose Your Fighter.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/character-select')}
                  className="text-2xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-2xl shadow-purple-500/50 hover:scale-110 transition-all duration-300 hover:shadow-purple-500/80 border-2 border-purple-400"
                >
                  <Play className="mr-3 h-8 w-8" />
                  PLAY NOW
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/character-select')}
                  className="text-2xl px-12 py-8 border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold transition-all hover:scale-110 duration-300 shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/80"
                >
                  <Swords className="mr-3 h-8 w-8" />
                  SELECT FIGHTER
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/john-wick-trailer')}
                  className="text-2xl px-12 py-8 border-4 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-black font-bold transition-all hover:scale-110 duration-300 shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/80"
                >
                  <Sparkles className="mr-3 h-8 w-8" />
                  WATCH TRAILER
                </Button>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src={leroyPoster} 
                alt="Leroy - The Trench Town Technomancer"
                className="w-full max-w-md lg:max-w-lg rounded-lg shadow-2xl shadow-purple-500/50 hover:scale-105 transition-transform duration-500 animate-float"
              />
            </div>
          </div>
        </section>

        {/* Fighter Roster */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-cyan-900/10" />
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-fade-in">
              CHOOSE YOUR WARRIOR
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {fighters.map((fighter, index) => (
                <div
                  key={fighter.id}
                  onClick={() => navigate('/character-select')}
                  className="relative group cursor-pointer transform transition-all duration-500 hover:scale-125 hover:z-10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-900/80 to-cyan-900/80 border-4 border-purple-500/50 group-hover:border-cyan-400 transition-all overflow-hidden backdrop-blur-md shadow-2xl group-hover:shadow-cyan-500/50 relative">
                    <img 
                      src={fighter.img} 
                      alt={fighter.name}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/20 group-hover:to-cyan-500/20 transition-all duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex flex-col items-center justify-end pb-6 px-2">
                    <span className="text-white font-bold text-xl mb-1 drop-shadow-lg">{fighter.name}</span>
                    <span className="text-cyan-400 text-sm font-semibold">{fighter.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-6 p-8 rounded-xl bg-gradient-to-br from-purple-900/50 to-transparent border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-500/50 backdrop-blur-md">
                <div className="text-7xl animate-bounce">⚡</div>
                <h3 className="text-3xl font-bold text-cyan-400 drop-shadow-lg">UNIQUE FIGHTERS</h3>
                <p className="text-gray-200 text-lg">
                  9 authentic Jamaican warriors with distinct fighting styles and backstories rooted in 1980s Kingston culture
                </p>
              </div>
              
              <div className="text-center space-y-6 p-8 rounded-xl bg-gradient-to-br from-cyan-900/50 to-transparent border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-cyan-500/50 backdrop-blur-md">
                <div className="text-7xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏙️</div>
                <h3 className="text-3xl font-bold text-purple-400 drop-shadow-lg">EPIC STAGES</h3>
                <p className="text-gray-200 text-lg">
                  Battle across iconic Kingston locations from Trench Town to Blue Mountains in stunning cyberpunk aesthetics
                </p>
              </div>
              
              <div className="text-center space-y-6 p-8 rounded-xl bg-gradient-to-br from-pink-900/50 to-transparent border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-pink-500/50 backdrop-blur-md">
                <div className="text-7xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎮</div>
                <h3 className="text-3xl font-bold text-pink-400 drop-shadow-lg">SPECIAL MOVES</h3>
                <p className="text-gray-200 text-lg">
                  Master devastating combos and signature special moves inspired by Jamaican martial arts and street fighting
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-cyan-900/40 animate-pulse" />
          <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.8)] animate-fade-in">
              READY TO FIGHT?
            </h2>
            <p className="text-3xl text-gray-100 font-bold drop-shadow-lg">
              Step into the ring and prove your worth in the streets of Kingston
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/character-select')}
              className="text-3xl px-20 py-10 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-400 hover:to-purple-400 text-white font-bold shadow-2xl shadow-cyan-500/70 hover:scale-125 transition-all duration-500 border-4 border-cyan-400 hover:shadow-purple-500/90 animate-pulse"
            >
              <Play className="mr-4 h-10 w-10" />
              START YOUR JOURNEY
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarvelRivalsLanding;
