import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioManager } from './useAudioManager';
import { useProjectileSystem } from './useProjectileSystem';
import { useSuperMoveSystem } from './useSuperMoveSystem';
import { useEnhancedSpriteSystem } from './useEnhancedSpriteSystem';
import { useVisualEffects } from './useVisualEffects';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';
import { Fighter as FighterType } from '@/types/gameTypes';

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

export interface Fighter extends FighterType {
  stamina: number;
  maxStamina: number;
  superMeter: number;
  maxSuperMeter: number;
  animationTimer: number;
  comboCount: number;
  comboDecay: number;
  comboDamage: number;
  frameData: {
    hitstun: number;
    blockstun: number;
    invulnerable: number;
  };
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
  backgroundLayers: {
    parallax1: number;
    parallax2: number;
    parallax3: number;
  };
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GROUND_Y = CANVAS_HEIGHT - 120;
const GRAVITY = 0.8;
const JUMP_FORCE = -18;
const MOVE_SPEED = 4;
const WALK_SPEED = 3;
const RUN_SPEED = 5;
const MAX_COMBO_DECAY = 60;

export const useEnhancedGameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const audioManager = useAudioManager();
  const { projectiles, updateProjectiles, addProjectile } = useProjectileSystem();
  const { checkSuperMoves, createSuperProjectile, getVoiceLine } = useSuperMoveSystem();
  const { isLoaded: spritesLoaded, drawEnhancedFighter, getAnimationDuration, registerAnimationCallback, isAnimationComplete } = useEnhancedSpriteSystem();
  const visualEffects = useVisualEffects();
  
  const [gameState, setGameState] = useState<GameState>({
    screen: 'fighting',
    round: 1,
    timer: 99,
    fighters: {
      player1: null,
      player2: null,
    },
    selectedFighters: {
      player1: 'leroy',
      player2: 'jordan',
    },
    winner: null,
    stage: 'kingston-street',
    particles: [],
    backgroundLayers: { parallax1: 0, parallax2: 0, parallax3: 0 }
  });

  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const player1Keys = useRef<Record<string, boolean>>({});
  const player2Keys = useRef<Record<string, boolean>>({});

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
        return {
          move,
          newFighter: {
            ...fighter,
            stamina: fighter.stamina - move.cost,
            superMeter: Math.min(fighter.maxSuperMeter, fighter.superMeter + 10),
            inputBuffer: [],
            state: { current: 'special', timer: 30 },
            animationTimer: 0
          }
        };
      }
    }
    
    return { move: null, newFighter: fighter };
  }, []);

  const createFighter = useCallback((id: string, name: string, x: number): Fighter => {
    const data = ENHANCED_FIGHTER_DATA[id] || ENHANCED_FIGHTER_DATA.leroy;
    
    return {
      id,
      name: data.name,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      superMeter: 0,
      maxSuperMeter: 100,
      x,
      y: GROUND_Y - 100,
      width: 70,
      height: 100,
      facing: x < CANVAS_WIDTH / 2 ? 'right' : 'left',
      state: { current: 'idle', timer: 0 },
      animationTimer: 0,
      velocity: { x: 0, y: 0 },
      isGrounded: true,
      hitbox: { x: x - 35, y: GROUND_Y - 100, width: 70, height: 100 },
      comboCount: 0,
      comboDecay: 0,
      comboDamage: 0,
      frameData: { hitstun: 0, blockstun: 0, invulnerable: 0 },
      colors: data.colors,
      specialMoves: data.specialMoves,
      inputBuffer: [],
      lastInputTime: 0
    };
  }, []);

  const initializeFighters = useCallback(() => {
    console.log('Creating fighters...');
    const player1 = createFighter('leroy', 'Leroy', CANVAS_WIDTH / 2 - 150);
    const player2 = createFighter('jordan', 'Jordan', CANVAS_WIDTH / 2 + 70);
    
    setGameState(prev => ({
      ...prev,
      fighters: { player1, player2 }
    }));
    
    console.log('Fighters initialized successfully');
  }, [createFighter]);

  const checkCollision = useCallback((rect1: any, rect2: any): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const updateFighter = useCallback((fighter: Fighter, isPlayer1: boolean): Fighter => {
    let newFighter = { ...fighter };
    const keys = isPlayer1 ? player1Keys.current : player2Keys.current;
    
    // Update animation timer
    newFighter.animationTimer = (newFighter.animationTimer || 0) + 16;
    
    // Check if animation is complete for non-looping animations
    const animationComplete = isAnimationComplete(fighter.id, fighter.state.current, newFighter.animationTimer);
    
    // Reset to idle if attack/hurt animation is complete
    if (animationComplete && (fighter.state.current === 'attacking' || fighter.state.current === 'hurt' || fighter.state.current === 'special')) {
      newFighter.state.current = 'idle';
      newFighter.animationTimer = 0;
    }

    // Update frame data
    if (newFighter.frameData.hitstun > 0) {
      newFighter.frameData.hitstun--;
      newFighter.state.current = 'hurt';
    }
    if (newFighter.frameData.blockstun > 0) {
      newFighter.frameData.blockstun--;
      newFighter.state.current = 'blocking';
    }
    
    // Update hitbox position
    newFighter.hitbox = {
      x: newFighter.x,
      y: newFighter.y,
      width: newFighter.width,
      height: newFighter.height
    };

    // Regenerate stamina
    if (newFighter.stamina < newFighter.maxStamina) {
      newFighter.stamina = Math.min(newFighter.maxStamina, newFighter.stamina + 0.5);
    }

    // Handle input only if not in hitstun/blockstun
    if (newFighter.frameData.hitstun === 0 && newFighter.frameData.blockstun === 0) {
      const fighterData = ENHANCED_FIGHTER_DATA[fighter.id];
      
      // Horizontal movement with walking animation
      if (keys.left && newFighter.x > 50) {
        newFighter.x -= fighterData.stats.walkSpeed;
        newFighter.facing = 'left';
        if (newFighter.state.current === 'idle' || newFighter.state.current === 'walking') {
          newFighter.state.current = 'walking';
        }
      } else if (keys.right && newFighter.x < 1024 - 50 - newFighter.width) {
        newFighter.x += fighterData.stats.walkSpeed;
        newFighter.facing = 'right';
        if (newFighter.state.current === 'idle' || newFighter.state.current === 'walking') {
          newFighter.state.current = 'walking';
        }
      } else if (newFighter.state.current === 'walking') {
        newFighter.state.current = 'idle';
        newFighter.animationTimer = 0;
      }

      // Jumping
      if (keys.up && newFighter.isGrounded) {
        newFighter.velocity.y = fighterData.stats.jumpForce;
        newFighter.isGrounded = false;
        newFighter.state.current = 'jumping';
        newFighter.animationTimer = 0;
      }

      // Apply gravity and ground collision
      if (!newFighter.isGrounded) {
        newFighter.velocity.y += GRAVITY;
        newFighter.y += newFighter.velocity.y;
        
        if (newFighter.y >= GROUND_Y - newFighter.height) {
          newFighter.y = GROUND_Y - newFighter.height;
          newFighter.velocity.y = 0;
          newFighter.isGrounded = true;
          if (newFighter.state.current === 'jumping') {
            newFighter.state.current = 'idle';
            newFighter.animationTimer = 0;
          }
        }
      }

      // Attacking
      if (keys.punch && (newFighter.state.current === 'idle' || newFighter.state.current === 'walking')) {
        newFighter.state.current = 'attacking';
        newFighter.animationTimer = 0;
        newFighter.state.timer = 20;
        const audioKey = Math.random() > 0.5 ? 'punch1' : 'punch2';
        audioManager.playSound(audioKey);
        
        // Add visual effects
        visualEffects.addScreenShake(3, 100);
      }

      // Blocking
      if (keys.block) {
        if (newFighter.state.current === 'idle' || newFighter.state.current === 'walking' || newFighter.state.current === 'blocking') {
          newFighter.state.current = 'blocking';
        }
      } else if (newFighter.state.current === 'blocking') {
        newFighter.state.current = 'idle';
        newFighter.animationTimer = 0;
      }

      // Check for special moves
      const specialResult = checkSpecialMoves(newFighter);
      newFighter = specialResult.newFighter;
    }

    return newFighter;
  }, [isAnimationComplete, checkSpecialMoves, audioManager, visualEffects]);

  const updateParticles = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      particles: prev.particles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.velocityX,
          y: particle.y + particle.velocityY,
          velocityY: particle.velocityY + 0.2, // gravity
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0)
    }));
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState.screen !== 'fighting') return;
    
    // Update visual effects
    visualEffects.updateEffects(16);
    
    // Skip game logic updates during hitstop for dramatic effect
    if (!visualEffects.isHitStopActive()) {
      setGameState(prevState => {
        if (prevState.screen !== 'fighting') return prevState;
        
        const newState = { ...prevState };
        
        // Update fighters
        if (newState.fighters.player1 && newState.fighters.player2) {
          let newFighter1 = updateFighter(newState.fighters.player1, true);
          let newFighter2 = updateFighter(newState.fighters.player2, false);

          // Check fighter vs fighter collision
          const collision = checkCollision(
            newFighter1.hitbox,
            newFighter2.hitbox
          );

          if (collision && newFighter1.state.current === 'attacking' && newFighter2.state.current !== 'hurt') {
            const damage = newFighter2.state.current === 'blocking' ? 5 : 15;
            newFighter2.health = Math.max(0, newFighter2.health - damage);
            
            if (newFighter2.state.current === 'blocking') {
              audioManager.playSound('block');
              visualEffects.addHitSpark(newFighter2.x + newFighter2.width/2, newFighter2.y + newFighter2.height/2, 'block');
              visualEffects.addScreenShake(2, 100);
            } else {
              newFighter2.state.current = 'hurt';
              newFighter2.animationTimer = 0;
              newFighter2.state.timer = 15;
              audioManager.playSound('hit1');
              visualEffects.addHitSpark(newFighter2.x + newFighter2.width/2, newFighter2.y + newFighter2.height/2, 'impact');
              visualEffects.addScreenShake(5, 150);
            }
          } else if (collision && newFighter2.state.current === 'attacking' && newFighter1.state.current !== 'hurt') {
            const damage = newFighter1.state.current === 'blocking' ? 5 : 15;
            newFighter1.health = Math.max(0, newFighter1.health - damage);
            
            if (newFighter1.state.current === 'blocking') {
              audioManager.playSound('block');
              visualEffects.addHitSpark(newFighter1.x + newFighter1.width/2, newFighter1.y + newFighter1.height/2, 'block');
              visualEffects.addScreenShake(2, 100);
            } else {
              newFighter1.state.current = 'hurt';
              newFighter1.animationTimer = 0;
              newFighter1.state.timer = 15;
              audioManager.playSound('hit1');
              visualEffects.addHitSpark(newFighter1.x + newFighter1.width/2, newFighter1.y + newFighter1.height/2, 'impact');
              visualEffects.addScreenShake(5, 150);
            }
          }

          // Handle special moves with projectiles
          const player1SpecialResult = checkSpecialMoves(newFighter1);
          if (player1SpecialResult.move) {
            newFighter1.state.current = 'special';
            newFighter1.animationTimer = 0;
            newFighter1.state.timer = 30;
            audioManager.playSound('special1');
            visualEffects.addFlashEffect(newFighter1.colors.aura, 0.4, 200);
            
            if (player1SpecialResult.move.type === 'projectile' && player1SpecialResult.move.projectile) {
              const projectileX = newFighter1.facing === 'right' ? 
                newFighter1.x + newFighter1.width : 
                newFighter1.x - player1SpecialResult.move.projectile.size;
              const projectileY = newFighter1.y + newFighter1.height / 2;
              
              addProjectile(projectileX, projectileY, newFighter1.facing, player1SpecialResult.move, 'player1');
            }
          }

          const player2SpecialResult = checkSpecialMoves(newFighter2);
          if (player2SpecialResult.move) {
            newFighter2.state.current = 'special';
            newFighter2.animationTimer = 0;
            newFighter2.state.timer = 30;
            audioManager.playSound('special1');
            visualEffects.addFlashEffect(newFighter2.colors.aura, 0.4, 200);
            
            if (player2SpecialResult.move.type === 'projectile' && player2SpecialResult.move.projectile) {
              const projectileX = newFighter2.facing === 'right' ? 
                newFighter2.x + newFighter2.width : 
                newFighter2.x - player2SpecialResult.move.projectile.size;
              const projectileY = newFighter2.y + newFighter2.height / 2;
              
              addProjectile(projectileX, projectileY, newFighter2.facing, player2SpecialResult.move, 'player2');
            }
          }

          // Check projectile hits
          const hitProjectiles = checkProjectileHits(projectiles, [newFighter1, newFighter2]);
          
          hitProjectiles.forEach(hit => {
            if (hit.target === 'player1') {
              const damage = newFighter1.state.current === 'blocking' ? hit.damage * 0.3 : hit.damage;
              newFighter1.health = Math.max(0, newFighter1.health - damage);
              
              if (newFighter1.state.current === 'blocking') {
                audioManager.playSound('block');
                visualEffects.addHitSpark(newFighter1.x + newFighter1.width/2, newFighter1.y + newFighter1.height/2, 'block');
                visualEffects.addScreenShake(3, 150);
              } else {
                newFighter1.state.current = 'hurt';
                newFighter1.animationTimer = 0;
                newFighter1.state.timer = 20;
                audioManager.playSound('hit2');
                visualEffects.addHitSpark(newFighter1.x + newFighter1.width/2, newFighter1.y + newFighter1.height/2, 'impact');
                visualEffects.addScreenShake(8, 200);
              }
            } else if (hit.target === 'player2') {
              const damage = newFighter2.state.current === 'blocking' ? hit.damage * 0.3 : hit.damage;
              newFighter2.health = Math.max(0, newFighter2.health - damage);
              
              if (newFighter2.state.current === 'blocking') {
                audioManager.playSound('block');
                visualEffects.addHitSpark(newFighter2.x + newFighter2.width/2, newFighter2.y + newFighter2.height/2, 'block');
                visualEffects.addScreenShake(3, 150);
              } else {
                newFighter2.state.current = 'hurt';
                newFighter2.animationTimer = 0;
                newFighter2.state.timer = 20;
                audioManager.playSound('hit2');
                visualEffects.addHitSpark(newFighter2.x + newFighter2.width/2, newFighter2.y + newFighter2.height/2, 'impact');
                visualEffects.addScreenShake(8, 200);
              }
            }
          });

          newState.fighters.player1 = newFighter1;
          newState.fighters.player2 = newFighter2;
        }
        
        // Update projectiles
        updateProjectiles();
        
        // Update particles
        updateParticles();
        
        // Check for winner
        if (newState.fighters.player1 && newState.fighters.player1.health <= 0) {
          newState.fighters.player1.state.current = 'ko';
          newState.fighters.player1.animationTimer = 0;
          if (newState.fighters.player2) {
            newState.fighters.player2.state.current = 'victory';
            newState.fighters.player2.animationTimer = 0;
          }
          newState.winner = 'Player 2';
          newState.screen = 'gameOver';
          audioManager.playSound('victory');
        } else if (newState.fighters.player2 && newState.fighters.player2.health <= 0) {
          newState.fighters.player2.state.current = 'ko';
          newState.fighters.player2.animationTimer = 0;
          if (newState.fighters.player1) {
            newState.fighters.player1.state.current = 'victory';
            newState.fighters.player1.animationTimer = 0;
          }
          newState.winner = 'Player 1';
          newState.screen = 'gameOver';
          audioManager.playSound('victory');
        }
        
        return newState;
      });
    }
    
    render();
    
    if (gameState.screen === 'fighting') {
      requestAnimationFrame(gameLoop);
    }
  }, [gameState.screen, updateFighter, updateProjectiles, updateParticles, checkCollision, checkSpecialMoves, audioManager, visualEffects, addProjectile, checkProjectileHits, projectiles]);

  const render = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get screen shake offset
    const shakeOffset = visualEffects.getShakeOffset();
    
    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enhanced background with atmospheric effects
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f1419');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Enhanced ground with texture
    const groundGradient = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
    groundGradient.addColorStop(0, '#3a3a3a');
    groundGradient.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Fighting arena markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height - 100);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw projectiles with enhanced effects
    projectiles.forEach(projectile => {
      // Draw projectile trail
      visualEffects.drawProjectileTrail(ctx, projectile);
      
      // Draw main projectile
      ctx.fillStyle = projectile.color;
      ctx.shadowColor = projectile.color;
      ctx.shadowBlur = 15;
      ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
      ctx.shadowBlur = 0;
    });

    // Draw fighters using enhanced sprite system with visual effects
    if (gameState.fighters.player1 && gameState.fighters.player2) {
      const shakeEffects = {
        screenShake: shakeOffset,
        hurt: false,
        special: false,
        blocking: false,
        glow: undefined,
        alpha: 1
      };

      // Player 1 effects
      const p1Effects = { ...shakeEffects };
      p1Effects.hurt = gameState.fighters.player1.state.current === 'hurt';
      p1Effects.special = gameState.fighters.player1.state.current === 'special';
      p1Effects.blocking = gameState.fighters.player1.state.current === 'blocking';
      if (p1Effects.special) p1Effects.glow = gameState.fighters.player1.colors.aura;

      // Player 2 effects
      const p2Effects = { ...shakeEffects };
      p2Effects.hurt = gameState.fighters.player2.state.current === 'hurt';
      p2Effects.special = gameState.fighters.player2.state.current === 'special';
      p2Effects.blocking = gameState.fighters.player2.state.current === 'blocking';
      if (p2Effects.special) p2Effects.glow = gameState.fighters.player2.colors.aura;

      drawEnhancedFighter(ctx, gameState.fighters.player1, gameState.fighters.player1.animationTimer || 0, p1Effects);
      drawEnhancedFighter(ctx, gameState.fighters.player2, gameState.fighters.player2.animationTimer || 0, p2Effects);
    }

    // Draw hit sparks and visual effects
    visualEffects.drawHitSparks(ctx);

    // Draw particles with enhanced rendering
    gameState.particles.forEach((particle, index) => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;

    ctx.restore();

    // Draw flash effect overlay (outside of shake transform)
    const flashOpacity = visualEffects.getFlashOpacity();
    if (flashOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = flashOpacity;
      ctx.fillStyle = visualEffects.flashEffect.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

  }, [gameState, drawEnhancedFighter, projectiles, visualEffects]);

  // Initialize fighters when component mounts
  useEffect(() => {
    initializeFighters();
    
    // Register animation callbacks for sound effects
    registerAnimationCallback('player1', (event: string) => {
      if (event === 'footstep') audioManager.playSound('footstep');
      if (event === 'impact') audioManager.playSound('impact');
    });
    
    registerAnimationCallback('player2', (event: string) => {
      if (event === 'footstep') audioManager.playSound('footstep');
      if (event === 'impact') audioManager.playSound('impact');
    });
  }, [initializeFighters, registerAnimationCallback, audioManager]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Player 1 controls (WASD + JK)
      switch(e.key.toLowerCase()) {
        case 'a':
          player1Keys.current.left = true;
          break;
        case 'd':
          player1Keys.current.right = true;
          break;
        case 'w':
          player1Keys.current.up = true;
          break;
        case 's':
          player1Keys.current.down = true;
          break;
        case 'j':
          player1Keys.current.punch = true;
          break;
        case 'k':
          player1Keys.current.block = true;
          break;
      }

      // Player 2 controls (Arrow keys + 1,2)
      switch(e.key) {
        case 'ArrowLeft':
          player2Keys.current.left = true;
          break;
        case 'ArrowRight':
          player2Keys.current.right = true;
          break;
        case 'ArrowUp':
          player2Keys.current.up = true;
          break;
        case 'ArrowDown':
          player2Keys.current.down = true;
          break;
        case '1':
          player2Keys.current.punch = true;
          break;
        case '2':
          player2Keys.current.block = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Player 1 controls
      switch(e.key.toLowerCase()) {
        case 'a':
          player1Keys.current.left = false;
          break;
        case 'd':
          player1Keys.current.right = false;
          break;
        case 'w':
          player1Keys.current.up = false;
          break;
        case 's':
          player1Keys.current.down = false;
          break;
        case 'j':
          player1Keys.current.punch = false;
          break;
        case 'k':
          player1Keys.current.block = false;
          break;
      }

      // Player 2 controls
      switch(e.key) {
        case 'ArrowLeft':
          player2Keys.current.left = false;
          break;
        case 'ArrowRight':
          player2Keys.current.right = false;
          break;
        case 'ArrowUp':
          player2Keys.current.up = false;
          break;
        case 'ArrowDown':
          player2Keys.current.down = false;
          break;
        case '1':
          player2Keys.current.punch = false;
          break;
        case '2':
          player2Keys.current.block = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Start the game loop
  useEffect(() => {
    if (gameState.screen === 'fighting') {
      const loop = () => {
        gameLoop();
        if (gameState.screen === 'fighting') {
          animationFrameRef.current = requestAnimationFrame(loop);
        }
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.screen, gameLoop]);

  const handleMobileInput = useCallback((player: number, input: string, pressed: boolean) => {
    const keys = player === 1 ? player1Keys.current : player2Keys.current;
    keys[input] = pressed;
  }, []);

  return {
    canvasRef,
    gameState,
    setGameState,
    initializeFighters,
    handleMobileInput
  };
};