import { Fighter } from '@/types/gameTypes';
import { createMetallicShine, drawGlow, drawShadow } from '../utils/ShaderEffects';

export const renderRazor = (
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

  const isDashing = fighter.state.current === 'walking';
  const isTeleporting = fighter.state.current === 'special';
  const isAttacking = fighter.state.current === 'attacking';

  // === AFTERIMAGE TRAILS (Dash Effect) ===
  if (isDashing) {
    const trailCount = 4;
    for (let i = 0; i < trailCount; i++) {
      const trailOffset = (i + 1) * width * 0.15 * (facing === 'right' ? -1 : 1);
      const trailAlpha = 0.15 * (1 - i / trailCount);
      
      ctx.globalAlpha = trailAlpha;
      renderRazorBody(ctx, x + trailOffset, y, width, height, facing, false);
    }
    ctx.globalAlpha = 1;
  }

  // === PIXELATION EFFECT (Teleport) ===
  if (isTeleporting) {
    const pixelSize = width * 0.05;
    ctx.fillStyle = '#ff00ff';
    
    for (let px = 0; px < width; px += pixelSize) {
      for (let py = 0; py < height; py += pixelSize) {
        if (Math.random() > 0.5) {
          ctx.globalAlpha = 0.3 + Math.random() * 0.4;
          ctx.fillRect(x + px, y + py, pixelSize, pixelSize);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Main body render
  renderRazorBody(ctx, x, y, width, height, facing, true);

  // === PLASMA KATANA ===
  renderPlasmaKatana(ctx, fighter, isAttacking);

  // === ENERGY SLASH TRAILS ===
  if (isAttacking) {
    renderEnergySlashes(ctx, fighter);
  }

  ctx.restore();
};

const renderRazorBody = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facing: string,
  renderDetails: boolean
) => {
  // === TACTICAL CYBER SUIT ===
  
  // Carbon fiber base with hexagon texture
  const suitColor = '#1a1a1a';
  ctx.fillStyle = suitColor;
  
  // Torso
  const torsoX = x + width * 0.25;
  const torsoY = y + height * 0.25;
  const torsoWidth = width * 0.5;
  const torsoHeight = height * 0.45;
  
  ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight);
  
  if (renderDetails) {
    // Hexagon texture pattern
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 1;
    const hexSize = width * 0.04;
    
    for (let hx = 0; hx < torsoWidth; hx += hexSize * 1.5) {
      for (let hy = 0; hy < torsoHeight; hy += hexSize * 1.3) {
        const centerX = torsoX + hx;
        const centerY = torsoY + hy;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hX = centerX + hexSize * Math.cos(angle);
          const hY = centerY + hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(hX, hY);
          else ctx.lineTo(hX, hY);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // === ARMOR PLATES ===
  const armorColor = '#2a2a2a';
  
  // Shoulder plates
  const shoulders = [
    { x: torsoX - width * 0.08, y: torsoY },
    { x: torsoX + torsoWidth - width * 0.04, y: torsoY }
  ];
  
  shoulders.forEach(shoulder => {
    // Layered plates
    for (let i = 0; i < 3; i++) {
      const plateY = shoulder.y + i * height * 0.06;
      ctx.fillStyle = i === 0 ? '#3a3a3a' : armorColor;
      
      ctx.beginPath();
      ctx.moveTo(shoulder.x, plateY);
      ctx.lineTo(shoulder.x + width * 0.12, plateY);
      ctx.lineTo(shoulder.x + width * 0.1, plateY + height * 0.05);
      ctx.lineTo(shoulder.x - width * 0.02, plateY + height * 0.05);
      ctx.closePath();
      ctx.fill();
      
      if (renderDetails) {
        // Beveled edges
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  });
  
  // Chest plate
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.3, torsoY + torsoHeight * 0.1);
  ctx.lineTo(torsoX + torsoWidth * 0.7, torsoY + torsoHeight * 0.1);
  ctx.lineTo(torsoX + torsoWidth * 0.8, torsoY + torsoHeight * 0.5);
  ctx.lineTo(torsoX + torsoWidth * 0.2, torsoY + torsoHeight * 0.5);
  ctx.closePath();
  ctx.fill();
  
  if (renderDetails) {
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  // Thigh armor plates
  const thighPlates = [
    { x: x + width * 0.28, y: y + height * 0.65 },
    { x: x + width * 0.58, y: y + height * 0.65 }
  ];
  
  thighPlates.forEach(plate => {
    ctx.fillStyle = armorColor;
    ctx.fillRect(plate.x, plate.y, width * 0.14, height * 0.2);
    
    if (renderDetails) {
      // Beveled edge highlight
      ctx.strokeStyle = '#4a4a4a';
      ctx.lineWidth = 2;
      ctx.strokeRect(plate.x, plate.y, width * 0.14, height * 0.2);
    }
  });

  // === LED STRIPS (Pulsing) ===
  if (renderDetails) {
    const ledPulse = 0.6 + Math.sin(Date.now() * 0.003) * 0.4;
    const ledColors = ['#ff00ff', '#00ffff'];
    const currentLED = Math.floor(Date.now() * 0.002) % 2;
    
    ctx.shadowColor = ledColors[currentLED];
    ctx.shadowBlur = 10;
    
    // Seam lines with alternating colors
    const seams = [
      { x1: torsoX, y1: torsoY + torsoHeight * 0.5, x2: torsoX + torsoWidth, y2: torsoY + torsoHeight * 0.5 },
      { x1: torsoX + torsoWidth * 0.5, y1: torsoY, x2: torsoX + torsoWidth * 0.5, y2: torsoY + torsoHeight },
      { x1: x + width * 0.3, y1: y + height * 0.7, x2: x + width * 0.3, y2: y + height * 0.85 },
      { x1: x + width * 0.7, y1: y + height * 0.7, x2: x + width * 0.7, y2: y + height * 0.85 }
    ];
    
    seams.forEach((seam, i) => {
      ctx.strokeStyle = `rgba(${i % 2 === currentLED ? '255, 0, 255' : '0, 255, 255'}, ${ledPulse})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(seam.x1, seam.y1);
      ctx.lineTo(seam.x2, seam.y2);
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
  }

  // === GLOWING CIRCUITRY PATTERNS ===
  if (renderDetails) {
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ccff';
    ctx.shadowBlur = 6;
    
    // Body contour traces
    const traces = [
      // Chest curves
      { points: [
        { x: torsoX + torsoWidth * 0.2, y: torsoY + torsoHeight * 0.2 },
        { x: torsoX + torsoWidth * 0.3, y: torsoY + torsoHeight * 0.3 },
        { x: torsoX + torsoWidth * 0.4, y: torsoY + torsoHeight * 0.35 }
      ]},
      { points: [
        { x: torsoX + torsoWidth * 0.8, y: torsoY + torsoHeight * 0.2 },
        { x: torsoX + torsoWidth * 0.7, y: torsoY + torsoHeight * 0.3 },
        { x: torsoX + torsoWidth * 0.6, y: torsoY + torsoHeight * 0.35 }
      ]}
    ];
    
    traces.forEach(trace => {
      ctx.beginPath();
      ctx.moveTo(trace.points[0].x, trace.points[0].y);
      for (let i = 1; i < trace.points.length; i++) {
        ctx.lineTo(trace.points[i].x, trace.points[i].y);
      }
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
  }

  // === FLEXIBLE MATERIAL AT JOINTS ===
  const jointColor = '#0a0a0a';
  
  // Elbows
  const elbows = [
    { x: x + width * 0.18, y: y + height * 0.4 },
    { x: x + width * 0.75, y: y + height * 0.4 }
  ];
  
  elbows.forEach(elbow => {
    ctx.fillStyle = jointColor;
    ctx.fillRect(elbow.x, elbow.y, width * 0.08, height * 0.08);
    
    if (renderDetails) {
      // Ribbing texture
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const ribY = elbow.y + (height * 0.08 * i / 5);
        ctx.beginPath();
        ctx.moveTo(elbow.x, ribY);
        ctx.lineTo(elbow.x + width * 0.08, ribY);
        ctx.stroke();
      }
    }
  });
  
  // Knees
  const knees = [
    { x: x + width * 0.28, y: y + height * 0.78 },
    { x: x + width * 0.58, y: y + height * 0.78 }
  ];
  
  knees.forEach(knee => {
    ctx.fillStyle = jointColor;
    ctx.fillRect(knee.x, knee.y, width * 0.14, height * 0.08);
    
    if (renderDetails) {
      // Ribbing
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const ribY = knee.y + (height * 0.08 * i / 5);
        ctx.beginPath();
        ctx.moveTo(knee.x, ribY);
        ctx.lineTo(knee.x + width * 0.14, ribY);
        ctx.stroke();
      }
    }
  });

  // === HELMET/MASK ===
  const headX = x + width * 0.5;
  const headY = y + height * 0.12;
  const headWidth = width * 0.3;
  const headHeight = height * 0.18;
  
  // Helmet base
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(headX - headWidth / 2, headY, headWidth, headHeight);
  
  if (renderDetails) {
    // Visor - reflective dark surface
    const visorY = headY + headHeight * 0.3;
    const visorHeight = headHeight * 0.3;
    
    const visorGradient = ctx.createLinearGradient(
      headX - headWidth / 2, visorY,
      headX + headWidth / 2, visorY + visorHeight
    );
    visorGradient.addColorStop(0, '#0a0a0a');
    visorGradient.addColorStop(0.5, '#1a1a2a');
    visorGradient.addColorStop(1, '#0a0a0a');
    
    ctx.fillStyle = visorGradient;
    ctx.fillRect(headX - headWidth * 0.4, visorY, headWidth * 0.8, visorHeight);
    
    // HUD overlay (targeting reticle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    
    const reticleX = headX;
    const reticleY = visorY + visorHeight / 2;
    const reticleSize = headWidth * 0.15;
    
    // Crosshair
    ctx.beginPath();
    ctx.moveTo(reticleX - reticleSize, reticleY);
    ctx.lineTo(reticleX + reticleSize, reticleY);
    ctx.moveTo(reticleX, reticleY - reticleSize);
    ctx.lineTo(reticleX, reticleY + reticleSize);
    ctx.stroke();
    
    // Circle
    ctx.beginPath();
    ctx.arc(reticleX, reticleY, reticleSize * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    
    // Mouth guard with vents
    const mouthY = headY + headHeight * 0.7;
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(headX - headWidth * 0.3, mouthY, headWidth * 0.6, headHeight * 0.2);
    
    // Vent lines
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const ventX = headX - headWidth * 0.25 + (headWidth * 0.5 * i / 6);
      ctx.beginPath();
      ctx.moveTo(ventX, mouthY);
      ctx.lineTo(ventX, mouthY + headHeight * 0.2);
      ctx.stroke();
    }
    
    // Breathing LED (cyan pulse)
    const breathPulse = 0.4 + Math.sin(Date.now() * 0.004) * 0.4;
    drawGlow(ctx, headX, mouthY + headHeight * 0.1, headWidth * 0.05, '#00ffff', breathPulse);
    
    // Ear guards (angled armor)
    const earGuards = [
      { x: headX - headWidth * 0.55, y: headY + headHeight * 0.4 },
      { x: headX + headWidth * 0.35, y: headY + headHeight * 0.4 }
    ];
    
    earGuards.forEach(guard => {
      ctx.fillStyle = '#2a2a2a';
      ctx.beginPath();
      ctx.moveTo(guard.x, guard.y);
      ctx.lineTo(guard.x + width * 0.08, guard.y - height * 0.03);
      ctx.lineTo(guard.x + width * 0.08, guard.y + height * 0.08);
      ctx.lineTo(guard.x, guard.y + height * 0.05);
      ctx.closePath();
      ctx.fill();
    });
    
    // Neck guard (overlapping segments)
    const neckY = headY + headHeight;
    for (let i = 0; i < 3; i++) {
      const segmentY = neckY + i * height * 0.02;
      ctx.fillStyle = i % 2 === 0 ? '#2a2a2a' : '#1a1a1a';
      ctx.fillRect(headX - headWidth * 0.3, segmentY, headWidth * 0.6, height * 0.025);
    }
  }

  // === GLOWING EYES (Crosshair Pupils) ===
  if (renderDetails) {
    const eyeY = headY + headHeight * 0.45;
    const eyes = [
      { x: headX - headWidth * 0.2, y: eyeY },
      { x: headX + headWidth * 0.2, y: eyeY }
    ];
    
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    
    eyes.forEach(eye => {
      // Eye glow
      drawGlow(ctx, eye.x, eye.y, headWidth * 0.12, '#ff00ff', 0.8);
      
      // Eye
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(eye.x, eye.y, headWidth * 0.06, 0, Math.PI * 2);
      ctx.fill();
      
      // Crosshair pupil
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(eye.x - headWidth * 0.04, eye.y);
      ctx.lineTo(eye.x + headWidth * 0.04, eye.y);
      ctx.moveTo(eye.x, eye.y - headWidth * 0.04);
      ctx.lineTo(eye.x, eye.y + headWidth * 0.04);
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
  }

  // === ARMS & LEGS ===
  ctx.fillStyle = '#1a1a1a';
  
  // Arms
  ctx.fillRect(x + width * 0.15, y + height * 0.3, width * 0.1, height * 0.35);
  ctx.fillRect(x + width * 0.75, y + height * 0.3, width * 0.1, height * 0.35);
  
  // Legs
  ctx.fillRect(x + width * 0.28, y + height * 0.7, width * 0.14, height * 0.3);
  ctx.fillRect(x + width * 0.58, y + height * 0.7, width * 0.14, height * 0.3);
};

const renderPlasmaKatana = (
  ctx: CanvasRenderingContext2D,
  fighter: Fighter,
  isAttacking: boolean
) => {
  const x = fighter.x;
  const y = fighter.y;
  const width = fighter.width;
  const height = fighter.height;
  const facing = fighter.facing;
  
  // Katana positioning
  const katanaHandleX = x + width * (facing === 'right' ? 0.8 : 0.2);
  const katanaHandleY = y + height * 0.5;
  
  const attackAngle = isAttacking ? -Math.PI / 4 : Math.PI / 6;
  const bladeLength = width * 0.8;
  
  const bladeTipX = katanaHandleX + Math.cos(attackAngle) * bladeLength * (facing === 'right' ? 1 : -1);
  const bladeTipY = katanaHandleY + Math.sin(attackAngle) * bladeLength;
  
  ctx.save();
  ctx.translate(katanaHandleX, katanaHandleY);
  ctx.rotate(attackAngle * (facing === 'right' ? 1 : -1));
  
  // === PLASMA BLADE ===
  // Outer glow (magenta)
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 20;
  
  ctx.strokeStyle = '#ff00ff';
  ctx.lineWidth = width * 0.03;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(bladeLength * (facing === 'right' ? 1 : -1), 0);
  ctx.stroke();
  
  // Inner bright edge
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = width * 0.015;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(bladeLength * (facing === 'right' ? 1 : -1), 0);
  ctx.stroke();
  
  ctx.shadowBlur = 0;
  
  // === HILT ===
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(-width * 0.08, -width * 0.02, width * 0.08, width * 0.04);
  
  // Wrapped grip texture
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const wrapX = -width * 0.08 + (width * 0.08 * i / 8);
    ctx.beginPath();
    ctx.moveTo(wrapX, -width * 0.02);
    ctx.lineTo(wrapX, width * 0.02);
    ctx.stroke();
  }
  
  // Circular guard
  const guardGradient = createMetallicShine(ctx, -width * 0.015, -width * 0.03, width * 0.03, width * 0.06);
  ctx.fillStyle = guardGradient;
  ctx.beginPath();
  ctx.arc(0, 0, width * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
  
  // === SCABBARD ON BACK ===
  if (!isAttacking) {
    const scabbardX = x + width * 0.45;
    const scabbardY = y + height * 0.3;
    const scabbardLength = width * 0.7;
    
    ctx.save();
    ctx.translate(scabbardX, scabbardY);
    ctx.rotate(Math.PI / 3);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, -width * 0.02, scabbardLength, width * 0.04);
    
    // Magnetic attachment points
    const attachPoints = [0.2, 0.5, 0.8];
    attachPoints.forEach(pos => {
      const attachX = scabbardLength * pos;
      drawGlow(ctx, attachX, 0, width * 0.02, '#00ffff', 0.5);
      
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(attachX, 0, width * 0.008, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
  
  // === LIGHT TRAILS (Motion Blur) ===
  if (isAttacking) {
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    
    // Trail behind blade
    for (let i = 0; i < 5; i++) {
      const trailAlpha = 0.3 * (1 - i / 5);
      const trailOffset = i * width * 0.05;
      const trailAngle = attackAngle + (i * 0.1);
      
      const trailX = katanaHandleX + Math.cos(trailAngle) * (bladeLength - trailOffset) * (facing === 'right' ? 1 : -1);
      const trailY = katanaHandleY + Math.sin(trailAngle) * (bladeLength - trailOffset);
      
      ctx.strokeStyle = `rgba(255, 0, 255, ${trailAlpha})`;
      ctx.lineWidth = width * 0.02;
      ctx.beginPath();
      ctx.moveTo(katanaHandleX, katanaHandleY);
      ctx.lineTo(trailX, trailY);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
};

const renderEnergySlashes = (
  ctx: CanvasRenderingContext2D,
  fighter: Fighter
) => {
  const x = fighter.x;
  const y = fighter.y;
  const width = fighter.width;
  const height = fighter.height;
  const facing = fighter.facing;
  
  // Energy arc slashes
  const slashCount = 3;
  for (let i = 0; i < slashCount; i++) {
    const slashX = x + width * (facing === 'right' ? 0.8 + i * 0.15 : 0.2 - i * 0.15);
    const slashY = y + height * (0.3 + i * 0.1);
    const slashLength = width * 0.3;
    const slashAngle = -Math.PI / 4 + i * 0.2;
    
    const arcAlpha = 0.6 - i * 0.15;
    
    ctx.save();
    ctx.translate(slashX, slashY);
    ctx.rotate(slashAngle * (facing === 'right' ? 1 : -1));
    
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    
    // Arc shape
    ctx.strokeStyle = `rgba(255, 0, 255, ${arcAlpha})`;
    ctx.lineWidth = width * 0.02;
    ctx.beginPath();
    ctx.arc(0, 0, slashLength, -Math.PI / 6, Math.PI / 6);
    ctx.stroke();
    
    // Inner bright line
    ctx.strokeStyle = `rgba(255, 255, 255, ${arcAlpha * 0.8})`;
    ctx.lineWidth = width * 0.01;
    ctx.beginPath();
    ctx.arc(0, 0, slashLength, -Math.PI / 6, Math.PI / 6);
    ctx.stroke();
    
    ctx.restore();
  }
  
  ctx.shadowBlur = 0;
};
