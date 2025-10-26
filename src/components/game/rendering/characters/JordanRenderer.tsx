import { Fighter } from '@/types/gameTypes';
import { createMuscleGradient, drawShadow, drawGlow, drawClothFolds, drawMuscleDefinition, createMetallicShine } from '../utils/ShaderEffects';

export const renderJordanSoundMaster = (
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
  
  // Flip for facing direction
  if (facing === 'left') {
    ctx.translate(x + width / 2, 0);
    ctx.scale(-1, 1);
    ctx.translate(-(x + width / 2), 0);
  }
  
  // === LEGS ===
  renderJordanLegs(ctx, x, y, width, height);
  
  // === TORSO ===
  renderJordanTorso(ctx, x, y, width, height);
  
  // === ARMS ===
  renderJordanArms(ctx, x, y, width, height, fighter.state.current);
  
  // === HEAD ===
  renderJordanHead(ctx, x, y, width, height);
  
  // === HEADPHONES ===
  renderJordanHeadphones(ctx, x, y, width, height);
  
  // === GOLD CHAIN ===
  renderGoldChain(ctx, x, y, width, height);
  
  // === SOUND WAVE EFFECTS ===
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    renderSoundWaveEffects(ctx, x, y, width, height);
  }
  
  ctx.restore();
};

const renderJordanLegs = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const legWidth = width * 0.25;
  const legHeight = height * 0.5;
  const legY = y + height * 0.5;
  
  // Left leg
  const leftLegX = x + width * 0.25;
  ctx.fillStyle = createMuscleGradient(ctx, leftLegX, legY, legWidth, legHeight, 210);
  ctx.fillRect(leftLegX, legY, legWidth, legHeight);
  drawMuscleDefinition(ctx, leftLegX, legY, legWidth, legHeight * 0.6, 'legs');
  
  // Right leg
  const rightLegX = x + width * 0.5;
  ctx.fillStyle = createMuscleGradient(ctx, rightLegX, legY, legWidth, legHeight, 210);
  ctx.fillRect(rightLegX, legY, legWidth, legHeight);
  drawMuscleDefinition(ctx, rightLegX, legY, legWidth, legHeight * 0.6, 'legs');
  
  // Baggy jeans texture
  ctx.fillStyle = 'rgba(30, 60, 120, 0.8)';
  ctx.fillRect(leftLegX, legY, legWidth, legHeight);
  ctx.fillRect(rightLegX, legY, legWidth, legHeight);
  
  drawClothFolds(ctx, leftLegX, legY, legWidth, legHeight, 4);
  drawClothFolds(ctx, rightLegX, legY, legWidth, legHeight, 4);
  
  // Sneakers - Air Jordan style
  renderSneakers(ctx, leftLegX, legY + legHeight, legWidth, height * 0.08);
  renderSneakers(ctx, rightLegX, legY + legHeight, legWidth, height * 0.08);
};

const renderSneakers = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Shoe base - red and white
  ctx.fillStyle = '#DC143C';
  ctx.fillRect(x - 5, y, width + 10, height);
  
  // White swoosh area
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x, y + height * 0.3);
  ctx.quadraticCurveTo(x + width * 0.7, y, x + width, y + height * 0.5);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fill();
  
  // Nike swoosh
  ctx.strokeStyle = '#DC143C';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.2, y + height * 0.5);
  ctx.quadraticCurveTo(x + width * 0.5, y + height * 0.3, x + width * 0.8, y + height * 0.6);
  ctx.stroke();
  
  // Laces
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x + width * 0.3, y + height * 0.2 + i * 5);
    ctx.lineTo(x + width * 0.7, y + height * 0.2 + i * 5);
    ctx.stroke();
  }
  
  // Sole highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(x, y + height * 0.8, width + 10, height * 0.2);
};

const renderJordanTorso = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const torsoWidth = width * 0.6;
  const torsoHeight = height * 0.45;
  const torsoX = x + width * 0.2;
  const torsoY = y + height * 0.15;
  
  // Muscular torso base
  ctx.fillStyle = createMuscleGradient(ctx, torsoX, torsoY, torsoWidth, torsoHeight, 30);
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.1, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.9, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.8, torsoY + torsoHeight);
  ctx.lineTo(torsoX + torsoWidth * 0.2, torsoY + torsoHeight);
  ctx.closePath();
  ctx.fill();
  
  // Muscle definition
  drawMuscleDefinition(ctx, torsoX, torsoY, torsoWidth, torsoHeight * 0.4, 'chest');
  drawMuscleDefinition(ctx, torsoX, torsoY + torsoHeight * 0.4, torsoWidth, torsoHeight * 0.6, 'abs');
  
  // Graphic tee with sound wave design
  ctx.fillStyle = 'rgba(100, 50, 200, 0.9)';
  ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight);
  
  // Sound wave graphic
  ctx.strokeStyle = '#00FFFF';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const waveY = torsoY + torsoHeight * 0.3 + i * 8;
    ctx.beginPath();
    ctx.moveTo(torsoX + torsoWidth * 0.2, waveY);
    for (let j = 0; j < 10; j++) {
      const waveX = torsoX + torsoWidth * 0.2 + (j * torsoWidth * 0.06);
      const amplitude = Math.random() * 10 + 5;
      ctx.lineTo(waveX, waveY + (j % 2 === 0 ? -amplitude : amplitude));
    }
    ctx.stroke();
  }
  
  // Shirt wrinkles
  drawClothFolds(ctx, torsoX, torsoY, torsoWidth, torsoHeight, 3);
  
  drawShadow(ctx, torsoX, torsoY, torsoWidth, torsoHeight, 'right');
};

const renderJordanArms = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, state: string) => {
  const armWidth = width * 0.15;
  const armHeight = height * 0.35;
  const armY = y + height * 0.2;
  
  // Left arm
  const leftArmX = x + width * 0.05;
  ctx.fillStyle = createMuscleGradient(ctx, leftArmX, armY, armWidth, armHeight, 30);
  ctx.fillRect(leftArmX, armY, armWidth, armHeight);
  drawMuscleDefinition(ctx, leftArmX, armY, armWidth, armHeight, 'arms');
  
  // Right arm (attacking pose)
  const rightArmX = x + width * 0.8;
  const rightArmExtend = state === 'attacking' ? 20 : 0;
  ctx.fillStyle = createMuscleGradient(ctx, rightArmX, armY, armWidth, armHeight, 30);
  ctx.fillRect(rightArmX + rightArmExtend, armY, armWidth, armHeight);
  drawMuscleDefinition(ctx, rightArmX + rightArmExtend, armY, armWidth, armHeight, 'arms');
  
  // Shirt sleeves
  ctx.fillStyle = 'rgba(100, 50, 200, 0.9)';
  ctx.fillRect(leftArmX, armY, armWidth, armHeight * 0.4);
  ctx.fillRect(rightArmX + rightArmExtend, armY, armWidth, armHeight * 0.4);
  
  // Hands with visible fingers
  renderHand(ctx, leftArmX + armWidth / 2, armY + armHeight, armWidth);
  renderHand(ctx, rightArmX + rightArmExtend + armWidth / 2, armY + armHeight, armWidth);
};

const renderHand = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.fillStyle = '#C49A6C';
  
  // Palm
  ctx.fillRect(x - size / 2, y, size, size * 0.6);
  
  // Fingers
  const fingerWidth = size / 5;
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(
      x - size / 2 + i * fingerWidth,
      y + size * 0.6,
      fingerWidth * 0.8,
      size * 0.4
    );
  }
};

const renderJordanHead = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const headSize = width * 0.3;
  const headX = x + width * 0.35;
  const headY = y;
  
  // Head/skull shape
  ctx.fillStyle = '#8B6F47';
  ctx.beginPath();
  ctx.ellipse(headX + headSize / 2, headY + headSize * 0.6, headSize * 0.5, headSize * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Dreadlocks - 30 individual locks
  renderDreadlocks(ctx, headX + headSize / 2, headY, headSize);
  
  // Face features
  // Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(headX + headSize * 0.3, headY + headSize * 0.5, headSize * 0.15, headSize * 0.1);
  ctx.fillRect(headX + headSize * 0.55, headY + headSize * 0.5, headSize * 0.15, headSize * 0.1);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(headX + headSize * 0.35, headY + headSize * 0.52, headSize * 0.08, headSize * 0.08);
  ctx.fillRect(headX + headSize * 0.6, headY + headSize * 0.52, headSize * 0.08, headSize * 0.08);
  
  // Nose
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(headX + headSize * 0.5, headY + headSize * 0.55);
  ctx.lineTo(headX + headSize * 0.48, headY + headSize * 0.65);
  ctx.stroke();
  
  // Mouth
  ctx.beginPath();
  ctx.arc(headX + headSize / 2, headY + headSize * 0.75, headSize * 0.15, 0, Math.PI);
  ctx.stroke();
};

const renderDreadlocks = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  const dreadCount = 30;
  const dreadWidth = size * 0.05;
  const dreadLength = size * 1.5;
  
  for (let i = 0; i < dreadCount; i++) {
    const angle = (i / dreadCount) * Math.PI - Math.PI / 2;
    const startX = x + Math.cos(angle) * size * 0.5;
    const startY = y + Math.sin(angle) * size * 0.3;
    
    // Gradient for each dread - dark brown to Rasta colors at tips
    const gradient = ctx.createLinearGradient(startX, startY, startX, startY + dreadLength);
    gradient.addColorStop(0, '#2C1810');
    gradient.addColorStop(0.7, '#3D2817');
    gradient.addColorStop(0.85, '#FFD700'); // Gold
    gradient.addColorStop(0.92, '#FF0000'); // Red
    gradient.addColorStop(1, '#00FF00'); // Green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(startX - dreadWidth / 2, startY, dreadWidth, dreadLength);
    
    // Gold beads at intervals
    if (i % 3 === 0) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(startX, startY + dreadLength * 0.3, dreadWidth, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(startX, startY + dreadLength * 0.6, dreadWidth, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const renderJordanHeadphones = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const headSize = width * 0.3;
  const headX = x + width * 0.35;
  const headY = y;
  
  // Headband
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(headX + headSize / 2, headY + headSize * 0.4, headSize * 0.6, Math.PI, Math.PI * 2);
  ctx.stroke();
  
  // Left speaker cup
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.1, headY + headSize * 0.6, headSize * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Speaker detail
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.1, headY + headSize * 0.6, headSize * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // LED indicator - pulsing cyan
  drawGlow(ctx, headX + headSize * 0.1, headY + headSize * 0.6, headSize * 0.3, '#00FFFF', 0.6);
  ctx.fillStyle = '#00FFFF';
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.1, headY + headSize * 0.55, headSize * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // Right speaker cup
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.9, headY + headSize * 0.6, headSize * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.9, headY + headSize * 0.6, headSize * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  drawGlow(ctx, headX + headSize * 0.9, headY + headSize * 0.6, headSize * 0.3, '#00FFFF', 0.6);
  ctx.fillStyle = '#00FFFF';
  ctx.beginPath();
  ctx.arc(headX + headSize * 0.9, headY + headSize * 0.55, headSize * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // Brand logo "BMK"
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `${headSize * 0.08}px Arial`;
  ctx.fillText('BMK', headX + headSize * 0.42, headY + headSize * 0.25);
};

const renderGoldChain = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  const chainY = y + height * 0.15;
  const chainCenterX = x + width * 0.5;
  
  // Chain links
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const linkX = chainCenterX + Math.sin(i * 0.5) * 10;
    const linkY = chainY + i * 8;
    ctx.beginPath();
    ctx.arc(linkX, linkY, 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Metallic shine on chain
  ctx.strokeStyle = createMetallicShine(ctx, chainCenterX - 20, chainY, 40, 60);
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const linkX = chainCenterX + Math.sin(i * 0.5) * 10;
    const linkY = chainY + i * 8;
    ctx.beginPath();
    ctx.arc(linkX, linkY, 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Pendant
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(chainCenterX, chainY + 70, 15, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';
  ctx.fillText('🎵', chainCenterX - 6, chainY + 75);
};

const renderSoundWaveEffects = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Concentric sound waves emanating from character
  for (let i = 0; i < 3; i++) {
    const radius = 50 + i * 30;
    const alpha = 0.3 - i * 0.1;
    
    ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Bass woofer effect around hands
  drawGlow(ctx, x + width * 0.1, y + height * 0.5, 40, '#FF00FF', 0.5);
  drawGlow(ctx, x + width * 0.9, y + height * 0.5, 40, '#FF00FF', 0.5);
};
