import { Fighter } from '@/types/gameTypes';

interface Bruise {
  x: number;
  y: number;
  size: number;
  opacity: number;
  fadeInProgress: number;
}

interface Tear {
  location: 'sleeve' | 'pants' | 'jacket';
  x: number;
  y: number;
  length: number;
  angle: number;
}

interface SweatDrop {
  x: number;
  y: number;
  velocityY: number;
  life: number;
  maxLife: number;
}

interface HitDeformation {
  scaleX: number;
  scaleY: number;
  rotation: number;
  timer: number;
  duration: number;
}

interface DamageState {
  bruises: Bruise[];
  tears: Tear[];
  sweatDrops: SweatDrop[];
  hitDeformation: HitDeformation | null;
  lastHealthThreshold: number;
}

export class DamageVisualizer {
  private damageStates: Map<string, DamageState> = new Map();
  private sweatSpawnTimer = 0;

  private ensureState(fighterId: string): DamageState {
    if (!this.damageStates.has(fighterId)) {
      this.damageStates.set(fighterId, {
        bruises: [],
        tears: [],
        sweatDrops: [],
        hitDeformation: null,
        lastHealthThreshold: 100,
      });
    }
    return this.damageStates.get(fighterId)!;
  }

  applyHitDeformation(
    fighterId: string,
    direction: 'left' | 'right',
    intensity: 'light' | 'medium' | 'heavy' | 'critical'
  ) {
    const state = this.ensureState(fighterId);

    // Map intensity to deformation values
    const deformMap = {
      light: { scale: 1.05, rotation: 5, duration: 133 }, // 8 frames
      medium: { scale: 1.1, rotation: 10, duration: 133 },
      heavy: { scale: 1.15, rotation: 15, duration: 133 },
      critical: { scale: 1.25, rotation: 20, duration: 166 }, // 10 frames
    };

    const deform = deformMap[intensity];
    const rotationDirection = direction === 'left' ? -1 : 1;

    state.hitDeformation = {
      scaleX: 1 / deform.scale, // Squash horizontally
      scaleY: deform.scale, // Stretch vertically
      rotation: (deform.rotation * Math.PI) / 180 * rotationDirection,
      timer: 0,
      duration: deform.duration,
    };
  }

  addBruise(fighterId: string, x: number, y: number, size: number) {
    const state = this.ensureState(fighterId);
    
    state.bruises.push({
      x,
      y,
      size,
      opacity: 0,
      fadeInProgress: 0,
    });
  }

  addTear(fighterId: string, location: 'sleeve' | 'pants' | 'jacket', x: number, y: number) {
    const state = this.ensureState(fighterId);
    
    state.tears.push({
      location,
      x,
      y,
      length: 15 + Math.random() * 20,
      angle: (Math.random() - 0.5) * 0.5, // Slight random angle
    });
  }

  updateDamageState(fighterId: string, healthPercentage: number, deltaTime: number) {
    const state = this.ensureState(fighterId);

    // Update hit deformation
    if (state.hitDeformation) {
      state.hitDeformation.timer += deltaTime;
      
      if (state.hitDeformation.timer >= state.hitDeformation.duration) {
        state.hitDeformation = null;
      }
    }

    // Add bruises at health thresholds
    if (healthPercentage <= 75 && state.lastHealthThreshold > 75) {
      this.addRandomBruises(fighterId, 2);
    }
    if (healthPercentage <= 50 && state.lastHealthThreshold > 50) {
      this.addRandomBruises(fighterId, 3);
      this.addRandomTear(fighterId);
    }
    if (healthPercentage <= 25 && state.lastHealthThreshold > 25) {
      this.addRandomBruises(fighterId, 4);
      this.addRandomTear(fighterId);
    }
    
    state.lastHealthThreshold = healthPercentage;

    // Update bruise fade-in
    state.bruises.forEach(bruise => {
      if (bruise.fadeInProgress < 1) {
        bruise.fadeInProgress += deltaTime / 5000; // 5 second fade-in
        bruise.opacity = Math.min(0.7, bruise.fadeInProgress * 0.7);
      }
    });

    // Update sweat system
    this.updateSweat(fighterId, healthPercentage, deltaTime);

    // Update sweat drops physics
    for (let i = state.sweatDrops.length - 1; i >= 0; i--) {
      const drop = state.sweatDrops[i];
      drop.life += deltaTime;
      drop.y += drop.velocityY * (deltaTime / 1000);
      drop.velocityY += 300 * (deltaTime / 1000); // Gravity

      if (drop.life >= drop.maxLife) {
        state.sweatDrops.splice(i, 1);
      }
    }
  }

  private addRandomBruises(fighterId: string, count: number) {
    const state = this.ensureState(fighterId);
    
    // Random positions on fighter (relative coordinates)
    const locations = [
      { x: 0.3, y: 0.15 }, // Face
      { x: 0.7, y: 0.15 }, // Face
      { x: 0.5, y: 0.4 },  // Chest
      { x: 0.2, y: 0.5 },  // Left arm
      { x: 0.8, y: 0.5 },  // Right arm
    ];

    for (let i = 0; i < count; i++) {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      this.addBruise(
        fighterId,
        loc.x + (Math.random() - 0.5) * 0.1,
        loc.y + (Math.random() - 0.5) * 0.1,
        15 + Math.random() * 15
      );
    }
  }

  private addRandomTear(fighterId: string) {
    const locations: Array<'sleeve' | 'pants' | 'jacket'> = ['sleeve', 'pants', 'jacket'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Position based on location
    let x = 0.5, y = 0.5;
    if (location === 'sleeve') {
      x = Math.random() < 0.5 ? 0.2 : 0.8;
      y = 0.4 + Math.random() * 0.2;
    } else if (location === 'pants') {
      x = 0.5 + (Math.random() - 0.5) * 0.3;
      y = 0.7 + Math.random() * 0.2;
    } else {
      x = 0.5 + (Math.random() - 0.5) * 0.4;
      y = 0.3 + Math.random() * 0.3;
    }
    
    this.addTear(fighterId, location, x, y);
  }

  private updateSweat(fighterId: string, healthPercentage: number, deltaTime: number) {
    const state = this.ensureState(fighterId);
    
    // Determine sweat spawn rate based on health
    let spawnRate = 0;
    if (healthPercentage < 75 && healthPercentage >= 50) {
      spawnRate = 1 / 2000; // 1 drop every 2 seconds
    } else if (healthPercentage < 50 && healthPercentage >= 25) {
      spawnRate = 1 / 1000; // 1 drop per second
    } else if (healthPercentage < 25) {
      spawnRate = 1 / 500; // 2 drops per second
    }

    if (spawnRate > 0) {
      this.sweatSpawnTimer += deltaTime;
      
      const spawnInterval = 1000 / (spawnRate * 1000);
      if (this.sweatSpawnTimer >= spawnInterval) {
        this.sweatSpawnTimer = 0;
        
        // Spawn sweat drop on face/forehead
        state.sweatDrops.push({
          x: 0.4 + Math.random() * 0.2, // Forehead area
          y: 0.1 + Math.random() * 0.1,
          velocityY: 1,
          life: 0,
          maxLife: 2000, // 2 seconds
        });
      }
    }
  }

  renderDamageEffects(ctx: CanvasRenderingContext2D, fighter: Fighter) {
    const state = this.damageStates.get(fighter.id);
    if (!state) return;

    const { bruises, tears, sweatDrops } = state;

    // Render bruises
    bruises.forEach(bruise => {
      const x = fighter.x + bruise.x * fighter.width;
      const y = fighter.y + bruise.y * fighter.height;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, bruise.size);
      gradient.addColorStop(0, `rgba(80, 30, 80, ${bruise.opacity})`);
      gradient.addColorStop(0.5, `rgba(60, 20, 60, ${bruise.opacity * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, bruise.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render tears
    tears.forEach(tear => {
      const x = fighter.x + tear.x * fighter.width;
      const y = fighter.y + tear.y * fighter.height;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tear.angle);
      
      ctx.strokeStyle = 'rgba(40, 40, 40, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(tear.length, 0);
      ctx.stroke();
      
      // Jagged edges
      ctx.lineWidth = 1;
      for (let i = 0; i < tear.length; i += 3) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
        ctx.stroke();
      }
      
      ctx.restore();
    });

    // Render sweat drops
    sweatDrops.forEach(drop => {
      const x = fighter.x + drop.x * fighter.width;
      const y = fighter.y + drop.y * fighter.height;
      
      const alpha = 1 - (drop.life / drop.maxLife);
      
      ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Highlight
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(x - 0.5, y - 0.5, 1, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  getDeformation(fighterId: string): { scaleX: number; scaleY: number; rotation: number } {
    const state = this.damageStates.get(fighterId);
    
    if (!state?.hitDeformation) {
      return { scaleX: 1, scaleY: 1, rotation: 0 };
    }

    const deform = state.hitDeformation;
    const progress = deform.timer / deform.duration;
    
    // Spring back effect
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    return {
      scaleX: 1 + (deform.scaleX - 1) * (1 - easeProgress),
      scaleY: 1 + (deform.scaleY - 1) * (1 - easeProgress),
      rotation: deform.rotation * (1 - easeProgress),
    };
  }

  createSpray(fighterId: string, x: number, y: number, direction: 'left' | 'right') {
    // This triggers particle spray (to be integrated with ParticleEngine)
    // Just store the event for now
  }

  clear(fighterId?: string) {
    if (fighterId) {
      this.damageStates.delete(fighterId);
    } else {
      this.damageStates.clear();
    }
    this.sweatSpawnTimer = 0;
  }
}

export const createDamageVisualizer = (): DamageVisualizer => {
  return new DamageVisualizer();
};
