import React from 'react';
import { Fighter } from '@/types/gameTypes';

interface EnhancedFighterRendererProps {
  ctx: CanvasRenderingContext2D;
  fighter: Fighter;
  effects?: {
    alpha?: number;
    hueRotation?: number;
    shadow?: boolean;
  };
}

export const renderEnhancedFighter = ({ ctx, fighter, effects = {} }: EnhancedFighterRendererProps) => {
  const { alpha = 1, hueRotation = 0, shadow = true } = effects;
  
  ctx.save();
  
  // Apply effects
  if (alpha !== 1) {
    ctx.globalAlpha = alpha;
  }
  
  if (hueRotation !== 0) {
    ctx.filter = `hue-rotate(${hueRotation}deg)`;
  }
  
  // Character-specific rendering
  switch (fighter.id) {
    case 'leroy':
      renderLeroy(ctx, fighter, shadow);
      break;
    case 'jordan':
      renderJordan(ctx, fighter, shadow);
      break;
    case 'razor':
      renderRazor(ctx, fighter, shadow);
      break;
    case 'sifu':
      renderSifu(ctx, fighter, shadow);
      break;
    case 'rootsman':
      renderRootsman(ctx, fighter, shadow);
      break;
    default:
      renderDefaultFighter(ctx, fighter, shadow);
  }
  
  ctx.restore();
};

const renderLeroy = (ctx: CanvasRenderingContext2D, fighter: Fighter, shadow: boolean) => {
  const { x, y, width, height, facing, state } = fighter;
  const scale = facing === 'left' ? -1 : 1;
  
  ctx.save();
  ctx.translate(x + width/2, y);
  ctx.scale(scale, 1);
  
  // Shadow
  if (shadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(0, height - 5, width/2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Body - DJ Style
  const bodyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  bodyGradient.addColorStop(0, '#00ffff'); // Cyan
  bodyGradient.addColorStop(1, '#0088cc');
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(-width/4, height * 0.3, width/2, height * 0.4);
  
  // Head
  ctx.fillStyle = '#8B4513'; // Brown skin
  ctx.beginPath();
  ctx.arc(0, height * 0.15, width/6, 0, Math.PI * 2);
  ctx.fill();
  
  // Dreadlocks
  ctx.fillStyle = '#2F1B14';
  for (let i = -2; i <= 2; i++) {
    const offsetX = i * (width/12);
    ctx.fillRect(offsetX - 3, height * 0.05, 6, height * 0.25);
  }
  
  // Headphones
  ctx.strokeStyle = '#ff00ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, height * 0.15, width/5, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();
  
  // Arms - animated based on state
  ctx.fillStyle = '#8B4513';
  if (state.current === 'attacking') {
    // Extended arm for attack
    ctx.fillRect(width/4, height * 0.35, width/3, height * 0.1);
  } else {
    // Normal arm position
    ctx.fillRect(-width/3, height * 0.35, width/4, height * 0.1);
    ctx.fillRect(width/6, height * 0.35, width/4, height * 0.1);
  }
  
  // Legs
  ctx.fillStyle = '#000080'; // Blue jeans
  ctx.fillRect(-width/6, height * 0.7, width/8, height * 0.3);
  ctx.fillRect(width/12, height * 0.7, width/8, height * 0.3);
  
  // DJ Equipment (when idle)
  if (state.current === 'idle') {
    ctx.fillStyle = '#333333';
    ctx.fillRect(-width/3, height * 0.45, width/6, height/8);
    // Turntable details
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(-width/4, height * 0.5, width/12, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};

const renderJordan = (ctx: CanvasRenderingContext2D, fighter: Fighter, shadow: boolean) => {
  const { x, y, width, height, facing, state } = fighter;
  const scale = facing === 'left' ? -1 : 1;
  
  ctx.save();
  ctx.translate(x + width/2, y);
  ctx.scale(scale, 1);
  
  if (shadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(0, height - 5, width/2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Body - Street wear style
  const bodyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  bodyGradient.addColorStop(0, '#ff00ff'); // Hot pink
  bodyGradient.addColorStop(1, '#aa0055');
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(-width/4, height * 0.3, width/2, height * 0.4);
  
  // Head
  ctx.fillStyle = '#654321'; // Brown skin
  ctx.beginPath();
  ctx.arc(0, height * 0.15, width/6, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair - stylized
  ctx.fillStyle = '#000000';
  ctx.fillRect(-width/8, height * 0.05, width/4, height * 0.12);
  
  // Gold chain
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, height * 0.25, width/8, 0, Math.PI);
  ctx.stroke();
  
  // Arms with swagger
  ctx.fillStyle = '#654321';
  const armAnimation = state.current === 'attacking' ? Math.sin(Date.now() * 0.01) * 10 : 0;
  ctx.save();
  ctx.rotate(armAnimation * Math.PI / 180);
  ctx.fillRect(-width/3, height * 0.35, width/4, height * 0.1);
  ctx.restore();
  
  ctx.fillRect(width/6, height * 0.35, width/4, height * 0.1);
  
  // Baggy pants
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(-width/5, height * 0.7, width/6, height * 0.3);
  ctx.fillRect(width/20, height * 0.7, width/6, height * 0.3);
  
  // Sneakers
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-width/4, height * 0.95, width/3, height * 0.05);
  ctx.fillRect(width/12, height * 0.95, width/3, height * 0.05);
  
  ctx.restore();
};

const renderRazor = (ctx: CanvasRenderingContext2D, fighter: Fighter, shadow: boolean) => {
  const { x, y, width, height, facing, state } = fighter;
  const scale = facing === 'left' ? -1 : 1;
  
  ctx.save();
  ctx.translate(x + width/2, y);
  ctx.scale(scale, 1);
  
  if (shadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(0, height - 5, width/2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Cyber ninja body
  const bodyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  bodyGradient.addColorStop(0, '#00ff00'); // Neon green
  bodyGradient.addColorStop(1, '#004400');
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(-width/4, height * 0.3, width/2, height * 0.4);
  
  // Head/Mask
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.arc(0, height * 0.15, width/6, 0, Math.PI * 2);
  ctx.fill();
  
  // Glowing eyes
  ctx.fillStyle = '#00ff00';
  ctx.beginPath();
  ctx.arc(-width/12, height * 0.13, 3, 0, Math.PI * 2);
  ctx.arc(width/12, height * 0.13, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Katana
  if (state.current === 'attacking' || state.current === 'special') {
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width/4, height * 0.3);
    ctx.lineTo(width/2, height * 0.1);
    ctx.stroke();
    
    // Blade glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  
  // Arms
  ctx.fillStyle = '#222222';
  ctx.fillRect(-width/3, height * 0.35, width/4, height * 0.1);
  ctx.fillRect(width/6, height * 0.35, width/4, height * 0.1);
  
  // Legs
  ctx.fillStyle = '#333333';
  ctx.fillRect(-width/6, height * 0.7, width/8, height * 0.3);
  ctx.fillRect(width/12, height * 0.7, width/8, height * 0.3);
  
  ctx.restore();
};

const renderSifu = (ctx: CanvasRenderingContext2D, fighter: Fighter, shadow: boolean) => {
  const { x, y, width, height, facing, state } = fighter;
  const scale = facing === 'left' ? -1 : 1;
  
  ctx.save();
  ctx.translate(x + width/2, y);
  ctx.scale(scale, 1);
  
  if (shadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(0, height - 5, width/2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Traditional martial arts robes
  const robeGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  robeGradient.addColorStop(0, '#ffff00'); // Golden yellow
  robeGradient.addColorStop(1, '#cc8800');
  ctx.fillStyle = robeGradient;
  ctx.fillRect(-width/3, height * 0.3, width * 0.66, height * 0.5);
  
  // Head
  ctx.fillStyle = '#DEB887'; // Asian skin tone
  ctx.beginPath();
  ctx.arc(0, height * 0.15, width/6, 0, Math.PI * 2);
  ctx.fill();
  
  // Mustache and beard
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-width/12, height * 0.18, width/6, height * 0.03);
  ctx.fillRect(-width/15, height * 0.22, width/7, height * 0.08);
  
  // Chi energy effects
  if (state.current === 'special' || state.current === 'attacking') {
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 15;
    
    // Energy aura
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, height * 0.5, width/3 + i * 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
  
  // Arms in martial arts pose
  ctx.fillStyle = '#DEB887';
  if (state.current === 'attacking') {
    // Attacking pose
    ctx.fillRect(width/4, height * 0.25, width/4, height * 0.1);
    ctx.fillRect(-width/2, height * 0.4, width/4, height * 0.1);
  } else {
    // Defensive stance
    ctx.fillRect(-width/4, height * 0.35, width/4, height * 0.1);
    ctx.fillRect(width/8, height * 0.3, width/4, height * 0.1);
  }
  
  // Pants
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-width/5, height * 0.8, width/6, height * 0.2);
  ctx.fillRect(width/20, height * 0.8, width/6, height * 0.2);
  
  ctx.restore();
};

const renderRootsman = (ctx: CanvasRenderingContext2D, fighter: Fighter, shadow: boolean) => {
  const { x, y, width, height, facing, state } = fighter;
  const scale = facing === 'left' ? -1 : 1;
  
  ctx.save();
  ctx.translate(x + width/2, y);
  ctx.scale(scale, 1);
  
  if (shadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(0, height - 5, width/2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Rastafarian colors
  const bodyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  bodyGradient.addColorStop(0, '#228B22'); // Green
  bodyGradient.addColorStop(0.5, '#FFD700'); // Gold
  bodyGradient.addColorStop(1, '#FF0000'); // Red
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(-width/4, height * 0.3, width/2, height * 0.4);
  
  // Head
  ctx.fillStyle = '#8B4513'; // Brown skin
  ctx.beginPath();
  ctx.arc(0, height * 0.15, width/6, 0, Math.PI * 2);
  ctx.fill();
  
  // Dreadlocks - longer and more flowing
  ctx.fillStyle = '#2F1B14';
  for (let i = -3; i <= 3; i++) {
    const offsetX = i * (width/14);
    const length = height * 0.4 + Math.sin(Date.now() * 0.01 + i) * 5;
    ctx.fillRect(offsetX - 2, height * 0.05, 4, length);
  }
  
  // Rasta hat/tam
  ctx.fillStyle = '#228B22';
  ctx.fillRect(-width/5, height * 0.05, width * 0.4, height * 0.08);
  
  // Nature energy effects
  if (state.current === 'special') {
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#228B22';
    ctx.shadowBlur = 20;
    
    // Vine-like energy
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(-width/2, height);
      ctx.quadraticCurveTo(
        (Math.random() - 0.5) * width,
        height * 0.7,
        width/2,
        height * 0.3
      );
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
  
  // Arms
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-width/3, height * 0.35, width/4, height * 0.1);
  ctx.fillRect(width/6, height * 0.35, width/4, height * 0.1);
  
  // Cargo shorts
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(-width/5, height * 0.7, width/6, height * 0.25);
  ctx.fillRect(width/20, height * 0.7, width/6, height * 0.25);
  
  // Sandals
  ctx.fillStyle = '#654321';
  ctx.fillRect(-width/6, height * 0.95, width/4, height * 0.05);
  ctx.fillRect(width/12, height * 0.95, width/4, height * 0.05);
  
  ctx.restore();
};

const renderDefaultFighter = (ctx: CanvasRenderingContext2D, fighter: Fighter, shadow: boolean) => {
  const { x, y, width, height, facing } = fighter;
  const scale = facing === 'left' ? -1 : 1;
  
  ctx.save();
  ctx.translate(x + width/2, y);
  ctx.scale(scale, 1);
  
  if (shadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(0, height - 5, width/2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Basic fighter silhouette
  ctx.fillStyle = '#4A90E2';
  ctx.fillRect(-width/4, height * 0.3, width/2, height * 0.4);
  
  ctx.fillStyle = '#F5A623';
  ctx.beginPath();
  ctx.arc(0, height * 0.15, width/6, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#4A90E2';
  ctx.fillRect(-width/3, height * 0.35, width/4, height * 0.1);
  ctx.fillRect(width/6, height * 0.35, width/4, height * 0.1);
  
  ctx.fillRect(-width/6, height * 0.7, width/8, height * 0.3);
  ctx.fillRect(width/12, height * 0.7, width/8, height * 0.3);
  
  ctx.restore();
};