export interface VisualEffectsConfig {
  hitSparks: boolean;
  screenShake: boolean;
  characterFlash: boolean;
  superEffects: boolean;
  comboEffects: boolean;
}

export interface HitSpark {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'impact' | 'block' | 'critical' | 'super';
}

export function renderHitSpark(
  ctx: CanvasRenderingContext2D,
  spark: HitSpark
) {
  ctx.save();
  
  const alpha = spark.life / spark.maxLife;
  const size = spark.size * (0.5 + alpha * 0.5);
  
  ctx.globalAlpha = alpha;
  ctx.translate(spark.x, spark.y);
  
  // Hit spark style based on type
  switch (spark.type) {
    case 'impact':
      renderImpactSpark(ctx, size, spark.color);
      break;
    case 'block':
      renderBlockSpark(ctx, size, spark.color);
      break;
    case 'critical':
      renderCriticalSpark(ctx, size, spark.color);
      break;
    case 'super':
      renderSuperSpark(ctx, size, spark.color);
      break;
  }
  
  ctx.restore();
}

function renderImpactSpark(ctx: CanvasRenderingContext2D, size: number, color: string) {
  // Classic Street Fighter impact spark
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.5;
  
  // Star-shaped spark
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const radius = i % 2 === 0 ? size : size * 0.5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
}

function renderBlockSpark(ctx: CanvasRenderingContext2D, size: number, color: string) {
  // Block sparks are more geometric
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.2;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.3;
  
  // Multiple lines radiating outward
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x1 = Math.cos(angle) * size * 0.3;
    const y1 = Math.sin(angle) * size * 0.3;
    const x2 = Math.cos(angle) * size;
    const y2 = Math.sin(angle) * size;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function renderCriticalSpark(ctx: CanvasRenderingContext2D, size: number, color: string) {
  // Critical hits have larger, more dramatic sparks
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size;
  
  // Large central explosion
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
  ctx.fill();
  
  // Radiating energy lines
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.1;
  ctx.shadowColor = 'white';
  ctx.shadowBlur = size * 0.5;
  
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x = Math.cos(angle) * size * 1.5;
    const y = Math.sin(angle) * size * 1.5;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function renderSuperSpark(ctx: CanvasRenderingContext2D, size: number, color: string) {
  // Super move sparks are the most dramatic
  ctx.save();
  
  // Multiple layered effects
  for (let layer = 0; layer < 3; layer++) {
    const layerSize = size * (1 - layer * 0.2);
    const layerAlpha = 1 - layer * 0.3;
    
    ctx.globalAlpha = layerAlpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = layerSize;
    
    // Rotating star pattern
    ctx.save();
    ctx.rotate(layer * Math.PI / 4);
    
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const radius = i % 2 === 0 ? layerSize : layerSize * 0.6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  ctx.restore();
}

export function renderScreenShake(
  ctx: CanvasRenderingContext2D,
  intensity: number
): { x: number; y: number } {
  const shakeX = (Math.random() - 0.5) * intensity * 2;
  const shakeY = (Math.random() - 0.5) * intensity * 2;
  
  ctx.translate(shakeX, shakeY);
  
  return { x: shakeX, y: shakeY };
}

export function renderCharacterFlash(
  ctx: CanvasRenderingContext2D,
  color: string,
  intensity: number
) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = color;
  ctx.globalAlpha = intensity;
  ctx.fillRect(-1000, -1000, 2000, 2000);
  ctx.restore();
}

export function renderComboCounter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  comboCount: number,
  comboDamage: number
) {
  if (comboCount <= 1) return;
  
  ctx.save();
  
  // Combo counter background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(x - 60, y - 25, 120, 50);
  
  // Combo count
  ctx.fillStyle = comboCount >= 10 ? 'hsl(45, 100%, 50%)' : 'hsl(0, 100%, 60%)';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeText(`${comboCount} HIT${comboCount > 1 ? 'S' : ''}`, x, y);
  ctx.fillText(`${comboCount} HIT${comboCount > 1 ? 'S' : ''}`, x, y);
  
  // Damage
  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px monospace';
  ctx.strokeText(`${comboDamage} DMG`, x, y + 20);
  ctx.fillText(`${comboDamage} DMG`, x, y + 20);
  
  ctx.restore();
}

export function renderSuperMeter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  meter: number,
  maxMeter: number
) {
  const width = 200;
  const height = 20;
  const segments = 3; // 3-bar super meter like Street Fighter
  
  ctx.save();
  
  // Meter background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(x, y, width, height);
  
  // Meter segments
  const segmentWidth = width / segments;
  const meterPerSegment = maxMeter / segments;
  
  for (let i = 0; i < segments; i++) {
    const segmentMeter = Math.max(0, Math.min(meterPerSegment, meter - i * meterPerSegment));
    const segmentFill = segmentMeter / meterPerSegment;
    
    if (segmentFill > 0) {
      // Color changes based on how full the meter is
      let color = 'hsl(60, 100%, 50%)'; // Yellow
      if (i === segments - 1 && segmentFill === 1) {
        color = 'hsl(45, 100%, 60%)'; // Gold for full meter
      } else if (segmentFill === 1) {
        color = 'hsl(120, 100%, 50%)'; // Green for full segment
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(
        x + i * segmentWidth + 2,
        y + 2,
        (segmentWidth - 4) * segmentFill,
        height - 4
      );
      
      // Glow effect for full segments
      if (segmentFill === 1) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        ctx.fillRect(
          x + i * segmentWidth + 2,
          y + 2,
          segmentWidth - 4,
          height - 4
        );
        ctx.shadowBlur = 0;
      }
    }
    
    // Segment dividers
    if (i < segments - 1) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(x + (i + 1) * segmentWidth - 1, y, 2, height);
    }
  }
  
  // Border
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  
  ctx.restore();
}

// John Wick specific effects
export function renderMuzzleFlash(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  ctx.save();
  
  // Bright flash
  const gradient = ctx.createRadialGradient(x, y, 5, x, y, 30);
  gradient.addColorStop(0, 'rgba(255, 200, 100, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.6)');
  gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x - 30, y - 30, 60, 60);
  
  // Flash lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * 25, y + Math.sin(angle) * 25);
    ctx.stroke();
  }
  
  ctx.restore();
}

export function renderBulletTrail(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  ctx.save();
  
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  ctx.restore();
}