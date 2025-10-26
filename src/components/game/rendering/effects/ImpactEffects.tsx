type ImpactEffectType = 'flash' | 'shake' | 'freeze' | 'blur' | 'chromatic' | 'zoom';

interface ImpactEffect {
  type: ImpactEffectType;
  intensity: number;
  duration: number;
  timer: number;
  color?: string;
  direction?: 'left' | 'right';
  centerX?: number;
  centerY?: number;
}

export class ImpactEffectManager {
  private effects: ImpactEffect[] = [];
  private shakeOffsetX = 0;
  private shakeOffsetY = 0;
  private currentZoom = 1;
  private isFrozen = false;

  addFlash(color: string = '#ffffff', intensity: number = 0.8, duration: number = 50) {
    this.effects.push({
      type: 'flash',
      intensity,
      duration,
      timer: 0,
      color,
    });
  }

  addShake(intensity: number, duration: number, direction?: 'left' | 'right') {
    this.effects.push({
      type: 'shake',
      intensity,
      duration,
      timer: 0,
      direction,
    });
  }

  addFreeze(duration: number) {
    this.effects.push({
      type: 'freeze',
      intensity: 1,
      duration,
      timer: 0,
    });
  }

  addRadialBlur(centerX: number, centerY: number, intensity: number, duration: number) {
    this.effects.push({
      type: 'blur',
      intensity,
      duration,
      timer: 0,
      centerX,
      centerY,
    });
  }

  addChromaticAberration(intensity: number, duration: number) {
    this.effects.push({
      type: 'chromatic',
      intensity,
      duration,
      timer: 0,
    });
  }

  addZoomPunch(scale: number, duration: number) {
    this.effects.push({
      type: 'zoom',
      intensity: scale,
      duration,
      timer: 0,
    });
  }

  update(deltaTime: number) {
    // Update all effects
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.timer += deltaTime;

      if (effect.timer >= effect.duration) {
        this.effects.splice(i, 1);
        continue;
      }

      // Update effect-specific state
      const progress = effect.timer / effect.duration;

      if (effect.type === 'shake') {
        // Directional shake
        const baseIntensity = effect.intensity * (1 - progress);
        if (effect.direction) {
          const dirMultiplier = effect.direction === 'right' ? 1 : -1;
          this.shakeOffsetX = (Math.random() - 0.5) * baseIntensity + dirMultiplier * baseIntensity * 0.5;
        } else {
          this.shakeOffsetX = (Math.random() - 0.5) * baseIntensity;
        }
        this.shakeOffsetY = (Math.random() - 0.5) * baseIntensity;
      }

      if (effect.type === 'zoom') {
        // Ease-out cubic for zoom
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        if (progress < 0.3) {
          // Zoom in quickly
          this.currentZoom = 1 + (effect.intensity - 1) * (progress / 0.3);
        } else {
          // Return slowly
          this.currentZoom = effect.intensity - (effect.intensity - 1) * ((progress - 0.3) / 0.7);
        }
      }

      if (effect.type === 'freeze') {
        this.isFrozen = true;
      }
    }

    // Reset shake if no shake effects
    if (!this.effects.some(e => e.type === 'shake')) {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }

    // Reset zoom if no zoom effects
    if (!this.effects.some(e => e.type === 'zoom')) {
      this.currentZoom = 1;
    }

    // Reset freeze if no freeze effects
    if (!this.effects.some(e => e.type === 'freeze')) {
      this.isFrozen = false;
    }
  }

  applyEffects(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Apply flash effects (screen-space)
    const flashEffects = this.effects.filter(e => e.type === 'flash');
    flashEffects.forEach(effect => {
      const progress = effect.timer / effect.duration;
      const opacity = effect.intensity * (1 - progress);
      
      ctx.fillStyle = effect.color || '#ffffff';
      ctx.globalAlpha = opacity;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    });

    // Apply chromatic aberration
    const chromaticEffects = this.effects.filter(e => e.type === 'chromatic');
    if (chromaticEffects.length > 0) {
      const effect = chromaticEffects[0];
      const progress = effect.timer / effect.duration;
      
      // Ramp up then down
      let intensity = effect.intensity;
      if (progress < 0.3) {
        intensity *= progress / 0.3;
      } else {
        intensity *= (1 - (progress - 0.3) / 0.7);
      }
      
      this.applyChromaticAberration(ctx, width, height, intensity);
    }

    // Apply radial blur (visual approximation)
    const blurEffects = this.effects.filter(e => e.type === 'blur');
    if (blurEffects.length > 0) {
      const effect = blurEffects[0];
      const progress = effect.timer / effect.duration;
      const intensity = effect.intensity * (1 - progress);
      
      ctx.filter = `blur(${intensity}px)`;
      // Note: Would need imageData manipulation for true radial blur
      ctx.filter = 'none';
    }

    // Apply desaturation during freeze
    if (this.isFrozen) {
      ctx.filter = 'saturate(0.8)';
      ctx.filter = 'none';
    }
  }

  private applyChromaticAberration(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) {
    // This is a simplified visual approximation
    // True chromatic aberration requires pixel manipulation
    
    const offset = intensity;
    
    // Draw red channel shifted right
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(255, 0, 0, 0.3)`;
    ctx.fillRect(offset, 0, width, height);
    
    // Draw blue channel shifted left
    ctx.fillStyle = `rgba(0, 0, 255, 0.3)`;
    ctx.fillRect(-offset, 0, width, height);
    ctx.restore();
  }

  getTransform(): { scale: number; offsetX: number; offsetY: number } {
    return {
      scale: this.currentZoom,
      offsetX: this.shakeOffsetX,
      offsetY: this.shakeOffsetY,
    };
  }

  isFreezeActive(): boolean {
    return this.isFrozen;
  }

  // Convenience methods for common hit types
  triggerHitImpact(
    attackType: 'light' | 'medium' | 'heavy' | 'critical' | 'super',
    x: number,
    y: number,
    direction?: 'left' | 'right'
  ) {
    switch (attackType) {
      case 'light':
        this.addShake(2, 100);
        this.addFlash('#ffffff', 0.3, 50);
        break;
      
      case 'medium':
        this.addShake(5, 150);
        this.addFlash('#ffffff', 0.5, 50);
        break;
      
      case 'heavy':
        this.addShake(10, 200, direction);
        this.addFlash('#ffffff', 0.8, 50);
        this.addFreeze(100);
        this.addZoomPunch(1.02, 100);
        break;
      
      case 'critical':
        this.addShake(15, 250, direction);
        this.addFlash('#ff0000', 0.8, 50);
        this.addFreeze(200);
        this.addZoomPunch(1.05, 150);
        this.addRadialBlur(x, y, 5, 100);
        break;
      
      case 'super':
        this.addShake(20, 300);
        this.addFlash('#ffffff', 1.0, 50);
        this.addFreeze(150);
        this.addZoomPunch(1.1, 200);
        this.addChromaticAberration(5, 200);
        break;
    }
  }

  triggerBlockImpact(x: number, y: number) {
    this.addShake(3, 100);
    this.addFlash('#8888ff', 0.3, 50);
  }

  triggerSuperActivation() {
    this.addZoomPunch(1.15, 300);
    this.addChromaticAberration(8, 400);
    this.addFreeze(100);
    this.addFlash('#ffffff', 0.9, 100);
  }

  clear() {
    this.effects = [];
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.currentZoom = 1;
    this.isFrozen = false;
  }
}

export const createImpactEffectManager = (): ImpactEffectManager => {
  return new ImpactEffectManager();
};
