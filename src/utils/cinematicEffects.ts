/**
 * Cinematic Effects for Special Moves and Super Attacks
 */

export interface ChromaticAberration {
  offset: number;
  intensity: number;
}

export interface RadialBlur {
  x: number;
  y: number;
  strength: number;
  radius: number;
}

export interface EnergyVortex {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  intensity: number;
  color: string;
}

/**
 * Apply chromatic aberration effect (RGB color split)
 */
export function applyChromaticAberration(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offset: number = 5
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Red channel - shift right
      if (x + offset < width) {
        const sourceIdx = (y * width + (x + offset)) * 4;
        newData[idx] = data[sourceIdx];
      }

      // Blue channel - shift left
      if (x - offset >= 0) {
        const sourceIdx = (y * width + (x - offset)) * 4;
        newData[idx + 2] = data[sourceIdx + 2];
      }
    }
  }

  ctx.putImageData(new ImageData(newData, width, height), 0, 0);
}

/**
 * Apply radial blur from impact point
 */
export function applyRadialBlur(
  ctx: CanvasRenderingContext2D,
  blur: RadialBlur
) {
  const samples = 12;
  ctx.save();
  ctx.globalAlpha = 1 / samples;

  for (let i = 0; i < samples; i++) {
    const scale = 1 + (blur.strength * i) / samples;
    ctx.setTransform(
      scale, 0, 0, scale,
      blur.x * (1 - scale),
      blur.y * (1 - scale)
    );
    ctx.drawImage(ctx.canvas, 0, 0);
  }

  ctx.restore();
}

/**
 * Render energy vortex effect for super moves
 */
export function renderEnergyVortex(
  ctx: CanvasRenderingContext2D,
  vortex: EnergyVortex
) {
  ctx.save();
  ctx.translate(vortex.x, vortex.y);
  ctx.rotate(vortex.rotation);

  // Draw multiple spiral rings
  const spiralCount = 8;
  
  for (let i = 0; i < spiralCount; i++) {
    const radius = vortex.radius * (1 - i / spiralCount);
    const alpha = vortex.intensity * (i / spiralCount);
    const offset = (i * Math.PI * 2) / spiralCount;

    ctx.strokeStyle = `${vortex.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const r = radius * (1 + Math.sin(angle * 3 + offset) * 0.2);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Add glow
    ctx.shadowColor = vortex.color;
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Central bright core
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, vortex.radius * 0.3);
  gradient.addColorStop(0, `${vortex.color}ff`);
  gradient.addColorStop(0.5, `${vortex.color}88`);
  gradient.addColorStop(1, `${vortex.color}00`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(-vortex.radius * 0.3, -vortex.radius * 0.3, vortex.radius * 0.6, vortex.radius * 0.6);

  ctx.restore();
}

/**
 * Render screen-space reflection for energy projectiles
 */
export function renderProjectileReflection(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  intensity: number = 0.5
) {
  ctx.save();

  // Create reflection gradient
  const gradient = ctx.createLinearGradient(x, y, x, y + height * 1.5);
  gradient.addColorStop(0, `${color}00`);
  gradient.addColorStop(0.3, `${color}${Math.floor(intensity * 80).toString(16).padStart(2, '0')}`);
  gradient.addColorStop(1, `${color}00`);

  ctx.fillStyle = gradient;
  ctx.fillRect(x - width * 0.5, y + height, width * 2, height * 0.5);

  // Add glow beneath
  ctx.shadowColor = color;
  ctx.shadowBlur = 30;
  ctx.fillRect(x - width * 0.3, y + height, width * 1.6, height * 0.3);

  ctx.restore();
}

/**
 * Render freeze-frame close-up effect
 */
export function renderFreezeFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1.4,
  intensity: number = 1.0
) {
  // Add radial speed lines
  const lineCount = 24;
  ctx.save();
  
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * intensity})`;
  ctx.lineWidth = 3;

  for (let i = 0; i < lineCount; i++) {
    const angle = (Math.PI * 2 * i) / lineCount;
    const startDist = 100;
    const endDist = 400;
    
    const x1 = x + Math.cos(angle) * startDist;
    const y1 = y + Math.sin(angle) * startDist;
    const x2 = x + Math.cos(angle) * endDist;
    const y2 = y + Math.sin(angle) * endDist;

    ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Add bright center flash
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * intensity})`);
  gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.3 * intensity})`);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x - 150, y - 150, 300, 300);

  ctx.restore();
}

/**
 * Apply time dilation visual effect (motion blur + trails)
 */
export function renderTimeDilation(
  ctx: CanvasRenderingContext2D,
  intensity: number = 0.5
) {
  ctx.save();
  ctx.globalAlpha = intensity * 0.3;
  ctx.filter = `blur(${intensity * 3}px)`;
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.restore();
}
