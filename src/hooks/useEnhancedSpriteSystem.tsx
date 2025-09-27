import { useState, useRef, useCallback, useEffect } from 'react';
import { renderAuthenticFighter } from '@/components/game/AuthenticFighterRenderer';
import { Fighter as FighterType } from '@/types/gameTypes';

// Enhanced sprite frame structure
export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EnhancedSpriteAnimation {
  frames: SpriteFrame[];
  duration: number;
  loop: boolean;
  frameEvents?: Record<number, string>; // Frame number -> event name
}

export interface FighterSprites {
  idle: EnhancedSpriteAnimation;
  walking: EnhancedSpriteAnimation;
  attacking: EnhancedSpriteAnimation;
  blocking: EnhancedSpriteAnimation;
  hit: EnhancedSpriteAnimation;
  jumping: EnhancedSpriteAnimation;
  crouching: EnhancedSpriteAnimation;
  special: EnhancedSpriteAnimation;
  super: EnhancedSpriteAnimation;
  victory: EnhancedSpriteAnimation;
  defeat: EnhancedSpriteAnimation;
}

const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 128;

const createSpriteFrames = (row: number, count: number): SpriteFrame[] => {
  return Array.from({ length: count }, (_, i) => ({
    x: i * FRAME_WIDTH,
    y: row * FRAME_HEIGHT,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
  }));
};

// Enhanced sprite data with frame events
const ENHANCED_FIGHTER_SPRITE_DATA: Record<string, FighterSprites> = {
  leroy: {
    idle: { frames: createSpriteFrames(0, 4), duration: 1000, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 600, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 400, 
      loop: false,
      frameEvents: { 2: 'hit_connect' }
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 300, loop: false },
    hit: { frames: createSpriteFrames(4, 3), duration: 200, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 500, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 200, loop: false },
    special: { 
      frames: createSpriteFrames(7, 6), 
      duration: 800, 
      loop: false,
      frameEvents: { 3: 'special_effect', 4: 'projectile_launch' }
    },
    super: { 
      frames: createSpriteFrames(8, 8), 
      duration: 1200, 
      loop: false,
      frameEvents: { 2: 'screen_flash', 5: 'super_impact' }
    },
    victory: { frames: createSpriteFrames(9, 4), duration: 2000, loop: true },
    defeat: { frames: createSpriteFrames(10, 3), duration: 1000, loop: false },
  },
  jordan: {
    idle: { frames: createSpriteFrames(0, 4), duration: 1000, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 600, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 400, 
      loop: false,
      frameEvents: { 2: 'hit_connect' }
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 300, loop: false },
    hit: { frames: createSpriteFrames(4, 3), duration: 200, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 500, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 200, loop: false },
    special: { 
      frames: createSpriteFrames(7, 6), 
      duration: 800, 
      loop: false,
      frameEvents: { 3: 'special_effect', 4: 'projectile_launch' }
    },
    super: { 
      frames: createSpriteFrames(8, 8), 
      duration: 1200, 
      loop: false,
      frameEvents: { 2: 'screen_flash', 5: 'super_impact' }
    },
    victory: { frames: createSpriteFrames(9, 4), duration: 2000, loop: true },
    defeat: { frames: createSpriteFrames(10, 3), duration: 1000, loop: false },
  },
  sifu: {
    idle: { frames: createSpriteFrames(0, 4), duration: 1000, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 600, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 400, 
      loop: false,
      frameEvents: { 2: 'hit_connect' }
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 300, loop: false },
    hit: { frames: createSpriteFrames(4, 3), duration: 200, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 500, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 200, loop: false },
    special: { 
      frames: createSpriteFrames(7, 6), 
      duration: 800, 
      loop: false,
      frameEvents: { 3: 'special_effect', 4: 'projectile_launch' }
    },
    super: { 
      frames: createSpriteFrames(8, 8), 
      duration: 1200, 
      loop: false,
      frameEvents: { 2: 'screen_flash', 5: 'super_impact' }
    },
    victory: { frames: createSpriteFrames(9, 4), duration: 2000, loop: true },
    defeat: { frames: createSpriteFrames(10, 3), duration: 1000, loop: false },
  },
  razor: {
    idle: { frames: createSpriteFrames(0, 4), duration: 1000, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 600, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 400, 
      loop: false,
      frameEvents: { 2: 'hit_connect' }
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 300, loop: false },
    hit: { frames: createSpriteFrames(4, 3), duration: 200, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 500, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 200, loop: false },
    special: { 
      frames: createSpriteFrames(7, 6), 
      duration: 800, 
      loop: false,
      frameEvents: { 3: 'special_effect', 4: 'projectile_launch' }
    },
    super: { 
      frames: createSpriteFrames(8, 8), 
      duration: 1200, 
      loop: false,
      frameEvents: { 2: 'screen_flash', 5: 'super_impact' }
    },
    victory: { frames: createSpriteFrames(9, 4), duration: 2000, loop: true },
    defeat: { frames: createSpriteFrames(10, 3), duration: 1000, loop: false },
  },
  rootsman: {
    idle: { frames: createSpriteFrames(0, 4), duration: 1000, loop: true },
    walking: { frames: createSpriteFrames(1, 6), duration: 600, loop: true },
    attacking: { 
      frames: createSpriteFrames(2, 5), 
      duration: 400, 
      loop: false,
      frameEvents: { 2: 'hit_connect' }
    },
    blocking: { frames: createSpriteFrames(3, 2), duration: 300, loop: false },
    hit: { frames: createSpriteFrames(4, 3), duration: 200, loop: false },
    jumping: { frames: createSpriteFrames(5, 4), duration: 500, loop: false },
    crouching: { frames: createSpriteFrames(6, 2), duration: 200, loop: false },
    special: { 
      frames: createSpriteFrames(7, 6), 
      duration: 800, 
      loop: false,
      frameEvents: { 3: 'special_effect', 4: 'projectile_launch' }
    },
    super: { 
      frames: createSpriteFrames(8, 8), 
      duration: 1200, 
      loop: false,
      frameEvents: { 2: 'screen_flash', 5: 'super_impact' }
    },
    victory: { frames: createSpriteFrames(9, 4), duration: 2000, loop: true },
    defeat: { frames: createSpriteFrames(10, 3), duration: 1000, loop: false },
  },
};

export const useEnhancedSpriteSystem = () => {
  const spriteImages = useRef<Record<string, HTMLImageElement>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const animationCallbacks = useRef<Map<string, (event: string) => void>>(new Map());

  // Initialize sprite system - mark as loaded to use AuthenticFighterRenderer
  useEffect(() => {
    const loadSprites = () => {
      console.log('useEnhancedSpriteSystem: Initializing sprite system...');
      setIsLoaded(true);
    };

    loadSprites();
  }, []);

  const getCurrentFrame = useCallback((
    fighterId: string,
    state: string,
    animationTimer: number
  ): { frame: SpriteFrame | null; frameIndex: number } => {
    const fighterSprites = ENHANCED_FIGHTER_SPRITE_DATA[fighterId];
    if (!fighterSprites) {
      return { frame: null, frameIndex: 0 };
    }

    const animation = fighterSprites[state as keyof FighterSprites];
    if (!animation || !animation.frames.length) {
      return { frame: null, frameIndex: 0 };
    }

    const frameTime = animation.duration / animation.frames.length;
    let frameIndex = Math.floor(animationTimer / frameTime);

    if (!animation.loop && frameIndex >= animation.frames.length) {
      frameIndex = animation.frames.length - 1;
    } else {
      frameIndex = frameIndex % animation.frames.length;
    }

    // Trigger frame events if any
    if (animation.frameEvents && animation.frameEvents[frameIndex]) {
      const callback = animationCallbacks.current.get(fighterId);
      if (callback) {
        callback(animation.frameEvents[frameIndex]);
      }
    }

    return {
      frame: animation.frames[frameIndex] || animation.frames[0],
      frameIndex
    };
  }, []);

  const registerAnimationCallback = useCallback((
    fighterId: string,
    callback: (event: string) => void
  ) => {
    animationCallbacks.current.set(fighterId, callback);
  }, []);

  const drawEnhancedFighter = useCallback((
    ctx: CanvasRenderingContext2D,
    fighter: FighterType,
    effects?: {
      alpha?: number;
      hueRotate?: number;
      shake?: { x: number; y: number };
    }
  ) => {
    if (!ctx || !fighter) return;

    // Use AuthenticFighterRenderer directly for stable, detailed rendering
    try {
      renderAuthenticFighter({ ctx, fighter, effects });
    } catch (error) {
      console.error('Error in AuthenticFighterRenderer:', error);
      // Simple fallback
      ctx.fillStyle = fighter.colors?.primary || '#FF0000';
      ctx.fillRect(fighter.x, fighter.y, 60, 100);
    }
  }, []);

  const getAnimationDuration = useCallback((
    fighterId: string,
    state: string
  ): number => {
    const fighterSprites = ENHANCED_FIGHTER_SPRITE_DATA[fighterId];
    if (!fighterSprites) return 1000;

    const animation = fighterSprites[state as keyof FighterSprites];
    return animation?.duration || 1000;
  }, []);

  const isAnimationComplete = useCallback((
    fighterId: string,
    state: string,
    animationTimer: number
  ): boolean => {
    const fighterSprites = ENHANCED_FIGHTER_SPRITE_DATA[fighterId];
    if (!fighterSprites) return true;

    const animation = fighterSprites[state as keyof FighterSprites];
    if (!animation || animation.loop) return false;

    return animationTimer >= animation.duration;
  }, []);

  return {
    isLoaded,
    drawEnhancedFighter,
    getAnimationDuration,
    getCurrentFrame,
    registerAnimationCallback,
    isAnimationComplete,
  };
};