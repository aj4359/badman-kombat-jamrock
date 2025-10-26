import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Swords, Sparkles, Zap, Trophy } from 'lucide-react';
import ParticleSystem from '@/components/ui/ParticleSystem';
import { FighterPreview } from '@/components/landing/FighterPreview';
import { GameModes } from '@/components/landing/GameModes';
import { StageCarousel } from '@/components/landing/StageCarousel';
import { SocialProof } from '@/components/landing/SocialProof';
import leroyPoster from '@/assets/leroy-poster.png';
import fighterLineup from '@/assets/fighter-lineup.png';
import leroySprite from '@/assets/leroy-sprite-sheet.png';
import razorSprite from '@/assets/razor-sprite-sheet.png';
import voltageSprite from '@/assets/voltage-sprite.png';
import jordanSprite from '@/assets/jordan-sprite-sheet.png';
import sifuSprite from '@/assets/sifu-sprite-sheet.png';
import rootsmanSprite from '@/assets/rootsman-sprite-sheet.png';

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
    { 
      id: 'leroy', 
      name: 'LEROY', 
      img: leroySprite, 
      title: 'Cyber Storm',
      stats: { speed: 8, power: 9, technique: 7 },
      voiceLine: "Ya feel di power of di streets!"
    },
    { 
      id: 'jordan', 
      name: 'JORDAN', 
      img: jordanSprite, 
      title: 'Sound Master',
      stats: { speed: 10, power: 9, technique: 9 },
      voiceLine: "Air superiority on and off the court!"
    },
    { 
      id: 'razor', 
      name: 'RAZOR', 
      img: razorSprite, 
      title: 'Neon Blade',
      stats: { speed: 9, power: 8, technique: 8 },
      voiceLine: "Kingston streets made me who I am!"
    },
    { 
      id: 'rootsman', 
      name: 'ROOTSMAN', 
      img: rootsmanSprite, 
      title: 'Tech-Nature',
      stats: { speed: 7, power: 8, technique: 9 },
      voiceLine: "Jah guide mi every step!"
    },
    { 
      id: 'sifu', 
      name: 'SIFU', 
      img: sifuSprite, 
      title: 'Steel Wire',
      stats: { speed: 10, power: 7, technique: 10 },
      voiceLine: "Ancient wisdom flows through me."
    },
    { 
      id: 'voltage', 
      name: 'VOLTAGE', 
      img: voltageSprite, 
      title: 'Electric Queen',
      stats: { speed: 9, power: 8, technique: 9 },
      voiceLine: "Feel the voltage surge!"
    }
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
              console.warn('✅ [PHASE 1] Video background optional, continuing:', e);
              setVideoLoaded(true);
            }}
          >
            <source src="assets/bmk-trailer.mp4" type="video/mp4" />
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
          <h2 className="text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            CHOOSE YOUR WARRIOR
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {fighters.map((fighter) => (
              <FighterPreview
                key={fighter.id}
                id={fighter.id}
                name={fighter.name}
                title={fighter.title}
                image={fighter.img}
                stats={fighter.stats}
                voiceLine={fighter.voiceLine}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            GAME FEATURES
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 hover:border-cyan-400 transition-all hover:scale-105">
              <Swords className="w-16 h-16 mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <h3 className="text-2xl font-bold mb-3">UNIQUE FIGHTERS</h3>
              <p className="text-gray-300">Master diverse fighting styles from Kingston streets to ancient temples</p>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-105">
              <Zap className="w-16 h-16 mb-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <h3 className="text-2xl font-bold mb-3">EPIC STAGES</h3>
              <p className="text-gray-300">Battle across iconic Jamaican locations with dynamic environments</p>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-pink-900/20 to-cyan-900/20 border border-pink-500/30 hover:border-pink-400 transition-all hover:scale-105">
              <Trophy className="w-16 h-16 mb-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
              <h3 className="text-2xl font-bold mb-3">SPECIAL MOVES</h3>
              <p className="text-gray-300">Unleash devastating combos and signature finishing moves</p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <GameModes />

      {/* Stage Carousel */}
      <StageCarousel />

      {/* Social Proof */}
      <SocialProof />

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
