import { useState } from 'react';

/**
 * Procedural Animation System - No sprite sheets needed
 * All fighters use geometric rendering with pose-based animation
 */
export const useFighterSprites = () => {
  const [isLoaded] = useState(true); // Always ready for geometric rendering
  
  // No sprite loading needed - everything is procedurally generated
  console.log('🎨 Using procedural geometric animation system');
  
  return { 
    isLoaded,
    getSpriteData: () => null, // Return null to trigger geometric rendering
    getAnimationController: () => null,
    spriteData: {}
  };
};
