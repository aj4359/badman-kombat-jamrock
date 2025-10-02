import { Fighter } from '@/types/gameTypes';

export interface AuthenticFighterRendererProps {
  ctx: CanvasRenderingContext2D;
  fighter: Fighter;
  effects?: {
    alpha?: number;
    hueRotation?: number;
    glow?: boolean;
    flash?: boolean;
    shake?: { x: number; y: number };
    special?: boolean;
  };
  spriteImage?: HTMLImageElement | null;
}

// Street Fighter-style character profiles
const AUTHENTIC_FIGHTER_PROFILES = {
  jordan: {
    name: 'Jordan "Sound Master" Johnson',
    style: 'dj_rasta',
    colors: {
      skin: 'hsl(30, 45%, 35%)',
      headphones: 'hsl(270, 100%, 60%)',
      chain: 'hsl(45, 100%, 50%)',
      shirt: 'hsl(200, 80%, 30%)',
      dreadlocks: 'hsl(25, 60%, 20%)',
      turntable: 'hsl(240, 90%, 20%)',
      aura: 'hsl(270, 100%, 60%)'
    }
  },
  sifu: {
    name: 'Sifu YK Leung PhD',
    style: 'kung_fu_master',
    colors: {
      skin: 'hsl(35, 30%, 55%)',
      gi: 'hsl(0, 0%, 95%)',
      belt: 'hsl(0, 0%, 10%)',
      hair: 'hsl(0, 0%, 10%)',
      chi_aura: 'hsl(45, 100%, 50%)',
      steel_wire: 'hsl(220, 100%, 70%)'
    }
  },
  leroy: {
    name: 'Leroy "Rootsman" Zion',
    style: 'cyber_rasta',
    colors: {
      skin: 'hsl(25, 50%, 25%)',
      dreadlocks: 'hsl(25, 60%, 20%)',
      cyber_tattoos: 'hsl(180, 100%, 50%)',
      rasta_shirt: 'hsl(120, 80%, 40%)',
      tech_accessories: 'hsl(200, 90%, 60%)',
      circuit_glow: 'hsl(180, 100%, 50%)'
    }
  },
  razor: {
    name: 'Razor "Cyber Samurai"',
    style: 'cyber_ninja',
    colors: {
      skin: 'hsl(30, 20%, 40%)',
      ninja_suit: 'hsl(240, 100%, 5%)',
      cyber_eyes: 'hsl(0, 100%, 50%)',
      katana: 'hsl(220, 100%, 70%)',
      energy_field: 'hsl(120, 100%, 50%)'
    }
  },
  rootsman: {
    name: 'Rootsman "Nature\'s Voice"',
    style: 'mystic_rasta',
    colors: {
      skin: 'hsl(25, 50%, 30%)',
      dreads: 'hsl(25, 60%, 15%)',
      nature_aura: 'hsl(120, 80%, 40%)',
      rasta_colors: ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'],
      mystical_energy: 'hsl(120, 100%, 70%)'
    }
  }
};

export function renderAuthenticFighter({ ctx, fighter, effects = {}, spriteImage = null }: AuthenticFighterRendererProps) {
  ctx.save();
  
  // If we have a sprite image, use it instead of geometric rendering
  if (spriteImage && spriteImage.complete) {
    console.log('🎨 Rendering sprite for', fighter.id, 'at', fighter.x, fighter.y);
    
    // Apply effects
    if (effects.alpha !== undefined) {
      ctx.globalAlpha = effects.alpha;
    }
    
    if (effects.shake) {
      ctx.translate(effects.shake.x, effects.shake.y);
    }
    
    if (effects.hueRotation) {
      ctx.filter = `hue-rotate(${effects.hueRotation}deg)`;
    }
    
    // CRITICAL FIX: Draw sprite at correct canvas position
    // Fighter Y is from top of canvas (0 at top, increases downward)
    // We need to draw the sprite so its BOTTOM is at ground level (420)
    const GROUND_LEVEL = 420;
    const drawX = fighter.x;
    const drawY = GROUND_LEVEL - fighter.height; // Position sprite so bottom touches ground
    
    console.log('📍 Sprite draw position:', { drawX, drawY, width: fighter.width, height: fighter.height });
    
    // Handle flipping for facing direction
    if (fighter.facing === 'left') {
      ctx.save();
      ctx.translate(drawX + fighter.width / 2, drawY + fighter.height / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(
        spriteImage,
        -fighter.width / 2,
        -fighter.height / 2,
        fighter.width,
        fighter.height
      );
      ctx.restore();
    } else {
      ctx.drawImage(spriteImage, drawX, drawY, fighter.width, fighter.height);
    }
    
    ctx.restore();
    return;
  }
  
  // Fallback to geometric rendering if no sprite
  console.log('🔍 AuthenticFighterRenderer DEBUG (fallback):', {
    id: fighter.id,
    x: fighter.x,
    y: fighter.y,
    width: fighter.width,
    height: fighter.height,
    facing: fighter.facing,
    state: fighter.state?.current
  });
  
  // Apply effects
  if (effects.alpha !== undefined) {
    ctx.globalAlpha = effects.alpha;
  }
  
  if (effects.shake) {
    ctx.translate(effects.shake.x, effects.shake.y);
  }
  
  if (effects.hueRotation) {
    ctx.filter = `hue-rotate(${effects.hueRotation}deg)`;
  }
  
  // CRITICAL FIX: Translate to fighter's feet position for geometric rendering
  // Geometric functions draw UPWARD from y=0 using negative Y coords
  ctx.translate(fighter.x, fighter.y + fighter.height);
  
  // Handle facing direction with simple scale
  if (fighter.facing === 'left') {
    ctx.translate(fighter.width, 0);
    ctx.scale(-1, 1);
  }
  
  // Choose rendering function based on fighter ID
  switch (fighter.id) {
    case 'jordan':
      renderJordanSoundMaster(ctx, fighter, effects);
      break;
    case 'sifu':
      renderSifuMaster(ctx, fighter, effects);
      break;
    case 'leroy':
      renderLeroyRootsman(ctx, fighter, effects);
      break;
    case 'razor':
      renderRazorCyberSamurai(ctx, fighter, effects);
      break;
    case 'rootsman':
      renderRootsmanMystic(ctx, fighter, effects);
      break;
    default:
      renderDefaultStreetFighter(ctx, fighter, effects);
  }
  
  ctx.restore();
}

function renderJordanSoundMaster(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.jordan;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 150x200 scaled (2.5x)
  // Shadow (flat, wide)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-37.5, 12.5, 225, 15);
  
  // Sneakers (at ground level)
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(-50, -30, 50, 30); // Left shoe
  ctx.fillRect(0, -30, 50, 30); // Right shoe
  
  // Legs - thin, going upward
  ctx.fillStyle = 'hsl(220, 50%, 30%)'; // Jeans
  ctx.fillRect(-45, -120, 40, 90); // Left leg
  ctx.fillRect(5, -120, 40, 90); // Right leg
  
  // Torso - DJ shirt
  ctx.fillStyle = profile.colors.shirt;
  ctx.fillRect(-60, -240, 120, 120);
  
  // Sound wave graphics on shirt
  ctx.strokeStyle = profile.colors.aura;
  ctx.lineWidth = 3.75;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, -180, 30 + i * 12.5, 0, Math.PI);
    ctx.stroke();
  }
  
  // Arms - thin, extending from sides
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-90, -225, 30, 100); // Left arm
  ctx.fillRect(60, -225, 30, 100); // Right arm
  
  // Head - wider than tall
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-52.5, -330, 105, 90);
  
  // Dreadlocks - SHORT visible strands
  ctx.fillStyle = profile.colors.dreadlocks;
  for (let i = 0; i < 7; i++) {
    const x = -67.5 + i * 22.5;
    ctx.fillRect(x, -337.5, 15, 62.5);
  }
  
  // Headphones
  ctx.fillStyle = profile.colors.headphones;
  ctx.fillRect(-52.5, -300, 105, 15); // Headband
  ctx.fillRect(-52.5, -300, 20, 37.5); // Left cup
  ctx.fillRect(32.5, -300, 20, 37.5); // Right cup
  
  // Gold chain
  ctx.strokeStyle = profile.colors.chain;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, -210, 30, 0, Math.PI);
  ctx.stroke();
  
  // Eyes - horizontal ovals
  ctx.fillStyle = 'white';
  ctx.fillRect(-30, -287.5, 30, 15); // Left eye
  ctx.fillRect(0, -287.5, 30, 15); // Right eye
  ctx.fillStyle = 'black';
  ctx.fillRect(-22.5, -282.5, 12.5, 7.5); // Left pupil
  ctx.fillRect(7.5, -282.5, 12.5, 7.5); // Right pupil
  
  // Special effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.aura;
    ctx.lineWidth = 5;
    ctx.shadowColor = profile.colors.aura;
    ctx.shadowBlur = 25;
    
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(0, -180, 62.5 + i * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
}

function renderSifuMaster(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.sifu;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 150x200 scaled (2.5x)
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-37.5, 12.5, 225, 15);
  
  // Kung fu shoes
  ctx.fillStyle = 'hsl(0, 0%, 10%)';
  ctx.fillRect(-62.5, -30, 50, 30);
  ctx.fillRect(12.5, -30, 50, 30);
  
  // Legs - wide kung fu stance
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-55, -120, 45, 90); // Left leg
  ctx.fillRect(10, -120, 45, 90); // Right leg
  
  // Torso in traditional gi
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-60, -240, 120, 120);
  
  // Black belt
  ctx.fillStyle = profile.colors.belt;
  ctx.fillRect(-60, -150, 120, 20);
  
  // Arms in fighting pose
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-90, -225, 30, 90); // Left arm
  ctx.fillRect(60, -225, 30, 90); // Right arm
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-52.5, -330, 105, 90);
  
  // Traditional hair
  ctx.fillStyle = profile.colors.hair;
  ctx.fillRect(-45, -337.5, 90, 30);
  
  // Goatee
  ctx.fillRect(-15, -255, 20, 20);
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-30, -295, 30, 15);
  ctx.fillRect(0, -295, 30, 15);
  ctx.fillStyle = 'black';
  ctx.fillRect(-22.5, -290, 12.5, 7.5);
  ctx.fillRect(7.5, -290, 12.5, 7.5);
  
  // Steel wire weapon (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.steel_wire;
    ctx.lineWidth = 3.75;
    ctx.beginPath();
    ctx.moveTo(75, -210);
    ctx.quadraticCurveTo(125, -270, 162.5, -180);
    ctx.stroke();
  }
  
  // Chi energy effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.chi_aura;
    ctx.shadowColor = profile.colors.chi_aura;
    ctx.shadowBlur = 30;
    
    ctx.beginPath();
    ctx.arc(-75, -195, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(75, -195, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }
}

function renderLeroyRootsman(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.leroy;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 150x200 scaled (2.5x)
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-37.5, 12.5, 225, 15);
  
  // Tech boots
  ctx.fillStyle = profile.colors.tech_accessories;
  ctx.fillRect(-50, -30, 45, 30);
  ctx.fillRect(5, -30, 45, 30);
  
  // Legs
  ctx.fillStyle = 'hsl(220, 40%, 25%)';
  ctx.fillRect(-45, -120, 40, 90);
  ctx.fillRect(5, -120, 40, 90);
  
  // Rasta shirt
  ctx.fillStyle = profile.colors.rasta_shirt;
  ctx.fillRect(-60, -240, 120, 120);
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-90, -225, 30, 90);
  ctx.fillRect(60, -225, 30, 90);
  
  // Cyber tattoos on arms
  ctx.strokeStyle = profile.colors.cyber_tattoos;
  ctx.lineWidth = 3.75;
  ctx.shadowColor = profile.colors.circuit_glow;
  ctx.shadowBlur = 20;
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-85, -215 + i * 20);
    ctx.lineTo(-60, -215 + i * 20);
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-52.5, -330, 105, 90);
  
  // Dreadlocks with rasta colors - SHORT strands
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    ctx.fillRect(-67.5 + i * 22.5, -337.5, 15, 62.5);
  }
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-30, -287.5, 30, 15);
  ctx.fillRect(0, -287.5, 30, 15);
  ctx.fillStyle = 'black';
  ctx.fillRect(-22.5, -282.5, 12.5, 7.5);
  ctx.fillRect(7.5, -282.5, 12.5, 7.5);
  
  // Circuit glow effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.circuit_glow;
    ctx.lineWidth = 5;
    ctx.shadowColor = profile.colors.circuit_glow;
    ctx.shadowBlur = 25;
    
    ctx.beginPath();
    ctx.moveTo(-60, -240);
    ctx.lineTo(60, -240);
    ctx.moveTo(0, -240);
    ctx.lineTo(0, -120);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRazorCyberSamurai(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.razor;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 150x200 scaled (2.5x)
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-37.5, 12.5, 225, 15);
  
  // Ninja boots
  ctx.fillStyle = 'hsl(0, 0%, 5%)';
  ctx.fillRect(-50, -30, 45, 30);
  ctx.fillRect(5, -30, 45, 30);
  
  // Ninja suit legs
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-45, -120, 40, 90);
  ctx.fillRect(5, -120, 40, 90);
  
  // Ninja suit torso
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-60, -240, 120, 120);
  
  // Arms
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-90, -225, 30, 90);
  ctx.fillRect(60, -225, 30, 90);
  
  // Head/mask
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-52.5, -330, 105, 90);
  
  // Glowing cyber eyes
  ctx.fillStyle = profile.colors.cyber_eyes;
  ctx.shadowColor = profile.colors.cyber_eyes;
  ctx.shadowBlur = 20;
  ctx.fillRect(-30, -287.5, 30, 15);
  ctx.fillRect(0, -287.5, 30, 15);
  ctx.shadowBlur = 0;
  
  // Katana (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.katana;
    ctx.shadowColor = profile.colors.katana;
    ctx.shadowBlur = 15;
    ctx.fillRect(75, -315, 12.5, 150);
    
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(80, -315);
    ctx.lineTo(80, -165);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
  
  // Energy field effects
  if (effects.special) {
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 3.75;
    ctx.shadowColor = profile.colors.energy_field;
    ctx.shadowBlur = 25;
    
    ctx.beginPath();
    ctx.rect(-67.5, -337.5, 135, 300);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRootsmanMystic(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.rootsman;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 150x200 scaled (2.5x)
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-37.5, 12.5, 225, 15);
  
  // Natural sandals
  ctx.fillStyle = 'hsl(30, 50%, 25%)';
  ctx.fillRect(-55, -30, 50, 30);
  ctx.fillRect(5, -30, 50, 30);
  
  // Legs
  ctx.fillStyle = 'hsl(30, 40%, 30%)';
  ctx.fillRect(-45, -120, 40, 90);
  ctx.fillRect(5, -120, 40, 90);
  
  // Earth-tone shirt with rasta accents
  const rastaColors = profile.colors.rasta_colors as string[];
  ctx.fillStyle = rastaColors[0];
  ctx.fillRect(-60, -240, 120, 120);
  
  // Rasta color stripes
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = rastaColors[i];
    ctx.fillRect(-60, -240 + i * 40, 120, 15);
  }
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-90, -225, 30, 90);
  ctx.fillRect(60, -225, 30, 90);
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-52.5, -330, 105, 90);
  
  // Long flowing dreadlocks
  ctx.fillStyle = profile.colors.dreads;
  for (let i = 0; i < 8; i++) {
    const x = -75 + i * 20;
    const length = 62.5 + Math.sin(i) * 12.5;
    ctx.fillRect(x, -345, 12.5, length);
  }
  
  // Eyes with mystical wisdom
  ctx.fillStyle = 'white';
  ctx.fillRect(-30, -287.5, 30, 15);
  ctx.fillRect(0, -287.5, 30, 15);
  ctx.fillStyle = profile.colors.mystical_energy;
  ctx.fillRect(-22.5, -282.5, 12.5, 7.5);
  ctx.fillRect(7.5, -282.5, 12.5, 7.5);
  
  // Nature's mystical aura
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.mystical_energy;
    ctx.lineWidth = 3.75;
    ctx.shadowColor = profile.colors.mystical_energy;
    ctx.shadowBlur = 25;
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const startX = -75 + i * 37.5;
      ctx.moveTo(startX, 12.5);
      ctx.quadraticCurveTo(startX + 20, -150, startX + 10, -240);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
}

function renderDefaultStreetFighter(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 150x200 scaled (2.5x)
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-37.5, 12.5, 225, 15);
  
  // Basic Street Fighter silhouette
  ctx.fillStyle = fighter.colors.primary;
  
  // Legs
  ctx.fillRect(-45, -120, 40, 90);
  ctx.fillRect(5, -120, 40, 90);
  
  // Torso
  ctx.fillRect(-60, -240, 120, 120);
  
  // Arms
  ctx.fillRect(-90, -225, 30, 90);
  ctx.fillRect(60, -225, 30, 90);
  
  // Head
  ctx.fillRect(-52.5, -330, 105, 90);
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-30, -287.5, 30, 15);
  ctx.fillRect(0, -287.5, 30, 15);
  ctx.fillStyle = 'black';
  ctx.fillRect(-22.5, -282.5, 12.5, 7.5);
  ctx.fillRect(7.5, -282.5, 12.5, 7.5);
}