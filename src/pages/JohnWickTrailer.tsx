import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViralStreetFighterCanvas } from '@/components/game/ViralStreetFighterCanvas';
import { TrailerOverlays } from '@/components/game/TrailerOverlays';
import { CinematicRecorder } from '@/components/game/CinematicRecorder';
import { CinematicEffects } from '@/components/game/CinematicEffects';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

const JohnWickTrailer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPhase, setCurrentPhase] = useState<'title' | 'gameplay' | 'victory' | 'none'>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentOpponent, setCurrentOpponent] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [killCount, setKillCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [showHeadshot, setShowHeadshot] = useState(false);
  const [bulletTime, setBulletTime] = useState(false);
  
  const opponents = ['leroy', 'jordan', 'razor', 'sifu'];
  
  const trailerSequence = [
    { phase: 'title' as const, duration: 3000 },
    { phase: 'gameplay' as const, duration: 25000 },
    { phase: 'victory' as const, duration: 4000 }
  ];
  
  const startTrailer = () => {
    setIsGenerating(true);
    setCurrentOpponent(0);
    let currentIndex = 0;
    
    const advancePhase = () => {
      if (currentIndex < trailerSequence.length) {
        const { phase, duration } = trailerSequence[currentIndex];
        setCurrentPhase(phase);
        
        if (phase === 'gameplay') {
          const opponentInterval = setInterval(() => {
            setCurrentOpponent(prev => {
              const newOpp = (prev + 1) % opponents.length;
              setKillCount(prev + 1);
              return newOpp;
            });
          }, 6000);
          
          // Simulate combat effects
          const effectsInterval = setInterval(() => {
            setComboCount(Math.floor(Math.random() * 15) + 5);
            if (Math.random() > 0.7) {
              setShowHeadshot(true);
              setTimeout(() => setShowHeadshot(false), 800);
            }
            if (Math.random() > 0.8) {
              setBulletTime(true);
              setTimeout(() => setBulletTime(false), 1500);
            }
          }, 2000);
          
          setTimeout(() => {
            clearInterval(opponentInterval);
            clearInterval(effectsInterval);
            currentIndex++;
            advancePhase();
          }, duration);
        } else {
          setTimeout(() => {
            currentIndex++;
            advancePhase();
          }, duration);
        }
      } else {
        setCurrentPhase('none');
        setIsGenerating(false);
      }
    };
    
    advancePhase();
  };
  
  const fighterData = useMemo(() => ({
    player1: { id: 'johnwick', name: 'JOHN WICK' },
    player2: { id: opponents[currentOpponent], name: opponents[currentOpponent].toUpperCase() }
  }), [currentOpponent]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/90 border-b border-red-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="ghost" className="text-red-400 hover:text-red-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🎬 JOHN WICK TRAILER
          </h1>
          
          <div className="w-32"></div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Canvas */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-red-900/50 mb-6">
            <ViralStreetFighterCanvas 
              fighterData={fighterData} 
              canvasRef={canvasRef}
              isRecording={isRecording}
            />
            <TrailerOverlays
              phase={currentPhase}
              fighterName={currentPhase === 'title' ? 'BABA YAGA' : undefined}
              comboCount={currentPhase === 'gameplay' ? comboCount : undefined}
              isSlowMotion={bulletTime}
            />
            <CinematicEffects
              showFilmGrain={true}
              showVignette={true}
              colorGrade="johnwick"
              bulletTime={bulletTime}
              killCount={currentPhase === 'gameplay' ? killCount : 0}
              comboCount={currentPhase === 'gameplay' ? comboCount : 0}
              showHeadshot={showHeadshot}
            />
          </div>
          
          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {!isGenerating && (
              <Button
                onClick={startTrailer}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-6 px-12"
              >
                <Play className="mr-2 h-5 w-5" />
                Generate Trailer
              </Button>
            )}
            
            {isGenerating && (
              <div className="text-center">
                <p className="text-red-400 font-bold text-xl mb-2">
                  GENERATING: {currentPhase.toUpperCase()}
                </p>
                <p className="text-white/60">
                  Opponent: {opponents[currentOpponent].toUpperCase()}
                </p>
              </div>
            )}
          </div>
          
          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-gray-900 to-black border border-red-900/30 rounded-lg p-6">
              <h3 className="text-red-400 font-bold text-lg mb-2">🎯 PRECISION</h3>
              <p className="text-white/70">Watch John Wick's legendary gun-fu combat style in action</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-black border border-red-900/30 rounded-lg p-6">
              <h3 className="text-orange-400 font-bold text-lg mb-2">⚡ SPEED</h3>
              <p className="text-white/70">Experience rapid-fire combos and devastating precision headshots</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-black border border-red-900/30 rounded-lg p-6">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">💀 BABA YAGA</h3>
              <p className="text-white/70">Unleash the Continental Protocol super move</p>
            </div>
          </div>
        </div>
      </div>
      
      <CinematicRecorder 
        canvasRef={canvasRef} 
        onRecordingStart={() => {
          setIsRecording(true);
          startTrailer();
        }}
        onRecordingStop={() => setIsRecording(false)}
      />
    </div>
  );
};

export default JohnWickTrailer;
