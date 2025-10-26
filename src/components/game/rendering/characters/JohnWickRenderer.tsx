import { Fighter } from '@/types/gameTypes';
import { createMetallicShine, drawGlow, drawShadow } from '../utils/ShaderEffects';

export const renderJohnWick = (
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

  const isAttacking = fighter.state.current === 'attacking';
  const healthPercent = (fighter.health || 100) / 100;
  
  // === HEAD & FACIAL FEATURES ===
  const headX = x + width * 0.5;
  const headY = y + height * 0.14;
  const headRadius = width * 0.14;
  
  // Skin tone
  const skinTone = '#d4a574';
  const skinShadow = '#b8936e';
  
  // Face base
  const faceGradient = ctx.createRadialGradient(
    headX - headRadius * 0.3, headY - headRadius * 0.3, 0,
    headX, headY, headRadius
  );
  faceGradient.addColorStop(0, skinTone);
  faceGradient.addColorStop(1, skinShadow);
  
  ctx.fillStyle = faceGradient;
  ctx.beginPath();
  ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Strong jawline
  ctx.fillStyle = skinShadow;
  ctx.beginPath();
  ctx.moveTo(headX - headRadius * 0.7, headY + headRadius * 0.3);
  ctx.lineTo(headX - headRadius * 0.5, headY + headRadius * 0.8);
  ctx.lineTo(headX, headY + headRadius * 0.9);
  ctx.lineTo(headX + headRadius * 0.5, headY + headRadius * 0.8);
  ctx.lineTo(headX + headRadius * 0.7, headY + headRadius * 0.3);
  ctx.arc(headX, headY, headRadius * 0.7, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  
  // High cheekbones
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(headX - headRadius * 0.5, headY + headRadius * 0.1, headRadius * 0.15, headRadius * 0.2, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headX + headRadius * 0.5, headY + headRadius * 0.1, headRadius * 0.15, headRadius * 0.2, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Defined brow ridge
  ctx.fillStyle = skinShadow;
  ctx.fillRect(headX - headRadius * 0.7, headY - headRadius * 0.3, headRadius * 1.4, headRadius * 0.15);
  
  // Beard stubble texture
  ctx.fillStyle = '#3a3a3a';
  for (let i = 0; i < 100; i++) {
    const stubbleX = headX + (Math.random() - 0.5) * headRadius * 1.4;
    const stubbleY = headY + headRadius * 0.3 + Math.random() * headRadius * 0.6;
    const distFromCenter = Math.sqrt(Math.pow(stubbleX - headX, 2) + Math.pow(stubbleY - headY, 2));
    
    if (distFromCenter < headRadius * 0.85) {
      ctx.beginPath();
      ctx.arc(stubbleX, stubbleY, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Intense eyes
  const eyes = [
    { x: headX - headRadius * 0.35, y: headY - headRadius * 0.1 },
    { x: headX + headRadius * 0.35, y: headY - headRadius * 0.1 }
  ];
  
  eyes.forEach(eye => {
    // Eye white
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(eye.x, eye.y, headRadius * 0.12, headRadius * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dark iris
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, headRadius * 0.06, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, headRadius * 0.03, 0, Math.PI * 2);
    ctx.fill();
    
    // Bags under eyes (battle-worn)
    ctx.strokeStyle = 'rgba(100, 70, 50, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(eye.x, eye.y + headRadius * 0.12, headRadius * 0.12, 0, Math.PI);
    ctx.stroke();
  });
  
  // Eyebrows
  const expression = isAttacking ? 'angry' : 'focused';
  const eyebrowAngle = expression === 'angry' ? -0.3 : -0.1;
  
  ctx.fillStyle = '#2a2a2a';
  ctx.save();
  
  // Left eyebrow
  ctx.translate(headX - headRadius * 0.35, headY - headRadius * 0.25);
  ctx.rotate(eyebrowAngle);
  ctx.fillRect(-headRadius * 0.15, 0, headRadius * 0.3, headRadius * 0.05);
  ctx.restore();
  
  ctx.save();
  // Right eyebrow
  ctx.translate(headX + headRadius * 0.35, headY - headRadius * 0.25);
  ctx.rotate(-eyebrowAngle);
  ctx.fillRect(-headRadius * 0.15, 0, headRadius * 0.3, headRadius * 0.05);
  ctx.restore();
  
  // Scar on right cheek
  ctx.strokeStyle = 'rgba(150, 100, 80, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(headX + headRadius * 0.3, headY + headRadius * 0.1);
  ctx.lineTo(headX + headRadius * 0.25, headY + headRadius * 0.4);
  ctx.stroke();
  
  // Hair (medium length, swept back)
  const hairColor = '#2a1a0a';
  ctx.fillStyle = hairColor;
  
  // Back hair mass
  ctx.beginPath();
  ctx.ellipse(headX, headY - headRadius * 0.5, headRadius * 0.9, headRadius * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Front hair strands (swept back)
  for (let i = 0; i < 12; i++) {
    const strandAngle = (i - 6) * 0.15;
    const strandStartX = headX + Math.sin(strandAngle) * headRadius * 0.7;
    const strandStartY = headY - headRadius * 0.8;
    const strandEndX = strandStartX + Math.sin(strandAngle) * headRadius * 0.3;
    const strandEndY = headY - headRadius * 0.3;
    
    ctx.strokeStyle = hairColor;
    ctx.lineWidth = headRadius * 0.08;
    ctx.beginPath();
    ctx.moveTo(strandStartX, strandStartY);
    ctx.quadraticCurveTo(
      strandStartX + Math.sin(strandAngle) * headRadius * 0.15,
      strandStartY + headRadius * 0.25,
      strandEndX,
      strandEndY
    );
    ctx.stroke();
  }
  
  // Sweat (during combat)
  if (healthPercent < 0.7) {
    const sweatCount = Math.floor((1 - healthPercent) * 8);
    ctx.fillStyle = 'rgba(200, 220, 255, 0.6)';
    
    for (let i = 0; i < sweatCount; i++) {
      const sweatX = headX + (Math.random() - 0.5) * headRadius * 1.2;
      const sweatY = headY - headRadius * 0.2 + Math.random() * headRadius * 0.4;
      ctx.beginPath();
      ctx.arc(sweatX, sweatY, headRadius * 0.03, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // === THE ICONIC SUIT ===
  const torsoX = x + width * 0.27;
  const torsoY = y + height * 0.28;
  const torsoWidth = width * 0.46;
  const torsoHeight = height * 0.42;
  
  // Vest (underneath, visible at jacket opening)
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(torsoX + torsoWidth * 0.25, torsoY, torsoWidth * 0.5, torsoHeight * 0.8);
  
  // Vest buttons
  for (let i = 0; i < 4; i++) {
    const buttonY = torsoY + torsoHeight * (0.15 + i * 0.2);
    const buttonGradient = createMetallicShine(
      ctx,
      torsoX + torsoWidth * 0.45,
      buttonY,
      width * 0.015,
      width * 0.015
    );
    ctx.fillStyle = buttonGradient;
    ctx.beginPath();
    ctx.arc(torsoX + torsoWidth * 0.48, buttonY, width * 0.008, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // White dress shirt (collar visible)
  ctx.fillStyle = '#f5f5f5';
  
  // Collar
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.3, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.2, torsoY + torsoHeight * 0.12);
  ctx.lineTo(torsoX + torsoWidth * 0.35, torsoY + torsoHeight * 0.12);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.7, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.8, torsoY + torsoHeight * 0.12);
  ctx.lineTo(torsoX + torsoWidth * 0.65, torsoY + torsoHeight * 0.12);
  ctx.closePath();
  ctx.fill();
  
  // Shirt buttons (barely visible)
  ctx.fillStyle = '#e5e5e5';
  for (let i = 0; i < 3; i++) {
    const shirtButtonY = torsoY + torsoHeight * (0.15 + i * 0.15);
    ctx.beginPath();
    ctx.arc(torsoX + torsoWidth * 0.48, shirtButtonY, width * 0.006, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Black tie with Windsor knot
  ctx.fillStyle = '#0a0a0a';
  
  // Knot
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.48, torsoY + torsoHeight * 0.08);
  ctx.lineTo(torsoX + torsoWidth * 0.4, torsoY + torsoHeight * 0.18);
  ctx.lineTo(torsoX + torsoWidth * 0.48, torsoY + torsoHeight * 0.22);
  ctx.lineTo(torsoX + torsoWidth * 0.56, torsoY + torsoHeight * 0.18);
  ctx.closePath();
  ctx.fill();
  
  // Tie body
  ctx.fillRect(
    torsoX + torsoWidth * 0.45,
    torsoY + torsoHeight * 0.22,
    torsoWidth * 0.08,
    torsoHeight * 0.5
  );
  
  // Tie clip (silver)
  const clipGradient = createMetallicShine(
    ctx,
    torsoX + torsoWidth * 0.43,
    torsoY + torsoHeight * 0.4,
    torsoWidth * 0.12,
    torsoHeight * 0.02
  );
  ctx.fillStyle = clipGradient;
  ctx.fillRect(
    torsoX + torsoWidth * 0.43,
    torsoY + torsoHeight * 0.4,
    torsoWidth * 0.12,
    torsoHeight * 0.02
  );
  
  // Suit jacket (black with subtle pinstripe)
  ctx.fillStyle = '#0a0a0a';
  
  // Left lapel
  ctx.beginPath();
  ctx.moveTo(torsoX, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.15, torsoY + torsoHeight * 0.3);
  ctx.lineTo(torsoX + torsoWidth * 0.35, torsoY + torsoHeight * 0.3);
  ctx.lineTo(torsoX + torsoWidth * 0.25, torsoY);
  ctx.closePath();
  ctx.fill();
  
  // Right lapel
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth, torsoY);
  ctx.lineTo(torsoX + torsoWidth * 0.85, torsoY + torsoHeight * 0.3);
  ctx.lineTo(torsoX + torsoWidth * 0.65, torsoY + torsoHeight * 0.3);
  ctx.lineTo(torsoX + torsoWidth * 0.75, torsoY);
  ctx.closePath();
  ctx.fill();
  
  // Lapel sheen
  ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(torsoX + torsoWidth * 0.2, torsoY + torsoHeight * 0.05);
  ctx.lineTo(torsoX + torsoWidth * 0.25, torsoY + torsoHeight * 0.25);
  ctx.stroke();
  
  // Jacket body
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(torsoX, torsoY + torsoHeight * 0.3, torsoWidth * 0.35, torsoHeight * 0.7);
  ctx.fillRect(torsoX + torsoWidth * 0.65, torsoY + torsoHeight * 0.3, torsoWidth * 0.35, torsoHeight * 0.7);
  
  // Pinstripe texture (very subtle)
  ctx.strokeStyle = 'rgba(40, 40, 40, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 15; i++) {
    const stripeX = torsoX + (torsoWidth * i / 15);
    ctx.beginPath();
    ctx.moveTo(stripeX, torsoY);
    ctx.lineTo(stripeX, torsoY + torsoHeight);
    ctx.stroke();
  }
  
  // Jacket buttons (4 on front)
  for (let i = 0; i < 4; i++) {
    const jacketButtonY = torsoY + torsoHeight * (0.35 + i * 0.15);
    const buttonGradient = createMetallicShine(
      ctx,
      torsoX + torsoWidth * 0.3,
      jacketButtonY - width * 0.01,
      width * 0.02,
      width * 0.02
    );
    ctx.fillStyle = buttonGradient;
    ctx.beginPath();
    ctx.arc(torsoX + torsoWidth * 0.32, jacketButtonY, width * 0.01, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Pocket square (white)
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(
    torsoX + torsoWidth * 0.08,
    torsoY + torsoHeight * 0.15,
    torsoWidth * 0.12,
    torsoHeight * 0.08
  );
  
  // === COAT TAILS (Dynamic - flap during movement) ===
  const isMoving = fighter.velocityX !== 0 || Math.abs(fighter.velocityY || 0) > 0.1;
  const tailFlap = isMoving ? Math.sin(Date.now() * 0.01) * 0.15 : 0;
  
  const coatTails = [
    { x: torsoX + torsoWidth * 0.1, baseAngle: 0.2 },
    { x: torsoX + torsoWidth * 0.7, baseAngle: -0.2 }
  ];
  
  coatTails.forEach((tail, index) => {
    const tailAngle = tail.baseAngle + (index === 0 ? tailFlap : -tailFlap);
    
    ctx.save();
    ctx.translate(tail.x, torsoY + torsoHeight);
    ctx.rotate(tailAngle);
    
    // Tail segments (6 per tail)
    const segmentHeight = height * 0.08;
    for (let i = 0; i < 6; i++) {
      const segmentY = i * segmentHeight;
      const segmentWidth = torsoWidth * 0.18 * (1 - i * 0.08);
      
      ctx.fillStyle = i % 2 === 0 ? '#0a0a0a' : '#050505';
      ctx.fillRect(-segmentWidth / 2, segmentY, segmentWidth, segmentHeight);
    }
    
    ctx.restore();
  });
  
  // === ARMS ===
  const armColor = '#0a0a0a';
  
  // Left arm
  ctx.fillStyle = armColor;
  ctx.fillRect(x + width * 0.12, y + height * 0.3, width * 0.12, height * 0.35);
  
  // Sleeve wrinkle at elbow
  ctx.strokeStyle = 'rgba(30, 30, 30, 0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x + width * 0.12, y + height * 0.45 + i * 3);
    ctx.lineTo(x + width * 0.24, y + height * 0.45 + i * 3);
    ctx.stroke();
  }
  
  // Right arm
  ctx.fillStyle = armColor;
  ctx.fillRect(x + width * 0.76, y + height * 0.3, width * 0.12, height * 0.35);
  
  // Right sleeve wrinkle
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x + width * 0.76, y + height * 0.45 + i * 3);
    ctx.lineTo(x + width * 0.88, y + height * 0.45 + i * 3);
    ctx.stroke();
  }
  
  // === DRESS PANTS (Black) ===
  ctx.fillStyle = '#0a0a0a';
  
  // Left leg
  const leftLegX = x + width * 0.3;
  const legY = y + height * 0.7;
  const legWidth = width * 0.16;
  const legHeight = height * 0.3;
  
  ctx.fillRect(leftLegX, legY, legWidth, legHeight);
  
  // Crease line
  ctx.strokeStyle = 'rgba(50, 50, 50, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftLegX + legWidth * 0.5, legY);
  ctx.lineTo(leftLegX + legWidth * 0.5, legY + legHeight);
  ctx.stroke();
  
  // Right leg
  const rightLegX = x + width * 0.54;
  ctx.fillRect(rightLegX, legY, legWidth, legHeight);
  
  // Crease line
  ctx.beginPath();
  ctx.moveTo(rightLegX + legWidth * 0.5, legY);
  ctx.lineTo(rightLegX + legWidth * 0.5, legY + legHeight);
  ctx.stroke();
  
  // Belt (black leather with silver buckle)
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(torsoX, legY - height * 0.02, torsoWidth, height * 0.04);
  
  const buckleGradient = createMetallicShine(
    ctx,
    torsoX + torsoWidth * 0.42,
    legY - height * 0.025,
    torsoWidth * 0.16,
    height * 0.05
  );
  ctx.fillStyle = buckleGradient;
  ctx.fillRect(
    torsoX + torsoWidth * 0.42,
    legY - height * 0.025,
    torsoWidth * 0.16,
    height * 0.05
  );
  
  // Cuff at ankle
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(leftLegX, legY + legHeight - height * 0.03, legWidth, height * 0.03);
  ctx.fillRect(rightLegX, legY + legHeight - height * 0.03, legWidth, height * 0.03);
  
  // === DRESS SHOES (Oxford style) ===
  const shoes = [
    { x: leftLegX, y: legY + legHeight },
    { x: rightLegX, y: legY + legHeight }
  ];
  
  shoes.forEach(shoe => {
    // Shoe body (glossy black)
    const shoeGradient = ctx.createLinearGradient(
      shoe.x, shoe.y,
      shoe.x, shoe.y + height * 0.06
    );
    shoeGradient.addColorStop(0, '#1a1a1a');
    shoeGradient.addColorStop(0.5, '#0a0a0a');
    shoeGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = shoeGradient;
    ctx.fillRect(shoe.x, shoe.y, legWidth, height * 0.06);
    
    // Glossy shine (specular highlight)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(
      shoe.x + legWidth * 0.3,
      shoe.y + height * 0.02,
      legWidth * 0.15,
      height * 0.01,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Laces (subtle detail)
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const laceY = shoe.y + height * 0.01 + i * height * 0.012;
      ctx.beginPath();
      ctx.moveTo(shoe.x + legWidth * 0.3, laceY);
      ctx.lineTo(shoe.x + legWidth * 0.7, laceY);
      ctx.stroke();
    }
  });
  
  // === GUNS (Glock 26 / 1911) ===
  if (isAttacking) {
    renderGuns(ctx, fighter);
  } else {
    // Holster visible under jacket (slight bulge)
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(
      torsoX + torsoWidth * 0.75,
      torsoY + torsoHeight * 0.5,
      torsoWidth * 0.15,
      torsoHeight * 0.2
    );
  }
  
  // === COMBAT KNIFE (Boot sheath) ===
  const knifeX = leftLegX + legWidth * 0.8;
  const knifeY = legY + legHeight * 0.5;
  
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(knifeX, knifeY, width * 0.03, height * 0.15);
  
  // Knife handle (visible)
  const handleGradient = createMetallicShine(
    ctx,
    knifeX - width * 0.01,
    knifeY - height * 0.05,
    width * 0.05,
    height * 0.05
  );
  ctx.fillStyle = handleGradient;
  ctx.fillRect(knifeX - width * 0.01, knifeY - height * 0.05, width * 0.05, height * 0.05);
  
  // Tactical grip texture
  ctx.fillStyle = '#0a0a0a';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(
      knifeX,
      knifeY - height * 0.04 + i * height * 0.015,
      width * 0.03,
      height * 0.005
    );
  }

  ctx.restore();
};

const renderGuns = (
  ctx: CanvasRenderingContext2D,
  fighter: Fighter
) => {
  const x = fighter.x;
  const y = fighter.y;
  const width = fighter.width;
  const height = fighter.height;
  const facing = fighter.facing;
  
  // Gun positioning (center-axis-relock shooting position)
  const gunX = x + width * (facing === 'right' ? 0.65 : 0.35);
  const gunY = y + height * 0.45;
  const gunAngle = facing === 'right' ? -0.2 : 0.2;
  
  ctx.save();
  ctx.translate(gunX, gunY);
  ctx.rotate(gunAngle);
  
  // === GLOCK 26 (Compact) ===
  const gunLength = width * 0.25;
  const gunHeight = height * 0.08;
  
  // Slide
  const slideGradient = createMetallicShine(
    ctx, 0, -gunHeight * 0.6,
    gunLength * 0.85, gunHeight * 0.4
  );
  ctx.fillStyle = slideGradient;
  ctx.fillRect(0, -gunHeight * 0.6, gunLength * 0.85, gunHeight * 0.4);
  
  // Slide serrations
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 8; i++) {
    const serrationX = gunLength * 0.4 + i * gunLength * 0.05;
    ctx.fillRect(serrationX, -gunHeight * 0.6, gunLength * 0.02, gunHeight * 0.4);
  }
  
  // Frame (grip)
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, -gunHeight * 0.2, gunLength * 0.3, gunHeight);
  
  // Grip texture
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 6; i++) {
    const gripY = -gunHeight * 0.1 + i * gunHeight * 0.15;
    for (let j = 0; j < 4; j++) {
      const gripX = j * gunLength * 0.06;
      ctx.fillRect(gripX + 2, gripY, gunLength * 0.02, height * 0.01);
    }
  }
  
  // Trigger
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath();
  ctx.arc(gunLength * 0.2, gunHeight * 0.1, width * 0.015, 0, Math.PI * 2);
  ctx.fill();
  
  // Magazine base visible
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(gunLength * 0.05, gunHeight * 0.8, gunLength * 0.2, height * 0.04);
  
  // === MUZZLE FLASH ===
  drawGlow(ctx, gunLength * 0.85, -gunHeight * 0.4, width * 0.08, '#ffff00', 0.8);
  
  // Flash burst shape
  ctx.fillStyle = 'rgba(255, 255, 100, 0.9)';
  ctx.beginPath();
  ctx.moveTo(gunLength * 0.85, -gunHeight * 0.4);
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const radius = i % 2 === 0 ? width * 0.06 : width * 0.03;
    const flashX = gunLength * 0.85 + Math.cos(angle) * radius;
    const flashY = -gunHeight * 0.4 + Math.sin(angle) * radius;
    ctx.lineTo(flashX, flashY);
  }
  ctx.closePath();
  ctx.fill();
  
  // Smoke puff
  ctx.fillStyle = 'rgba(150, 150, 150, 0.4)';
  ctx.beginPath();
  ctx.arc(gunLength * 0.95, -gunHeight * 0.4, width * 0.04, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
  
  // === SHELL CASING EJECTION ===
  const casingX = gunX + Math.cos(gunAngle - Math.PI / 2) * width * 0.1;
  const casingY = gunY + Math.sin(gunAngle - Math.PI / 2) * width * 0.1;
  
  ctx.save();
  ctx.translate(casingX, casingY);
  ctx.rotate(Math.random() * Math.PI);
  
  // Brass casing
  const casingGradient = createMetallicShine(
    ctx, -width * 0.015, -height * 0.02,
    width * 0.03, height * 0.04
  );
  casingGradient.addColorStop(0, '#d4af37');
  casingGradient.addColorStop(1, '#b8922e');
  
  ctx.fillStyle = casingGradient;
  ctx.fillRect(-width * 0.015, -height * 0.02, width * 0.03, height * 0.04);
  
  ctx.restore();
  
  // === BULLET TRACER (Yellow line) ===
  const bulletEndX = gunX + Math.cos(gunAngle) * width * 2;
  const bulletEndY = gunY + Math.sin(gunAngle) * width * 2;
  
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.8)';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ffff00';
  ctx.shadowBlur = 10;
  
  ctx.beginPath();
  ctx.moveTo(gunX, gunY);
  ctx.lineTo(bulletEndX, bulletEndY);
  ctx.stroke();
  
  ctx.shadowBlur = 0;
};
