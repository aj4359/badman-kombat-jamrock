/**
 * Authentic 1970s Kingston Street Stage Renderer
 * Renders directly on canvas with authentic Jamaica vibe
 */

export const renderLate70sKingstonStage = (
  ctx: CanvasRenderingContext2D,
  time: number,
  cameraShake: { x: number; y: number }
) => {
  const width = 1024;
  const height = 576;
  
  // 1. SUNSET SKY GRADIENT
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGradient.addColorStop(0, '#FF6B35');    // Orange sunset
  skyGradient.addColorStop(0.4, '#F7931E'); // Golden hour
  skyGradient.addColorStop(0.7, '#C74B9B'); // Purple horizon
  skyGradient.addColorStop(1, '#2A2D5A');   // Deep purple
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.6);
  
  // 2. BACKGROUND BUILDINGS (Far layer)
  ctx.save();
  ctx.fillStyle = '#1a1a2e';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  
  // Zinc-roof shacks
  for (let i = 0; i < 5; i++) {
    const x = i * 220 - 20;
    const buildingHeight = 80 + Math.random() * 40;
    ctx.fillRect(x, height * 0.4 - buildingHeight, 200, buildingHeight);
    
    // Corrugated roof
    ctx.fillStyle = '#666';
    for (let j = 0; j < 10; j++) {
      ctx.fillRect(x + j * 20, height * 0.4 - buildingHeight - 5, 18, 5);
    }
    ctx.fillStyle = '#1a1a2e';
    
    // Windows (some lit, some dark)
    const isLit = Math.random() > 0.5;
    ctx.fillStyle = isLit ? '#FFD700' : '#0a0a0a';
    ctx.fillRect(x + 60, height * 0.4 - buildingHeight + 20, 30, 25);
    ctx.fillRect(x + 110, height * 0.4 - buildingHeight + 20, 30, 25);
  }
  ctx.restore();
  
  // 3. RASTAFARI MURALS
  ctx.save();
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 4;
  ctx.fillText('ONE LOVE', 120, height * 0.35);
  
  ctx.fillStyle = '#FF0000';
  ctx.fillText('JAH LIVE', width - 240, height * 0.38);
  ctx.restore();
  
  // 4. PALM TREES (Swaying animation)
  const sway = Math.sin(time * 0.001) * 3;
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const x = i * 400 + 100;
    const y = height * 0.42;
    
    // Trunk
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + sway, y - 50, x + sway * 1.5, y - 100);
    ctx.stroke();
    
    // Palm fronds
    ctx.fillStyle = '#228B22';
    for (let j = 0; j < 5; j++) {
      const angle = (j * Math.PI * 2) / 5;
      ctx.save();
      ctx.translate(x + sway * 1.5, y - 100);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -20, 8, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
  
  // 5. 1970s CARS (Parked on street)
  ctx.save();
  // Morris Marina
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(50, height * 0.52, 120, 40);
  ctx.fillRect(60, height * 0.48, 100, 15);
  // Wheels
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(75, height * 0.52 + 40, 12, 0, Math.PI * 2);
  ctx.arc(155, height * 0.52 + 40, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Toyota Corolla
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(width - 170, height * 0.52, 120, 40);
  ctx.fillRect(width - 160, height * 0.48, 100, 15);
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(width - 155, height * 0.52 + 40, 12, 0, Math.PI * 2);
  ctx.arc(width - 75, height * 0.52 + 40, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  // 6. NEON SIGNS (Flickering)
  ctx.save();
  const flicker = Math.random() > 0.9 ? 0.5 : 1;
  
  // "IRIE VIBES" neon sign
  ctx.shadowColor = '#00FF00';
  ctx.shadowBlur = 20 * flicker;
  ctx.fillStyle = `rgba(0, 255, 0, ${0.8 * flicker})`;
  ctx.font = 'bold 20px Arial';
  ctx.fillText('IRIE VIBES', 250, height * 0.42);
  
  // "SOUND SYSTEM" neon sign
  ctx.shadowColor = '#FF00FF';
  ctx.shadowBlur = 20 * flicker;
  ctx.fillStyle = `rgba(255, 0, 255, ${0.8 * flicker})`;
  ctx.fillText('SOUND SYSTEM', width - 350, height * 0.45);
  ctx.restore();
  
  // 7. CROWD SILHOUETTES (Animated)
  ctx.save();
  const bobAmount = Math.sin(time * 0.003) * 2;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  
  for (let i = 0; i < 12; i++) {
    const x = i * 90 + 20;
    const y = height * 0.58 + bobAmount * (i % 2 === 0 ? 1 : -1);
    const headSize = 15 + Math.random() * 5;
    
    // Head (some with afros)
    const isAfro = i % 3 === 0;
    ctx.beginPath();
    ctx.arc(x, y, headSize * (isAfro ? 1.4 : 1), 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.fillRect(x - 10, y + headSize, 20, 30);
    
    // Raised fist occasionally
    if (i % 4 === 0) {
      ctx.fillRect(x - 20, y + 10, 8, 20);
      ctx.beginPath();
      ctx.arc(x - 20, y + 10, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  
  // 8. GROUND PLANE (Cracked asphalt)
  const groundY = height * 0.65;
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, groundY, width, height - groundY);
  
  // Cracks
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, groundY + 20);
  ctx.lineTo(180, groundY + 60);
  ctx.moveTo(300, groundY + 10);
  ctx.lineTo(420, groundY + 70);
  ctx.moveTo(600, groundY + 30);
  ctx.lineTo(750, groundY + 50);
  ctx.stroke();
  
  // Yellow street markings (faded)
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 10]);
  ctx.beginPath();
  ctx.moveTo(0, groundY + 40);
  ctx.lineTo(width, groundY + 40);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Puddles (rain reflections)
  ctx.fillStyle = 'rgba(100, 100, 120, 0.4)';
  ctx.beginPath();
  ctx.ellipse(200, groundY + 60, 40, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(700, groundY + 50, 50, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Litter details
  ctx.fillStyle = '#654321';
  ctx.fillRect(150, groundY + 70, 8, 12); // Bottle
  ctx.fillStyle = '#fff';
  ctx.fillRect(450, groundY + 65, 15, 8); // Wrapper
  
  // 9. STREET LAMP LIGHTING
  ctx.save();
  const lampGlow = ctx.createRadialGradient(100, groundY - 20, 10, 100, groundY - 20, 150);
  lampGlow.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
  lampGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = lampGlow;
  ctx.fillRect(0, groundY - 100, 200, 100);
  
  const lampGlow2 = ctx.createRadialGradient(width - 100, groundY - 20, 10, width - 100, groundY - 20, 150);
  lampGlow2.addColorStop(0, 'rgba(255, 100, 100, 0.3)');
  lampGlow2.addColorStop(1, 'rgba(255, 100, 100, 0)');
  ctx.fillStyle = lampGlow2;
  ctx.fillRect(width - 200, groundY - 100, 200, 100);
  ctx.restore();
  
  // 10. GROUND SHADOW (for fighter depth)
  const shadowGradient = ctx.createLinearGradient(0, height - 80, 0, height);
  shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(0, height - 80, width, 80);
};
