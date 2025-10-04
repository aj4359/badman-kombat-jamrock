/**
 * Visual Effects System for Procedural Fighters
 * Motion blur, speed lines, impact waves, and particle effects
 */

export interface MotionBlurEffect {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  intensity: number;
}

export interface SpeedLine {
  x: number;
  y: number;
  length: number;
  angle: number;
  opacity: number;
}

export interface ImpactWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

/**
 * Render motion blur trail for fast-moving fighters
 */
export function renderMotionBlur(
  ctx: CanvasRenderingContext2D,
  effect: MotionBlurEffect
) {
  const speed = Math.sqrt(effect.velocityX ** 2 + effect.velocityY ** 2);
  if (speed < 3) return; // No blur for slow movement

  const trailLength = Math.min(speed * 5, 50);
  const trailCount = 3;

  ctx.save();
  
  for (let i = 0; i < trailCount; i++) {
    const t = (i + 1) / trailCount;
    const trailX = effect.x - effect.velocityX * t * trailLength;
    const trailY = effect.y - effect.velocityY * t * trailLength;
    
    ctx.globalAlpha = (1 - t) * effect.intensity * 0.3;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(trailX - 20, trailY - 40, 40, 80);
  }
  
  ctx.restore();
}

/**
 * Render speed lines during fast attacks
 */
export function renderSpeedLines(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  direction: 'left' | 'right',
  intensity: number = 1
) {
  const lineCount = 8;
  const baseLength = 80;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  
  const angle = direction === 'right' ? 0 : Math.PI;
  
  for (let i = 0; i < lineCount; i++) {
    const offsetY = (i - lineCount / 2) * 20;
    const length = baseLength * (0.7 + Math.random() * 0.3) * intensity;
    const startX = centerX;
    const startY = centerY + offsetY;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle + (Math.random() - 0.5) * 0.2) * length;
    
    ctx.globalAlpha = 0.4 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Render impact wave on hit
 */
export function renderImpactWave(
  ctx: CanvasRenderingContext2D,
  wave: ImpactWave
) {
  ctx.save();
  
  ctx.globalAlpha = wave.opacity;
  ctx.strokeStyle = wave.color;
  ctx.lineWidth = 4;
  
  // Outer ring
  ctx.beginPath();
  ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Inner ring
  ctx.globalAlpha = wave.opacity * 0.5;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(wave.x, wave.y, wave.radius * 0.7, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Render glow effect for special moves
 */
export function renderCharacterGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  intensity: number = 1
) {
  ctx.save();
  
  const gradient = ctx.createRadialGradient(
    x + width / 2,
    y + height / 2,
    0,
    x + width / 2,
    y + height / 2,
    Math.max(width, height) * 0.8
  );
  
  gradient.addColorStop(0, `${color}${Math.floor(intensity * 50).toString(16).padStart(2, '0')}`);
  gradient.addColorStop(0.5, `${color}${Math.floor(intensity * 30).toString(16).padStart(2, '0')}`);
  gradient.addColorStop(1, `${color}00`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x - width * 0.2, y - height * 0.2, width * 1.4, height * 1.4);
  
  ctx.restore();
}

/**
 * Render particle burst effect
 */
export function renderParticleBurst(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particleCount: number,
  color: string,
  spread: number = 50
) {
  ctx.save();
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
    const distance = Math.random() * spread;
    const particleX = x + Math.cos(angle) * distance;
    const particleY = y + Math.sin(angle) * distance;
    const size = 2 + Math.random() * 3;
    
    ctx.globalAlpha = 1 - distance / spread;
    ctx.fillStyle = color;
    ctx.fillRect(particleX - size / 2, particleY - size / 2, size, size);
  }
  
  ctx.restore();
}

/**
 * Render screen flash effect
 */
export function renderScreenFlash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  opacity: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Render combo counter with style
 */
export function renderComboCounter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  comboCount: number,
  scale: number = 1
) {
  if (comboCount < 2) return;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Glow background
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.fillRect(-60, -30, 120, 60);
  
  ctx.shadowBlur = 0;
  
  // Combo number
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${comboCount}`, 0, -5);
  
  // "HIT" text
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('HIT COMBO', 0, 20);
  
  ctx.restore();
}
