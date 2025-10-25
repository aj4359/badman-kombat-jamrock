import { useCallback, useRef, useState } from 'react';
import { HitSpark, Projectile } from '@/types/gameTypes';
import { 
  applyChromaticAberration, 
  applyRadialBlur, 
  renderEnergyVortex,
  renderFreezeFrame,
  renderTimeDilation,
  ChromaticAberration,
  RadialBlur,
  EnergyVortex
} from '@/utils/cinematicEffects';

interface ScreenShake {
  intensity: number;
  duration: number;
  timer: number;
}

interface HitStop {
  duration: number;
  timer: number;
}

interface FlashEffect {
  color: string;
  intensity: number;
  duration: number;
  timer: number;
}

export const useVisualEffects = () => {
  const [screenShake, setScreenShake] = useState<ScreenShake>({ intensity: 0, duration: 0, timer: 0 });
  const [hitStop, setHitStop] = useState<HitStop>({ duration: 0, timer: 0 });
  const [flashEffect, setFlashEffect] = useState<FlashEffect>({ color: '#ffffff', intensity: 0, duration: 0, timer: 0 });
  const [hitSparks, setHitSparks] = useState<HitSpark[]>([]);
  const sparkIdCounter = useRef(0);

  const addScreenShake = useCallback((intensity: number, duration: number) => {
    // Enhanced intensity for better feel (doubled)
    setScreenShake({ intensity: intensity * 2, duration, timer: 0 });
  }, []);

  const addHitStop = useCallback((duration: number) => {
    setHitStop({ duration, timer: 0 });
  }, []);

  const addFlashEffect = useCallback((color: string, intensity: number, duration: number) => {
    setFlashEffect({ color, intensity, duration, timer: 0 });
  }, []);

  const addHitSpark = useCallback((x: number, y: number, type: 'impact' | 'block' | 'critical' = 'impact') => {
    const sparkColors = {
      impact: '#ffff00',
      block: '#00ffff',
      critical: '#ff0000'
    };

    const newSpark: HitSpark = {
      id: `spark_${sparkIdCounter.current++}`,
      x,
      y,
      size: type === 'critical' ? 60 : 40, // Increased from 20/15 for more impact
      color: sparkColors[type],
      life: 0,
      maxLife: type === 'critical' ? 15 : 10,
      type
    };

    setHitSparks(prev => [...prev, newSpark]);
  }, []);

  // Pure update function - called externally, doesn't trigger setState
  const updateEffects = useCallback((deltaTime: number) => {
    // This function is now pure - it only returns updated values
    // The calling code (game loop) will handle state updates in batch
  }, []);

  const getShakeOffset = useCallback((): { x: number; y: number } => {
    if (screenShake.timer >= screenShake.duration) {
      return { x: 0, y: 0 };
    }
    
    const progress = screenShake.timer / screenShake.duration;
    const intensity = screenShake.intensity * (1 - progress);
    
    return {
      x: (Math.random() - 0.5) * intensity,
      y: (Math.random() - 0.5) * intensity
    };
  }, [screenShake]);

  const isHitStopActive = useCallback((): boolean => {
    return hitStop.timer < hitStop.duration;
  }, [hitStop]);

  const getFlashOpacity = useCallback((): number => {
    if (flashEffect.timer >= flashEffect.duration) {
      return 0;
    }
    
    const progress = flashEffect.timer / flashEffect.duration;
    return flashEffect.intensity * (1 - progress);
  }, [flashEffect]);

  const drawHitSparks = useCallback((ctx: CanvasRenderingContext2D) => {
    hitSparks.forEach(spark => {
      const progress = spark.life / spark.maxLife;
      const alpha = 1 - progress;
      const currentSize = spark.size * (1 - progress * 0.5);
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = spark.color;
      
      // Draw spark as a diamond/star shape
      ctx.translate(spark.x, spark.y);
      ctx.rotate(progress * Math.PI * 2);
      
      ctx.beginPath();
      ctx.moveTo(0, -currentSize);
      ctx.lineTo(currentSize * 0.3, -currentSize * 0.3);
      ctx.lineTo(currentSize, 0);
      ctx.lineTo(currentSize * 0.3, currentSize * 0.3);
      ctx.lineTo(0, currentSize);
      ctx.lineTo(-currentSize * 0.3, currentSize * 0.3);
      ctx.lineTo(-currentSize, 0);
      ctx.lineTo(-currentSize * 0.3, -currentSize * 0.3);
      ctx.closePath();
      ctx.fill();
      
      // Add enhanced glow effect
      ctx.shadowColor = spark.color;
      ctx.shadowBlur = currentSize * 2; // Doubled glow intensity
      ctx.fill();
      
      ctx.restore();
    });
  }, [hitSparks]);

  const drawProjectileTrail = useCallback((ctx: CanvasRenderingContext2D, projectile: Projectile) => {
    // PHASE 7: Enhanced projectile trails with glow
    const trail = {
      fireball: 'hsl(20, 100%, 50%)',
      soundwave: 'hsl(180, 100%, 50%)',
      energy: 'hsl(60, 100%, 50%)',
      hadoken: 'hsl(220, 100%, 60%)',
      sonic: 'hsl(270, 100%, 60%)',
      plasma: 'hsl(180, 100%, 60%)'
    };

    ctx.save();
    const trailColor = trail[projectile.type] || 'hsl(0, 0%, 100%)';
    
    // Draw glowing trail with enhanced particles
    for (let i = 0; i < 8; i++) {
      const trailX = projectile.x - (projectile.velocityX * i * 1.5);
      const trailY = projectile.y - (projectile.velocityY * i * 1.5);
      const trailSize = projectile.width * (1 - i * 0.1);
      const alpha = 0.7 * (1 - i * 0.12);
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = trailColor;
      ctx.shadowColor = trailColor;
      ctx.shadowBlur = 20;
      
      ctx.beginPath();
      ctx.arc(trailX + trailSize/2, trailY + trailSize/2, trailSize/2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }, []);

  const createComboEffect = useCallback((x: number, y: number, comboCount: number) => {
    // Create multiple hit sparks for combo effect
    for (let i = 0; i < Math.min(comboCount, 5); i++) {
      setTimeout(() => {
        addHitSpark(
          x + (Math.random() - 0.5) * 40,
          y + (Math.random() - 0.5) * 40,
          comboCount > 5 ? 'critical' : 'impact'
        );
      }, i * 50);
    }
    
    // Add screen shake based on combo count
    addScreenShake(Math.min(comboCount * 2, 15), 200);
    
    // Add flash for high combos
    if (comboCount > 3) {
      addFlashEffect('#ffff00', 0.3, 150);
    }
  }, [addHitSpark, addScreenShake, addFlashEffect]);

  const applyCinematicEffects = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    effectType: 'chromatic' | 'radialBlur' | 'vortex' | 'freeze' | 'timeDilation',
    params?: any
  ) => {
    switch (effectType) {
      case 'chromatic':
        applyChromaticAberration(ctx, width, height, params?.offset || 5);
        break;
      case 'radialBlur':
        if (params) {
          applyRadialBlur(ctx, params as RadialBlur);
        }
        break;
      case 'vortex':
        if (params) {
          renderEnergyVortex(ctx, params as EnergyVortex);
        }
        break;
      case 'freeze':
        renderFreezeFrame(ctx, params?.x || width/2, params?.y || height/2, params?.scale, params?.intensity);
        break;
      case 'timeDilation':
        renderTimeDilation(ctx, params?.intensity || 0.5);
        break;
    }
  }, []);

  return {
    addScreenShake,
    addHitStop,
    addFlashEffect,
    addHitSpark,
    createComboEffect,
    applyCinematicEffects,
    updateEffects,
    getShakeOffset,
    isHitStopActive,
    getFlashOpacity,
    drawHitSparks,
    drawProjectileTrail,
    flashEffect,
    hitSparks
  };
};