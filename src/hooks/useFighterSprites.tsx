import { useEffect, useRef, useState } from 'react';
import { 
  extractFramesFromSpriteSheet, 
  FIGHTER_SPRITE_CONFIGS,
  createAnimationSequences,
  AnimationController,
  SpriteFrame
} from '@/utils/spriteSheetLoader';

// Import ACTUAL sprite sheet images (multi-frame grid layouts)
import leroySpriteSheet from '@/assets/leroy-sprite-sheet.png';
import jordanSpriteSheet from '@/assets/jordan-sprite-sheet.png';
import razorSpriteSheet from '@/assets/razor-sprite-sheet.png';
import sifuSpriteSheet from '@/assets/sifu-sprite-sheet.png';
import rootsmanSpriteSheet from '@/assets/rootsman-sprite-sheet.png';

const SPRITE_SOURCES: Record<string, string> = {
  leroy: leroySpriteSheet,
  jordan: jordanSpriteSheet,
  razor: razorSpriteSheet,
  sifu: sifuSpriteSheet,
  rootsman: rootsmanSpriteSheet,
};

interface FighterSpriteData {
  frames: SpriteFrame[];
  animations: Record<string, any>;
  controller: AnimationController;
}

interface SpriteDataMap {
  [key: string]: FighterSpriteData | null;
}

export const useFighterSprites = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const spriteDataRef = useRef<SpriteDataMap>({});

  useEffect(() => {
    const loadSprites = async () => {
      console.log('🎨 Loading fighter sprite sheets and extracting frames...');
      
      const spritePromises = Object.entries(SPRITE_SOURCES).map(([fighterId, src]) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            console.log(`✅ Loaded sprite sheet for ${fighterId}, extracting frames...`);
            
            // Extract frames from sprite sheet
            const config = FIGHTER_SPRITE_CONFIGS[fighterId] || FIGHTER_SPRITE_CONFIGS.default;
            const frames = extractFramesFromSpriteSheet(img, config);
            
            // Create animation sequences
            const animations = createAnimationSequences(frames, fighterId);
            
            // Create animation controller
            const controller = new AnimationController(animations);
            
            spriteDataRef.current[fighterId] = {
              frames,
              animations,
              controller,
            };
            
            console.log(`✅ Extracted ${frames.length} frames for ${fighterId}`);
            resolve();
          };
          img.onerror = () => {
            console.error(`❌ Failed to load sprite sheet for ${fighterId}`);
            spriteDataRef.current[fighterId] = null;
            reject(new Error(`Failed to load ${fighterId}`));
          };
          img.src = src;
        });
      });

      try {
        await Promise.all(spritePromises);
        console.log('🎉 All fighter sprite sheets loaded and frames extracted!');
        setIsLoaded(true);
      } catch (error) {
        console.error('⚠️ Some sprites failed to load:', error);
        setIsLoaded(true); // Still set loaded to allow fallback
      }
    };

    loadSprites();
  }, []);

  const getSpriteData = (fighterId: string): FighterSpriteData | null => {
    return spriteDataRef.current[fighterId] || null;
  };

  const getAnimationController = (fighterId: string): AnimationController | null => {
    return spriteDataRef.current[fighterId]?.controller || null;
  };

  return { 
    isLoaded, 
    getSpriteData,
    getAnimationController,
    spriteData: spriteDataRef.current 
  };
};
