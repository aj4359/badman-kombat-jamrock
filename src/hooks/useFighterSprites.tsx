import { useEffect, useRef, useState } from 'react';

// Import ONLY valid sprite sheet images (not portraits)
// NOTE: leroy-sprite.png, jordan-sprite.png etc are portraits, not sprite sheets
// These will use geometric fallback rendering instead

interface SpriteMap {
  [key: string]: HTMLImageElement | null;
}

// EMPTY - No valid sprite sheets available
// All fighters will use geometric fallback rendering
const SPRITE_SOURCES: Record<string, string> = {};

export const useFighterSprites = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const spritesRef = useRef<SpriteMap>({});

  useEffect(() => {
    // No sprites to load - all fighters use geometric rendering
    console.log('🎨 No sprite sheets available - using geometric fallback for all fighters');
    setIsLoaded(true);
  }, []);

  const getSprite = (fighterId: string): HTMLImageElement | null => {
    return spritesRef.current[fighterId] || null;
  };

  return { isLoaded, getSprite, sprites: spritesRef.current };
};
