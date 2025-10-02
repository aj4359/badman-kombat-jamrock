import { useEffect, useRef, useState } from 'react';

// Import sprite images
import ashaSprite from '@/assets/asha-sprite.png';
import leroySprite from '@/assets/leroy-sprite.png';
import jordanSprite from '@/assets/jordan-sprite.png';
import razorSprite from '@/assets/razor-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';
import rootsmanSprite from '@/assets/rootsman-sprite.png';

interface SpriteMap {
  [key: string]: HTMLImageElement | null;
}

const SPRITE_SOURCES: Record<string, string> = {
  asha: ashaSprite,
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
      const promises = Object.entries(SPRITE_SOURCES).map(
        ([id, src]) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              spritesRef.current[id] = img;
              console.log(`✅ Loaded sprite for ${id}`);
              resolve();
            };
            img.onerror = () => {
              console.warn(`⚠️ Failed to load sprite for ${id}, will use fallback`);
              spritesRef.current[id] = null;
              resolve(); // Don't reject, just use fallback
            };
            img.src = src;
          })
      );

      await Promise.all(promises);
      setIsLoaded(true);
      console.log('✅ All fighter sprites loaded');
    };

    loadSprites();
  }, []);

  const getSprite = (fighterId: string): HTMLImageElement | null => {
    return spritesRef.current[fighterId] || null;
  };

  return { isLoaded, getSprite, sprites: spritesRef.current };
};
