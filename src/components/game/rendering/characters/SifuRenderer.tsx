import { Fighter } from '@/types/gameTypes';
import { createMuscleGradient, drawShadow, drawGlow, drawClothFolds } from '../utils/ShaderEffects';

export const renderSifuMaster = (
  ctx: CanvasRenderingContext2D,
  fighter: Fighter,
  scale: number = 1
) => {
  const x = fighter.x;
  const y = fighter.y;
  const width = fighter.width * scale;
  const height = fighter.height * scale;
  const facing = fighter.facing;
  
  ctx.save();
  
  if (facing === 'left') {
    ctx.translate(x + width / 2, 0);
    ctx.scale(-1, 1);
    ctx.translate(-(x + width / 2), 0);
  }
  
  // Chi energy aura
  if (fighter.state.current === 'special' || fighter.state.current === 'attacking') {
    renderChiAura(ctx, x, y, width, height);
  }
  
  renderSifuLegs(ctx, x, y, width, height);
  renderSifuTorso(ctx, x, y, width, height);
  renderSifuArms(ctx, x, y, width, height, fighter.state.current);
  renderSifuHead(ctx, x, y, width, height);
  
  // Steel wire weapon
  if (fighter.state.current === 'special') {
    renderSteelWire(ctx, x, y, width, height);
  }
  
  ctx.restore();
};

const renderChiAura = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Golden particle streams
  for (let i = 0; i < 20; i++) {
    const particleX = x + width / 2 + (Math.random() - 0.5) * width;
    const particleY = y + height / 2 + (Math.random() - 0.5) * height;
    drawGlow(ctx, particleX, particleY, 10, '#FFD700', 0.4);
  }
  
  // Energy flowing through meridian lines
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.5, y);
  ctx.lineTo(x + width * 0.5, y + height);
  ctx.stroke();
  
  // Circular chi flow
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height * 0.3, 30, 0, Math.PI * 2);
  ctx.stroke();
};

const renderSifuLegs = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const legWidth = width * 0.22;
  const legHeight = height * 0.5;
  const legY = y + height * 0.5;
  
  // Left leg with kung fu stance
  const leftLegX = x + width * 0.25;
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(leftLegX, legY, legWidth, legHeight);
  
  // Right leg
  const rightLegX = x + width * 0.53;
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(rightLegX, legY, legWidth, legHeight);
  
  // White gi pants
  ctx.fillStyle = 'rgba(245, 245, 245, 0.95)';
  ctx.fillRect(leftLegX, legY, legWidth, legHeight);
  ctx.fillRect(rightLegX, legY, legWidth, legHeight);
  
  // Pants wrinkle at knees
  drawClothFolds(ctx, leftLegX, legY + legHeight * 0.4, legWidth, legHeight * 0.3, 3);
  drawClothFolds(ctx, rightLegX, legY + legHeight * 0.4, legWidth, legHeight * 0.3, 3);
  
  // Bare feet with visible toes
  renderBareFoot(ctx, leftLegX + legWidth / 2, legY + legHeight, legWidth);
  renderBareFoot(ctx, rightLegX + legWidth / 2, legY + legHeight, legWidth);
};

const renderBareFoot = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.fillStyle = '#D2B48C';
  
  // Foot base
  ctx.fillRect(x - size * 0.6, y, size * 1.2, size * 0.5);
  
  // Toes
  const toeSize = size / 6;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(
      x - size * 0.5 + i * toeSize * 1.2,
      y - toeSize / 2,
      toeSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
};

const renderSifuTorso = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const torsoWidth = width * 0.55;
  const torsoHeight = height * 0.45;
  const torsoX = x + width * 0.225;
  const torsoY = y + height * 0.15;
  
  // Aged but strong torso
  ctx.fillStyle = '#D2B48C';
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.15, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.85, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.75, torsoY + torsoHeight);
  ctx.lineTo(torsoX + torsoWidth * 0.25, torsoY + torsoHeight);
  ctx.closePath();
  ctx.fill();
  
  // Traditional kung fu gi with canvas texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight);
  
  // Cross-over gi pattern
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.2, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.8, torsoY + torsoHeight * 0.3);
  ctx.stroke();
  
  // Belt wrapped correctly with knot
  renderBelt(ctx, torsoX, torsoY + torsoHeight * 0.6, torsoWidth);
  
  // Gi sleeves billowing
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.moveTo(torsoX, torsoY + torsoHeight * 0.2);
  ctx.quadraticCurveTo(torsoX - 15, torsoY + torsoHeight * 0.4, torsoX, torsoY + torsoHeight * 0.6);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth, torsoY + torsoHeight * 0.2);
  ctx.quadraticCurveTo(torsoX + torsoWidth + 15, torsoY + torsoHeight * 0.4, torsoX + torsoWidth, torsoY + torsoHeight * 0.6);
  ctx.fill();
  
  // Fabric texture
  drawClothFolds(ctx, torsoX, torsoY, torsoWidth, torsoHeight, 4);
};

const renderBelt = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number) => {
  // Black belt
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x, y, width, 15);
  
  // Belt knot on left side
  ctx.fillRect(x - 10, y - 5, 30, 25);
  ctx.fillRect(x - 5, y + 20, 20, 30);
  
  // Knot highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 10, y - 5, 30, 25);
};

const renderSifuArms = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, state: string) => {
  const armWidth = width * 0.18;
  const armHeight = height * 0.4;
  const armY = y + height * 0.2;
  
  // Left arm
  const leftArmX = x + width * 0.05;
  ctx.fillStyle = '#D2B48C';
  ctx.fillRect(leftArmX, armY, armWidth, armHeight);
  
  // Right arm - extended in attack pose
  const rightArmX = x + width * 0.77;
  const rightArmExtend = state === 'attacking' ? 25 : 0;
  ctx.fillStyle = '#D2B48C';
  ctx.fillRect(rightArmX + rightArmExtend, armY, armWidth, armHeight);
  
  // Gi sleeves
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(leftArmX, armY, armWidth, armHeight * 0.5);
  ctx.fillRect(rightArmX + rightArmExtend, armY, armWidth, armHeight * 0.5);
  
  // Palms glowing with chi during special moves
  if (state === 'special' || state === 'attacking') {
    drawGlow(ctx, leftArmX + armWidth / 2, armY + armHeight, 25, '#FFD700', 0.7);
    drawGlow(ctx, rightArmX + rightArmExtend + armWidth / 2, armY + armHeight, 25, '#FFD700', 0.7);
  }
  
  // Aged hands
  ctx.fillStyle = '#C19A6B';
  ctx.fillRect(leftArmX, armY + armHeight, armWidth, armHeight * 0.15);
  ctx.fillRect(rightArmX + rightArmExtend, armY + armHeight, armWidth, armHeight * 0.15);
};

const renderSifuHead = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const headSize = width * 0.28;
  const headX = x + width * 0.36;
  const headY = y;
  
  // Aged wise face
  ctx.fillStyle = '#C19A6B';
  ctx.beginPath();
  ctx.ellipse(headX + headSize / 2, headY + headSize * 0.55, headSize * 0.48, headSize * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Traditional topknot hairstyle
  ctx.fillStyle = '#E0E0E0';
  ctx.beginPath();
  ctx.arc(headX + headSize / 2, headY + headSize * 0.15, headSize * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair bun details
  ctx.strokeStyle = '#B0B0B0';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(headX + headSize / 2, headY + headSize * 0.15, headSize * 0.1 + i * 3, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Wise aged eyes with crow's feet
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(headX + headSize * 0.25, headY + headSize * 0.45, headSize * 0.18, headSize * 0.12);
  ctx.fillRect(headX + headSize * 0.57, headY + headSize * 0.45, headSize * 0.18, headSize * 0.12);
  
  ctx.fillStyle = '#4A4A4A';
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.34, headY + headSize * 0.51, headSize * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.66, headY + headSize * 0.51, headSize * 0.05, 0, Math.PI * 2);
  ctx.fill();
  
  // Crow's feet wrinkles
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.43, headY + headSize * (0.45 + i * 0.03));
    ctx.lineTo(headX + headSize * 0.2, headY + headSize * (0.43 + i * 0.03));
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.75, headY + headSize * (0.45 + i * 0.03));
    ctx.lineTo(headX + headSize * 0.98, headY + headSize * (0.43 + i * 0.03));
    ctx.stroke();
  }
  
  // Wrinkled forehead
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.3, headY + headSize * (0.3 + i * 0.05));
    ctx.lineTo(headX + headSize * 0.7, headY + headSize * (0.3 + i * 0.05));
    ctx.stroke();
  }
  
  // Long white beard
  renderBeard(ctx, headX + headSize / 2, headY + headSize * 0.75, headSize);
  
  // White mustache
  ctx.fillStyle = '#F5F5F5';
  ctx.beginPath();
  ctx.ellipse(headX + headSize * 0.35, headY + headSize * 0.68, headSize * 0.15, headSize * 0.08, -0.2, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headX + headSize * 0.65, headY + headSize * 0.68, headSize * 0.15, headSize * 0.08, 0.2, 0, Math.PI);
  ctx.fill();
};

const renderBeard = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.fillStyle = '#F5F5F5';
  
  // Main beard shape
  ctx.beginPath();
  ctx.moveTo(x - size * 0.3, y);
  ctx.quadraticCurveTo(x - size * 0.35, y + size * 0.5, x - size * 0.15, y + size * 0.8);
  ctx.lineTo(x + size * 0.15, y + size * 0.8);
  ctx.quadraticCurveTo(x + size * 0.35, y + size * 0.5, x + size * 0.3, y);
  ctx.closePath();
  ctx.fill();
  
  // Individual hair strands
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 1;
  for (let i = 0; i < 15; i++) {
    const startX = x - size * 0.3 + (i / 15) * size * 0.6;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(startX + (Math.random() - 0.5) * 5, y + size * 0.8);
    ctx.stroke();
  }
};

const renderSteelWire = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Thin reflective wire
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  
  // Wire swinging motion
  ctx.beginPath();
  ctx.moveTo(x + width * 0.9, y + height * 0.3);
  ctx.quadraticCurveTo(
    x + width * 1.3,
    y + height * 0.5,
    x + width * 1.5,
    y + height * 0.4
  );
  ctx.stroke();
  
  // Wire glints
  for (let i = 0; i < 5; i++) {
    const glintX = x + width * (0.9 + i * 0.12);
    const glintY = y + height * (0.3 + i * 0.02);
    drawGlow(ctx, glintX, glintY, 5, '#FFFFFF', 0.8);
  }
  
  ctx.setLineDash([]);
};
