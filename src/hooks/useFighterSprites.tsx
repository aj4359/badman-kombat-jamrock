import { useState, useEffect, useRef, useCallback } from 'react';
import { extractFramesFromSpriteSheet, createAnimationSequences, AnimationController, FIGHTER_SPRITE_CONFIGS } from '@/utils/spriteSheetLoader';

// Import sprite sheets
import leroySheet from '@/assets/leroy-sprite-sheet.png';
import jordanSheet from '@/assets/jordan-sprite-sheet.png';
import razorSheet from '@/assets/razor-sprite-sheet.png';
import sifuSheet from '@/assets/sifu-sprite-sheet.png';
import rootsmanSheet from '@/assets/rootsman-sprite-sheet.png';

const SPRITE_SHEET_PATHS: Record<string, string> = {
  leroy: leroySheet,
  jordan: jordanSheet,
  razor: razorSheet,
  sifu: sifuSheet,
  rootsman: rootsmanSheet,
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
            const img = new Image();
            img.onload = () => {
              spriteImages.current[fighterId] = img;
              
              // Extract frames from sprite sheet
              const config = FIGHTER_SPRITE_CONFIGS[fighterId];
              if (config) {
                const frames = extractFramesFromSpriteSheet(img, config);
                spriteFrames.current[fighterId] = frames;
                
                // Create animation sequences
                const animations = createAnimationSequences(frames, fighterId);
                animationControllers.current[fighterId] = new AnimationController(animations);
                
                console.log(`✅ Loaded ${fighterId} sprite: ${frames.length} frames`);
              }
              resolve();
            };
            img.onerror = () => {
              console.warn(`⚠️ Failed to load sprite sheet for ${fighterId}`);
              reject();
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

  return {
    isLoaded,
    getSpriteData,
    getAnimationController,
    spriteData: spriteImages.current,
    spriteFrames: spriteFrames.current,
  };
};
