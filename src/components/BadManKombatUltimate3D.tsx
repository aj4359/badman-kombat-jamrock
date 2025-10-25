import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';
import { ViralStreetFighterCanvas } from './game/ViralStreetFighterCanvas';

interface Arena {
  id: string;
  name: string;
  description: string;
  background: string;
  music: string;
}

// Get fighter list from enhanced data
const FIGHTERS = Object.values(ENHANCED_FIGHTER_DATA);

const ARENAS: Arena[] = [
  {
    id: 'kingston-street',
    name: 'Kingston Downtown Streets',
    description: 'Rain-soaked streets with VHS aesthetic',
    background: '/assets/kingston-street-scene-1.jpg',
    music: '/assets/audio/dancehall-riddim-1.mp3'
  },
  {
    id: 'kingston-alley',
    name: 'Kingston Back Alley',
    description: 'Dark alley showdown',
    background: '/assets/kingston-alley-scene.jpg',
    music: '/assets/audio/dancehall-riddim-2.mp3'
  },
  {
    id: 'kingston-courtyard',
    name: 'Kingston Courtyard',
    description: 'Community gathering spot turned battleground',
    background: '/assets/kingston-courtyard-scene.jpg',
    music: '/assets/audio/reggae-drum-bass.mp3'
  },
  {
    id: 'negril-beach',
    name: 'Negril Beach Arena',
    description: 'Sunset combat at the beach',
    background: '/assets/negril-beach-arena.jpg',
    music: '/assets/audio/jamaican-dub-riddim.mp3'
  },
  {
    id: 'blue-mountains',
    name: 'Blue Mountains Temple',
    description: 'Ancient temple with mystical energy',
    background: '/assets/blue-mountains-temple.jpg',
    music: '/assets/audio/bmk-champion-loop.mp3'
  }
];


const BadManKombatUltimate3D = () => {
  const [gameState, setGameState] = useState<'menu' | 'select' | 'arena' | 'fight'>('menu');
  const [selectedPlayer1, setSelectedPlayer1] = useState<any>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<any>(null);
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play arena music
  useEffect(() => {
    if (gameState === 'fight' && selectedArena && audioEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(selectedArena.music);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(console.error);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [gameState, selectedArena, audioEnabled]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white overflow-x-hidden">
      {/* Menu */}
      {gameState === 'menu' && (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-12 p-8 relative">
          <div className="absolute inset-0 bg-[url('/assets/kingston-street-scene-1.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 space-y-8 text-center">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 animate-pulse drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                BADMAN KOMBAT
              </span>
              <span className="block text-6xl md:text-7xl mt-4 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                ULTIMATE
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 font-semibold tracking-wide">
              1980s Kingston Street Fights • Dancehall Meets Martial Arts<br />
              <span className="text-yellow-400">Project CYBER YARD</span>
            </p>
            <div className="flex flex-col gap-6">
              <Button 
                onClick={() => setGameState('select')} 
                className="text-3xl px-12 py-8 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 border-4 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:shadow-[0_0_50px_rgba(234,179,8,0.8)] transition-all duration-300 transform hover:scale-110"
              >
                ENTER THE RING
              </Button>
              <Button 
                onClick={() => window.location.href = '/john-wick-trailer'} 
                className="text-2xl px-10 py-6 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] transition-all duration-300 transform hover:scale-105"
              >
                JOHN WICK TRAILER
              </Button>
              <Button 
                onClick={() => window.location.href = '/game-overview'} 
                className="text-2xl px-10 py-6 bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 border-4 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] transition-all duration-300 transform hover:scale-105"
              >
                GAME OVERVIEW
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                className="text-xl px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] transition-all duration-300 transform hover:scale-105"
              >
                VIEW EPIC INTRO
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fighter Selection */}
      {gameState === 'select' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/50 to-black" />
          <div className="relative z-10 w-full max-w-7xl">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              {!selectedPlayer1 ? 'PLAYER 1: SELECT FIGHTER' : 'PLAYER 2: SELECT FIGHTER'}
            </h2>
            <p className="text-center text-gray-400 mb-12">Choose your warrior from the streets of Kingston</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {FIGHTERS.map(fighter => {
                const spriteMap: Record<string, string> = {
                  'leroy': '/src/assets/leroy-sprite.png',
                  'jordan': '/src/assets/jordan-sprite.png',
                  'sifu': '/src/assets/sifu-sprite.png',
                  'razor': '/src/assets/razor-sprite.png',
                  'rootsman': '/src/assets/rootsman-sprite.png',
                  'asha': '/src/assets/asha-warrior-sprite.png'
                };
                
                return (
                  <button
                    key={fighter.id}
                    onClick={() => {
                      if (!selectedPlayer1) {
                        setSelectedPlayer1(fighter);
                      } else if (!selectedPlayer2 || selectedPlayer2.id === fighter.id) {
                        if (fighter.id !== selectedPlayer1.id) {
                          setSelectedPlayer2(fighter);
                          setGameState('arena');
                        }
                      }
                    }}
                    disabled={selectedPlayer1?.id === fighter.id}
                    className="group relative p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-4 hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-[0_0_40px_rgba(234,179,8,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: selectedPlayer1?.id === fighter.id || selectedPlayer2?.id === fighter.id 
                        ? fighter.colors.primary 
                        : '#374151' 
                    }}
                  >
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg bg-black/30">
                      <img 
                        src={spriteMap[fighter.id] || '/src/assets/leroy-sprite.png'} 
                        alt={fighter.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-center" style={{ color: fighter.colors.primary }}>
                      {fighter.name}
                    </h3>
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>PWR: {fighter.stats.power}</span>
                      <span>SPD: {fighter.stats.speed}</span>
                      <span>DEF: {fighter.stats.defense}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center line-clamp-2">
                      {fighter.voiceLines[0]?.text || 'Ready to fight!'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Arena Selection */}
      {gameState === 'arena' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/30 to-black" />
          <div className="relative z-10 w-full max-w-7xl">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
              SELECT BATTLEGROUND
            </h2>
            <p className="text-center text-gray-400 mb-12">Fight across iconic Jamaican locations</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ARENAS.map(arena => (
                <button
                  key={arena.id}
                  onClick={() => {
                    setSelectedArena(arena);
                    setGameState('fight');
                  }}
                  className="group relative overflow-hidden rounded-xl border-4 border-gray-700 hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-[0_0_50px_rgba(234,179,8,0.6)]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={arena.background} 
                      alt={arena.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2 text-yellow-400 drop-shadow-lg">
                      {arena.name}
                    </h3>
                    <p className="text-sm text-gray-200 drop-shadow-md">{arena.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fight Screen */}
      {gameState === 'fight' && selectedPlayer1 && selectedPlayer2 && selectedArena && (
        <div className="relative w-full h-screen overflow-hidden">
          {/* Back Button */}
          <Button
            onClick={() => {
              setGameState('menu');
              setSelectedPlayer1(null);
              setSelectedPlayer2(null);
              setSelectedArena(null);
            }}
            variant="outline"
            size="lg"
            className="fixed top-4 left-4 z-50 bg-black/80 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            EXIT
          </Button>

          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="fixed top-4 right-4 z-50 p-4 bg-black/80 border-2 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
          >
            {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Game Canvas */}
          <ViralStreetFighterCanvas 
            fighterData={{
              player1: selectedPlayer1,
              player2: selectedPlayer2
            }}
            stage={selectedArena}
          />
        </div>
      )}
    </div>
  );
};

export default BadManKombatUltimate3D;

