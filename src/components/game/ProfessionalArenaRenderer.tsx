export const renderProfessionalArena = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Sky gradient - sunset Jamaica vibes
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGradient.addColorStop(0, '#FF6B35'); // Orange sunset
  skyGradient.addColorStop(0.3, '#F7931E'); // Golden hour
  skyGradient.addColorStop(0.6, '#1E3A8A'); // Deep blue
  skyGradient.addColorStop(1, '#0F172A'); // Dark night
  
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.6);
  
  // Ground - concrete street
  const groundGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
  groundGradient.addColorStop(0, '#4B5563'); // Dark concrete
  groundGradient.addColorStop(0.5, '#374151'); // Street
  groundGradient.addColorStop(1, '#1F2937'); // Shadow
  
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);
  
  // Street lines
  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 10]);
  ctx.beginPath();
  ctx.moveTo(0, height * 0.75);
  ctx.lineTo(width, height * 0.75);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Background buildings silhouette
  drawKingstonSkyline(ctx, width, height);
  
  // Crowd silhouettes
  drawCrowdSilhouettes(ctx, width, height);
  
  // Stage lighting effects
  drawStageLighting(ctx, width, height);
  
  // Neon signs and street elements
  drawStreetElements(ctx, width, height);
};

const drawKingstonSkyline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const buildings = [
    { x: 0, y: height * 0.4, width: width * 0.15, height: height * 0.2 },
    { x: width * 0.12, y: height * 0.35, width: width * 0.18, height: height * 0.25 },
    { x: width * 0.25, y: height * 0.3, width: width * 0.12, height: height * 0.3 },
    { x: width * 0.35, y: height * 0.38, width: width * 0.15, height: height * 0.22 },
    { x: width * 0.48, y: height * 0.32, width: width * 0.14, height: height * 0.28 },
    { x: width * 0.6, y: height * 0.36, width: width * 0.16, height: height * 0.24 },
    { x: width * 0.74, y: height * 0.31, width: width * 0.13, height: height * 0.29 },
    { x: width * 0.85, y: height * 0.39, width: width * 0.15, height: height * 0.21 },
  ];
  
  ctx.fillStyle = '#1F2937';
  buildings.forEach(building => {
    ctx.fillRect(building.x, building.y, building.width, building.height);
    
    // Add windows
    const windowRows = Math.floor(building.height / 20);
    const windowCols = Math.floor(building.width / 15);
    
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        if (Math.random() > 0.3) {
          ctx.fillStyle = Math.random() > 0.7 ? '#FCD34D' : '#374151';
          ctx.fillRect(
            building.x + col * 15 + 3,
            building.y + row * 20 + 3,
            8, 12
          );
        }
      }
    }
    ctx.fillStyle = '#1F2937';
  });
};

const drawCrowdSilhouettes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Left side crowd
  ctx.fillStyle = '#0F172A';
  for (let i = 0; i < 20; i++) {
    const x = i * 15 - 10;
    const crowdHeight = 40 + Math.random() * 30;
    ctx.fillRect(x, height * 0.6 - crowdHeight, 12, crowdHeight);
  }
  
  // Right side crowd
  for (let i = 0; i < 20; i++) {
    const x = width - (i * 15) - 40;
    const crowdHeight = 40 + Math.random() * 30;
    ctx.fillRect(x, height * 0.6 - crowdHeight, 12, crowdHeight);
  }
};

const drawStageLighting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Spotlight effects
  const spotlights = [
    { x: width * 0.3, color: '#FCD34D' },
    { x: width * 0.7, color: '#F87171' },
  ];
  
  spotlights.forEach(spotlight => {
    const gradient = ctx.createRadialGradient(
      spotlight.x, height * 0.1, 0,
      spotlight.x, height * 0.7, width * 0.3
    );
    gradient.addColorStop(0, spotlight.color + '40');
    gradient.addColorStop(0.5, spotlight.color + '20');
    gradient.addColorStop(1, spotlight.color + '00');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });
};

const drawStreetElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Neon sign (left)
  ctx.fillStyle = '#EC4899';
  ctx.fillRect(50, height * 0.4, 80, 40);
  ctx.fillStyle = '#F9A8D4';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('FIGHT', 55, height * 0.4 + 25);
  
  // Neon sign (right)
  ctx.fillStyle = '#06B6D4';
  ctx.fillRect(width - 130, height * 0.35, 80, 40);
  ctx.fillStyle = '#67E8F9';
  ctx.fillText('CLUB', width - 125, height * 0.35 + 25);
  
  // Street lamps
  const lampPositions = [width * 0.2, width * 0.8];
  lampPositions.forEach(x => {
    // Lamp post
    ctx.fillStyle = '#374151';
    ctx.fillRect(x - 3, height * 0.6, 6, -height * 0.25);
    
    // Lamp light
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(x, height * 0.35, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Light glow
    const glow = ctx.createRadialGradient(x, height * 0.35, 0, x, height * 0.35, 50);
    glow.addColorStop(0, '#FCD34D60');
    glow.addColorStop(1, '#FCD34D00');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, height * 0.35, 50, 0, Math.PI * 2);
    ctx.fill();
  });
};