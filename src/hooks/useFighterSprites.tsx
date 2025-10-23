import { useState, useEffect, useRef, useCallback } from 'react';
import { extractFramesFromSpriteSheet, createAnimationSequences, AnimationController, FIGHTER_SPRITE_CONFIGS } from '@/utils/spriteSheetLoader';

// Import sprite sheets
import leroySheet from '@/assets/leroy-sprite-sheet.png';
import jordanSheet from '@/assets/jordan-sprite-sheet.png';
import razorSheet from '@/assets/razor-sprite-sheet.png';
import sifuSheet from '@/assets/sifu-sprite-sheet.png';
import rootsmanSheet from '@/assets/rootsman-sprite-sheet.png';
import johnwickSheet from '@/assets/johnwick-sprite-sheet.png';

const SPRITE_SHEET_PATHS: Record<string, string> = {
  leroy: leroySheet,
  jordan: jordanSheet,
  razor: razorSheet,
  sifu: sifuSheet,
  rootsman: rootsmanSheet,
  johnwick: johnwickSheet,
};

export const useFighterSprites = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const spriteImages = useRef<Record<string, HTMLImageElement>>({});
  const spriteFrames = useRef<Record<string, any[]>>({});
  const animationControllers = useRef<Record<string, AnimationController>>({});

  useEffect(() => {
    const loadSprites = async () => {
      console.log('🎨 [PHASE 1 FIX] Loading sprite sheets with error handling...');
      
      const loadPromises = Object.entries(SPRITE_SHEET_PATHS).map(
        ([fighterId, path]) =>
          new Promise<void>((resolve) => {
            // ✅ SAFETY CHECK: Validate path exists
            if (!path || typeof path !== 'string' || path.includes('undefined')) {
              console.warn(`⚠️ [PHASE 1] No sprite sheet for ${fighterId}, using geometric fallback`);
              resolve(); // Don't crash, just skip
              return;
            }
            
            const img = new Image();
            
            img.onload = async () => {
              try {
                if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                  console.warn(`⚠️ [PHASE 1] ${fighterId} sprite has zero dimensions, using fallback`);
                  resolve();
                  return;
                }
                
                spriteImages.current[fighterId] = img;
                
                const config = FIGHTER_SPRITE_CONFIGS[fighterId];
                if (config) {
                  const frames = await extractFramesFromSpriteSheet(img, config);
                  spriteFrames.current[fighterId] = frames;
                  const animations = createAnimationSequences(frames, fighterId);
                  animationControllers.current[fighterId] = new AnimationController(animations);
                  console.log(`✅ [PHASE 1] ${fighterId}: ${frames.length} frames loaded`);
                }
                resolve();
              } catch (error) {
                console.warn(`⚠️ [PHASE 1] Error processing ${fighterId} sprite:`, error);
                resolve(); // Don't crash
              }
            };
            
            img.onerror = () => {
              console.warn(`⚠️ [PHASE 1] Sprite file not found for ${fighterId}, using geometric fallback`);
              resolve(); // Don't crash, geometric rendering will handle it
            };
            
            // ✅ SAFETY: Wrap in try/catch
            try {
              img.src = path;
            } catch (error) {
              console.warn(`⚠️ [PHASE 1] Failed to set src for ${fighterId}:`, error);
              resolve();
            }
          })
      );

      try {
        await Promise.all(loadPromises);
        console.log('✅ [PHASE 1] Sprite loading complete (with fallbacks)');
      } catch (error) {
        console.warn('⚠️ [PHASE 1] Sprite loading had errors, continuing with geometric fallbacks:', error);
      } finally {
        setIsLoaded(true); // Always set loaded to proceed with game
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
    // ✅ VALIDATION: Check if sprite exists before returning coordinates
    const spriteImage = spriteImages.current[fighterId];
    if (!spriteImage || !spriteImage.complete || spriteImage.naturalWidth === 0) {
      console.warn(`⚠️ Sprite not loaded for ${fighterId}, using geometric fallback`);
      return null;
    }
    
    const FRAME_WIDTH = 64;
    const FRAME_HEIGHT = 64;
    
    // Map animation names to sprite sheet rows
    const animationRows: Record<string, { row: number; frames: number }> = {
      idle: { row: 0, frames: 4 },
      walking: { row: 1, frames: 8 },
      lightPunch: { row: 2, frames: 6 },
      mediumPunch: { row: 3, frames: 7 },
      heavyPunch: { row: 4, frames: 8 },
      lightKick: { row: 5, frames: 6 },
      heavyKick: { row: 6, frames: 8 },
      blocking: { row: 7, frames: 2 },
      hurt: { row: 8, frames: 4 },
      knockdown: { row: 9, frames: 6 },
      special: { row: 10, frames: 12 },
      victory: { row: 11, frames: 8 }
    };
    
    const anim = animationRows[animationName] || animationRows.idle;
    const safeFrameIndex = frameIndex % anim.frames;
    
    console.log(`🎨 Returning frame coords for ${fighterId}:`, {
      animation: animationName,
      frame: safeFrameIndex,
      coords: {
        x: safeFrameIndex * FRAME_WIDTH,
        y: anim.row * FRAME_HEIGHT,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT
      }
    });
    
    return {
      x: safeFrameIndex * FRAME_WIDTH,
      y: anim.row * FRAME_HEIGHT,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT
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
