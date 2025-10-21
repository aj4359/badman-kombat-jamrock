// Core Game Types for Street Fighter II-style Fighting System

export interface Projectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  damage: number;
  owner: string;
  color: string;
  type: 'fireball' | 'soundwave' | 'energy' | 'bullet';
  life: number;
  maxLife: number;
  hitbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface HitSpark {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'impact' | 'block' | 'critical';
}

export interface ComboData {
  count: number;
  damage: number;
  scaling: number;
  timer: number;
}

export interface FrameData {
  hitstun: number;
  blockstun: number;
  invulnerable: number;
  startup: number;
  active: number;
  recovery: number;
}

export interface FighterState {
  current: 'idle' | 'walking' | 'attacking' | 'blocking' | 'hurt' | 'jumping' | 'crouching' | 'special' | 'stunned' | 'ko' | 'victory';
  timer: number;
  canCancel: boolean;
  frameAdvantage: number;
}

export interface SuperMove {
  name: string;
  input: string;
  damage: number;
  cost: number; // Super meter cost (usually 100 for full super)
  type: 'projectile' | 'melee' | 'command' | 'cinematic';
  frames: {
    startup: number;
    active: number;
    recovery: number;
  };
  invulnerable?: boolean; // Some supers have i-frames
  effects?: {
    type: 'knockdown' | 'wallbounce' | 'launch' | 'cinematic';
    duration: number;
  };
}

export interface VoiceLine {
  trigger: 'special' | 'super' | 'victory' | 'hurt' | 'ko';
  text: string;
  audioFile?: string;
}

export interface Fighter {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  meter: number;
  facing: 'left' | 'right';
  velocityX: number;
  velocityY: number;
  grounded: boolean;
  state: FighterState;
  combatState: any;
  inputBuffer: any;
  specialMoves: SpecialMove[];
  superMoves: SuperMove[];
  voiceLines: VoiceLine[];
  colors: {
    primary: string;
    secondary: string;
    aura: string;
  };
  // Enhanced animation and collision system
  animation?: {
    currentFrame: number;
    frameTimer: number;
    sequence: string;
    currentMove?: string;
  };
  hitbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // Combat enhancement properties
  superMeter?: number;
  maxSuperMeter?: number;
  comboCount?: number;
  comboDamage?: number;
  comboDecay?: number;
  // Enhanced game engine properties
  stamina?: number;
  maxStamina?: number;
  animationTimer?: number;
  frameData?: {
    hitstun: number;
    blockstun: number;
    invulnerable: number;
    startup?: number;
    active?: number;
    recovery?: number;
  };
  inputBufferSystem?: any;
  lastInputTime?: number;
}

export interface FighterData {
  id: string;
  name: string;
  stats: {
    power: number;
    speed: number;
    defense: number;
    walkSpeed: number;
    jumpForce: number;
  };
  specialMoves: SpecialMove[];
  superMoves: SuperMove[];
  voiceLines: VoiceLine[];
  colors: {
    primary: string;
    secondary: string;
    aura: string;
  };
}

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
    type: 'fireball' | 'soundwave' | 'energy' | 'bullet';
  };
}