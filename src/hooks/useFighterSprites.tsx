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
      console.log('🎨 [PHASE 2 FIX] Loading single sprite images (not sheets)...');
      
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
              console.log(`✅ [PHASE 2] ${fighterId}: Single sprite loaded (${img.naturalWidth}x${img.naturalHeight})`);
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
        console.log('✅ [PHASE 2] Single sprite loading complete');
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
    // ✅ PHASE 2: Single sprites don't have frame coordinates, return full image
    const spriteImage = spriteImages.current[fighterId];
    if (!spriteImage || !spriteImage.complete || spriteImage.naturalWidth === 0) {
      return null; // Will use geometric fallback
    }
    
    // Return full image dimensions (single sprite, not a sheet)
    return {
      x: 0,
      y: 0,
      width: spriteImage.naturalWidth,
      height: spriteImage.naturalHeight
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
