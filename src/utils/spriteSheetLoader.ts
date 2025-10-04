/**
 * Sprite Sheet Frame Extraction System
 * Extracts individual frames from grid-based sprite sheets
 */

export interface SpriteFrame {
  image: HTMLImageElement;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
}

export interface SpriteSheetConfig {
  frameWidth: number;
  frameHeight: number;
  rows: number;
  cols: number;
  scale?: number;
}

export interface AnimationSequence {
  name: string;
  frames: SpriteFrame[];
  frameIndices: number[];
  frameDuration: number; // Frames to display each sprite
  loop: boolean;
}

/**
 * Extract individual frames from a sprite sheet image
 */
export function extractFramesFromSpriteSheet(
  image: HTMLImageElement,
  config: SpriteSheetConfig
): SpriteFrame[] {
  const frames: SpriteFrame[] = [];
  const { frameWidth, frameHeight, rows, cols, scale = 1 } = config;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Create a canvas for this frame
      const canvas = document.createElement('canvas');
      canvas.width = frameWidth * scale;
      canvas.height = frameHeight * scale;
      const ctx = canvas.getContext('2d')!;

      // Extract the frame from sprite sheet
      ctx.drawImage(
        image,
        col * frameWidth,  // source X
        row * frameHeight, // source Y
        frameWidth,        // source width
        frameHeight,       // source height
        0,                 // dest X
        0,                 // dest Y
        frameWidth * scale, // dest width
        frameHeight * scale // dest height
      );

      // Create an image from the canvas
      const frameImage = new Image();
      frameImage.src = canvas.toDataURL();

      frames.push({
        image: frameImage,
        sourceX: col * frameWidth,
        sourceY: row * frameHeight,
        width: frameWidth,
        height: frameHeight,
      });
    }
  }

  return frames;
}

/**
 * Standard sprite sheet configurations for fighters
 */
export const FIGHTER_SPRITE_CONFIGS: Record<string, SpriteSheetConfig> = {
  leroy: { frameWidth: 200, frameHeight: 200, rows: 4, cols: 6, scale: 1.5 },
  jordan: { frameWidth: 200, frameHeight: 200, rows: 4, cols: 6, scale: 1.5 },
  razor: { frameWidth: 200, frameHeight: 200, rows: 4, cols: 6, scale: 1.5 },
  sifu: { frameWidth: 200, frameHeight: 200, rows: 4, cols: 6, scale: 1.5 },
  rootsman: { frameWidth: 200, frameHeight: 200, rows: 4, cols: 6, scale: 1.5 },
};

/**
 * Animation definitions for each fighter state
 * Maps state to frame indices in the sprite sheet
 */
export const ANIMATION_DEFINITIONS: Record<string, Record<string, { frames: number[], duration: number, loop: boolean }>> = {
  default: {
    idle: { frames: [0, 1, 2, 3], duration: 10, loop: true },
    walking: { frames: [6, 7, 8, 9, 10, 11], duration: 5, loop: true },
    jumping: { frames: [12, 13, 14, 15], duration: 6, loop: false },
    crouching: { frames: [18, 19], duration: 8, loop: true },
    lightPunch: { frames: [4, 5, 4, 0], duration: 4, loop: false },
    mediumPunch: { frames: [16, 17, 16, 0], duration: 4, loop: false },
    heavyPunch: { frames: [20, 21, 22, 21, 0], duration: 5, loop: false },
    lightKick: { frames: [5, 23, 5, 0], duration: 4, loop: false },
    mediumKick: { frames: [17, 23, 17, 0], duration: 4, loop: false },
    heavyKick: { frames: [21, 22, 23, 22, 0], duration: 5, loop: false },
    blocking: { frames: [18, 19], duration: 6, loop: true },
    hit: { frames: [19, 18], duration: 5, loop: false },
    special: { frames: [20, 21, 22, 23, 22, 21], duration: 6, loop: false },
  },
};

/**
 * Create animation sequences from extracted frames
 */
export function createAnimationSequences(
  frames: SpriteFrame[],
  fighterId: string
): Record<string, AnimationSequence> {
  const animations: Record<string, AnimationSequence> = {};
  const animDefs = ANIMATION_DEFINITIONS[fighterId] || ANIMATION_DEFINITIONS.default;

  Object.entries(animDefs).forEach(([animName, def]) => {
    const animFrames = def.frames.map(index => frames[index] || frames[0]);
    
    animations[animName] = {
      name: animName,
      frames: animFrames,
      frameIndices: def.frames,
      frameDuration: def.duration,
      loop: def.loop,
    };
  });

  return animations;
}

/**
 * Animation state manager
 */
export class AnimationController {
  private currentAnimation: string = 'idle';
  private currentFrame: number = 0;
  private frameTimer: number = 0;
  private isFinished: boolean = false;

  constructor(private animations: Record<string, AnimationSequence>) {}

  update(): void {
    const anim = this.animations[this.currentAnimation];
    if (!anim || this.isFinished) return;

    this.frameTimer++;
    if (this.frameTimer >= anim.frameDuration) {
      this.frameTimer = 0;
      this.currentFrame++;

      if (this.currentFrame >= anim.frames.length) {
        if (anim.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = anim.frames.length - 1;
          this.isFinished = true;
        }
      }
    }
  }

  setAnimation(animName: string): void {
    if (animName !== this.currentAnimation && this.animations[animName]) {
      this.currentAnimation = animName;
      this.currentFrame = 0;
      this.frameTimer = 0;
      this.isFinished = false;
    }
  }

  getCurrentFrame(): SpriteFrame | null {
    const anim = this.animations[this.currentAnimation];
    if (!anim) return null;
    return anim.frames[this.currentFrame] || anim.frames[0];
  }

  isAnimationFinished(): boolean {
    return this.isFinished;
  }

  getFrameIndex(): number {
    return this.currentFrame;
  }

  getCurrentAnimationName(): string {
    return this.currentAnimation;
  }
}
