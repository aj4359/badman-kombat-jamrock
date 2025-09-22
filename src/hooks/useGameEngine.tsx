import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioManager } from './useAudioManager';
import { useSpriteSystem } from './useSpriteSystem';

export interface Fighter {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  x: number;
  y: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  state: 'idle' | 'walking' | 'attacking' | 'blocking' | 'hurt' | 'jumping' | 'crouching' | 'special';
  animation: {
    frame: number;
    timer: number;
    duration: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  isGrounded: boolean;
  hitbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  attackBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
    active: boolean;
  };
  color: string;
}

export interface GameState {
  screen: 'menu' | 'characterSelect' | 'vs' | 'fighting' | 'paused' | 'gameOver';
  round: number;
  timer: number;
  fighters: {
    player1: Fighter | null;
    player2: Fighter | null;
  };
  selectedFighters: {
    player1: string | null;
    player2: string | null;
  };
  winner: string | null;
  stage: string;
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GROUND_Y = CANVAS_HEIGHT - 100;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 4;

export const useGameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number>();
  const { playEffect } = useAudioManager();
  const { drawFighter: drawFighterSprite } = useSpriteSystem();
  
  const [gameState, setGameState] = useState<GameState>({
    screen: 'fighting',
    round: 1,
    timer: 99,
    fighters: {
      player1: null,
      player2: null,
    },
    selectedFighters: {
      player1: null,
      player2: null,
    },
    winner: null,
    stage: 'downtown-kingston'
  });

  const [keys, setKeys] = useState<Record<string, boolean>>({});

  const createFighter = useCallback((id: string, name: string, x: number, color: string): Fighter => ({
    id,
    name,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    x,
    y: GROUND_Y - 100,
    width: 60,
    height: 100,
    facing: x < CANVAS_WIDTH / 2 ? 'right' : 'left',
    state: 'idle',
    animation: {
      frame: 0,
      timer: 0,
      duration: 200
    },
    velocity: {
      x: 0,
      y: 0
    },
    isGrounded: true,
    hitbox: {
      x: x - 30,
      y: GROUND_Y - 100,
      width: 60,
      height: 100
    },
    color
  }), []);

  const initializeFighters = useCallback(() => {
    const player1 = createFighter('leroy', 'Leroy', 200, 'hsl(180, 100%, 50%)');
    const player2 = createFighter('razor', 'Razor', CANVAS_WIDTH - 200, 'hsl(320, 100%, 60%)');
    
    setGameState(prev => ({
      ...prev,
      fighters: {
        player1,
        player2
      }
    }));
  }, [createFighter]);

  const checkCollision = useCallback((rect1: any, rect2: any): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const updateFighter = useCallback((fighter: Fighter, isPlayer1: boolean): Fighter => {
    const updated = { ...fighter };
    
    // Handle input
    if (isPlayer1) {
      // Player 1 controls: WASD + JKL
      if (keys['a'] || keys['A']) {
        updated.velocity.x = -MOVE_SPEED;
        updated.facing = 'left';
        updated.state = 'walking';
      } else if (keys['d'] || keys['D']) {
        updated.velocity.x = MOVE_SPEED;
        updated.facing = 'right';
        updated.state = 'walking';
      } else {
        updated.velocity.x = 0;
        if (updated.state === 'walking') updated.state = 'idle';
      }

      if (keys['w'] || keys['W']) {
        if (updated.isGrounded) {
          updated.velocity.y = JUMP_FORCE;
          updated.isGrounded = false;
          updated.state = 'jumping';
        }
      }

      if (keys['s'] || keys['S']) {
        if (updated.isGrounded) {
          updated.state = 'crouching';
        }
      }

      if (keys['j'] || keys['J']) {
        if (updated.state !== 'attacking') {
          playEffect('whoosh');
        }
        updated.state = 'attacking';
        updated.attackBox = {
          x: updated.facing === 'right' ? updated.x + updated.width : updated.x - 40,
          y: updated.y + 20,
          width: 40,
          height: 30,
          active: true
        };
      } else {
        updated.attackBox = undefined;
      }

      if (keys['k'] || keys['K']) {
        updated.state = 'blocking';
      }
    } else {
      // Player 2 controls: Arrow Keys + Numpad
      if (keys['ArrowLeft']) {
        updated.velocity.x = -MOVE_SPEED;
        updated.facing = 'left';
        updated.state = 'walking';
      } else if (keys['ArrowRight']) {
        updated.velocity.x = MOVE_SPEED;
        updated.facing = 'right';
        updated.state = 'walking';
      } else {
        updated.velocity.x = 0;
        if (updated.state === 'walking') updated.state = 'idle';
      }

      if (keys['ArrowUp']) {
        if (updated.isGrounded) {
          updated.velocity.y = JUMP_FORCE;
          updated.isGrounded = false;
          updated.state = 'jumping';
        }
      }

      if (keys['ArrowDown']) {
        if (updated.isGrounded) {
          updated.state = 'crouching';
        }
      }

      if (keys['1'] || keys['End']) {
        if (updated.state !== 'attacking') {
          playEffect('whoosh');
        }
        updated.state = 'attacking';
        updated.attackBox = {
          x: updated.facing === 'right' ? updated.x + updated.width : updated.x - 40,
          y: updated.y + 20,
          width: 40,
          height: 30,
          active: true
        };
      } else {
        updated.attackBox = undefined;
      }

      if (keys['2'] || keys['ArrowDown']) {
        updated.state = 'blocking';
      }
    }

    // Apply physics
    updated.x += updated.velocity.x;
    updated.y += updated.velocity.y;

    // Apply gravity
    if (!updated.isGrounded) {
      updated.velocity.y += GRAVITY;
    }

    // Ground collision
    if (updated.y >= GROUND_Y - updated.height) {
      updated.y = GROUND_Y - updated.height;
      updated.velocity.y = 0;
      updated.isGrounded = true;
      if (updated.state === 'jumping') {
        updated.state = 'idle';
      }
    }

    // Boundary collision
    if (updated.x < 0) updated.x = 0;
    if (updated.x + updated.width > CANVAS_WIDTH) updated.x = CANVAS_WIDTH - updated.width;

    // Update hitbox
    updated.hitbox = {
      x: updated.x,
      y: updated.y,
      width: updated.width,
      height: updated.height
    };

    // Update animation
    updated.animation.timer += 16; // 60fps
    if (updated.animation.timer >= updated.animation.duration) {
      updated.animation.timer = 0;
      updated.animation.frame = (updated.animation.frame + 1) % 4;
    }

    return updated;
  }, [keys]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(220, 13%, 8%)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, 'hsl(220, 15%, 15%)');
    gradient.addColorStop(1, 'hsl(220, 13%, 8%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = 'hsl(180, 50%, 30%)';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

    // Draw grid pattern
    ctx.strokeStyle = 'hsl(180, 100%, 50%, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw fighters
    const { player1, player2 } = gameState.fighters;
    
    if (player1) {
      // Draw fighter sprite
      drawFighterSprite(
        ctx,
        player1.id,
        player1.x,
        player1.y,
        player1.width,
        player1.height,
        player1.state,
        player1.animation.timer,
        player1.facing,
        {
          hurt: player1.state === 'hurt',
          special: player1.state === 'special',
          color: player1.color
        }
      );

      // Attack box
      if (player1.attackBox?.active) {
        ctx.fillStyle = 'hsl(0, 100%, 60%, 0.3)';
        ctx.fillRect(
          player1.attackBox.x,
          player1.attackBox.y,
          player1.attackBox.width,
          player1.attackBox.height
        );
      }

      // Name
      ctx.fillStyle = 'hsl(180, 100%, 50%)';
      ctx.font = 'bold 16px Orbitron';
      ctx.fillText(player1.name, player1.x, player1.y - 10);
    }

    if (player2) {
      // Draw fighter sprite
      drawFighterSprite(
        ctx,
        player2.id,
        player2.x,
        player2.y,
        player2.width,
        player2.height,
        player2.state,
        player2.animation.timer,
        player2.facing,
        {
          hurt: player2.state === 'hurt',
          special: player2.state === 'special',
          color: player2.color
        }
      );

      // Attack box
      if (player2.attackBox?.active) {
        ctx.fillStyle = 'hsl(0, 100%, 60%, 0.3)';
        ctx.fillRect(
          player2.attackBox.x,
          player2.attackBox.y,
          player2.attackBox.width,
          player2.attackBox.height
        );
      }

      // Name
      ctx.fillStyle = 'hsl(320, 100%, 60%)';
      ctx.font = 'bold 16px Orbitron';
      ctx.fillText(player2.name, player2.x, player2.y - 10);
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    const { player1, player2 } = gameState.fighters;
    
    if (player1 && player2) {
      const updatedPlayer1 = updateFighter(player1, true);
      const updatedPlayer2 = updateFighter(player2, false);

      // Check for attacks
      if (updatedPlayer1.attackBox?.active && checkCollision(updatedPlayer1.attackBox, updatedPlayer2.hitbox)) {
        if (updatedPlayer2.state !== 'blocking') {
          updatedPlayer2.health = Math.max(0, updatedPlayer2.health - 10);
          updatedPlayer2.state = 'hurt';
          playEffect('hit');
        } else {
          playEffect('block');
        }
      }

      if (updatedPlayer2.attackBox?.active && checkCollision(updatedPlayer2.attackBox, updatedPlayer1.hitbox)) {
        if (updatedPlayer1.state !== 'blocking') {
          updatedPlayer1.health = Math.max(0, updatedPlayer1.health - 10);
          updatedPlayer1.state = 'hurt';
          playEffect('hit');
        } else {
          playEffect('block');
        }
      }

      setGameState(prev => ({
        ...prev,
        fighters: {
          player1: updatedPlayer1,
          player2: updatedPlayer2
        }
      }));
    }

    render();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateFighter, checkCollision, render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctxRef.current = canvas.getContext('2d');

    initializeFighters();
  }, [initializeFighters]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState.screen === 'fighting') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameState.screen]);

  return {
    canvasRef,
    gameState,
    setGameState,
    initializeFighters
  };
};