import React, { useCallback, useEffect, useRef } from 'react';

interface FightingStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameState: any;
  fighterSprites: any;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
}

const FightingStage: React.FC<FightingStageProps> = ({
  canvasRef,
  gameState,
  fighterSprites,
  onKeyDown,
  onKeyUp
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced keyboard input handling for Street Fighter-style controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      // Player 1 Controls (WASD + JK)
      const p1Keys = ['a', 'A', 'd', 'D', 'w', 'W', 's', 'S', 'j', 'J', 'k', 'K'];
      // Player 2 Controls (Arrow Keys + 1,2)
      const p2Keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '1', '2', 'End', 'PageDown'];
      
      if (p1Keys.includes(e.key) || p2Keys.includes(e.key)) {
        onKeyDown(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      onKeyUp(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  // Street Fighter authentic stage rendering
  const renderStageEffects = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Street Fighter-style background
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    skyGradient.addColorStop(0, 'hsl(210, 40%, 25%)'); // Dark blue sky
    skyGradient.addColorStop(1, 'hsl(200, 35%, 20%)'); // Slightly lighter
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

    // Kingston street background elements
    ctx.fillStyle = 'hsl(25, 20%, 15%)'; // Dark buildings silhouette
    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);

    // Ground - concrete street
    const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
    groundGradient.addColorStop(0, 'hsl(30, 15%, 35%)'); // Concrete color
    groundGradient.addColorStop(1, 'hsl(30, 10%, 25%)'); // Darker at bottom
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

    // Street Fighter floor markings
    ctx.strokeStyle = 'hsl(50, 80%, 60%, 0.3)'; // Yellow street lines
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 10]);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height * 0.6);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // Fighting area boundaries
    ctx.strokeStyle = 'hsl(0, 80%, 50%, 0.2)'; // Red danger zone
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height * 0.6);
    ctx.lineTo(50, canvas.height);
    ctx.moveTo(canvas.width - 50, canvas.height * 0.6);
    ctx.lineTo(canvas.width - 50, canvas.height);
    ctx.stroke();
    
    ctx.setLineDash([]);

  }, [canvasRef]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-background via-background/80 to-muted/20"
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 25%),
          radial-gradient(circle at 75% 75%, hsl(var(--secondary)) 0%, transparent 25%)
        `,
        backgroundSize: '400px 400px, 300px 300px',
        backgroundPosition: '0 0, 50px 50px'
      }}
    >
      {/* Enhanced canvas with Street Fighter styling */}
      <canvas
        ref={canvasRef}
        width={1024}
        height={576}
        className="w-full h-full border-2 border-neon-cyan/30 rounded-lg shadow-2xl shadow-neon-cyan/20"
        style={{
          imageRendering: 'pixelated', // Crisp pixel art rendering
          filter: 'contrast(1.1) saturate(1.2)', // Enhanced visual impact
        }}
        tabIndex={0}
      />
      
      {/* Fighting stage overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner damage indicators */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-60" />
        
        {/* Stage lighting effects */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse at top, transparent 40%, hsl(var(--primary)) 70%, transparent 100%),
              radial-gradient(ellipse at bottom, transparent 60%, hsl(var(--secondary)) 80%, transparent 100%)
            `
          }}
        />
      </div>

      {/* Round indicator overlay */}
      {gameState.winner && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="font-retro text-6xl font-black text-neon-cyan mb-4 animate-pulse">
              {gameState.winner === 'Player 1' ? 'PLAYER 1 WINS!' : 'PLAYER 2 WINS!'}
            </h2>
            <p className="text-neon-pink text-xl font-retro">
              PERFECT VICTORY
            </p>
          </div>
        </div>
      )}

      {/* Control hints */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/60 font-mono">
        <div>P1: WASD + J(Punch) K(Block)</div>
        <div>P2: Arrows + 1(Punch) 2(Block)</div>
      </div>
      
      {/* Stage info */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/60 font-mono">
        Kingston Downtown Arena
      </div>
    </div>
  );
};

export default FightingStage;