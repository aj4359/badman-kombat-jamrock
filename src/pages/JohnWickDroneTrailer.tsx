import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Square, Camera } from 'lucide-react';
import { ViralStreetFighterCanvas } from '@/components/game/ViralStreetFighterCanvas';
import { CinematicRecorder } from '@/components/game/CinematicRecorder';
import { CinematicEffects } from '@/components/game/CinematicEffects';
import { useDroneCamera } from '@/hooks/useDroneCamera';
import { 
  ALL_JOHN_WICK_SEQUENCES, 
  JOHN_WICK_ACTION_SEQUENCE,
  JohnWickTrailerSequence 
} from '@/utils/johnWickDroneSequences';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JohnWickDroneTrailer() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<JohnWickTrailerSequence>(JOHN_WICK_ACTION_SEQUENCE);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  
  // John Wick specific state
  const [killCount, setKillCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [showHeadshot, setShowHeadshot] = useState(false);
  const [bulletTime, setBulletTime] = useState(false);
  const [currentOpponent, setCurrentOpponent] = useState(0);
  
  const opponents = ['leroy', 'jordan', 'razor', 'sifu'];
  
  const { executeDroneSequence, droneState } = useDroneCamera();

  const fighterData = useMemo(() => ({
    player1: {
      id: 'johnwick',
      name: 'JOHN WICK',
      enhancedData: { stats: { power: 95, speed: 90, defense: 80 } }
    },
    player2: {
      id: opponents[currentOpponent],
      name: opponents[currentOpponent].toUpperCase(),
      enhancedData: { stats: { power: 85, speed: 90, defense: 75 } }
    }
  }), [currentOpponent]);

  const handleGenerateTrailer = useCallback(async () => {
    console.log('🎬 Starting John Wick Drone Trailer');
    setIsGenerating(true);
    setCurrentShotIndex(0);
    setKillCount(0);
    setComboCount(0);
    
    // Execute drone sequence
    executeDroneSequence(selectedSequence.shots);
    
    // Track progress and trigger effects
    let shotIndex = 0;
    let elapsed = 0;
    
    const progressInterval = setInterval(() => {
      if (shotIndex >= selectedSequence.shots.length) {
        clearInterval(progressInterval);
        setIsGenerating(false);
        setBulletTime(false);
        setComboCount(0);
        console.log('✅ John Wick Trailer Complete');
        return;
      }
      
      const currentShot = selectedSequence.shots[shotIndex];
      
      // Trigger effects based on shot name
      if (currentShot.name.includes('headshot') && elapsed === 0) {
        setShowHeadshot(true);
        setKillCount(prev => prev + 1);
        setTimeout(() => setShowHeadshot(false), 800);
      }
      
      if (currentShot.name.includes('bullet_time') && elapsed === 0) {
        setBulletTime(true);
      } else if (!currentShot.name.includes('bullet_time') && bulletTime) {
        setBulletTime(false);
      }
      
      if (currentShot.name.includes('combat') || currentShot.name.includes('rapid')) {
        setComboCount(Math.floor(Math.random() * 15) + 5);
      } else {
        setComboCount(0);
      }
      
      elapsed += 100;
      
      if (elapsed >= currentShot.duration) {
        shotIndex++;
        setCurrentShotIndex(shotIndex);
        elapsed = 0;
        
        // Cycle opponent
        setCurrentOpponent(prev => (prev + 1) % opponents.length);
      }
    }, 100);
  }, [selectedSequence, executeDroneSequence, bulletTime]);

  const handleSequenceChange = (sequenceName: string) => {
    const sequence = ALL_JOHN_WICK_SEQUENCES.find(s => s.name === sequenceName);
    if (sequence) {
      setSelectedSequence(sequence);
      setCurrentShotIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-white">
      {/* Header with Continental aesthetic */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/95 border-b-2 border-red-600/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="ghost" className="text-white hover:text-red-400">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white font-serif tracking-wider">
              JOHN WICK
            </h1>
            <p className="text-red-400 text-sm tracking-widest">CINEMATIC DRONE TRAILER</p>
          </div>
          
          <Badge variant="outline" className="border-red-500 text-red-400">
            <Camera className="w-3 h-3 mr-1" />
            BABA YAGA
          </Badge>
        </div>
      </div>

      <div className="pt-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Preview - Left Side */}
        <div className="lg:col-span-2">
          <Card className="bg-black/60 border-red-600/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-400">LIVE PREVIEW</h2>
              {isGenerating && (
                <Badge variant="outline" className="border-red-500 text-red-400 animate-pulse">
                  <Camera className="w-3 h-3 mr-1" />
                  RECORDING
                </Badge>
              )}
            </div>
            
            {/* Canvas with effects overlay */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <ViralStreetFighterCanvas
                fighterData={fighterData}
                canvasRef={canvasRef}
                isRecording={isGenerating}
              />
              
              {/* John Wick Cinematic Effects */}
              <CinematicEffects
                showFilmGrain={true}
                showVignette={true}
                colorGrade="johnwick"
                bulletTime={bulletTime}
                killCount={killCount}
                comboCount={comboCount}
                showHeadshot={showHeadshot}
              />
              
              {/* Shot Info Overlay */}
              {isGenerating && currentShotIndex < selectedSequence.shots.length && (
                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-600/50">
                  <div className="text-xs text-gray-400">CAMERA</div>
                  <div className="text-sm font-bold text-red-400">
                    {selectedSequence.shots[currentShotIndex]?.name.toUpperCase().replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Shot {currentShotIndex + 1} / {selectedSequence.shots.length}
                  </div>
                </div>
              )}

              {/* Drone Camera Info */}
              <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-red-600/50 text-xs font-mono">
                <p className="text-red-400">📹 DRONE CAM</p>
                <p className="text-white/60">Zoom: {droneState.zoom.toFixed(1)}x</p>
                <p className="text-white/60">Elev: {Math.round(droneState.elevation)}px</p>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="mt-4">
              <CinematicRecorder canvasRef={canvasRef} />
            </div>
          </Card>
        </div>

        {/* Control Panel - Right Side */}
        <div className="space-y-4">
          {/* Sequence Selector */}
          <Card className="bg-black/60 border-red-600/50 p-6">
            <h3 className="text-lg font-bold text-red-400 mb-4">SEQUENCE</h3>
            
            <Select value={selectedSequence.name} onValueChange={handleSequenceChange}>
              <SelectTrigger className="bg-black/60 border-red-600/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-red-600/50">
                {ALL_JOHN_WICK_SEQUENCES.map((seq) => (
                  <SelectItem 
                    key={seq.name} 
                    value={seq.name}
                    className="text-white hover:bg-red-600/20"
                  >
                    {seq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Duration:</span>
                <span className="text-red-400">{selectedSequence.totalDuration / 1000}s</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shots:</span>
                <span className="text-red-400">{selectedSequence.shots.length}</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {selectedSequence.description}
              </p>
            </div>

            <Button
              onClick={handleGenerateTrailer}
              disabled={isGenerating}
              className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              {isGenerating ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  RECORDING...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  GENERATE TRAILER
                </>
              )}
            </Button>
          </Card>

          {/* Shot Timeline */}
          <Card className="bg-black/60 border-red-600/50 p-6">
            <h3 className="text-lg font-bold text-red-400 mb-4">TIMELINE</h3>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {selectedSequence.shots.map((shot, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all ${
                    index === currentShotIndex && isGenerating
                      ? 'bg-red-600/30 border-red-500'
                      : index < currentShotIndex && isGenerating
                      ? 'bg-green-600/20 border-green-600/40'
                      : 'bg-black/40 border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {index + 1}. {shot.name.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(shot.duration / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      {shot.zoom}x
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      {shot.elevation}px
                    </Badge>
                    {shot.orbit && (
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        ORBIT
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Info Card */}
          <Card className="bg-black/60 border-red-600/50 p-6">
            <h3 className="text-lg font-bold text-red-400 mb-3">THE CONTINENTAL</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Automated cinematic drone camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>John Wick themed visual effects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Bullet time, headshots, kill counters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Professional recording ready</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
