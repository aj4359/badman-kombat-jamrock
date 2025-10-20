import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface Fighter {
  id: string;
  name: string;
  stats: { power: number; speed: number; defense: number };
  colors: { primary: string; secondary: string };
}

interface ViralStreetFighterCanvasProps {
  player1: Fighter;
  player2: Fighter;
  stage: { name: string; background: string };
  onBack: () => void;
}

const ViralStreetFighterCanvas: React.FC<ViralStreetFighterCanvasProps> = ({
  player1,
  player2,
  stage,
  onBack
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showLocation, setShowLocation] = useState(true);
  const [p1Health, setP1Health] = useState(100);
  const [p2Health, setP2Health] = useState(100);

  useEffect(() => {
    // Show location intro for 3 seconds
    const timer = setTimeout(() => setShowLocation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1280;
    canvas.height = 720;

    // Load background
    const bgImage = new Image();
    bgImage.src = stage.background;
    
    let animationFrame: number;
    let p1X = 200;
    let p2X = 1000;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (bgImage.complete) {
        ctx.globalAlpha = 0.7;
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }

      // Draw stage name overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#00d4ff';
      ctx.textAlign = 'center';
      ctx.fillText(stage.name.toUpperCase(), canvas.width / 2, canvas.height - 25);

      // Draw fighters (simple rectangles for now - sprites will be added)
      ctx.fillStyle = player1.colors.primary;
      ctx.fillRect(p1X, 400, 80, 150);
      
      ctx.fillStyle = player2.colors.primary;
      ctx.fillRect(p2X, 400, 80, 150);

      // Draw names
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(player1.name, p1X + 40, 380);
      ctx.fillText(player2.name, p2X + 40, 380);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [player1, player2, stage]);

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Location Introduction Overlay */}
      {showLocation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center animate-fade-in">
            <div className="text-6xl md:text-8xl font-black text-white mb-4 tracking-wider">
              {stage.name.toUpperCase()}
            </div>
            <div className="text-2xl text-cyan-400 tracking-[0.3em]">LOADING BATTLEGROUND</div>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full border-4 border-cyan-500/20"
      />

      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between">
        {/* Player 1 Health */}
        <div className="flex-1 max-w-md">
          <div className="text-white font-bold mb-2 text-xl">{player1.name}</div>
          <div className="h-8 bg-black/50 border-2 border-red-500/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300"
              style={{ width: `${p1Health}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="mx-8 text-center">
          <div className="text-6xl font-black text-white bg-black/50 px-8 py-4 rounded-lg border-2 border-cyan-400/50">
            99
          </div>
          <div className="text-cyan-400 text-sm mt-2 font-bold tracking-wider">ROUND 1</div>
        </div>

        {/* Player 2 Health */}
        <div className="flex-1 max-w-md">
          <div className="text-white font-bold mb-2 text-xl text-right">{player2.name}</div>
          <div className="h-8 bg-black/50 border-2 border-red-500/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-red-500 to-yellow-500 transition-all duration-300 ml-auto"
              style={{ width: `${p2Health}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-6 flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-white/20 hover:border-cyan-400 text-white hover:text-cyan-400 bg-black/50 backdrop-blur-sm"
        >
          BACK
        </Button>
      </div>

      {/* Controls Instructions */}
      <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <div className="text-white/70 text-sm space-y-1">
          <div><span className="text-cyan-400 font-bold">WASD</span> - Move</div>
          <div><span className="text-cyan-400 font-bold">J</span> - Punch</div>
          <div><span className="text-cyan-400 font-bold">K</span> - Kick</div>
          <div><span className="text-cyan-400 font-bold">L</span> - Special</div>
        </div>
      </div>
    </div>
  );
};

export default ViralStreetFighterCanvas;
