export const renderProfessionalHealthBars = (ctx: CanvasRenderingContext2D, canvasWidth: number, gameState: any) => {
  const barWidth = 350;
  const barHeight = 25;
  const barY = 25;
  const cornerRadius = 12;
  
  // Player 1 health bar (left)
  renderHealthBar(ctx, 30, barY, barWidth, barHeight, gameState.player1.health, 'left', cornerRadius);
  
  // Player 2 health bar (right)
  renderHealthBar(ctx, canvasWidth - 30 - barWidth, barY, barWidth, barHeight, gameState.player2.health, 'right', cornerRadius);
  
  // VS text in center
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('VS', canvasWidth / 2, barY + 18);
};

const renderHealthBar = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, health: number, side: 'left' | 'right', cornerRadius: number) => {
  // Background
  ctx.fillStyle = '#1F2937';
  roundRect(ctx, x, y, width, height, cornerRadius);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, width, height, cornerRadius);
  ctx.stroke();
  
  // Health fill
  const healthWidth = (width - 4) * (health / 100);
  const healthColor = health > 60 ? '#10B981' : health > 30 ? '#F59E0B' : '#EF4444';
  
  ctx.fillStyle = healthColor;
  if (side === 'left') {
    roundRect(ctx, x + 2, y + 2, healthWidth, height - 4, cornerRadius - 1);
  } else {
    roundRect(ctx, x + width - 2 - healthWidth, y + 2, healthWidth, height - 4, cornerRadius - 1);
  }
  ctx.fill();
  
  // Health glow effect
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, healthColor + '80');
  gradient.addColorStop(0.5, healthColor + '40');
  gradient.addColorStop(1, healthColor + '80');
  
  ctx.fillStyle = gradient;
  if (side === 'left') {
    roundRect(ctx, x + 2, y + 2, healthWidth, height - 4, cornerRadius - 1);
  } else {
    roundRect(ctx, x + width - 2 - healthWidth, y + 2, healthWidth, height - 4, cornerRadius - 1);
  }
  ctx.fill();
  
  // Health percentage text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(health)}%`, x + width / 2, y + height / 2 + 5);
};

export const renderFighterNames = (ctx: CanvasRenderingContext2D, canvasWidth: number, gameState: any) => {
  // Player 1 name (left)
  ctx.fillStyle = '#00FFFF';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(gameState.player1.name || 'Player 1', 30, 75);
  
  // Player 2 name (right)
  ctx.fillStyle = '#9966FF';
  ctx.textAlign = 'right';
  ctx.fillText(gameState.player2.name || 'Player 2', canvasWidth - 30, 75);
  
  // Round timer
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('99', canvasWidth / 2, 95);
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};