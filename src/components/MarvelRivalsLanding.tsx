import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Swords, Sparkles } from 'lucide-react';
import ParticleSystem from '@/components/ui/ParticleSystem';
import leroyPoster from '@/assets/leroy-poster.png';
import fighterLineup from '@/assets/fighter-lineup.png';
import trailerVideo from '/assets/bmk-trailer.mp4';

const MarvelRivalsLanding = () => {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const fighters = [
    { id: 'leroy', name: 'LEROY', img: '/src/assets/leroy-sprite.png' },
    { id: 'jordan', name: 'JORDAN', img: '/src/assets/jordan-sprite.png' },
    { id: 'razor', name: 'RAZOR', img: '/src/assets/razor-sprite.png' },
    { id: 'rootsman', name: 'ROOTSMAN', img: '/src/assets/rootsman-sprite.png' },
    { id: 'sifu', name: 'SIFU', img: '/src/assets/sifu-sprite.png' },
    { id: 'blaze', name: 'BLAZE', img: '/src/assets/blaze-sprite.png' },
    { id: 'marcus', name: 'MARCUS', img: '/src/assets/marcus-sprite.png' },
    { id: 'asha', name: 'ASHA', img: '/src/assets/asha-sprite.png' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Particle Background */}
      <ParticleSystem />

      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src={trailerVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl mx-auto text-center">
            {/* Main Title */}
            <div className="mb-12 animate-fade-in">
              <h1 className="font-retro text-7xl md:text-9xl font-black mb-6 marvel-glow text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                BADMAN KOMBAT
              </h1>
              <p className="text-2xl md:text-4xl font-bold text-cyan-400 tracking-wider mb-4">
                KINGSTON'S FINEST WARRIORS
              </p>
              <p className="text-lg md:text-xl text-purple-300 max-w-2xl mx-auto">
                8 legendary fighters. Infinite kombat. One champion.
              </p>
            </div>

            {/* Hero Character */}
            <div className="mb-12 relative inline-block group">
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-3xl group-hover:opacity-50 transition-opacity duration-500" />
              <img
                src={leroyPoster}
                alt="Leroy - Champion Fighter"
                className="relative w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/game')}
                className="text-xl px-12 py-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-cyan-300"
              >
                <Play className="mr-3 h-6 w-6" />
                PLAY NOW
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/character-select')}
                className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-purple-300"
              >
                <Swords className="mr-3 h-6 w-6" />
                SELECT FIGHTER
              </Button>
            </div>
          </div>
        </section>

        {/* Fighter Roster */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              CHOOSE YOUR WARRIOR
            </h2>
            <p className="text-xl text-center text-purple-300 mb-16">
              Master unique fighting styles from Kingston's streets
            </p>

            {/* Fighter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {fighters.map((fighter, index) => (
                <div
                  key={fighter.id}
                  className="group relative cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate('/character-select')}
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-purple-500/50 rounded-lg p-4 transform group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-800 rounded mb-3 flex items-center justify-center overflow-hidden">
                        <span className="text-6xl font-bold text-purple-500/20">
                          {fighter.name[0]}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-center text-cyan-400 group-hover:text-white transition-colors">
                        {fighter.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-purple-900/20 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition-colors">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-3 text-cyan-400">8 UNIQUE FIGHTERS</h3>
                <p className="text-gray-300">
                  Each warrior brings their own devastating combat style
                </p>
              </div>
              <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-colors">
                <Swords className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-2xl font-bold mb-3 text-purple-400">EPIC STAGES</h3>
                <p className="text-gray-300">
                  Fight across iconic Kingston locations
                </p>
              </div>
              <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-pink-500/30 hover:border-pink-400 transition-colors">
                <Play className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                <h3 className="text-2xl font-bold mb-3 text-pink-400">SPECIAL MOVES</h3>
                <p className="text-gray-300">
                  Unleash powerful combos and finishing moves
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            READY FOR KOMBAT?
          </h2>
          <Button
            size="lg"
            onClick={() => navigate('/game')}
            className="text-2xl px-16 py-10 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse"
          >
            <Play className="mr-4 h-8 w-8" />
            START PLAYING NOW
          </Button>
        </section>
      </div>
    </div>
  );
};

export default MarvelRivalsLanding;
