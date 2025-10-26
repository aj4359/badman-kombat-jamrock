import { Fighter } from '@/types/gameTypes';

export const createMuscleGradient = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  baseHue: number,
  vertical: boolean = true
) => {
  const gradient = vertical
    ? ctx.createLinearGradient(x, y, x, y + height)
    : ctx.createLinearGradient(x, y, x + width, y);
  
  gradient.addColorStop(0, `hsl(${baseHue}, 50%, 45%)`);
  gradient.addColorStop(0.3, `hsl(${baseHue}, 55%, 50%)`);
  gradient.addColorStop(0.7, `hsl(${baseHue}, 45%, 42%)`);
  gradient.addColorStop(1, `hsl(${baseHue}, 40%, 38%)`);
  
  return gradient;
};

export const createRimLight = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  intensity: number = 0.3
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = intensity;
  ctx.strokeRect(x, y, width, height);
  ctx.globalAlpha = 1;
};

export const drawShadow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  direction: 'left' | 'right' = 'right'
) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  const shadowWidth = width * 0.2;
  const shadowX = direction === 'right' ? x + width - shadowWidth : x;
  ctx.fillRect(shadowX, y, shadowWidth, height);
};

export const createMetallicShine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  return gradient;
};

export const drawGlow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  intensity: number = 0.5
) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.save();
  ctx.globalAlpha = intensity;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const drawClothFolds = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  foldCount: number = 3
) => {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < foldCount; i++) {
    const foldY = y + (height / (foldCount + 1)) * (i + 1);
    ctx.beginPath();
    ctx.moveTo(x, foldY);
    ctx.quadraticCurveTo(x + width / 2, foldY + 5, x + width, foldY);
    ctx.stroke();
  }
};

export const drawMuscleDefinition = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  type: 'chest' | 'abs' | 'arms' | 'legs'
) => {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  
  switch (type) {
    case 'chest':
      // Pec lines
      ctx.beginPath();
      ctx.arc(x + width * 0.3, y + height * 0.3, width * 0.15, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + width * 0.7, y + height * 0.3, width * 0.15, 0, Math.PI);
      ctx.stroke();
      break;
      
    case 'abs':
      // Ab lines
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + width * 0.35, y + height * (0.3 + i * 0.2));
        ctx.lineTo(x + width * 0.65, y + height * (0.3 + i * 0.2));
        ctx.stroke();
      }
      // Center line
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + height * 0.2);
      ctx.lineTo(x + width / 2, y + height * 0.9);
      ctx.stroke();
      break;
      
    case 'arms':
      // Bicep curve
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height * 0.3, width * 0.4, 0, Math.PI);
      ctx.stroke();
      break;
      
    case 'legs':
      // Quad definition
      ctx.beginPath();
      ctx.moveTo(x + width * 0.3, y);
      ctx.lineTo(x + width * 0.3, y + height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + width * 0.7, y);
      ctx.lineTo(x + width * 0.7, y + height);
      ctx.stroke();
      break;
  }
};
