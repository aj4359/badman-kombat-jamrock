import { Fighter } from '@/types/gameTypes';
import { createMuscleGradient, drawGlow, drawShadow, createMetallicShine } from '../utils/ShaderEffects';

export const renderLeroy = (
  ctx: CanvasRenderingContext2D,
  fighter: Fighter,
  shadow: boolean = true
) => {
  const x = fighter.x;
  const y = fighter.y;
  const width = fighter.width;
  const height = fighter.height;
  const facing = fighter.facing;

  ctx.save();

  // Flip for facing direction
  if (facing === 'left') {
    ctx.translate(x + width / 2, 0);
    ctx.scale(-1, 1);
    ctx.translate(-(x + width / 2), 0);
  }

  // Shadow
  if (shadow) {
    drawShadow(ctx, x, y + height * 0.9, width, height * 0.1, facing);
  }

  // Skin tone (darker complexion)
  const skinTone = '#3d2817';
  const skinHighlight = '#5a3a26';

  // === DREADLOCK SYSTEM (40-60 locks) ===
  const dreadCount = 50;
  const dreadColor = '#1a1a1a';
  const goldWireColor = '#d4af37';
  
  // Rasta tam (red/gold/green)
  const tamX = x + width * 0.5;
  const tamY = y + height * 0.08;
  const tamRadius = width * 0.2;
  
  // Tam base - red
  ctx.fillStyle = '#c41e3a';
  ctx.beginPath();
  ctx.arc(tamX, tamY, tamRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Gold band
  ctx.strokeStyle = goldWireColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(tamX, tamY, tamRadius * 0.9, 0, Math.PI * 2);
  ctx.stroke();
  
  // Green center with lion emblem
  ctx.fillStyle = '#009b3a';
  ctx.beginPath();
  ctx.arc(tamX, tamY, tamRadius * 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Lion emblem (simplified)
  ctx.fillStyle = goldWireColor;
  ctx.font = `${width * 0.08}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🦁', tamX, tamY);

  // Render dreadlocks flowing from tam
  const animationFrame = Math.floor(Date.now() / 100) % 360;
  for (let i = 0; i < dreadCount; i++) {
    const angle = (i / dreadCount) * Math.PI * 2;
    const startX = tamX + Math.cos(angle) * tamRadius * 0.9;
    const startY = tamY + Math.sin(angle) * tamRadius * 0.9;
    
    // Physics-based sway (sine wave oscillation)
    const swayOffset = Math.sin(animationFrame * 0.05 + i * 0.3) * width * 0.05;
    
    // Each dread as bezier curve to waist
    const controlX1 = startX + swayOffset * 0.5;
    const controlY1 = y + height * 0.4;
    const controlX2 = startX + swayOffset;
    const controlY2 = y + height * 0.6;
    const endX = startX + swayOffset * 1.5;
    const endY = y + height * 0.85;
    
    ctx.strokeStyle = dreadColor;
    ctx.lineWidth = width * 0.015;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    ctx.stroke();
    
    // Gold wire wrapping on select locks (every 5th lock)
    if (i % 5 === 0) {
      const segments = 4;
      for (let s = 0; s < segments; s++) {
        const t = s / segments;
        const nextT = (s + 1) / segments;
        
        // Bezier curve evaluation
        const px = Math.pow(1-t, 3) * startX + 
                   3 * Math.pow(1-t, 2) * t * controlX1 + 
                   3 * (1-t) * Math.pow(t, 2) * controlX2 + 
                   Math.pow(t, 3) * endX;
        const py = Math.pow(1-t, 3) * startY + 
                   3 * Math.pow(1-t, 2) * t * controlY1 + 
                   3 * (1-t) * Math.pow(t, 2) * controlY2 + 
                   Math.pow(t, 3) * endY;
        
        ctx.strokeStyle = goldWireColor;
        ctx.lineWidth = width * 0.008;
        ctx.beginPath();
        ctx.arc(px, py, width * 0.01, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // === HEAD ===
  const headX = x + width * 0.5;
  const headY = y + height * 0.15;
  const headRadius = width * 0.18;

  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  // Head highlight
  const headGradient = ctx.createRadialGradient(
    headX - headRadius * 0.3, headY - headRadius * 0.3, 0,
    headX, headY, headRadius
  );
  headGradient.addColorStop(0, skinHighlight);
  headGradient.addColorStop(1, skinTone);
  ctx.fillStyle = headGradient;
  ctx.beginPath();
  ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  // === CYBER EYE (LEFT) ===
  const cyberEyeX = headX - headRadius * 0.4;
  const cyberEyeY = headY;
  const cyberEyeRadius = headRadius * 0.25;
  
  // Eye socket glow
  drawGlow(ctx, cyberEyeX, cyberEyeY, cyberEyeRadius * 2, '#00ffff', 0.6);
  
  // LED eye
  ctx.fillStyle = '#0066cc';
  ctx.beginPath();
  ctx.arc(cyberEyeX, cyberEyeY, cyberEyeRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Bright center
  ctx.fillStyle = '#00ccff';
  ctx.beginPath();
  ctx.arc(cyberEyeX, cyberEyeY, cyberEyeRadius * 0.6, 0, Math.PI * 2);
  ctx.fill();
  
  // Crosshair pupil
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cyberEyeX - cyberEyeRadius * 0.5, cyberEyeY);
  ctx.lineTo(cyberEyeX + cyberEyeRadius * 0.5, cyberEyeY);
  ctx.moveTo(cyberEyeX, cyberEyeY - cyberEyeRadius * 0.5);
  ctx.lineTo(cyberEyeX, cyberEyeY + cyberEyeRadius * 0.5);
  ctx.stroke();
  
  // Lens reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(cyberEyeX - cyberEyeRadius * 0.3, cyberEyeY - cyberEyeRadius * 0.3, cyberEyeRadius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Normal eye (right)
  const normalEyeX = headX + headRadius * 0.4;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(normalEyeX, headY, headRadius * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#2a1810';
  ctx.beginPath();
  ctx.arc(normalEyeX, headY, headRadius * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // === TORSO ===
  const torsoX = x + width * 0.3;
  const torsoY = y + height * 0.25;
  const torsoWidth = width * 0.4;
  const torsoHeight = height * 0.4;

  // Muscular body
  const muscleGradient = createMuscleGradient(ctx, torsoX, torsoY, torsoWidth, torsoHeight, 200);
  ctx.fillStyle = muscleGradient;
  ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight);

  // === CIRCUIT BOARD TATTOOS ===
  const isAttacking = fighter.state.current === 'attacking' || fighter.state.current === 'special';
  const circuitGlow = isAttacking ? 0.9 : 0.5;
  
  // Arms - glowing blue traces
  const armCircuits = [
    { x: x + width * 0.15, y: y + height * 0.35, w: width * 0.12, h: height * 0.25 },
    { x: x + width * 0.73, y: y + height * 0.35, w: width * 0.12, h: height * 0.25 }
  ];
  
  armCircuits.forEach(circuit => {
    // Circuit paths
    ctx.strokeStyle = `rgba(0, 200, 255, ${circuitGlow})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ccff';
    ctx.shadowBlur = 8;
    
    // Vertical traces
    for (let i = 0; i < 5; i++) {
      const lineX = circuit.x + (circuit.w * i / 5);
      ctx.beginPath();
      ctx.moveTo(lineX, circuit.y);
      ctx.lineTo(lineX, circuit.y + circuit.h);
      ctx.stroke();
    }
    
    // Horizontal connections
    for (let i = 0; i < 8; i++) {
      const lineY = circuit.y + (circuit.h * i / 8);
      ctx.beginPath();
      ctx.moveTo(circuit.x, lineY);
      ctx.lineTo(circuit.x + circuit.w, lineY);
      ctx.stroke();
    }
    
    // Circuit nodes
    ctx.fillStyle = `rgba(0, 255, 255, ${circuitGlow})`;
    for (let i = 0; i < 15; i++) {
      const nodeX = circuit.x + Math.random() * circuit.w;
      const nodeY = circuit.y + Math.random() * circuit.h;
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  ctx.shadowBlur = 0;

  // Digital tribal patterns on chest - animated pulse
  const chestPatterns = [
    { x: torsoX + torsoWidth * 0.2, y: torsoY + torsoHeight * 0.3 },
    { x: torsoX + torsoWidth * 0.5, y: torsoY + torsoHeight * 0.2 },
    { x: torsoX + torsoWidth * 0.8, y: torsoY + torsoHeight * 0.3 }
  ];
  
  const pulseIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;
  ctx.fillStyle = `rgba(0, 200, 255, ${pulseIntensity})`;
  ctx.shadowColor = '#00ccff';
  ctx.shadowBlur = 10;
  
  chestPatterns.forEach(pattern => {
    ctx.beginPath();
    ctx.arc(pattern.x, pattern.y, width * 0.03, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.shadowBlur = 0;

  // === TANK TOP ===
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight * 0.6);
  
  // Fabric texture (vertical lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const lineX = torsoX + (torsoWidth * i / 10);
    ctx.beginPath();
    ctx.moveTo(lineX, torsoY);
    ctx.lineTo(lineX, torsoY + torsoHeight * 0.6);
    ctx.stroke();
  }
  
  // Tank straps
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(torsoX + torsoWidth * 0.1, torsoY, torsoWidth * 0.15, torsoHeight * 0.3);
  ctx.fillRect(torsoX + torsoWidth * 0.75, torsoY, torsoWidth * 0.15, torsoHeight * 0.3);

  // === ARMS ===
  // Left arm
  const leftArmX = x + width * 0.15;
  const leftArmY = y + height * 0.3;
  const armWidth = width * 0.12;
  const armHeight = height * 0.35;
  
  ctx.fillStyle = createMuscleGradient(ctx, leftArmX, leftArmY, armWidth, armHeight, 180);
  ctx.fillRect(leftArmX, leftArmY, armWidth, armHeight);
  
  // Right arm
  const rightArmX = x + width * 0.73;
  ctx.fillStyle = createMuscleGradient(ctx, rightArmX, leftArmY, armWidth, armHeight, 0);
  ctx.fillRect(rightArmX, leftArmY, armWidth, armHeight);

  // === BRACERS (Tech Interfaces) ===
  const bracers = [
    { x: leftArmX, y: leftArmY + armHeight * 0.5 },
    { x: rightArmX, y: leftArmY + armHeight * 0.5 }
  ];
  
  bracers.forEach(bracer => {
    // Bracer body
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(bracer.x, bracer.y, armWidth, armHeight * 0.25);
    
    // Metallic shine
    const shineGradient = createMetallicShine(ctx, bracer.x, bracer.y, armWidth, armHeight * 0.25);
    ctx.fillStyle = shineGradient;
    ctx.fillRect(bracer.x, bracer.y, armWidth, armHeight * 0.25);
    
    // LED screen
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(bracer.x + armWidth * 0.1, bracer.y + armHeight * 0.05, armWidth * 0.8, armHeight * 0.08);
    
    // Screen text (binary)
    ctx.fillStyle = '#003322';
    ctx.font = `${width * 0.02}px monospace`;
    ctx.fillText('1010', bracer.x + armWidth * 0.2, bracer.y + armHeight * 0.1);
    
    // Fastening straps
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bracer.x, bracer.y + armHeight * 0.08);
    ctx.lineTo(bracer.x + armWidth, bracer.y + armHeight * 0.08);
    ctx.stroke();
  });

  // === LEGS ===
  // Cargo shorts
  const shortsY = y + height * 0.65;
  const shortsHeight = height * 0.25;
  
  ctx.fillStyle = '#4a4a3a';
  ctx.fillRect(torsoX, shortsY, torsoWidth, shortsHeight);
  
  // Belt
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(torsoX, shortsY - height * 0.02, torsoWidth, height * 0.04);
  
  // Belt buckle
  const buckleGradient = createMetallicShine(ctx, x + width * 0.45, shortsY - height * 0.02, width * 0.1, height * 0.04);
  ctx.fillStyle = buckleGradient;
  ctx.fillRect(x + width * 0.45, shortsY - height * 0.02, width * 0.1, height * 0.04);
  
  // Pockets with straps
  const pockets = [
    { x: torsoX + torsoWidth * 0.1, y: shortsY + shortsHeight * 0.3 },
    { x: torsoX + torsoWidth * 0.6, y: shortsY + shortsHeight * 0.3 }
  ];
  
  pockets.forEach(pocket => {
    ctx.fillStyle = '#3a3a2a';
    ctx.fillRect(pocket.x, pocket.y, torsoWidth * 0.25, shortsHeight * 0.4);
    
    // Velcro straps
    ctx.fillStyle = '#1a1a0a';
    ctx.fillRect(pocket.x, pocket.y, torsoWidth * 0.25, shortsHeight * 0.05);
  });
  
  // Wrinkles at hips
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(torsoX + torsoWidth * 0.2 + i * 5, shortsY);
    ctx.lineTo(torsoX + torsoWidth * 0.3 + i * 5, shortsY + shortsHeight * 0.15);
    ctx.stroke();
  }
  
  // Legs
  const legWidth = width * 0.15;
  const legHeight = height * 0.35;
  
  ctx.fillStyle = skinTone;
  ctx.fillRect(x + width * 0.3, y + height * 0.65, legWidth, legHeight);
  ctx.fillRect(x + width * 0.55, y + height * 0.65, legWidth, legHeight);

  // === SANDALS ===
  const sandals = [
    { x: x + width * 0.28, y: y + height * 0.95 },
    { x: x + width * 0.53, y: y + height * 0.95 }
  ];
  
  sandals.forEach(sandal => {
    // Sole
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(sandal.x, sandal.y, legWidth * 1.1, height * 0.03);
    
    // Thickness
    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(sandal.x, sandal.y + height * 0.03, legWidth * 1.1, height * 0.01);
    
    // Leather straps (X pattern)
    ctx.strokeStyle = '#5a4a3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sandal.x, sandal.y - height * 0.02);
    ctx.lineTo(sandal.x + legWidth * 1.1, sandal.y - height * 0.08);
    ctx.moveTo(sandal.x + legWidth * 1.1, sandal.y - height * 0.02);
    ctx.lineTo(sandal.x, sandal.y - height * 0.08);
    ctx.stroke();
    
    // Visible toes
    ctx.fillStyle = skinTone;
    for (let i = 0; i < 5; i++) {
      const toeX = sandal.x + (legWidth * 1.1 * i / 5) + legWidth * 0.05;
      const toeY = sandal.y - height * 0.015;
      ctx.beginPath();
      ctx.arc(toeX, toeY, width * 0.015, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // === HOLOGRAPHIC RASTA FLAG (Shoulder Projection) ===
  const flagX = x + width * 0.7;
  const flagY = y + height * 0.3;
  const flagWidth = width * 0.15;
  const flagHeight = height * 0.12;
  
  // Hologram glow
  ctx.shadowColor = '#00ff88';
  ctx.shadowBlur = 15;
  
  // Red layer
  ctx.fillStyle = 'rgba(196, 30, 58, 0.5)';
  ctx.fillRect(flagX, flagY, flagWidth, flagHeight * 0.33);
  
  // Gold layer
  ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.fillRect(flagX, flagY + flagHeight * 0.33, flagWidth, flagHeight * 0.34);
  
  // Green layer
  ctx.fillStyle = 'rgba(0, 155, 58, 0.5)';
  ctx.fillRect(flagX, flagY + flagHeight * 0.67, flagWidth, flagHeight * 0.33);
  
  // Hologram scanlines
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const lineY = flagY + (flagHeight * i / 8);
    ctx.beginPath();
    ctx.moveTo(flagX, lineY);
    ctx.lineTo(flagX + flagWidth, lineY);
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;

  // === DIGITAL VINES (Ground Effect) ===
  if (isAttacking) {
    const vineCount = 5;
    for (let i = 0; i < vineCount; i++) {
      const vineX = x + width * (0.2 + i * 0.15);
      const vineY = y + height;
      const vineHeight = height * 0.3;
      
      ctx.strokeStyle = 'rgba(0, 255, 100, 0.6)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00ff64';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(vineX, vineY);
      ctx.quadraticCurveTo(
        vineX + Math.sin(i) * width * 0.1,
        vineY - vineHeight * 0.5,
        vineX + Math.cos(i) * width * 0.05,
        vineY - vineHeight
      );
      ctx.stroke();
      
      // Pixelated leaves
      const leafSize = width * 0.02;
      const leafX = vineX + Math.cos(i) * width * 0.05;
      const leafY = vineY - vineHeight;
      
      ctx.fillStyle = 'rgba(0, 255, 100, 0.7)';
      ctx.fillRect(leafX - leafSize, leafY - leafSize, leafSize * 2, leafSize * 2);
      
      // Binary code veins
      ctx.font = `${width * 0.015}px monospace`;
      ctx.fillStyle = 'rgba(0, 200, 80, 0.8)';
      ctx.fillText('01', leafX - leafSize * 0.5, leafY);
    }
    
    ctx.shadowBlur = 0;
  }

  // === NANITE PARTICLES (Flowing through dreads) ===
  const naniteCount = 20;
  for (let i = 0; i < naniteCount; i++) {
    const progress = (Date.now() * 0.001 + i * 0.2) % 1;
    const dreadIndex = Math.floor(i * dreadCount / naniteCount);
    const angle = (dreadIndex / dreadCount) * Math.PI * 2;
    const startX = tamX + Math.cos(angle) * tamRadius * 0.9;
    const startY = tamY + Math.sin(angle) * tamRadius * 0.9;
    const endX = startX + Math.sin(animationFrame * 0.05 + dreadIndex * 0.3) * width * 0.075;
    const endY = y + height * 0.85;
    
    const naniteX = startX + (endX - startX) * progress;
    const naniteY = startY + (endY - startY) * progress;
    
    drawGlow(ctx, naniteX, naniteY, width * 0.01, '#00ffff', 0.8);
    
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(naniteX, naniteY, width * 0.005, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};
