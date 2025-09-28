import React, { useRef, useEffect, useCallback } from 'react';

interface Fighter {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  facing: 'left' | 'right';
  state: 'idle' | 'walking' | 'attacking';
  name: string;
}

interface GameState {
  player1: Fighter;
  player2: Fighter;
  keys: { [key: string]: boolean };
}

export const SimpleGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    player1: {
      x: 150,
      y: 260,
      width: 80,
      height: 120,
      health: 100,
      facing: 'right',
      state: 'idle',
      name: 'LEROY'
    },
    player2: {
      x: 570,
      y: 260,
      width: 80,
      height: 120,
      health: 100,
      facing: 'left',
      state: 'idle',
      name: 'JORDAN'
    },
    keys: {}
  });

  // Draw a human-like fighter sprite
  const drawFighter = useCallback((ctx: CanvasRenderingContext2D, fighter: Fighter) => {
    const { x, y, width, height, facing, name } = fighter;
    
    // Colors for different fighters
    const colors = name === 'LEROY' 
      ? { skin: '#8B4513', clothes: '#FF6B35', belt: '#FFD700' }
      : { skin: '#DEB887', clothes: '#4169E1', belt: '#FF69B4' };

    ctx.save();
    
    // Flip context if facing left
    if (facing === 'left') {
      ctx.scale(-1, 1);
      ctx.translate(-x - width, 0);
    }

    // Head
    ctx.fillStyle = colors.skin;
    ctx.beginPath();
    ctx.arc(x + width/2, y + 15, 12, 0, Math.PI * 2);
    ctx.fill();

    // Body (gi/uniform)
    ctx.fillStyle = colors.clothes;
    ctx.fillRect(x + width/2 - 15, y + 25, 30, 50);

    // Arms
    ctx.fillStyle = colors.skin;
    ctx.fillRect(x + width/2 - 25, y + 30, 10, 35); // Left arm
    ctx.fillRect(x + width/2 + 15, y + 30, 10, 35); // Right arm

    // Belt
    ctx.fillStyle = colors.belt;
    ctx.fillRect(x + width/2 - 15, y + 60, 30, 8);

    // Legs
    ctx.fillStyle = colors.clothes;
    ctx.fillRect(x + width/2 - 12, y + 75, 10, 35); // Left leg
    ctx.fillRect(x + width/2 + 2, y + 75, 10, 35); // Right leg

    // Feet
    ctx.fillStyle = '#2C1810';
    ctx.fillRect(x + width/2 - 15, y + 110, 12, 8); // Left foot
    ctx.fillRect(x + width/2 + 3, y + 110, 12, 8); // Right foot

    // Fighting stance details
    if (fighter.state === 'attacking') {
      // Add attack effect
      ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
      const effectX = facing === 'right' ? x + width : x - 20;
      ctx.fillRect(effectX, y + 40, 20, 20);
    }

    ctx.restore();

    // Name label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, x + width/2, y - 10);
  }, []);

  const updateGame = useCallback(() => {
    const gameState = gameStateRef.current;
    const speed = 4;

    // Reset states
    gameState.player1.state = 'idle';
    gameState.player2.state = 'idle';

    // Player 1 controls (WASD + JK for attacks)
    if (gameState.keys['KeyW']) gameState.player1.y -= speed;
    if (gameState.keys['KeyS']) gameState.player1.y += speed;
    if (gameState.keys['KeyA']) {
      gameState.player1.x -= speed;
      gameState.player1.facing = 'left';
      gameState.player1.state = 'walking';
    }
    if (gameState.keys['KeyD']) {
      gameState.player1.x += speed;
      gameState.player1.facing = 'right';
      gameState.player1.state = 'walking';
    }
    if (gameState.keys['KeyJ'] || gameState.keys['KeyK']) {
      gameState.player1.state = 'attacking';
    }

    // Player 2 controls (Arrow keys + Numpad 1,2 for attacks)
    if (gameState.keys['ArrowUp']) gameState.player2.y -= speed;
    if (gameState.keys['ArrowDown']) gameState.player2.y += speed;
    if (gameState.keys['ArrowLeft']) {
      gameState.player2.x -= speed;
      gameState.player2.facing = 'left';
      gameState.player2.state = 'walking';
    }
    if (gameState.keys['ArrowRight']) {
      gameState.player2.x += speed;
      gameState.player2.facing = 'right';
      gameState.player2.state = 'walking';
    }
    if (gameState.keys['Numpad1'] || gameState.keys['Numpad2']) {
      gameState.player2.state = 'attacking';
    }

    // Keep players on screen
    gameState.player1.x = Math.max(0, Math.min(720, gameState.player1.x));
    gameState.player1.y = Math.max(50, Math.min(330, gameState.player1.y));
    gameState.player2.x = Math.max(0, Math.min(720, gameState.player2.x));
    gameState.player2.y = Math.max(50, Math.min(330, gameState.player2.y));

    // Auto-face opponent
    if (gameState.player1.x < gameState.player2.x) {
      if (gameState.player1.state === 'idle') gameState.player1.facing = 'right';
      if (gameState.player2.state === 'idle') gameState.player2.facing = 'left';
    } else {
      if (gameState.player1.state === 'idle') gameState.player1.facing = 'left';
      if (gameState.player2.state === 'idle') gameState.player2.facing = 'right';
    }
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Street Fighter-style background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FF6B35'); // Orange sky
    gradient.addColorStop(0.6, '#4169E1'); // Blue horizon
    gradient.addColorStop(1, '#1a1a2e'); // Dark ground
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground platform
    ctx.fillStyle = '#2C5F41';
    ctx.fillRect(0, 380, canvas.width, 20);
    
    // Platform details
    ctx.fillStyle = '#1B3B2F';
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.fillRect(i, 385, 10, 15);
    }

    // Draw fighters
    drawFighter(ctx, gameState.player1);
    drawFighter(ctx, gameState.player2);

    // Health bars
    const barWidth = 300;
    const barHeight = 20;
    
    // Player 1 health bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(20, 20, barWidth + 4, barHeight + 4);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(22, 22, barWidth, barHeight);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(22, 22, (gameState.player1.health / 100) * barWidth, barHeight);
    
    // Player 2 health bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(canvas.width - barWidth - 24, 20, barWidth + 4, barHeight + 4);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(canvas.width - barWidth - 22, 22, barWidth, barHeight);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(canvas.width - barWidth - 22, 22, (gameState.player2.health / 100) * barWidth, barHeight);
    
    // Player names
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(gameState.player1.name, 22, 15);
    ctx.textAlign = 'right';
    ctx.fillText(gameState.player2.name, canvas.width - 22, 15);
    
    // Center "VS" indicator
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('VS', canvas.width / 2, 35);
  }, [drawFighter]);

  const gameLoop = useCallback(() => {
    updateGame();
    render();
    requestAnimationFrame(gameLoop);
  }, [updateGame, render]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    gameStateRef.current.keys[e.code] = true;
    e.preventDefault();
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    gameStateRef.current.keys[e.code] = false;
    e.preventDefault();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const loopId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(loopId);
    };
  }, [handleKeyDown, handleKeyUp, gameLoop]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">
        🥊 STREET FIGHTER KOMBAT
      </h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border border-yellow-400 rounded-lg shadow-2xl"
        />
      </div>
      <div className="mt-4 text-center space-y-2">
        <div className="flex gap-8 justify-center">
          <div className="text-white">
            <strong className="text-cyan-400">LEROY (P1):</strong>
            <div className="text-sm">WASD = Move | J/K = Attack</div>
          </div>
          <div className="text-white">
            <strong className="text-pink-400">JORDAN (P2):</strong>
            <div className="text-sm">Arrows = Move | Num1/Num2 = Attack</div>
          </div>
        </div>
        <p className="text-yellow-400 text-sm font-bold">
          HUMAN STREET FIGHTERS - NO MORE RECTANGLES!
        </p>
      </div>
    </div>
  );
};
