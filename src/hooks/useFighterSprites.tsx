import { useState, useEffect, useRef, useCallback } from 'react';
import { extractFramesFromSpriteSheet, createAnimationSequences, AnimationController, FIGHTER_SPRITE_CONFIGS } from '@/utils/spriteSheetLoader';

// ✅ PHASE 1 FIX: Use sprite sheet images
import leroySprite from '@/assets/leroy-sprite-sheet.png';
import jordanSprite from '@/assets/jordan-sprite-sheet.png';
import razorSprite from '@/assets/razor-sprite-sheet.png';
import sifuSprite from '@/assets/sifu-sprite-sheet.png';
import rootsmanSprite from '@/assets/rootsman-sprite-sheet.png';
import johnwickSprite from '@/assets/johnwick-sprite.png';

const SPRITE_PATHS: Record<string, string> = {
  leroy: leroySprite,
  jordan: jordanSprite,
  razor: razorSprite,
  sifu: sifuSprite,
  rootsman: rootsmanSprite,
  johnwick: johnwickSprite,
};

export const useFighterSprites = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const spriteImages = useRef<Record<string, HTMLImageElement>>({});
  const spriteFrames = useRef<Record<string, any[]>>({});
  const animationControllers = useRef<Record<string, AnimationController>>({});

  useEffect(() => {
    const loadSprites = async () => {
      console.log('🎨 [SPRITE SYSTEM] Loading sprite sheet images...');
      
      const loadPromises = Object.entries(SPRITE_PATHS).map(
        ([fighterId, path]) =>
          new Promise<void>((resolve) => {
            if (!path || typeof path !== 'string' || path.includes('undefined')) {
              console.warn(`⚠️ [PHASE 2] No sprite for ${fighterId}, using geometric fallback`);
              resolve();
              return;
            }
            
            const img = new Image();
            
            img.onload = () => {
              if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                console.warn(`⚠️ [PHASE 2] ${fighterId} sprite has zero dimensions`);
                resolve();
                return;
              }
              
              spriteImages.current[fighterId] = img;
              console.log(`✅ [SPRITE SYSTEM] ${fighterId}: Sprite sheet loaded (${img.naturalWidth}x${img.naturalHeight})`);
              resolve();
            };
            
            img.onerror = () => {
              console.warn(`⚠️ [PHASE 2] Sprite not found for ${fighterId}, using geometric fallback`);
              resolve();
            };
            
            try {
              img.src = path;
            } catch (error) {
              console.warn(`⚠️ [PHASE 2] Failed to load ${fighterId}:`, error);
              resolve();
            }
          })
      );

      try {
        await Promise.all(loadPromises);
        console.log('✅ [SPRITE SYSTEM] Sprite sheet loading complete');
      } catch (error) {
        console.warn('⚠️ [PHASE 2] Sprite loading errors, using geometric fallbacks:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSprites();
  }, []);

  const getSpriteData = useCallback((fighterId: string) => {
    return spriteImages.current[fighterId] || null;
  }, []);

  const getAnimationController = useCallback((fighterId: string) => {
    return animationControllers.current[fighterId] || null;
  }, []);

  const getAnimationFrame = useCallback((
    fighterId: string,
    animationName: string,
    frameIndex: number
  ): { x: number; y: number; width: number; height: number } | null => {
    const spriteImage = spriteImages.current[fighterId];
    if (!spriteImage || !spriteImage.complete || spriteImage.naturalWidth === 0) {
      return null; // Will use geometric fallback
    }
    
    // Get sprite sheet configuration
    const config = FIGHTER_SPRITE_CONFIGS[fighterId];
    if (!config) {
      console.warn(`⚠️ No sprite config for ${fighterId}`);
      return null;
    }
    
    // Get animation definition
    const animDefs = require('@/utils/spriteSheetLoader').ANIMATION_DEFINITIONS[fighterId] || 
                     require('@/utils/spriteSheetLoader').ANIMATION_DEFINITIONS.default;
    const animDef = animDefs[animationName];
    
    if (!animDef || !animDef.frames || animDef.frames.length === 0) {
      console.warn(`⚠️ No animation '${animationName}' for ${fighterId}`);
      return null;
    }
    
    // Get the frame index from the animation sequence
    const safeFrameIndex = frameIndex % animDef.frames.length;
    const spriteSheetIndex = animDef.frames[safeFrameIndex];
    
    // Calculate row and column in the sprite sheet grid
    const col = spriteSheetIndex % config.cols;
    const row = Math.floor(spriteSheetIndex / config.cols);
    
    // Calculate source coordinates in the sprite sheet
    return {
      x: col * config.frameWidth,
      y: row * config.frameHeight,
      width: config.frameWidth,
      height: config.frameHeight
    };
  }, []);

  return {
    isLoaded,
    getSpriteData,
    getAnimationController,
    getAnimationFrame,
    spriteData: spriteImages.current,
    spriteFrames: spriteFrames.current,
  };
};
