import { useState, useEffect, useRef, useCallback } from 'react';
import { extractFramesFromSpriteSheet, createAnimationSequences, AnimationController, FIGHTER_SPRITE_CONFIGS } from '@/utils/spriteSheetLoader';

// Import sprite sheets
import leroySheet from '@/assets/leroy-sprite-sheet.png';
import jordanSheet from '@/assets/jordan-sprite-sheet.png';
import razorSheet from '@/assets/razor-sprite-sheet.png';
import sifuSheet from '@/assets/sifu-sprite-sheet.png';
import rootsmanSheet from '@/assets/rootsman-sprite-sheet.png';
import johnwickSheet from '@/assets/johnwick-sprite.png';

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
      console.log('🎨 Loading pixel art sprite sheets...');
      const loadPromises = Object.entries(SPRITE_SHEET_PATHS).map(
        ([fighterId, path]) =>
          new Promise<void>((resolve, reject) => {
            console.log(`🎨 Loading ${fighterId}:`, { path, type: typeof path });
            
            if (!path || typeof path !== 'string') {
              console.error(`❌ Invalid path for ${fighterId}:`, path);
              resolve();
              return;
            }
            
            const img = new Image();
            img.onload = async () => {
              console.log(`✅ ${fighterId} loaded:`, {
                width: img.naturalWidth,
                height: img.naturalHeight
              });
              
              if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                console.error(`❌ ${fighterId} has zero dimensions`);
                resolve();
                return;
              }
              
              spriteImages.current[fighterId] = img;
              
              // Extract frames from sprite sheet
              const config = FIGHTER_SPRITE_CONFIGS[fighterId];
              if (config) {
                const frames = await extractFramesFromSpriteSheet(img, config);
                spriteFrames.current[fighterId] = frames;
                
                // Create animation sequences
                const animations = createAnimationSequences(frames, fighterId);
                animationControllers.current[fighterId] = new AnimationController(animations);
                
                console.log(`✅ ${fighterId}: ${frames.length} frames`);
              }
              resolve();
            };
            img.onerror = (error) => {
              console.error(`❌ SPRITE FAILED: ${fighterId}`, {
                path,
                src: img.src,
                error
              });
              console.warn(`🎨 Geometric fallback: ${fighterId}`);
              resolve();
            };
            img.src = path;
          })
      );

      try {
        await Promise.all(loadPromises);
        setIsLoaded(true);
        console.log('✅ All pixel art sprites loaded successfully!');
      } catch (error) {
        console.error('❌ Error loading sprite sheets:', error);
        setIsLoaded(true); // Still set loaded to allow geometric fallback
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
