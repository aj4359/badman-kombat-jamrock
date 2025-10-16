import { useState, useRef, useCallback, useEffect } from 'react';
// Audio disabled to eliminate bell sounds
import { useCrowdAudio } from './useCrowdAudio';
import { useFightAudio } from './useFightAudio';
import { useProjectileSystem } from './useProjectileSystem';
import { useSuperMoveSystem } from './useSuperMoveSystem';
import { useEnhancedSpriteSystem } from './useEnhancedSpriteSystem';
import { useVisualEffects } from './useVisualEffects';
import { useStreetFighterCombat } from './useStreetFighterCombat';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';
import { Fighter as FighterType } from '@/types/gameTypes';
import { CombatSystem, CombatState, InputBuffer } from '@/components/game/CombatSystem';

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
  combatState: CombatState;
  inputBufferSystem: InputBuffer;
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

export const useEnhancedGameEngine = (fighterData?: { player1: any; player2: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const frameCountRef = useRef(0); // ✅ FIXED: Moved up for proper scope
  const screenRef = useRef<'menu' | 'characterSelect' | 'vs' | 'fighting' | 'paused' | 'gameOver'>('fighting'); // PHASE 1: Track screen state
  // Audio manager removed to eliminate bell sounds
  const crowdAudio = useCrowdAudio();
  const fightAudio = useFightAudio();
  const { projectiles, updateProjectiles, addProjectile } = useProjectileSystem();
  const { checkSuperMoves, createSuperProjectile, getVoiceLine } = useSuperMoveSystem();
  const { isLoaded: spritesLoaded, drawEnhancedFighter, getAnimationDuration, registerAnimationCallback, isAnimationComplete } = useEnhancedSpriteSystem();
  const visualEffects = useVisualEffects();
  const streetFighterCombat = useStreetFighterCombat();
  
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
  
  // PHASE 1: Update screenRef when gameState.screen changes
  useEffect(() => {
    screenRef.current = gameState.screen;
  }, [gameState.screen]);
  
  // Enhanced input system for 60fps performance
  const inputSystemRef = useRef({
    buffer: new Map<number, Array<{ action: string; timestamp: number }>>(),
    lastInputTime: new Map<number, number>()
  });

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

  // PHASE 2: FIX CALLBACK DEPENDENCIES - Stable createFighter with no external dependencies
  const createFighter = useCallback((id: string, name: string, x: number): Fighter => {
    console.log(`✅ createFighter: Creating ${id} at x=${x}`);
    const data = ENHANCED_FIGHTER_DATA[id] || ENHANCED_FIGHTER_DATA.leroy;
    
    const fighter = {
      id,
      name: data.name,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      superMeter: 0,
      maxSuperMeter: 100,
      x,
      y: GROUND_Y - 200, // Position fighter so bottom aligns with ground
      width: 150,
      height: 200,
      facing: (x < CANVAS_WIDTH / 2 ? 'right' : 'left') as 'left' | 'right',
      state: { current: 'idle' as const, timer: 0, canCancel: true, frameAdvantage: 0 },
      animation: { currentFrame: 0, frameTimer: 0, sequence: 'idle' },
      animationTimer: 0,
      velocityX: 0,
      velocityY: 0,
      grounded: true,
      hitbox: { x: x - 75, y: 220, width: 150, height: 200 },
      comboCount: 0,
      comboDecay: 0,
      comboDamage: 0,
      frameData: { hitstun: 0, blockstun: 0, invulnerable: 0, startup: 0, active: 0, recovery: 0 },
      colors: data.colors,
      specialMoves: data.specialMoves,
      superMoves: data.superMoves || [],
      voiceLines: data.voiceLines || [],
      meter: 0,
      combatState: CombatSystem.initializeCombatState(),
      inputBuffer: [],
      lastInputTime: 0,
      inputBufferSystem: CombatSystem.initializeInputBuffer()
    };
    
    console.log(`✅ Created fighter: ${fighter.name} successfully`);
    return fighter;
  }, []); // PHASE 2: Empty deps array for stable reference

  // PHASE 4: ADD SAFEGUARDS - Single initialization flag and error boundaries
  const initializationCompleteRef = useRef(false);
  
  const initializeFighters = useCallback(() => {
    if (initializationCompleteRef.current) {
      console.log('⚠️ initializeFighters: Already initialized, skipping');
      return;
    }
    
    console.log('🚀 DIAGNOSTIC: initializeFighters called');
    console.log('🔥 DIAGNOSTIC: Fighter data received:', fighterData);
    
    try {
      const p1Data = fighterData?.player1 || { id: 'leroy', name: 'LEROY' };
      const p2Data = fighterData?.player2 || { id: 'jordan', name: 'JORDAN' };
      
      console.log('🔥 DIAGNOSTIC: Creating fighters:', { p1: p1Data.id, p2: p2Data.id });
      
      const player1 = createFighter(p1Data.id, p1Data.name, CANVAS_WIDTH / 2 - 150);
      const player2 = createFighter(p2Data.id, p2Data.name, CANVAS_WIDTH / 2 + 70);
      
      setGameState(prev => {
        const newState = {
          ...prev,
          fighters: { player1, player2 },
          screen: 'fighting' as const,
          round: 1,
          timer: 99
        };
        console.log('✅ Fighters set in game state:', {
          p1: player1.name,
          p2: player2.name
        });
        return newState;
      });
      
      initializationCompleteRef.current = true;
      console.log('🎉 Fighter initialization COMPLETE!');
      
    } catch (error) {
      console.error('💥 initializeFighters FAILED:', error);
      initializationCompleteRef.current = false;
    }
  }, [createFighter, fighterData]);

  const checkCollision = useCallback((rect1: any, rect2: any): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const updateFighter = useCallback((fighter: Fighter, keys: Record<string, boolean>): Fighter => {
    let newFighter = { ...fighter };
    const fighterData = ENHANCED_FIGHTER_DATA[fighter.id] || ENHANCED_FIGHTER_DATA.leroy;
    
    // 🐛 DEBUG: Log position changes every 60 frames
    if (frameCountRef.current % 60 === 0) {
      console.log(`🎮 Fighter: x=${newFighter.x.toFixed(0)}, state=${newFighter.state.current}, keys=`, keys);
    }
    
    // Enhanced frame-perfect timing for 60fps gameplay
    const deltaTime = 16.67; // Target 60fps frame time
    
    // Update combat state using the integrated system
    newFighter.combatState = CombatSystem.updateCombatState(newFighter.combatState);
    
    // Update frame data timers (legacy support)
    newFighter.frameData.hitstun = Math.max(0, newFighter.frameData.hitstun - 1);
    newFighter.frameData.blockstun = Math.max(0, newFighter.frameData.blockstun - 1);
    newFighter.frameData.invulnerable = Math.max(0, newFighter.frameData.invulnerable - 1);
    
    // Update animation timer
    newFighter.animationTimer++;
    
    // Update combo decay with combat system
    if (newFighter.combatState.comboCount > 0) {
      newFighter.comboCount = newFighter.combatState.comboCount;
      newFighter.comboDamage = newFighter.combatState.comboDamage;
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
    
    // Input handling with advanced buffer system
    if (keys.left) newFighter.inputBufferSystem = CombatSystem.addInputToBuffer(newFighter.inputBufferSystem, 'left');
    if (keys.right) newFighter.inputBufferSystem = CombatSystem.addInputToBuffer(newFighter.inputBufferSystem, 'right');
    if (keys.up) newFighter.inputBufferSystem = CombatSystem.addInputToBuffer(newFighter.inputBufferSystem, 'up');
    if (keys.down) newFighter.inputBufferSystem = CombatSystem.addInputToBuffer(newFighter.inputBufferSystem, 'down');
    if (keys.punch) newFighter.inputBufferSystem = CombatSystem.addInputToBuffer(newFighter.inputBufferSystem, 'punch');
    if (keys.kick) newFighter.inputBufferSystem = CombatSystem.addInputToBuffer(newFighter.inputBufferSystem, 'kick');
    if (keys.block) newFighter.inputBufferSystem = CombatSystem.addInputToBuffer(newFighter.inputBufferSystem, 'block');
    
    // Only allow new actions if fighter can act (using combat system)
    if (CombatSystem.canAct(newFighter as any)) {
      // Enhanced Movement with frame-perfect responsiveness
      const moveSpeed = fighterData.stats.walkSpeed * (deltaTime / 16.67); // Normalize to 60fps
      if (keys.left && newFighter.x > 50) {
        const oldX = newFighter.x;
        newFighter.x -= moveSpeed;
        newFighter.facing = 'left';
        if (newFighter.state.current === 'idle' || newFighter.state.current === 'walking') {
          newFighter.state.current = 'walking';
        }
        // 🐛 DEBUG: Log movement
        if (Math.random() < 0.01) console.log(`⬅️ Moving LEFT: ${oldX.toFixed(0)} → ${newFighter.x.toFixed(0)}`);
      } else if (keys.right && newFighter.x < CANVAS_WIDTH - 50 - newFighter.width) {
        const oldX = newFighter.x;
        newFighter.x += moveSpeed;
        newFighter.facing = 'right';
        if (newFighter.state.current === 'idle' || newFighter.state.current === 'walking') {
          newFighter.state.current = 'walking';
        }
        // 🐛 DEBUG: Log movement
        if (Math.random() < 0.01) console.log(`➡️ Moving RIGHT: ${oldX.toFixed(0)} → ${newFighter.x.toFixed(0)}`);
      } else if (newFighter.state.current === 'walking') {
        newFighter.state.current = 'idle';
        newFighter.animationTimer = 0;
      }

      // Increment animation timer slowly for smooth pose transitions
      if (newFighter.animationTimer !== undefined) {
        newFighter.animationTimer += 0.25; // Slow animation speed (was incrementing every frame)
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

      // Enhanced Attacking with frame data system
      if (keys.punch && (newFighter.state.current === 'idle' || newFighter.state.current === 'walking' || CombatSystem.canCancel(newFighter as any))) {
        const frameData = CombatSystem.FRAME_DATA.mediumPunch;
        newFighter.state.current = 'attacking';
        if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
        newFighter.state.timer = frameData.startup + frameData.active + frameData.recovery;
        
        // Store attack frame data for hit detection
        if (!newFighter.frameData) {
          newFighter.frameData = { hitstun: 0, blockstun: 0, invulnerable: 0 };
        }
        (newFighter.frameData as any).startup = frameData.startup;
        (newFighter.frameData as any).active = frameData.active;
        (newFighter.frameData as any).recovery = frameData.recovery;
        
        // Play hit sound
        fightAudio.onHit('medium');
        
        // Enhanced visual effects
        visualEffects.addScreenShake(4, 80);
        visualEffects.addHitSpark(newFighter.x + newFighter.width / 2, newFighter.y + 30, 'impact');
        
        // Build super meter
        newFighter.superMeter = Math.min(newFighter.maxSuperMeter, newFighter.superMeter + 5);
      }
      
      // Heavy attack
      if (keys.kick && (newFighter.state.current === 'idle' || newFighter.state.current === 'walking' || CombatSystem.canCancel(newFighter as any))) {
        const frameData = CombatSystem.FRAME_DATA.heavyKick;
        newFighter.state.current = 'attacking';
        if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
        newFighter.state.timer = frameData.startup + frameData.active + frameData.recovery;
        
        // Store attack frame data for hit detection
        if (!newFighter.frameData) {
          newFighter.frameData = { hitstun: 0, blockstun: 0, invulnerable: 0 };
        }
        (newFighter.frameData as any).startup = frameData.startup;
        (newFighter.frameData as any).active = frameData.active;
        (newFighter.frameData as any).recovery = frameData.recovery;
        
        // Play hit sound
        fightAudio.onHit('heavy');
        visualEffects.addScreenShake(8, 120);
        visualEffects.addHitSpark(newFighter.x + newFighter.width / 2, newFighter.y + 30, 'critical');
        
        // More meter gain for heavy attacks
        newFighter.superMeter = Math.min(newFighter.maxSuperMeter, newFighter.superMeter + 8);
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

      // Check for special moves using combat system
      const specialMove = CombatSystem.checkSpecialMoveInputs(newFighter.inputBufferSystem || CombatSystem.initializeInputBuffer(), newFighter);
      if (specialMove && (newFighter.stamina || 0) >= specialMove.cost) {
        newFighter.state.current = 'special';
        if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
        newFighter.state.timer = specialMove.frames.startup + specialMove.frames.active + specialMove.frames.recovery;
        if (newFighter.stamina !== undefined) newFighter.stamina -= specialMove.cost;
        if (newFighter.superMeter !== undefined && newFighter.maxSuperMeter !== undefined) {
          newFighter.superMeter = Math.min(newFighter.maxSuperMeter, newFighter.superMeter + 15);
        }
        
        // Clear input buffer after successful special move
        newFighter.inputBufferSystem = CombatSystem.initializeInputBuffer();
        
        // Audio disabled to prevent bell sounds
        // fightAudio.onSpecialMove();
        visualEffects.addScreenShake(10, 150);
        visualEffects.createComboEffect(newFighter.x + newFighter.width / 2, newFighter.y + 30, 1);
      }
      
      // Check for super moves
      const superMove = CombatSystem.checkSuperMoveInputs(newFighter.inputBufferSystem || CombatSystem.initializeInputBuffer(), newFighter);
      if (superMove && (newFighter.superMeter || 0) >= superMove.cost) {
        newFighter.state.current = 'special';
        if (newFighter.animationTimer !== undefined) newFighter.animationTimer = 0;
        newFighter.state.timer = superMove.frames.startup + superMove.frames.active + superMove.frames.recovery;
        if (newFighter.superMeter !== undefined) newFighter.superMeter -= superMove.cost;
        
        // Add invulnerability frames for supers
        if (superMove.invulnerable && newFighter.combatState) {
          newFighter.combatState.invulnerableFrames = superMove.frames.startup;
        }
        
        // Clear input buffer after successful super move
        newFighter.inputBufferSystem = CombatSystem.initializeInputBuffer();
        
        // Audio disabled to prevent bell sounds
        // fightAudio.onSpecialMove();
        visualEffects.addScreenShake(15, 300);
        visualEffects.addFlashEffect('hsl(60, 100%, 80%)', 0.8, 200);
        visualEffects.createComboEffect(newFighter.x + newFighter.width / 2, newFighter.y + 30, 10);
      }
    }

    return newFighter;
  }, [isAnimationComplete, checkSpecialMoves, visualEffects]);

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
    
    if (frameCountRef.current === 0) {
      console.log('🔄 GAME LOOP STARTED');
    }
    
    if (frameCountRef.current % 60 === 0) {
      console.log('🔄 TICK:', frameCountRef.current, 'Screen:', gameState.screen);
    }
    
    frameCountRef.current++;
    
    // Update visual effects
    visualEffects.updateEffects(16);
    
    // Skip game logic updates during hitstop for dramatic effect
    if (!visualEffects.isHitStopActive()) {
      setGameState(prevState => {
        if (prevState.screen !== 'fighting') return prevState;
        
        const newState = { ...prevState };
        
        // Update fighters
        if (newState.fighters.player1 && newState.fighters.player2) {
      let newFighter1 = updateFighter(newState.fighters.player1, player1Keys.current);
      let newFighter2 = updateFighter(newState.fighters.player2, player2Keys.current);

          // Enhanced collision detection with proper frame data
          const fighter1Hitbox = newFighter1.hitbox || { x: newFighter1.x, y: newFighter1.y, width: newFighter1.width, height: newFighter1.height };
          const fighter2Hitbox = newFighter2.hitbox || { x: newFighter2.x, y: newFighter2.y, width: newFighter2.width, height: newFighter2.height };

          if (checkCollision(fighter1Hitbox, fighter2Hitbox)) {
            // Player 1 attacking Player 2
            if (newFighter1.state.current === 'attacking' && 
                newFighter1.animationTimer !== undefined &&
                (newFighter1.frameData as any)?.startup !== undefined &&
                (newFighter1.frameData as any)?.active !== undefined &&
                newFighter1.animationTimer >= (newFighter1.frameData as any).startup &&
                newFighter1.animationTimer < (newFighter1.frameData as any).startup + (newFighter1.frameData as any).active &&
                !CombatSystem.isInvulnerable(newFighter2 as any)) {
              
              if (newFighter2.state.current === 'blocking') {
                // Blocked attack
                const blockResult = CombatSystem.applyBlock(newFighter1 as any, newFighter2 as any, 10, 6);
                newFighter1 = { ...newFighter1, ...blockResult.attacker };
                newFighter2 = { ...newFighter2, ...blockResult.defender };
                
                // Audio disabled to prevent bell sounds
                visualEffects.addHitSpark(newFighter2.x + newFighter2.width / 2, newFighter2.y + newFighter2.height / 2, 'block');
                visualEffects.addScreenShake(3, 80);
              } else {
                // Successful hit
                const attackType = player1Keys.current.kick ? 'heavy' : 'medium';
                const damage = player1Keys.current.kick ? 18 : 12;
                const hitstun = player1Keys.current.kick ? 18 : 12;
                
                const hitResult = CombatSystem.applyHit(newFighter1 as any, newFighter2 as any, damage, hitstun, attackType);
                newFighter1 = { ...newFighter1, ...hitResult.attacker };
                newFighter2 = { ...newFighter2, ...hitResult.defender };
                
                // Enhanced feedback based on combo count
                const comboCount = newFighter2.combatState.comboCount;
                if (comboCount > 1) {
                  fightAudio.onComboStart();
                  visualEffects.createComboEffect(newFighter2.x + newFighter2.width / 2, newFighter2.y + 30, comboCount);
                } else {
                  fightAudio.onHit(attackType === 'heavy' ? 'heavy' : 'medium');
                }
                
                visualEffects.addHitSpark(newFighter2.x + newFighter2.width / 2, newFighter2.y + newFighter2.height / 2, 'impact');
                visualEffects.addScreenShake(attackType === 'heavy' ? 8 : 6, 120);
              }
            }

            // Player 2 attacking Player 1 (symmetric logic)
            if (newFighter2.state.current === 'attacking' && 
                newFighter2.animationTimer !== undefined &&
                (newFighter2.frameData as any)?.startup !== undefined &&
                (newFighter2.frameData as any)?.active !== undefined &&
                newFighter2.animationTimer >= (newFighter2.frameData as any).startup &&
                newFighter2.animationTimer < (newFighter2.frameData as any).startup + (newFighter2.frameData as any).active &&
                !CombatSystem.isInvulnerable(newFighter1 as any)) {
              
              if (newFighter1.state.current === 'blocking') {
                // Blocked attack
                const blockResult = CombatSystem.applyBlock(newFighter2 as any, newFighter1 as any, 10, 6);
                newFighter2 = { ...newFighter2, ...blockResult.attacker };
                newFighter1 = { ...newFighter1, ...blockResult.defender };
                
                // Audio disabled to prevent bell sounds
                visualEffects.addHitSpark(newFighter1.x + newFighter1.width / 2, newFighter1.y + newFighter1.height / 2, 'block');
                visualEffects.addScreenShake(3, 80);
              } else {
                // Successful hit  
                const attackType = player2Keys.current.kick ? 'heavy' : 'medium';
                const damage = player2Keys.current.kick ? 18 : 12;
                const hitstun = player2Keys.current.kick ? 18 : 12;
                
                const hitResult = CombatSystem.applyHit(newFighter2 as any, newFighter1 as any, damage, hitstun, attackType);
                newFighter2 = { ...newFighter2, ...hitResult.attacker };
                newFighter1 = { ...newFighter1, ...hitResult.defender };
                
                // Enhanced feedback based on combo count
                const comboCount = newFighter1.combatState.comboCount;
                if (comboCount > 1) {
                  fightAudio.onComboStart();
                  visualEffects.createComboEffect(newFighter1.x + newFighter1.width / 2, newFighter1.y + 30, comboCount);
                } else {
                  fightAudio.onHit(attackType === 'heavy' ? 'heavy' : 'medium');
                }
                
                visualEffects.addHitSpark(newFighter1.x + newFighter1.width / 2, newFighter1.y + newFighter1.height / 2, 'impact');
                visualEffects.addScreenShake(attackType === 'heavy' ? 8 : 6, 120);
              }
            }
          }

          // 🐛 DEBUG: Log state updates every 60 frames
          if (frameCountRef.current % 60 === 0) {
            console.log(`🔄 Game Loop Update #${frameCountRef.current}:`, {
              p1_x: newFighter1.x.toFixed(0),
              p2_x: newFighter2.x.toFixed(0),
              p1_state: newFighter1.state.current,
              p2_state: newFighter2.state.current,
              p1_keys: player1Keys.current,
              p2_keys: player2Keys.current
            });
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
          fightAudio.onRoundEnd('player2');
        } else if (newState.fighters.player2?.health === 0) {
          newState.fighters.player2.state = { current: 'ko', timer: 60, canCancel: false, frameAdvantage: 0 };
          newState.winner = 'player1';
          fightAudio.onRoundEnd('player1');
        } else if (newState.timer <= 0) {
          // Time up
          if (newState.fighters.player1.health > newState.fighters.player2.health) {
            newState.winner = 'player1';
            fightAudio.onRoundEnd('player1');
          } else if (newState.fighters.player2.health > newState.fighters.player1.health) {
            newState.winner = 'player2';
            fightAudio.onRoundEnd('player2');
          } else {
            newState.winner = 'draw';
            fightAudio.onRoundEnd();
          }
        }

        return newState;
      });
    }

    updateParticles();
    streetFighterCombat.updateProjectiles();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateFighter, updateParticles, checkCollision, visualEffects, streetFighterCombat]); // PHASE 1: Removed gameState.screen

  // Fighter initialization is handled by the canvas component only

  // Start game loop - FIXED: gameLoop is stable, only depends on screen state
  useEffect(() => {
    if (gameState.screen === 'fighting' && !animationFrameRef.current) {
      console.log('🎮 Starting game loop');
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        console.log('🛑 Stopping game loop');
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [gameState.screen]); // Only restart when screen changes, NOT gameLoop

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      console.log('🎮 KEY DOWN:', e.key);
      
      // Player 1 controls
      if (['w', 'a', 's', 'd', 'j', 'k', 'l'].includes(key)) {
        const mapping: Record<string, string> = {
          'w': 'up',
          'a': 'left',
          's': 'down',
          'd': 'right',
          'j': 'punch',
          'k': 'block',
          'l': 'kick'
        };
        player1Keys.current[mapping[key]] = true;
        console.log('⬆️ P1:', mapping[key]);
      }

      // Player 2 controls
      if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright', '1', '2', '3'].includes(key)) {
        const mapping: Record<string, string> = {
          'arrowup': 'up',
          'arrowleft': 'left',
          'arrowdown': 'down', 
          'arrowright': 'right',
          '1': 'punch',
          '2': 'block',
          '3': 'kick'
        };
        player2Keys.current[mapping[key]] = true;
        console.log('⬆️ P2:', mapping[key]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Player 1 controls
      if (['w', 'a', 's', 'd', 'j', 'k', 'l'].includes(key)) {
        const mapping: Record<string, string> = {
          'w': 'up',
          'a': 'left',
          's': 'down',
          'd': 'right',
          'j': 'punch',
          'k': 'block',
          'l': 'kick' // ✅ FIXED: Added kick
        };
        player1Keys.current[mapping[key]] = false;
      }

      // Player 2 controls
      if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright', '1', '2', '3'].includes(key)) {
        const mapping: Record<string, string> = {
          'arrowup': 'up',
          'arrowleft': 'left',
          'arrowdown': 'down',
          'arrowright': 'right', 
          '1': 'punch',
          '2': 'block',
          '3': 'kick' // ✅ FIXED: Added kick
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
    handleMobileInput,
    streetFighterCombat
  };
};