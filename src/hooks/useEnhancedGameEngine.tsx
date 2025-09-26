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
  projectiles: any[];
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
    projectiles: [],
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

  // Create projectile helper function
  const createProjectile = useCallback((x: number, y: number, vx: number, vy: number, damage: number) => {
    return {
      id: `proj_${Date.now()}`,
      x,
      y,
      velocityX: vx,
      velocityY: vy,
      damage,
      owner: 'player',
      color: 'hsl(60, 100%, 50%)',
      type: 'fireball' as const,
      life: 120,
      maxLife: 120,
      width: 20,
      height: 20,
      hitbox: { x, y, width: 20, height: 20 }
    };
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
            state: { current: 'special', timer: 30, canCancel: false, frameAdvantage: 0 },
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
      state: { current: 'idle', timer: 0, canCancel: true, frameAdvantage: 0 },
      animation: { currentFrame: 0, frameTimer: 0, sequence: 'idle' },
      animationTimer: 0,
      velocityX: 0,
      velocityY: 0,
      grounded: true,
      hitbox: { x: x - 35, y: GROUND_Y - 100, width: 70, height: 100 },
      comboCount: 0,
      comboDecay: 0,
      comboDamage: 0,
      frameData: { hitstun: 0, blockstun: 0, invulnerable: 0 },
      colors: data.colors,
      specialMoves: data.specialMoves,
      superMoves: data.superMoves || [],
      voiceLines: data.voiceLines || [],
      meter: 0,
      combatState: {},
      inputBuffer: [],
      lastInputTime: 0
    };
  }, []);

  const initializeFighters = useCallback(() => {
    console.log('Creating fighters...');
    const player1 = createFighter('leroy', 'Leroy', CANVAS_WIDTH / 2 - 150);
    const player2 = createFighter('jordan', 'Jordan', CANVAS_WIDTH / 2 + 70);
    
    console.log('Player 1:', player1);
    console.log('Player 2:', player2);
    
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
    const fighterData = ENHANCED_FIGHTER_DATA[fighter.id] || ENHANCED_FIGHTER_DATA.leroy;
    
    // Update frame data timers
    newFighter.frameData.hitstun = Math.max(0, newFighter.frameData.hitstun - 1);
    newFighter.frameData.blockstun = Math.max(0, newFighter.frameData.blockstun - 1);
    newFighter.frameData.invulnerable = Math.max(0, newFighter.frameData.invulnerable - 1);
    
    // Update animation timer
    newFighter.animationTimer++;
    
    // Update combo decay
    if (newFighter.comboCount > 0) {
      newFighter.comboDecay++;
      if (newFighter.comboDecay > MAX_COMBO_DECAY) {
        newFighter.comboCount = 0;
        newFighter.comboDamage = 0;
        newFighter.comboDecay = 0;
      }
    }
    
    // State management
    if (newFighter.state.timer > 0) {
      newFighter.state.timer--;
      if (newFighter.state.timer === 0) {
        if (newFighter.state.current === 'attacking' || newFighter.state.current === 'special') {
          newFighter.state.current = 'idle';
          newFighter.animationTimer = 0;
        }
      }
    }
    
    // Only allow new actions if not in hitstun/blockstun
    if (newFighter.frameData.hitstun === 0 && newFighter.frameData.blockstun === 0) {
      // Movement
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
      if (keys.up && newFighter.grounded) {
        newFighter.velocityY = fighterData.stats.jumpForce;
        newFighter.grounded = false;
        newFighter.state.current = 'jumping';
        newFighter.animationTimer = 0;
      }

      // Apply gravity and ground collision
      if (!newFighter.grounded) {
        newFighter.velocityY += GRAVITY;
        newFighter.y += newFighter.velocityY;
        
        if (newFighter.y >= GROUND_Y - newFighter.height) {
          newFighter.y = GROUND_Y - newFighter.height;
          newFighter.velocityY = 0;
          newFighter.grounded = true;
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
        audioManager.playEffect('hit');
        
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

          // Basic collision detection
          const fighter1Hitbox = newFighter1.hitbox || { x: newFighter1.x, y: newFighter1.y, width: newFighter1.width, height: newFighter1.height };
          const fighter2Hitbox = newFighter2.hitbox || { x: newFighter2.x, y: newFighter2.y, width: newFighter2.width, height: newFighter2.height };

          if (checkCollision(fighter1Hitbox, fighter2Hitbox)) {
            // Handle collision
            if (newFighter1.state.current === 'attacking' && newFighter2.state.current !== 'blocking') {
              newFighter2.health = Math.max(0, newFighter2.health - 10);
              audioManager.playEffect('hit');
              visualEffects.addHitSpark(newFighter2.x + newFighter2.width / 2, newFighter2.y + newFighter2.height / 2, 'impact');
            } else if (newFighter1.state.current === 'attacking' && newFighter2.state.current === 'blocking') {
              audioManager.playEffect('block');
              visualEffects.addHitSpark(newFighter2.x + newFighter2.width / 2, newFighter2.y + newFighter2.height / 2, 'block');
            }

            if (newFighter2.state.current === 'attacking' && newFighter1.state.current !== 'blocking') {
              newFighter1.health = Math.max(0, newFighter1.health - 10);
              audioManager.playEffect('hit');
              visualEffects.addHitSpark(newFighter1.x + newFighter1.width / 2, newFighter1.y + newFighter1.height / 2, 'impact');
            }
          }

          newState.fighters.player1 = newFighter1;
          newState.fighters.player2 = newFighter2;
        }

        // Update timer
        if (newState.timer > 0) {
          newState.timer -= 0.016; // 60 FPS
        }

        // Check for round end
        if (newState.fighters.player1?.health === 0) {
          newState.fighters.player1.state = { current: 'ko', timer: 60, canCancel: false, frameAdvantage: 0 };
          newState.winner = 'player2';
          audioManager.playEffect('ko');
        } else if (newState.fighters.player2?.health === 0) {
          newState.fighters.player2.state = { current: 'ko', timer: 60, canCancel: false, frameAdvantage: 0 };
          newState.winner = 'player1';
          audioManager.playEffect('ko');
        } else if (newState.timer <= 0) {
          // Time up
          if (newState.fighters.player1.health > newState.fighters.player2.health) {
            newState.winner = 'player1';
          } else if (newState.fighters.player2.health > newState.fighters.player1.health) {
            newState.winner = 'player2';
          } else {
            newState.winner = 'draw';
          }
          audioManager.playEffect('round-start');
        }

        return newState;
      });
    }

    updateParticles();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.screen, updateFighter, updateParticles, checkCollision, audioManager, visualEffects]);

  // Initialize game
  useEffect(() => {
    initializeFighters();
  }, [initializeFighters]);

  // Start game loop
  useEffect(() => {
    if (gameState.screen === 'fighting') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Player 1 controls
      if (['w', 'a', 's', 'd', 'j', 'k'].includes(key)) {
        const mapping: Record<string, string> = {
          'w': 'up',
          'a': 'left', 
          's': 'down',
          'd': 'right',
          'j': 'punch',
          'k': 'block'
        };
        player1Keys.current[mapping[key]] = true;
      }

      // Player 2 controls
      if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright', '1', '2'].includes(key)) {
        const mapping: Record<string, string> = {
          'arrowup': 'up',
          'arrowleft': 'left',
          'arrowdown': 'down', 
          'arrowright': 'right',
          '1': 'punch',
          '2': 'block'
        };
        player2Keys.current[mapping[key]] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Player 1 controls
      if (['w', 'a', 's', 'd', 'j', 'k'].includes(key)) {
        const mapping: Record<string, string> = {
          'w': 'up',
          'a': 'left',
          's': 'down',
          'd': 'right',
          'j': 'punch',
          'k': 'block'
        };
        player1Keys.current[mapping[key]] = false;
      }

      // Player 2 controls
      if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright', '1', '2'].includes(key)) {
        const mapping: Record<string, string> = {
          'arrowup': 'up',
          'arrowleft': 'left',
          'arrowdown': 'down',
          'arrowright': 'right', 
          '1': 'punch',
          '2': 'block'
        };
        player2Keys.current[mapping[key]] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMobileInput = useCallback((player: number, input: string, pressed: boolean) => {
    const targetKeys = player === 1 ? player1Keys.current : player2Keys.current;
    targetKeys[input] = pressed;
  }, []);

  return {
    canvasRef,
    gameState,
    initializeFighters,
    handleMobileInput
  };
};