import React from 'react';

export interface StageConfig {
  name: string;
  backgroundColors: string[];
  foregroundElements: StageElement[];
  musicTrack?: string;
  ambientEffects?: AmbientEffect[];
}

interface StageElement {
  type: 'building' | 'object' | 'decoration';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  depth: number; // For parallax
}

interface AmbientEffect {
  type: 'particles' | 'lighting' | 'weather';
  config: any;
}

export const STAGE_CONFIGS: Record<string, StageConfig> = {
  kingston_street: {
    name: "Kingston Street",
    backgroundColors: [
      '#1a1a2e', // Night sky
      '#16213e',
      '#0f3460'
    ],
    foregroundElements: [
      // Buildings in background
      { type: 'building', x: 0, y: 100, width: 150, height: 200, color: '#2c2c54', depth: 3 },
      { type: 'building', x: 150, y: 80, width: 200, height: 220, color: '#40407a', depth: 3 },
      { type: 'building', x: 350, y: 90, width: 180, height: 210, color: '#2c2c54', depth: 3 },
      { type: 'building', x: 530, y: 70, width: 170, height: 230, color: '#40407a', depth: 3 },
      { type: 'building', x: 700, y: 85, width: 150, height: 215, color: '#2c2c54', depth: 3 },
      
      // Street level decorations
      { type: 'decoration', x: 100, y: 280, width: 20, height: 30, color: '#f39c12', depth: 1 }, // Street light
      { type: 'decoration', x: 300, y: 280, width: 20, height: 30, color: '#f39c12', depth: 1 },
      { type: 'decoration', x: 500, y: 280, width: 20, height: 30, color: '#f39c12', depth: 1 },
      { type: 'decoration', x: 700, y: 280, width: 20, height: 30, color: '#f39c12', depth: 1 },
      
      // Cars
      { type: 'object', x: 50, y: 290, width: 60, height: 20, color: '#e74c3c', depth: 1 },
      { type: 'object', x: 750, y: 290, width: 60, height: 20, color: '#3498db', depth: 1 },
    ],
    ambientEffects: [
      { type: 'particles', config: { type: 'neon_glow', count: 10 } },
      { type: 'lighting', config: { type: 'street_lights', intensity: 0.8 } }
    ]
  },
  
  beach_sunset: {
    name: "Seven Mile Beach",
    backgroundColors: [
      '#ff6b6b', // Sunset colors
      '#feca57',
      '#48dbfb'
    ],
    foregroundElements: [
      // Palm trees
      { type: 'decoration', x: 100, y: 180, width: 15, height: 120, color: '#8B4513', depth: 2 },
      { type: 'decoration', x: 700, y: 170, width: 15, height: 130, color: '#8B4513', depth: 2 },
      
      // Beach huts
      { type: 'building', x: 600, y: 200, width: 80, height: 100, color: '#ff9ff3', depth: 2 },
      { type: 'building', x: 50, y: 190, width: 90, height: 110, color: '#54a0ff', depth: 2 },
      
      // Rocks
      { type: 'object', x: 300, y: 280, width: 40, height: 20, color: '#7f8fa6', depth: 1 },
      { type: 'object', x: 500, y: 285, width: 30, height: 15, color: '#7f8fa6', depth: 1 },
    ],
    ambientEffects: [
      { type: 'particles', config: { type: 'sand', count: 15 } },
      { type: 'weather', config: { type: 'ocean_waves' } }
    ]
  },
  
  dancehall_club: {
    name: "Sound System Arena",
    backgroundColors: [
      '#0c0c0c', // Dark club
      '#1a1a1a',
      '#2d1b69'
    ],
    foregroundElements: [
      // Sound system stacks
      { type: 'object', x: 50, y: 150, width: 80, height: 150, color: '#000000', depth: 2 },
      { type: 'object', x: 680, y: 140, width: 90, height: 160, color: '#000000', depth: 2 },
      
      // DJ booth
      { type: 'building', x: 350, y: 200, width: 100, height: 100, color: '#2c2c2c', depth: 2 },
      
      // Crowd silhouettes
      { type: 'decoration', x: 200, y: 260, width: 15, height: 40, color: '#1a1a1a', depth: 1 },
      { type: 'decoration', x: 220, y: 255, width: 15, height: 45, color: '#1a1a1a', depth: 1 },
      { type: 'decoration', x: 240, y: 265, width: 15, height: 35, color: '#1a1a1a', depth: 1 },
      { type: 'decoration', x: 540, y: 260, width: 15, height: 40, color: '#1a1a1a', depth: 1 },
      { type: 'decoration', x: 560, y: 255, width: 15, height: 45, color: '#1a1a1a', depth: 1 },
    ],
    ambientEffects: [
      { type: 'lighting', config: { type: 'strobe', colors: ['#ff00ff', '#00ffff', '#ffff00'] } },
      { type: 'particles', config: { type: 'bass_waves', count: 20 } }
    ]
  }
};

export const renderEnhancedStage = (
  ctx: CanvasRenderingContext2D,
  stageKey: string = 'kingston_street',
  cameraShake: { x: number; y: number } = { x: 0, y: 0 },
  timeOfDay: number = 0.5 // 0 = night, 1 = day
) => {
  const stage = STAGE_CONFIGS[stageKey];
  const canvas = ctx.canvas;
  
  ctx.save();
  
  // Apply camera shake
  ctx.translate(cameraShake.x, cameraShake.y);
  
  // Render background gradient sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
  stage.backgroundColors.forEach((color, index) => {
    skyGradient.addColorStop(index / (stage.backgroundColors.length - 1), color);
  });
  
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
  
  // Render ground with pattern
  const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
  groundGradient.addColorStop(0, '#2c3e50');
  groundGradient.addColorStop(1, '#34495e');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
  
  // Add ground pattern
  ctx.strokeStyle = '#3a4a5c';
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, canvas.height * 0.6);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  
  // Render stage elements by depth (background to foreground)
  const sortedElements = [...stage.foregroundElements].sort((a, b) => b.depth - a.depth);
  
  sortedElements.forEach(element => {
    renderStageElement(ctx, element, timeOfDay);
  });
  
  // Render fighting boundaries
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  
  // Left boundary
  ctx.beginPath();
  ctx.moveTo(50, canvas.height * 0.6);
  ctx.lineTo(50, canvas.height);
  ctx.stroke();
  
  // Right boundary  
  ctx.beginPath();
  ctx.moveTo(canvas.width - 50, canvas.height * 0.6);
  ctx.lineTo(canvas.width - 50, canvas.height);
  ctx.stroke();
  
  ctx.setLineDash([]);
  
  // Render ambient effects
  stage.ambientEffects?.forEach(effect => {
    renderAmbientEffect(ctx, effect, timeOfDay);
  });
  
  // Stage lighting effects
  renderStageLighting(ctx, stageKey, timeOfDay);
  
  ctx.restore();
};

const renderStageElement = (
  ctx: CanvasRenderingContext2D,
  element: StageElement,
  timeOfDay: number
) => {
  const { type, x, y, width, height, color, depth } = element;
  
  // Apply depth-based parallax and lighting
  const parallaxOffset = (3 - depth) * 10;
  const lightness = 1 - (depth * 0.2) + (timeOfDay * 0.3);
  
  ctx.save();
  ctx.translate(parallaxOffset, 0);
  ctx.globalAlpha = lightness;
  
  switch (type) {
    case 'building':
      renderBuilding(ctx, x, y, width, height, color);
      break;
    case 'decoration':
      renderDecoration(ctx, x, y, width, height, color);
      break;
    case 'object':
      renderObject(ctx, x, y, width, height, color);
      break;
  }
  
  ctx.restore();
};

const renderBuilding = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  // Building body
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  
  // Building outline
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  
  // Windows
  const windowRows = Math.floor(height / 30);
  const windowCols = Math.floor(width / 25);
  
  for (let row = 1; row <= windowRows; row++) {
    for (let col = 1; col <= windowCols; col++) {
      const windowX = x + col * 25 - 10;
      const windowY = y + row * 30 - 10;
      
      // Random window lighting
      if (Math.random() > 0.6) {
        ctx.fillStyle = '#ffff00';
        ctx.globalAlpha = 0.8;
      } else {
        ctx.fillStyle = '#1a1a1a';
        ctx.globalAlpha = 1;
      }
      
      ctx.fillRect(windowX, windowY, 8, 12);
      ctx.globalAlpha = 1;
    }
  }
};

const renderDecoration = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  ctx.fillStyle = color;
  
  // Street light or palm tree trunk
  ctx.fillRect(x, y, width, height);
  
  // Add light glow for street lights
  if (color === '#f39c12') {
    ctx.shadowColor = '#f39c12';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(x + width/2, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  // Add palm fronds for trees
  if (color === '#8B4513') {
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(x + width/2, y);
      ctx.lineTo(
        x + width/2 + Math.cos(angle) * 30,
        y - Math.sin(angle) * 20
      );
      ctx.stroke();
    }
  }
};

const renderObject = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  
  // Add details for cars
  if (width > 50 && height < 30) {
    // Car windows
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(x + 5, y + 2, width - 10, height/2);
    
    // Car wheels
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(x + 10, y + height, 6, 0, Math.PI * 2);
    ctx.arc(x + width - 10, y + height, 6, 0, Math.PI * 2);
    ctx.fill();
  }
};

const renderAmbientEffect = (
  ctx: CanvasRenderingContext2D,
  effect: AmbientEffect,
  timeOfDay: number
) => {
  switch (effect.type) {
    case 'particles':
      renderParticleEffect(ctx, effect.config);
      break;
    case 'lighting':
      renderLightingEffect(ctx, effect.config, timeOfDay);
      break;
    case 'weather':
      renderWeatherEffect(ctx, effect.config);
      break;
  }
};

const renderParticleEffect = (ctx: CanvasRenderingContext2D, config: any) => {
  const { type, count } = config;
  
  for (let i = 0; i < count; i++) {
    const x = Math.random() * ctx.canvas.width;
    const y = Math.random() * ctx.canvas.height * 0.8;
    
    switch (type) {
      case 'neon_glow':
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
        
      case 'sand':
        ctx.fillStyle = '#c2b280';
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'bass_waves':
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, Math.sin(Date.now() * 0.01) * 20 + 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        break;
    }
  }
};

const renderLightingEffect = (
  ctx: CanvasRenderingContext2D,
  config: any,
  timeOfDay: number
) => {
  const { type, intensity = 1, colors } = config;
  
  switch (type) {
    case 'street_lights':
      // Ambient street lighting
      ctx.fillStyle = `rgba(255, 204, 0, ${intensity * 0.1 * (1 - timeOfDay)})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;
      
    case 'strobe':
      if (colors && Math.random() > 0.9) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = `${color}33`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
      break;
  }
};

const renderWeatherEffect = (ctx: CanvasRenderingContext2D, config: any) => {
  const { type } = config;
  
  switch (type) {
    case 'ocean_waves':
      ctx.strokeStyle = '#48dbfb';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height * 0.9 + i * 5);
        
        for (let x = 0; x <= ctx.canvas.width; x += 10) {
          const y = ctx.canvas.height * 0.9 + 
                   Math.sin((x + Date.now() * 0.002) * 0.02) * 3 + 
                   i * 5;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      break;
  }
};

const renderStageLighting = (
  ctx: CanvasRenderingContext2D,
  stageKey: string,
  timeOfDay: number
) => {
  // Stage-specific lighting effects
  switch (stageKey) {
    case 'dancehall_club':
      // Spotlight effects
      const spotlights = [
        { x: 200, y: 100, color: '#ff00ff' },
        { x: 400, y: 80, color: '#00ffff' },
        { x: 600, y: 120, color: '#ffff00' }
      ];
      
      spotlights.forEach(light => {
        const gradient = ctx.createRadialGradient(
          light.x, light.y, 0,
          light.x, light.y, 150
        );
        gradient.addColorStop(0, `${light.color}44`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      });
      break;
      
    case 'beach_sunset':
      // Sunset lighting
      const sunGradient = ctx.createRadialGradient(
        ctx.canvas.width * 0.8, ctx.canvas.height * 0.2, 0,
        ctx.canvas.width * 0.8, ctx.canvas.height * 0.2, 200
      );
      sunGradient.addColorStop(0, 'rgba(255, 107, 107, 0.3)');
      sunGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;
  }
};