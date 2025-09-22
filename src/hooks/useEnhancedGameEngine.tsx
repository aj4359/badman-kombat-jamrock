import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioManager } from './useAudioManager';
import { useProjectileSystem } from './useProjectileSystem';
import { useSuperMoveSystem } from './useSuperMoveSystem';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';
import { Projectile, HitSpark, ComboData, FrameData, FighterState } from '@/types/gameTypes';

export interface SpecialMove {
  name: string;
  input: string;
  damage: number;
  cost: number;
  type: 'projectile' | 'melee' | 'grab' | 'counter' | 'teleport';
  frames: {
    startup: number;
    active: number;
    recovery: number;
  };
  effects?: {
    type: 'stun' | 'knockdown' | 'absorb' | 'combo' | 'launch';
    duration: number;
  };
  projectile?: {
    speed: number;
    size: number;
    range: number;
    color: string;
    type: 'fireball' | 'soundwave' | 'energy';
  };
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'spark' | 'energy' | 'impact' | 'special';
}

export interface Fighter {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  superMeter: number;
  maxSuperMeter: number;
  x: number;
  y: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  state: 'idle' | 'walking' | 'attacking' | 'blocking' | 'hurt' | 'jumping' | 'crouching' | 'special' | 'stunned';
  animation: {
    frame: number;
    timer: number;
    duration: number;
    currentMove?: string;
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
    damage: number;
    type: 'light' | 'heavy' | 'special';
  };
  comboCount: number;
  comboDecay: number;
  comboDamage: number;
  frameData: {
    hitstun: number;
    blockstun: number;
    invulnerable: number;
  };
  color: string;
  specialMoves: SpecialMove[];
  inputBuffer: string[];
  lastInputTime: number;
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
  particles: Particle[];
  screenShake: {
    intensity: number;
    duration: number;
  };
  hitstop: number;
  backgroundLayers: {
    parallax1: number;
    parallax2: number;
    parallax3: number;
  };
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GROUND_Y = CANVAS_HEIGHT - 100;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 4;
const MAX_COMBO_DECAY = 60;
const HITSTOP_FRAMES = 8;

// Fighter data with special moves
const FIGHTER_DATA: Record<string, {
  stats: { power: number; speed: number; defense: number };
  specialMoves: SpecialMove[];
}> = {
  leroy: {
    stats: { power: 85, speed: 90, defense: 75 },
    specialMoves: [
      {
        name: 'Digital Soundclash',
        input: 'down,down-right,right,punch',
        damage: 25,
        cost: 30,
        type: 'projectile',
        frames: { startup: 12, active: 8, recovery: 20 },
        effects: { type: 'stun', duration: 30 }
      }
    ]
  },
  jordan: {
    stats: { power: 75, speed: 95, defense: 75 },
    specialMoves: [
      {
        name: 'Bass Drop Devastation',
        input: 'down,down-right,right,punch',
        damage: 28,
        cost: 32,
        type: 'projectile',
        frames: { startup: 14, active: 10, recovery: 22 },
        effects: { type: 'knockdown', duration: 45 }
      }
    ]
  },
  razor: {
    stats: { power: 95, speed: 80, defense: 70 },
    specialMoves: [
      {
        name: 'Plasma Katana',
        input: 'right,right,punch',
        damage: 30,
        cost: 35,
        type: 'melee',
        frames: { startup: 6, active: 4, recovery: 25 }
      }
    ]
  },
  sifu: {
    stats: { power: 90, speed: 85, defense: 95 },
    specialMoves: [
      {
        name: 'Five Point Palm Strike',
        input: 'right,right,punch',
        damage: 18,
        cost: 25,
        type: 'melee',
        frames: { startup: 4, active: 6, recovery: 20 },
        effects: { type: 'stun', duration: 90 }
      }
    ]
  },
  rootsman: {
    stats: { power: 85, speed: 90, defense: 80 },
    specialMoves: [
      {
        name: 'Digital Root System',
        input: 'down,down-left,left,punch',
        damage: 20,
        cost: 28,
        type: 'grab',
        frames: { startup: 10, active: 15, recovery: 18 },
        effects: { type: 'stun', duration: 60 }
      }
    ]
  }
};

export const useEnhancedGameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number>();
  const { playEffect } = useAudioManager();
  const {
    projectiles,
    hitSparks,
    createProjectile,
    addProjectile,
    createHitSpark,
    updateProjectiles,
    updateHitSparks,
    checkProjectileCollision,
    removeProjectile
  } = useProjectileSystem();
  
  const {
    checkSuperMoves,
    createSuperProjectile,
    getVoiceLine
  } = useSuperMoveSystem();
  
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
    stage: 'downtown-kingston',
    particles: [],
    screenShake: { intensity: 0, duration: 0 },
    hitstop: 0,
    backgroundLayers: { parallax1: 0, parallax2: 0, parallax3: 0 }
  });

  const [keys, setKeys] = useState<Record<string, boolean>>({});

  // Create particle effect
  const createParticles = useCallback((x: number, y: number, type: 'impact' | 'special' | 'energy', count: number = 5, color: string = 'hsl(180, 100%, 50%)') => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: (Math.random() - 0.5) * 8 - 2,
        size: Math.random() * 4 + 2,
        color,
        life: 60,
        maxLife: 60,
        type
      });
    }
    
    setGameState(prev => ({
      ...prev,
      particles: [...prev.particles, ...newParticles]
    }));
  }, []);

  // Screen shake effect
  const addScreenShake = useCallback((intensity: number, duration: number) => {
    setGameState(prev => ({
      ...prev,
      screenShake: { intensity, duration }
    }));
  }, []);

  // Input buffer system for special moves
  const updateInputBuffer = useCallback((fighter: Fighter, input: string): Fighter => {
    const now = Date.now();
    let buffer = [...fighter.inputBuffer];
    
    // Clear old inputs (older than 500ms)
    if (now - fighter.lastInputTime > 500) {
      buffer = [];
    }
    
    buffer.push(input);
    if (buffer.length > 8) buffer.shift(); // Keep only last 8 inputs
    
    return {
      ...fighter,
      inputBuffer: buffer,
      lastInputTime: now
    };
  }, []);

  // Enhanced special move execution with projectile creation
  const checkSpecialMoves = useCallback((fighter: Fighter): { move: SpecialMove | null; newFighter: Fighter } => {
    const inputString = fighter.inputBuffer.join(',');
    
    for (const move of fighter.specialMoves) {
      if (inputString.includes(move.input) && fighter.stamina >= move.cost) {
        // Create projectile if it's a projectile move
        if (move.type === 'projectile' && move.projectile) {
          const projectileX = fighter.facing === 'right' ? fighter.x + fighter.width : fighter.x - move.projectile.size;
          const projectileY = fighter.y + fighter.height / 2;
          
          const newProjectile = createProjectile(
            projectileX,
            projectileY,
            fighter.facing,
            move.projectile.type,
            fighter.id,
            move.projectile.speed,
            move.damage,
            move.projectile.color
          );
          
          addProjectile(newProjectile);
          
          // Play special move sound
          playEffect('special');
        }
        
        return {
          move,
          newFighter: {
            ...fighter,
            stamina: fighter.stamina - move.cost,
            superMeter: Math.min(fighter.maxSuperMeter, fighter.superMeter + 10), // Build super meter
            inputBuffer: [], // Clear buffer after successful move
            state: 'special',
            animation: { ...fighter.animation, currentMove: move.name }
          }
        };
      }
    }
    
    return { move: null, newFighter: fighter };
  }, [createProjectile, addProjectile, playEffect]);

  const createFighter = useCallback((id: string, name: string, x: number, color: string): Fighter => {
    const data = ENHANCED_FIGHTER_DATA[id] || ENHANCED_FIGHTER_DATA.leroy;
    
    return {
      id,
      name,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      superMeter: 0,
      maxSuperMeter: 100,
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
      comboCount: 0,
      comboDecay: 0,
      comboDamage: 0,
      frameData: {
        hitstun: 0,
        blockstun: 0,
        invulnerable: 0
      },
      color: data.colors.primary,
      specialMoves: data.specialMoves,
      inputBuffer: [],
      lastInputTime: 0
    };
  }, []);

  const initializeFighters = useCallback(() => {
    const player1 = createFighter('leroy', 'Leroy', 200, 'hsl(180, 100%, 50%)');
    const player2 = createFighter('jordan', 'Jordan', CANVAS_WIDTH - 200, 'hsl(270, 100%, 60%)');
    
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
    let updated = { ...fighter };
    
    // Update frame data
    if (updated.frameData.hitstun > 0) {
      updated.frameData.hitstun--;
      updated.state = 'hurt';
    }
    if (updated.frameData.blockstun > 0) {
      updated.frameData.blockstun--;
      updated.state = 'blocking';
    }

    // Update combo decay
    if (updated.comboDecay > 0) {
      updated.comboDecay--;
      if (updated.comboDecay === 0) {
        updated.comboCount = 0;
        updated.comboDamage = 0;
      }
    }

    // Regenerate stamina
    if (updated.stamina < updated.maxStamina) {
      updated.stamina = Math.min(updated.maxStamina, updated.stamina + 0.5);
    }

    // Handle input only if not in hitstun/blockstun
    if (updated.frameData.hitstun === 0 && updated.frameData.blockstun === 0) {
      // Player 1 controls
      if (isPlayer1) {
        if (keys['a'] || keys['A']) {
          updated.velocity.x = -MOVE_SPEED;
          updated.facing = 'left';
          updated.state = 'walking';
          updated = updateInputBuffer(updated, 'left');
        } else if (keys['d'] || keys['D']) {
          updated.velocity.x = MOVE_SPEED;
          updated.facing = 'right';
          updated.state = 'walking';
          updated = updateInputBuffer(updated, 'right');
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
            updated = updateInputBuffer(updated, 'down');
          }
        }

        if (keys['j'] || keys['J']) {
          // Check for super move first (requires both punch and kick)
          if ((keys['k'] || keys['K']) && updated.superMeter >= updated.maxSuperMeter) {
            updated = updateInputBuffer(updated, 'punch+kick');
            const { move: superMove, newFighter } = checkSuperMoves(updated);
            if (superMove) {
              updated = newFighter;
              if (superMove.type === 'projectile') {
                const projectileX = updated.facing === 'right' ? updated.x + updated.width : updated.x - 80;
                const projectileY = updated.y + updated.height / 2;
                const superProjectile = createSuperProjectile(projectileX, projectileY, updated.facing, superMove, 'player1');
                addProjectile(superProjectile);
              }
              playEffect('special');
              // Voice line will be handled in game canvas
            }
          } else {
            // Regular attack
            if (updated.state !== 'attacking') {
              playEffect('whoosh');
            }
            updated.state = 'attacking';
            updated.attackBox = {
              x: updated.facing === 'right' ? updated.x + updated.width : updated.x - 40,
              y: updated.y + 20,
              width: 40,
              height: 30,
              active: true,
              damage: 10,
              type: 'light'
            };
            updated = updateInputBuffer(updated, 'punch');
          }
        } else {
          updated.attackBox = undefined;
        }

        if (keys['k'] || keys['K']) {
          updated.state = 'blocking';
          updated = updateInputBuffer(updated, 'kick');
        }
      } else {
        // Player 2 controls
        if (keys['ArrowLeft']) {
          updated.velocity.x = -MOVE_SPEED;
          updated.facing = 'left';
          updated.state = 'walking';
          updated = updateInputBuffer(updated, 'left');
        } else if (keys['ArrowRight']) {
          updated.velocity.x = MOVE_SPEED;
          updated.facing = 'right';
          updated.state = 'walking';
          updated = updateInputBuffer(updated, 'right');
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
            updated = updateInputBuffer(updated, 'down');
          }
        }

        if (keys['1'] || keys['End']) {
          // Check for super move first (requires both punch and kick)
          if ((keys['2'] || keys['PageDown']) && updated.superMeter >= updated.maxSuperMeter) {
            updated = updateInputBuffer(updated, 'punch+kick');
            const { move: superMove, newFighter } = checkSuperMoves(updated);
            if (superMove) {
              updated = newFighter;
              if (superMove.type === 'projectile') {
                const projectileX = updated.facing === 'right' ? updated.x + updated.width : updated.x - 80;
                const projectileY = updated.y + updated.height / 2;
                const superProjectile = createSuperProjectile(projectileX, projectileY, updated.facing, superMove, 'player2');
                addProjectile(superProjectile);
              }
              playEffect('special');
            }
          } else {
            // Regular attack
            if (updated.state !== 'attacking') {
              playEffect('whoosh');
            }
            updated.state = 'attacking';
            updated.attackBox = {
              x: updated.facing === 'right' ? updated.x + updated.width : updated.x - 40,
              y: updated.y + 20,
              width: 40,
              height: 30,
              active: true,
              damage: 10,
              type: 'light'
            };
            updated = updateInputBuffer(updated, 'punch');
          }
        } else {
          updated.attackBox = undefined;
        }

        if (keys['2']) {
          updated.state = 'blocking';
          updated = updateInputBuffer(updated, 'kick');
        }
      }

      // Check for special moves
      const { move, newFighter } = checkSpecialMoves(updated);
      if (move) {
        playEffect('specialMove');
        createParticles(newFighter.x + newFighter.width / 2, newFighter.y, 'special', 20, newFighter.color);
        updated = newFighter;
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
    updated.animation.timer += 16;
    if (updated.animation.timer >= updated.animation.duration) {
      updated.animation.timer = 0;
      updated.animation.frame = (updated.animation.frame + 1) % 4;
    }

    return updated;
  }, [keys, checkSpecialMoves, updateInputBuffer, playEffect, createParticles]);

  const updateParticles = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      particles: prev.particles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.velocityX,
          y: particle.y + particle.velocityY,
          velocityY: particle.velocityY + 0.2, // gravity on particles
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0)
    }));
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(220, 13%, 8%)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Enhanced background with parallax layers
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, 'hsl(220, 15%, 15%)');
    gradient.addColorStop(1, 'hsl(220, 13%, 8%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground with neon grid
    ctx.fillStyle = 'hsl(180, 50%, 30%)';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

    // Enhanced grid pattern
    ctx.strokeStyle = 'hsl(180, 100%, 50%, 0.2)';
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

    // Draw projectiles with enhanced visual effects
    projectiles.forEach(projectile => {
      ctx.save();
      
      const alpha = projectile.life / projectile.maxLife;
      ctx.globalAlpha = alpha;
      
      // Create glow effect for projectiles
      ctx.shadowColor = projectile.color;
      ctx.shadowBlur = 15;
      
      if (projectile.type === 'fireball') {
        // Draw fireball with gradient
        const gradient = ctx.createRadialGradient(
          projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, 0,
          projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, projectile.width / 2
        );
        gradient.addColorStop(0, projectile.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
      } else if (projectile.type === 'soundwave') {
        // Draw soundwave with oscillating pattern
        ctx.strokeStyle = projectile.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          ctx.arc(
            projectile.x + projectile.width / 2,
            projectile.y + projectile.height / 2,
            (projectile.width / 2) + (i * 8),
            0,
            Math.PI * 2
          );
        }
        ctx.stroke();
      } else {
        // Draw energy projectile
        ctx.fillStyle = projectile.color;
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
      }
      
      ctx.restore();
    });

    // Draw hit sparks
    hitSparks.forEach(spark => {
      ctx.save();
      
      const alpha = spark.life / spark.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = spark.color;
      
      if (spark.type === 'critical') {
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 20;
      }
      
      // Draw star-shaped spark
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x = spark.x + Math.cos(angle) * spark.size;
        const y = spark.y + Math.sin(angle) * spark.size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw fighters
    const { player1, player2 } = gameState.fighters;
    
    if (player1) {
      ctx.save();
      
      if (player1.state === 'special') {
        ctx.shadowColor = player1.color;
        ctx.shadowBlur = 20;
      }
      
      ctx.fillStyle = player1.color;
      ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
      
      ctx.strokeStyle = 'hsl(180, 100%, 70%)';
      ctx.lineWidth = 2;
      ctx.strokeRect(player1.x, player1.y, player1.width, player1.height);

      if (player1.state === 'hurt') {
        ctx.fillStyle = 'hsl(0, 100%, 60%, 0.5)';
        ctx.fillRect(player1.x - 5, player1.y - 5, player1.width + 10, player1.height + 10);
      }

      if (player1.attackBox?.active) {
        ctx.fillStyle = 'hsl(0, 100%, 60%, 0.3)';
        ctx.fillRect(
          player1.attackBox.x,
          player1.attackBox.y,
          player1.attackBox.width,
          player1.attackBox.height
        );
      }

      ctx.fillStyle = 'hsl(180, 100%, 50%)';
      ctx.font = 'bold 16px Orbitron';
      ctx.fillText(player1.name, player1.x, player1.y - 10);
      
      ctx.restore();
    }

    if (player2) {
      ctx.save();
      
      if (player2.state === 'special') {
        ctx.shadowColor = player2.color;
        ctx.shadowBlur = 20;
      }
      
      ctx.fillStyle = player2.color;
      ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
      
      ctx.strokeStyle = 'hsl(320, 100%, 70%)';
      ctx.lineWidth = 2;
      ctx.strokeRect(player2.x, player2.y, player2.width, player2.height);

      if (player2.state === 'hurt') {
        ctx.fillStyle = 'hsl(0, 100%, 60%, 0.5)';
        ctx.fillRect(player2.x - 5, player2.y - 5, player2.width + 10, player2.height + 10);
      }

      if (player2.attackBox?.active) {
        ctx.fillStyle = 'hsl(0, 100%, 60%, 0.3)';
        ctx.fillRect(
          player2.attackBox.x,
          player2.attackBox.y,
          player2.attackBox.width,
          player2.attackBox.height
        );
      }

      ctx.fillStyle = 'hsl(320, 100%, 60%)';
      ctx.font = 'bold 16px Orbitron';
      ctx.fillText(player2.name, player2.x, player2.y - 10);
      
      ctx.restore();
    }
  }, [gameState, projectiles, hitSparks]);

  const gameLoop = useCallback(() => {
    if (gameState.hitstop > 0) {
      setGameState(prev => ({ ...prev, hitstop: prev.hitstop - 1 }));
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const { player1, player2 } = gameState.fighters;
    
    if (player1 && player2) {
      const updatedPlayer1 = updateFighter(player1, true);
      const updatedPlayer2 = updateFighter(player2, false);

      // Enhanced collision detection and combat
      if (updatedPlayer1.attackBox?.active && checkCollision(updatedPlayer1.attackBox, updatedPlayer2.hitbox)) {
        if (updatedPlayer2.state !== 'blocking' && updatedPlayer2.frameData.invulnerable === 0) {
          updatedPlayer2.health = Math.max(0, updatedPlayer2.health - updatedPlayer1.attackBox.damage);
          updatedPlayer2.frameData.hitstun = 15;
          updatedPlayer1.comboCount++;
          updatedPlayer1.comboDecay = MAX_COMBO_DECAY;
          updatedPlayer1.comboDamage += 10;
          updatedPlayer1.superMeter = Math.min(updatedPlayer1.maxSuperMeter, updatedPlayer1.superMeter + 10);
          
          playEffect('hit');
          createParticles(updatedPlayer2.x + updatedPlayer2.width / 2, updatedPlayer2.y + updatedPlayer2.height / 2, 'impact', 8, 'hsl(0, 100%, 60%)');
          addScreenShake(5, 8);
          
          setGameState(prev => ({ ...prev, hitstop: HITSTOP_FRAMES }));
        } else if (updatedPlayer2.state === 'blocking') {
          updatedPlayer2.frameData.blockstun = 8;
          playEffect('block');
          createParticles(updatedPlayer2.x + updatedPlayer2.width / 2, updatedPlayer2.y + updatedPlayer2.height / 2, 'energy', 4, 'hsl(180, 100%, 50%)');
        }
      }

      if (updatedPlayer2.attackBox?.active && checkCollision(updatedPlayer2.attackBox, updatedPlayer1.hitbox)) {
        if (updatedPlayer1.state !== 'blocking' && updatedPlayer1.frameData.invulnerable === 0) {
          updatedPlayer1.health = Math.max(0, updatedPlayer1.health - updatedPlayer2.attackBox.damage);
          updatedPlayer1.frameData.hitstun = 15;
          updatedPlayer2.comboCount++;
          updatedPlayer2.comboDecay = MAX_COMBO_DECAY;
          updatedPlayer2.comboDamage += 10;
          updatedPlayer2.superMeter = Math.min(updatedPlayer2.maxSuperMeter, updatedPlayer2.superMeter + 10);
          
          playEffect('hit');
          createParticles(updatedPlayer1.x + updatedPlayer1.width / 2, updatedPlayer1.y + updatedPlayer1.height / 2, 'impact', 8, 'hsl(0, 100%, 60%)');
          addScreenShake(5, 8);
          
          setGameState(prev => ({ ...prev, hitstop: HITSTOP_FRAMES }));
        } else if (updatedPlayer1.state === 'blocking') {
          updatedPlayer1.frameData.blockstun = 8;
          playEffect('block');
          createParticles(updatedPlayer1.x + updatedPlayer1.width / 2, updatedPlayer1.y + updatedPlayer1.height / 2, 'energy', 4, 'hsl(180, 100%, 50%)');
        }
      }

      setGameState(prev => ({
        ...prev,
        fighters: {
          player1: updatedPlayer1,
          player2: updatedPlayer2
        },
        // Update screen shake
        screenShake: {
          intensity: Math.max(0, prev.screenShake.intensity - 0.5),
          duration: Math.max(0, prev.screenShake.duration - 1)
        }
      }));
    }

    // Update projectiles and check collisions
    updateProjectiles();
    updateHitSparks();
    
    // Check projectile vs fighter collisions
    projectiles.forEach(projectile => {
      if (projectile.owner === 'player1' && player2 && checkProjectileCollision(projectile.hitbox, player2.hitbox)) {
        if (player2.state !== 'blocking' && player2.frameData.invulnerable === 0) {
          player2.health = Math.max(0, player2.health - projectile.damage);
          player2.frameData.hitstun = 20;
          createHitSpark(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, 'impact', projectile.color);
          addScreenShake(3, 6);
          playEffect('hit');
        } else if (player2.state === 'blocking') {
          createHitSpark(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, 'block', 'hsl(180, 100%, 50%)');
          playEffect('block');
        }
        removeProjectile(projectile.id);
      }
      
      if (projectile.owner === 'player2' && player1 && checkProjectileCollision(projectile.hitbox, player1.hitbox)) {
        if (player1.state !== 'blocking' && player1.frameData.invulnerable === 0) {
          player1.health = Math.max(0, player1.health - projectile.damage);
          player1.frameData.hitstun = 20;
          createHitSpark(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, 'impact', projectile.color);
          addScreenShake(3, 6);
          playEffect('hit');
        } else if (player1.state === 'blocking') {
          createHitSpark(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, 'block', 'hsl(180, 100%, 50%)');
          playEffect('block');
        }
        removeProjectile(projectile.id);
      }
    });

    updateParticles();
    render();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateFighter, checkCollision, render, playEffect, createParticles, addScreenShake, updateParticles, updateProjectiles, updateHitSparks, projectiles, checkProjectileCollision, createHitSpark, removeProjectile]);

  // Keyboard event handlers
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

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctxRef.current = canvas.getContext('2d');

    initializeFighters();
  }, [initializeFighters]);

  // Game loop
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

  // Mobile input handler  
  const handleMobileInput = useCallback((action: string, pressed: boolean) => {
    const keyMap: Record<string, string> = {
      left: 'a',
      right: 'd', 
      punch: 'j',
      kick: 'k',
      block: 's',
      special: 'u'
    };
    
    const key = keyMap[action];
    if (key) {
      setKeys(prev => ({ ...prev, [key]: pressed }));
    }
  }, []);

  return {
    canvasRef,
    gameState,
    setGameState,
    initializeFighters,
    handleMobileInput
  };
};