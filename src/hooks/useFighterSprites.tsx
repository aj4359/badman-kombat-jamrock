import { useEffect, useRef, useState } from 'react';

// Import ONLY valid sprite sheet images (not portraits)
// NOTE: leroy-sprite.png, jordan-sprite.png etc are portraits, not sprite sheets
// These will use geometric fallback rendering instead

interface SpriteMap {
  [key: string]: HTMLImageElement | null;
}

// Import sprite sheet images
import leroySprite from '@/assets/leroy-sprite.png';
import jordanSprite from '@/assets/jordan-sprite.png';
import razorSprite from '@/assets/razor-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';
import rootsmanSprite from '@/assets/rootsman-sprite.png';

const SPRITE_SOURCES: Record<string, string> = {
  leroy: leroySprite,
  jordan: jordanSprite,
  razor: razorSprite,
  sifu: sifuSprite,
  rootsman: rootsmanSprite,
};

export const useFighterSprites = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const spritesRef = useRef<SpriteMap>({});

  useEffect(() => {
    const loadSprites = async () => {
      console.log('🎨 Loading fighter sprite sheets...');
      
      const spritePromises = Object.entries(SPRITE_SOURCES).map(([fighterId, src]) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            spritesRef.current[fighterId] = img;
            console.log(`✅ Loaded sprite for ${fighterId}`);
            resolve();
          };
          img.onerror = () => {
            console.error(`❌ Failed to load sprite for ${fighterId}`);
            reject(new Error(`Failed to load ${fighterId}`));
          };
          img.src = src;
        });
      });

      try {
        await Promise.all(spritePromises);
        console.log('🎉 All fighter sprites loaded successfully!');
        setIsLoaded(true);
      } catch (error) {
        console.error('⚠️ Some sprites failed to load:', error);
        setIsLoaded(true); // Still set loaded to allow geometric fallback
      }
    };

    loadSprites();
  }, []);

  const getSprite = (fighterId: string): HTMLImageElement | null => {
    return spritesRef.current[fighterId] || null;
  };

  return { isLoaded, getSprite, sprites: spritesRef.current };
};
