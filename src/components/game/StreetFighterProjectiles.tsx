import React from 'react';
import { Fighter } from '@/types/gameTypes';

export interface Projectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  damage: number;
  owner: string;
  type: 'hadoken' | 'fireball' | 'sonic' | 'plasma';
  life: number;
  maxLife: number;
}

export interface ProjectileRendererProps {
  ctx: CanvasRenderingContext2D;
  projectile: Projectile;
  effects?: {
    alpha?: number;
    glow?: boolean;
    trail?: boolean;
  };
}

export function renderStreetFighterProjectile({ ctx, projectile, effects = {} }: ProjectileRendererProps) {
  ctx.save();
  
  if (effects.alpha !== undefined) {
    ctx.globalAlpha = effects.alpha;
  }
  
  switch (projectile.type) {
    case 'hadoken':
      renderHadokenProjectile(ctx, projectile, effects);
      break;
    case 'fireball':
      renderFireballProjectile(ctx, projectile, effects);
      break;
    case 'sonic':
      renderSonicProjectile(ctx, projectile, effects);
      break;
    case 'plasma':
      renderPlasmaProjectile(ctx, projectile, effects);
      break;
    default:
      renderDefaultProjectile(ctx, projectile, effects);
  }
  
  ctx.restore();
}

function renderHadokenProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile, effects: any) {
  const { x, y, width, height } = projectile;
  const lifeFactor = projectile.life / projectile.maxLife;
  
  // Hadoken blue energy ball
  const gradient = ctx.createRadialGradient(
    x + width/2, y + height/2, 0,
    x + width/2, y + height/2, width/2
  );
  gradient.addColorStop(0, `hsla(220, 100%, 80%, ${lifeFactor})`);
  gradient.addColorStop(0.5, `hsla(240, 100%, 60%, ${lifeFactor * 0.8})`);
  gradient.addColorStop(1, `hsla(260, 100%, 40%, ${lifeFactor * 0.4})`);
  
  if (effects.glow) {
    ctx.shadowColor = 'hsl(220, 100%, 60%)';
    ctx.shadowBlur = 15;
  }
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x + width/2, y + height/2, width/2 * lifeFactor, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner core
  ctx.fillStyle = `hsla(200, 100%, 90%, ${lifeFactor})`;
  ctx.beginPath();
  ctx.arc(x + width/2, y + height/2, width/4 * lifeFactor, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0;
}

function renderFireballProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile, effects: any) {
  const { x, y, width, height } = projectile;
  const lifeFactor = projectile.life / projectile.maxLife;
  
  // Fire colors
  const gradient = ctx.createRadialGradient(
    x + width/2, y + height/2, 0,
    x + width/2, y + height/2, width/2
  );
  gradient.addColorStop(0, `hsla(60, 100%, 80%, ${lifeFactor})`);
  gradient.addColorStop(0.4, `hsla(30, 100%, 60%, ${lifeFactor * 0.9})`);
  gradient.addColorStop(0.8, `hsla(0, 100%, 50%, ${lifeFactor * 0.7})`);
  gradient.addColorStop(1, `hsla(0, 80%, 20%, ${lifeFactor * 0.3})`);
  
  if (effects.glow) {
    ctx.shadowColor = 'hsl(30, 100%, 50%)';
    ctx.shadowBlur = 20;
  }
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x + width/2, y + height/2, width/2 * lifeFactor, 0, Math.PI * 2);
  ctx.fill();
  
  // Flickering inner flame
  const flicker = 0.8 + Math.sin(Date.now() * 0.02) * 0.2;
  ctx.fillStyle = `hsla(60, 100%, 90%, ${lifeFactor * flicker})`;
  ctx.beginPath();
  ctx.arc(x + width/2, y + height/2, width/3 * lifeFactor * flicker, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0;
}

function renderSonicProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile, effects: any) {
  const { x, y, width, height } = projectile;
  const lifeFactor = projectile.life / projectile.maxLife;
  
  // Sound wave rings
  ctx.strokeStyle = `hsla(270, 100%, 70%, ${lifeFactor})`;
  ctx.lineWidth = 3;
  
  if (effects.glow) {
    ctx.shadowColor = 'hsl(270, 100%, 60%)';
    ctx.shadowBlur = 10;
  }
  
  for (let i = 0; i < 3; i++) {
    const ringSize = (width/2) * (0.3 + i * 0.3) * lifeFactor;
    const alpha = lifeFactor * (1 - i * 0.3);
    
    ctx.strokeStyle = `hsla(270, 100%, 70%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x + width/2, y + height/2, ringSize, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Center pulse
  ctx.fillStyle = `hsla(270, 100%, 80%, ${lifeFactor})`;
  ctx.beginPath();
  ctx.arc(x + width/2, y + height/2, width/6 * lifeFactor, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0;
}

function renderPlasmaProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile, effects: any) {
  const { x, y, width, height } = projectile;
  const lifeFactor = projectile.life / projectile.maxLife;
  
  // Electric plasma effect
  const gradient = ctx.createRadialGradient(
    x + width/2, y + height/2, 0,
    x + width/2, y + height/2, width/2
  );
  gradient.addColorStop(0, `hsla(180, 100%, 90%, ${lifeFactor})`);
  gradient.addColorStop(0.3, `hsla(180, 100%, 70%, ${lifeFactor * 0.9})`);
  gradient.addColorStop(0.7, `hsla(200, 100%, 50%, ${lifeFactor * 0.6})`);
  gradient.addColorStop(1, `hsla(220, 100%, 30%, ${lifeFactor * 0.2})`);
  
  if (effects.glow) {
    ctx.shadowColor = 'hsl(180, 100%, 50%)';
    ctx.shadowBlur = 15;
  }
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x + width/2, y + height/2, width/2 * lifeFactor, 0, Math.PI * 2);
  ctx.fill();
  
  // Electric arcs
  ctx.strokeStyle = `hsla(180, 100%, 80%, ${lifeFactor})`;
  ctx.lineWidth = 2;
  
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Date.now() * 0.01;
    const startX = x + width/2 + Math.cos(angle) * width/4;
    const startY = y + height/2 + Math.sin(angle) * height/4;
    const endX = x + width/2 + Math.cos(angle) * width/2;
    const endY = y + height/2 + Math.sin(angle) * height/2;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;
}

function renderDefaultProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile, effects: any) {
  const { x, y, width, height } = projectile;
  const lifeFactor = projectile.life / projectile.maxLife;
  
  ctx.fillStyle = `hsla(60, 100%, 50%, ${lifeFactor})`;
  ctx.fillRect(x, y, width, height);
}

export function createProjectile(
  fighter: Fighter,
  type: Projectile['type'],
  direction: number
): Projectile {
  return {
    id: `${fighter.id}_${Date.now()}`,
    x: fighter.x + (direction > 0 ? fighter.width : -32),
    y: fighter.y + fighter.height / 2 - 16,
    width: 32,
    height: 32,
    velocityX: direction * 8,
    velocityY: 0,
    damage: 15,
    owner: fighter.id,
    type,
    life: 120,
    maxLife: 120
  };
}

export function updateProjectile(projectile: Projectile): Projectile {
  return {
    ...projectile,
    x: projectile.x + projectile.velocityX,
    y: projectile.y + projectile.velocityY,
    life: projectile.life - 1
  };
}