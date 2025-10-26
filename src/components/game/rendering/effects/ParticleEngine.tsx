import { Fighter } from '@/types/gameTypes';

export type ParticleType = 'hitImpact' | 'aura' | 'dust' | 'trail' | 'combo' | 'spray';

export interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  gravity: number;
  wind: number;
  layer: 'background' | 'foreground';
  data?: any;
}

class ParticlePool {
  private pool: Particle[] = [];
  private active: Particle[] = [];
  private poolSize = 500;
  private nextId = 0;

  constructor() {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push(this.createEmptyParticle());
    }
  }

  private createEmptyParticle(): Particle {
    return {
      id: '',
      type: 'hitImpact',
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      life: 0,
      maxLife: 1,
      color: '#ffffff',
      size: 4,
      rotation: 0,
      rotationSpeed: 0,
      alpha: 1,
      gravity: 0,
      wind: 0,
      layer: 'foreground',
    };
  }

  spawn(config: Partial<Particle>): Particle | null {
    const particle = this.pool.pop();
    if (!particle) return null;

    Object.assign(particle, config);
    particle.id = `particle_${this.nextId++}`;
    particle.life = 0;
    this.active.push(particle);
    return particle;
  }

  update(deltaTime: number) {
    const dt = deltaTime / 1000; // Convert to seconds

    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      p.life += deltaTime;

      if (p.life >= p.maxLife) {
        this.pool.push(this.active.splice(i, 1)[0]);
        continue;
      }

      // Physics update
      p.velocityY += p.gravity * dt;
      p.velocityX += p.wind * dt;
      p.x += p.velocityX * dt;
      p.y += p.velocityY * dt;
      p.rotation += p.rotationSpeed * dt;

      // Update alpha based on life (linear fade)
      const progress = p.life / p.maxLife;
      
      // Different fade patterns for different types
      if (p.type === 'dust') {
        // Quick spawn, slow fade
        if (progress < 0.05) {
          p.alpha = progress / 0.05;
        } else {
          p.alpha = 1 - ((progress - 0.05) / 0.95);
        }
      } else if (p.type === 'aura') {
        // Pulse effect
        const pulseProgress = (Math.sin(p.life / 200) + 1) / 2;
        p.alpha = 0.5 + pulseProgress * 0.3;
      } else {
        // Standard linear fade
        p.alpha = 1 - progress;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, layer?: 'background' | 'foreground') {
    this.active.forEach(p => {
      if (layer && p.layer !== layer) return;
      this.renderParticle(ctx, p);
    });
  }

  renderLayer(ctx: CanvasRenderingContext2D, layer: 'background' | 'foreground') {
    this.render(ctx, layer);
  }

  private renderParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    switch (p.type) {
      case 'hitImpact':
        this.renderSquareParticle(ctx, p);
        break;
      case 'aura':
        this.renderGlowParticle(ctx, p);
        break;
      case 'dust':
        this.renderCloudParticle(ctx, p);
        break;
      case 'trail':
        this.renderTrailParticle(ctx, p);
        break;
      case 'combo':
        this.renderStarParticle(ctx, p);
        break;
      case 'spray':
        this.renderDropletParticle(ctx, p);
        break;
    }

    ctx.restore();
  }

  private renderSquareParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    
    // Add glow
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size * 2;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
  }

  private renderGlowParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderCloudParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    // Draw 3-5 overlapping circles for cloud effect
    const circles = p.data?.circles || [
      { x: 0, y: 0, size: p.size },
      { x: p.size * 0.4, y: p.size * 0.3, size: p.size * 0.8 },
      { x: -p.size * 0.3, y: p.size * 0.4, size: p.size * 0.7 },
    ];

    ctx.fillStyle = p.color;
    circles.forEach((circle: any) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private renderTrailParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.globalCompositeOperation = 'lighter';
    
    // Simplified fighter silhouette
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
    
    ctx.globalCompositeOperation = 'source-over';
  }

  private renderStarParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    
    // 4-pointed star
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const x = Math.cos(angle) * p.size;
      const y = Math.sin(angle) * p.size;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      
      // Inner point
      const innerAngle = angle + Math.PI / 4;
      const innerX = Math.cos(innerAngle) * (p.size * 0.4);
      const innerY = Math.sin(innerAngle) * (p.size * 0.4);
      ctx.lineTo(innerX, innerY);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add glow
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size * 2;
    ctx.fill();
  }

  private renderDropletParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  clear() {
    this.active.forEach(p => this.pool.push(p));
    this.active = [];
  }

  getActiveCount(): number {
    return this.active.length;
  }
}

// Singleton instance
let particlePoolInstance: ParticlePool | null = null;

export const createParticleEngine = (): ParticlePool => {
  if (!particlePoolInstance) {
    particlePoolInstance = new ParticlePool();
  }
  return particlePoolInstance;
};

// Helper functions for creating specific particle effects
export const createHitImpactBurst = (
  pool: ParticlePool,
  x: number,
  y: number,
  count: number,
  color: string
) => {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 300 + Math.random() * 200;
    
    pool.spawn({
      type: 'hitImpact',
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      maxLife: 500, // 0.5 seconds
      color,
      size: 4 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: 500,
      wind: 0,
      layer: 'foreground',
    });
  }
};

export const createAuraParticles = (
  pool: ParticlePool,
  fighter: Fighter,
  color: string,
  count: number = 5
) => {
  const centerX = fighter.x + fighter.width / 2;
  const centerY = fighter.y + fighter.height / 2;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 30;
    
    pool.spawn({
      type: 'aura',
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      velocityX: (Math.random() - 0.5) * 20,
      velocityY: -50 - Math.random() * 30, // Upward drift
      maxLife: 1000, // 1 second
      color,
      size: 8 + Math.random() * 8,
      rotation: 0,
      rotationSpeed: 0,
      gravity: -20, // Slight upward force
      wind: Math.sin(Date.now() / 500) * 10, // Sway effect
      layer: 'background',
    });
  }
};

export const createDustCloud = (
  pool: ParticlePool,
  x: number,
  y: number,
  direction: 'left' | 'right'
) => {
  const horizontalSpeed = direction === 'right' ? 100 : -100;
  
  for (let i = 0; i < 5; i++) {
    pool.spawn({
      type: 'dust',
      x: x + (Math.random() - 0.5) * 20,
      y: y - Math.random() * 10,
      velocityX: horizontalSpeed + (Math.random() - 0.5) * 50,
      velocityY: -50 - Math.random() * 50,
      maxLife: 2000, // 2 seconds
      color: 'rgba(139, 115, 85, 0.5)',
      size: 10 + Math.random() * 10,
      rotation: 0,
      rotationSpeed: 0,
      gravity: 200,
      wind: 0,
      layer: 'background',
      data: {
        circles: [
          { x: 0, y: 0, size: 10 + Math.random() * 5 },
          { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8, size: 8 + Math.random() * 4 },
          { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8, size: 7 + Math.random() * 3 },
        ],
      },
    });
  }
};

export const createSpecialTrail = (
  pool: ParticlePool,
  fighter: Fighter,
  moveColor: string
) => {
  pool.spawn({
    type: 'trail',
    x: fighter.x + fighter.width / 2,
    y: fighter.y + fighter.height / 2,
    velocityX: 0,
    velocityY: 0,
    maxLife: 500, // 0.5 seconds
    color: moveColor,
    size: fighter.width / 2,
    rotation: 0,
    rotationSpeed: 0,
    gravity: 0,
    wind: 0,
    layer: 'background',
  });
};

export const createComboBurst = (
  pool: ParticlePool,
  x: number,
  y: number,
  comboCount: number
) => {
  const particleCount = Math.min(comboCount * 10, 100);
  const colorProgress = Math.min(comboCount / 10, 1);
  
  // Gradient from yellow to red based on combo
  const r = Math.floor(255);
  const g = Math.floor(255 * (1 - colorProgress));
  const b = 0;
  const color = `rgb(${r}, ${g}, ${b})`;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 200 + Math.random() * 300;
    
    pool.spawn({
      type: 'combo',
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      maxLife: 667, // 40 frames at 60fps
      color,
      size: 6 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 15,
      gravity: 300,
      wind: 0,
      layer: 'foreground',
    });
  }
};

export const createSpray = (
  pool: ParticlePool,
  x: number,
  y: number,
  direction: number, // Angle in radians
  color: string
) => {
  const count = 15 + Math.random() * 10;
  
  for (let i = 0; i < count; i++) {
    const spread = 0.5; // Spread angle
    const angle = direction + (Math.random() - 0.5) * spread;
    const speed = 150 + Math.random() * 200;
    
    pool.spawn({
      type: 'spray',
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      maxLife: 833, // 50 frames at 60fps
      color,
      size: 3 + Math.random() * 3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 8,
      gravity: 600,
      wind: 0,
      layer: 'foreground',
    });
  }
};

export const clearAllParticles = (pool: ParticlePool) => {
  pool.clear();
};
