import React, { useRef, useEffect, useCallback } from 'react';

interface Fighter {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  color: string;
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
      x: 100,
      y: 200,
      width: 60,
      height: 80,
      health: 100,
      color: '#3b82f6' // blue
    },
    player2: {
      x: 640,
      y: 200,
      width: 60,
      height: 80,
      health: 100,
      color: '#ef4444' // red
    },
    keys: {}
  });

  const updateGame = useCallback(() => {
    const gameState = gameStateRef.current;
    const speed = 3;

    // Player 1 controls (WASD)
    if (gameState.keys['KeyW']) gameState.player1.y -= speed;
    if (gameState.keys['KeyS']) gameState.player1.y += speed;
    if (gameState.keys['KeyA']) gameState.player1.x -= speed;
    if (gameState.keys['KeyD']) gameState.player1.x += speed;

    // Player 2 controls (Arrow keys)
    if (gameState.keys['ArrowUp']) gameState.player2.y -= speed;
    if (gameState.keys['ArrowDown']) gameState.player2.y += speed;
    if (gameState.keys['ArrowLeft']) gameState.player2.x -= speed;
    if (gameState.keys['ArrowRight']) gameState.player2.x += speed;

    // Keep players on screen
    gameState.player1.x = Math.max(0, Math.min(800 - gameState.player1.width, gameState.player1.x));
    gameState.player1.y = Math.max(0, Math.min(400 - gameState.player1.height, gameState.player1.y));
    gameState.player2.x = Math.max(0, Math.min(800 - gameState.player2.width, gameState.player2.x));
    gameState.player2.y = Math.max(0, Math.min(400 - gameState.player2.height, gameState.player2.y));
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 350, canvas.width, 50);

    // Draw player 1
    ctx.fillStyle = gameState.player1.color;
    ctx.fillRect(gameState.player1.x, gameState.player1.y, gameState.player1.width, gameState.player1.height);
    
    // Draw player 1 label
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('P1 (WASD)', gameState.player1.x, gameState.player1.y - 10);

    // Draw player 2
    ctx.fillStyle = gameState.player2.color;
    ctx.fillRect(gameState.player2.x, gameState.player2.y, gameState.player2.width, gameState.player2.height);
    
    // Draw player 2 label
    ctx.fillStyle = 'white';
    ctx.fillText('P2 (Arrows)', gameState.player2.x, gameState.player2.y - 10);

    // Draw health bars
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(20, 20, 204, 24);
    ctx.fillRect(576, 20, 204, 24);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(22, 22, gameState.player1.health * 2, 20);
    ctx.fillRect(578, 22, gameState.player2.health * 2, 20);
    
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText('Player 1', 22, 15);
    ctx.fillText('Player 2', 578, 15);
  }, []);

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
      <h1 className="text-3xl font-bold text-white mb-4">SIMPLE FIGHTER</h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border border-slate-600 rounded-lg shadow-2xl"
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-white mb-2">
          <strong>Player 1:</strong> WASD to move | <strong>Player 2:</strong> Arrow keys to move
        </p>
        <p className="text-slate-400 text-sm">
          This is the minimal viable version - two controllable fighters
        </p>
      </div>
    </div>
  );
};
