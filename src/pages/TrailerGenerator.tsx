import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViralStreetFighterCanvas } from '@/components/game/ViralStreetFighterCanvas';
import { CinematicRecorder } from '@/components/game/CinematicRecorder';
import { TrailerOverlays } from '@/components/game/TrailerOverlays';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';

type TrailerPhase = 'title' | 'intro' | 'gameplay' | 'victory' | 'credits' | 'none';

const TrailerGenerator = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPhase, setCurrentPhase] = useState<TrailerPhase>('none');
  const [isGenerating, setIsGenerating] = useState(false);

  // Trailer sequence timing
  const trailerSequence = [
    { phase: 'title' as TrailerPhase, duration: 3000 },
    { phase: 'intro' as TrailerPhase, duration: 2000 },
    { phase: 'gameplay' as TrailerPhase, duration: 20000 },
    { phase: 'victory' as TrailerPhase, duration: 3000 },
    { phase: 'credits' as TrailerPhase, duration: 2000 }
  ];

  const startTrailerSequence = () => {
    setIsGenerating(true);
    let currentIndex = 0;

    const advancePhase = () => {
      if (currentIndex < trailerSequence.length) {
        const { phase, duration } = trailerSequence[currentIndex];
        setCurrentPhase(phase);

        setTimeout(() => {
          currentIndex++;
          advancePhase();
        }, duration);
      } else {
        setCurrentPhase('none');
        setIsGenerating(false);
      }
    };

    advancePhase();
  };

  // Default fighter data for trailer
  const fighterData = {
    player1: { id: 'leroy', name: 'LEROY' },
    player2: { id: 'jordan', name: 'JORDAN' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 border-b border-yellow-400/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-2xl font-bold text-white">
            🎬 Cinematic Trailer Generator
          </h1>
          
          <div className="w-32"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-black/50 border-yellow-400/30 p-4">
              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
                <ViralStreetFighterCanvas 
                  fighterData={fighterData}
                />
                <TrailerOverlays
                  phase={currentPhase}
                  fighterName={currentPhase === 'intro' ? 'LEROY' : undefined}
                  comboCount={currentPhase === 'gameplay' ? 5 : undefined}
                  isSlowMotion={false}
                />
              </div>
            </Card>
          </div>

          {/* Controls & Info */}
          <div className="space-y-4">
            {/* Info Card */}
            <Card className="bg-black/50 border-yellow-400/30 p-4">
              <div className="flex items-start gap-2 mb-3">
                <Info className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-bold mb-2">How It Works</h3>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>• AI controls both fighters</li>
                    <li>• Dynamic camera follows action</li>
                    <li>• 30-second cinematic trailer</li>
                    <li>• 1080p 60fps output</li>
                    <li>• Ready for social media</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Sequence Info */}
            <Card className="bg-black/50 border-yellow-400/30 p-4">
              <h3 className="text-white font-bold mb-3">Trailer Sequence</h3>
              <div className="space-y-2">
                {trailerSequence.map((seq, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded ${
                      currentPhase === seq.phase
                        ? 'bg-yellow-400/20 border border-yellow-400'
                        : 'bg-white/5'
                    }`}
                  >
                    <span className="text-white text-sm capitalize">{seq.phase}</span>
                    <span className="text-white/50 text-xs">{seq.duration / 1000}s</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Generate Button */}
            {!isGenerating && (
              <Button
                onClick={startTrailerSequence}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-6"
              >
                Generate Trailer
              </Button>
            )}

            {isGenerating && (
              <div className="text-center text-yellow-400 font-bold">
                Generating: {currentPhase.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recorder Component */}
      <CinematicRecorder
        canvasRef={canvasRef}
        onRecordingStart={startTrailerSequence}
      />
    </div>
  );
};

export default TrailerGenerator;
