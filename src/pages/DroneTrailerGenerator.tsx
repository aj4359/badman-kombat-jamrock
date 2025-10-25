import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Square, Download, Video, Camera, Zap } from 'lucide-react';
import { ViralStreetFighterCanvas } from '@/components/game/ViralStreetFighterCanvas';
import { CinematicRecorder } from '@/components/game/CinematicRecorder';
import { useDroneCamera } from '@/hooks/useDroneCamera';
import { 
  ALL_SEQUENCES, 
  EPIC_TRAILER_SEQUENCE,
  ACTION_SEQUENCE,
  CINEMATIC_SHOWCASE,
  TrailerSequence 
} from '@/utils/droneTrailerSequences';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DroneTrailerGenerator() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<TrailerSequence>(EPIC_TRAILER_SEQUENCE);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const { executeDroneSequence, droneState, availableShots } = useDroneCamera();

  // Default fighter data for trailer
  const fighterData = {
    player1: {
      id: 'johnwick',
      name: 'John Wick',
      enhancedData: {
        stats: { power: 95, speed: 90, defense: 85 }
      }
    },
    player2: {
      id: 'leroy',
      name: 'Leroy "Cyber Storm"',
      enhancedData: {
        stats: { power: 85, speed: 90, defense: 75 }
      }
    }
  };

  const handleGenerateTrailer = () => {
    console.log('🎬 Starting drone trailer generation');
    setIsGenerating(true);
    setCurrentShotIndex(0);
    
    // Execute the selected sequence
    executeDroneSequence(selectedSequence.shots);
    
    // Track progress through shots
    let shotIndex = 0;
    let elapsed = 0;
    
    const progressInterval = setInterval(() => {
      if (shotIndex >= selectedSequence.shots.length) {
        clearInterval(progressInterval);
        setIsGenerating(false);
        console.log('✅ Trailer generation complete');
        return;
      }
      
      const currentShot = selectedSequence.shots[shotIndex];
      elapsed += 100;
      
      if (elapsed >= currentShot.duration) {
        shotIndex++;
        setCurrentShotIndex(shotIndex);
        elapsed = 0;
      }
    }, 100);
  };

  const handleSequenceChange = (sequenceName: string) => {
    const sequence = ALL_SEQUENCES.find(s => s.name === sequenceName);
    if (sequence) {
      setSelectedSequence(sequence);
      setCurrentShotIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="border-yellow-500/50 hover:bg-yellow-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Drone Camera Trailer Generator
              </h1>
              <p className="text-gray-400 mt-1">
                Create cinematic trailers with automated drone camera movements
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-green-500 text-green-400">
            <Camera className="w-3 h-3 mr-1" />
            AI Director
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Canvas - Left Side (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="bg-black/40 border-yellow-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-yellow-400">Live Preview</h2>
              <div className="flex items-center gap-2">
                {isGenerating && (
                  <Badge variant="outline" className="border-red-500 text-red-400 animate-pulse">
                    <Video className="w-3 h-3 mr-1" />
                    Generating
                  </Badge>
                )}
                {isRecording && (
                  <Badge variant="outline" className="border-red-500 text-red-400">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1" />
                    Recording
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Canvas Container */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <ViralStreetFighterCanvas
                fighterData={fighterData}
                canvasRef={canvasRef}
                isRecording={isRecording}
              />
              
              {/* Shot Info Overlay */}
              {isGenerating && currentShotIndex < selectedSequence.shots.length && (
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-yellow-500/30">
                  <div className="text-xs text-gray-400">Current Shot</div>
                  <div className="text-sm font-bold text-yellow-400">
                    {selectedSequence.shots[currentShotIndex]?.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Shot {currentShotIndex + 1} / {selectedSequence.shots.length}
                  </div>
                </div>
              )}

              {/* Camera Info */}
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-yellow-500/30 text-xs">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-gray-400">Zoom:</span>
                  <span className="text-yellow-400">{droneState.zoom.toFixed(2)}x</span>
                  <span className="text-gray-400">Elevation:</span>
                  <span className="text-yellow-400">{Math.round(droneState.elevation)}px</span>
                  <span className="text-gray-400">Rotation:</span>
                  <span className="text-yellow-400">{droneState.rotation.toFixed(1)}°</span>
                </div>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="mt-4">
              <CinematicRecorder canvasRef={canvasRef} />
            </div>
          </Card>
        </div>

        {/* Control Panel - Right Side (1/3 width) */}
        <div className="space-y-4">
          {/* Sequence Selector */}
          <Card className="bg-black/40 border-yellow-500/30 p-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">Trailer Sequence</h3>
            
            <Select value={selectedSequence.name} onValueChange={handleSequenceChange}>
              <SelectTrigger className="bg-black/60 border-yellow-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-yellow-500/30">
                {ALL_SEQUENCES.map((seq) => (
                  <SelectItem 
                    key={seq.name} 
                    value={seq.name}
                    className="text-white hover:bg-yellow-500/10"
                  >
                    {seq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Duration:</span>
                <span className="text-yellow-400">{selectedSequence.totalDuration / 1000}s</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shots:</span>
                <span className="text-yellow-400">{selectedSequence.shots.length}</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {selectedSequence.description}
              </p>
            </div>

            <Button
              onClick={handleGenerateTrailer}
              disabled={isGenerating}
              className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {isGenerating ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Generate Trailer
                </>
              )}
            </Button>
          </Card>

          {/* Shot Timeline */}
          <Card className="bg-black/40 border-yellow-500/30 p-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">Shot Timeline</h3>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {selectedSequence.shots.map((shot, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all ${
                    index === currentShotIndex && isGenerating
                      ? 'bg-yellow-500/20 border-yellow-500'
                      : index < currentShotIndex && isGenerating
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-black/40 border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {index + 1}. {shot.name}
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
                        <Zap className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Info Card */}
          <Card className="bg-black/40 border-yellow-500/30 p-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">How It Works</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Select a trailer sequence preset</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Click "Generate Trailer" to start automated camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Watch the AI director execute cinematic shots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Use recording controls to capture the trailer</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
