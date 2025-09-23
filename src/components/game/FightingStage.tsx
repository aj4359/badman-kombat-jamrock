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

  // Enhanced visual effects for fighting stage
  const renderStageEffects = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Street Fighter style stage background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'hsl(240, 30%, 10%)');
    gradient.addColorStop(0.5, 'hsl(260, 40%, 15%)');
    gradient.addColorStop(1, 'hsl(240, 30%, 10%)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

    // Ground with Kingston vibes
    const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
    groundGradient.addColorStop(0, 'hsl(25, 50%, 20%)');
    groundGradient.addColorStop(1, 'hsl(25, 40%, 15%)');
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    // Enhanced grid pattern for cyberpunk feel
    ctx.strokeStyle = 'hsl(180, 100%, 50%, 0.15)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Center line for fighting reference
    ctx.strokeStyle = 'hsl(60, 100%, 50%, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
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