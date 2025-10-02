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

export function renderAuthenticFighter({ ctx, fighter, effects = {} }: AuthenticFighterRendererProps) {
  ctx.save();
  
  // DEBUG: Log fighter details
  console.log('🔍 AuthenticFighterRenderer DEBUG:', {
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
  
  // Use actual fighter coordinates - NO OFFSET
  ctx.translate(fighter.x, fighter.y);
  
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
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y
  // Shadow (slightly below feet)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(15, 5, 120, 10);
  
  // Sneakers (at ground level)
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(25, -20, 40, 20); // Left shoe
  ctx.fillRect(85, -20, 40, 20); // Right shoe
  
  // Legs - going upward
  ctx.fillStyle = 'hsl(220, 50%, 30%)'; // Jeans
  ctx.fillRect(30, -90, 35, 70); // Left leg
  ctx.fillRect(85, -90, 35, 70); // Right leg
  
  // Torso - DJ shirt
  ctx.fillStyle = profile.colors.shirt;
  ctx.fillRect(25, -190, 100, 100);
  
  // Sound wave graphics on shirt
  ctx.strokeStyle = profile.colors.aura;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(75, -130, 20 + i * 8, 0, Math.PI);
    ctx.stroke();
  }
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(0, -170, 25, 70); // Left arm
  ctx.fillRect(125, -190, 25, 80); // Right arm
  
  // Head - clearly visible
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(40, -210, 70, 50);
  
  // Dreadlocks - visible strands
  ctx.fillStyle = profile.colors.dreadlocks;
  for (let i = 0; i < 8; i++) {
    const x = 30 + i * 11;
    ctx.fillRect(x, -215, 9, 90);
  }
  
  // Headphones
  ctx.fillStyle = profile.colors.headphones;
  ctx.fillRect(40, -195, 70, 10); // Headband
  ctx.fillRect(40, -195, 12, 25); // Left cup
  ctx.fillRect(98, -195, 12, 25); // Right cup
  
  // Gold chain
  ctx.strokeStyle = profile.colors.chain;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(75, -150, 20, 0, Math.PI);
  ctx.stroke();
  
  // Eyes - clearly visible
  ctx.fillStyle = 'white';
  ctx.fillRect(50, -185, 18, 10); // Left eye
  ctx.fillRect(82, -185, 18, 10); // Right eye
  ctx.fillStyle = 'black';
  ctx.fillRect(56, -182, 8, 5); // Left pupil
  ctx.fillRect(88, -182, 8, 5); // Right pupil
  
  // Special effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.aura;
    ctx.lineWidth = 3;
    ctx.shadowColor = profile.colors.aura;
    ctx.shadowBlur = 15;
    
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(75, -120, 45 + i * 15, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
}

function renderSifuMaster(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.sifu;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(15, 5, 120, 10);
  
  // Kung fu shoes
  ctx.fillStyle = 'hsl(0, 0%, 10%)';
  ctx.fillRect(15, -16, 45, 16);
  ctx.fillRect(90, -16, 45, 16);
  
  // Legs - wide kung fu stance
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(15, -86, 45, 70); // Left leg
  ctx.fillRect(90, -86, 45, 70); // Right leg
  
  // Torso in traditional gi
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(23, -180, 105, 94);
  
  // Black belt
  ctx.fillStyle = profile.colors.belt;
  ctx.fillRect(23, -106, 105, 16);
  
  // Arms in fighting pose
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(0, -170, 30, 70); // Left arm
  ctx.fillRect(120, -180, 30, 80); // Right arm
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(38, -220, 75, 50);
  
  // Traditional hair
  ctx.fillStyle = profile.colors.hair;
  ctx.fillRect(42, -216, 66, 24);
  
  // Goatee
  ctx.fillRect(68, -176, 15, 16);
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(53, -202, 18, 10);
  ctx.fillRect(86, -202, 18, 10);
  ctx.fillStyle = 'black';
  ctx.fillRect(59, -199, 8, 5);
  ctx.fillRect(92, -199, 8, 5);
  
  // Steel wire weapon (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.steel_wire;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(135, -140);
    ctx.quadraticCurveTo(180, -180, 210, -120);
    ctx.stroke();
  }
  
  // Chi energy effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.chi_aura;
    ctx.shadowColor = profile.colors.chi_aura;
    ctx.shadowBlur = 20;
    
    ctx.beginPath();
    ctx.arc(18, -130, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(132, -126, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }
}

function renderLeroyRootsman(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.leroy;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(15, 5, 120, 10);
  
  // Tech boots
  ctx.fillStyle = profile.colors.tech_accessories;
  ctx.fillRect(30, -20, 38, 20);
  ctx.fillRect(83, -20, 38, 20);
  
  // Legs
  ctx.fillStyle = 'hsl(220, 40%, 25%)';
  ctx.fillRect(38, -80, 30, 60);
  ctx.fillRect(83, -80, 30, 60);
  
  // Rasta shirt
  ctx.fillStyle = profile.colors.rasta_shirt;
  ctx.fillRect(30, -170, 90, 90);
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(8, -150, 23, 50);
  ctx.fillRect(120, -150, 23, 50);
  
  // Cyber tattoos on arms
  ctx.strokeStyle = profile.colors.cyber_tattoos;
  ctx.lineWidth = 2;
  ctx.shadowColor = profile.colors.circuit_glow;
  ctx.shadowBlur = 10;
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(12, -146 + i * 10);
    ctx.lineTo(27, -146 + i * 10);
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(45, -210, 60, 50);
  
  // Dreadlocks with rasta colors
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    ctx.fillRect(33 + i * 11, -216, 9, 80);
  }
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(53, -196, 18, 10);
  ctx.fillRect(86, -196, 18, 10);
  ctx.fillStyle = 'black';
  ctx.fillRect(56, -194, 8, 5);
  ctx.fillRect(89, -194, 8, 5);
  
  // Circuit glow effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.circuit_glow;
    ctx.lineWidth = 3;
    ctx.shadowColor = profile.colors.circuit_glow;
    ctx.shadowBlur = 15;
    
    ctx.beginPath();
    ctx.moveTo(30, -160);
    ctx.lineTo(120, -160);
    ctx.moveTo(75, -170);
    ctx.lineTo(75, -80);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRazorCyberSamurai(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.razor;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(15, 5, 120, 10);
  
  // Ninja boots
  ctx.fillStyle = 'hsl(0, 0%, 5%)';
  ctx.fillRect(30, -16, 38, 16);
  ctx.fillRect(83, -16, 38, 16);
  
  // Ninja suit legs
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(38, -76, 30, 60);
  ctx.fillRect(83, -76, 30, 60);
  
  // Ninja suit torso
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(30, -166, 90, 90);
  
  // Arms
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(8, -146, 23, 50);
  ctx.fillRect(120, -146, 23, 50);
  
  // Head/mask
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(45, -206, 60, 50);
  
  // Glowing cyber eyes
  ctx.fillStyle = profile.colors.cyber_eyes;
  ctx.shadowColor = profile.colors.cyber_eyes;
  ctx.shadowBlur = 10;
  ctx.fillRect(53, -192, 18, 10);
  ctx.fillRect(86, -192, 18, 10);
  ctx.shadowBlur = 0;
  
  // Katana (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.katana;
    ctx.shadowColor = profile.colors.katana;
    ctx.shadowBlur = 8;
    ctx.fillRect(135, -196, 8, 100);
    
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(138, -196);
    ctx.lineTo(138, -96);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
  
  // Energy field effects
  if (effects.special) {
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.energy_field;
    ctx.shadowBlur = 12;
    
    ctx.beginPath();
    ctx.rect(23, -206, 105, 180);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRootsmanMystic(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.rootsman;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(15, 5, 120, 10);
  
  // Natural sandals
  ctx.fillStyle = 'hsl(30, 50%, 25%)';
  ctx.fillRect(33, -16, 39, 16);
  ctx.fillRect(78, -16, 39, 16);
  
  // Legs
  ctx.fillStyle = 'hsl(30, 40%, 30%)';
  ctx.fillRect(38, -76, 30, 60);
  ctx.fillRect(83, -76, 30, 60);
  
  // Earth-tone shirt with rasta accents
  const rastaColors = profile.colors.rasta_colors as string[];
  ctx.fillStyle = rastaColors[0];
  ctx.fillRect(30, -166, 90, 90);
  
  // Rasta color stripes
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = rastaColors[i];
    ctx.fillRect(30, -166 + i * 30, 90, 10);
  }
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(8, -146, 23, 50);
  ctx.fillRect(120, -146, 23, 50);
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(45, -206, 60, 50);
  
  // Long flowing dreadlocks
  ctx.fillStyle = profile.colors.dreads;
  for (let i = 0; i < 10; i++) {
    const x = 27 + i * 10;
    const length = 80 + Math.sin(i) * 20;
    ctx.fillRect(x, -212, 6, length);
  }
  
  // Eyes with mystical wisdom
  ctx.fillStyle = 'white';
  ctx.fillRect(53, -192, 18, 10);
  ctx.fillRect(86, -192, 18, 10);
  ctx.fillStyle = profile.colors.mystical_energy;
  ctx.fillRect(56, -190, 8, 5);
  ctx.fillRect(89, -190, 8, 5);
  
  // Nature's mystical aura
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.mystical_energy;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.mystical_energy;
    ctx.shadowBlur = 15;
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const startX = 15 + i * 30;
      ctx.moveTo(startX, 16);
      ctx.quadraticCurveTo(startX + 15, -116, startX + 8, -176);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
}

function renderDefaultStreetFighter(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  // Draw from feet (0,0) UPWARD using NEGATIVE Y
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(15, 5, 120, 10);
  
  // Basic Street Fighter silhouette
  ctx.fillStyle = fighter.colors.primary;
  
  // Legs
  ctx.fillRect(38, -76, 30, 60);
  ctx.fillRect(83, -76, 30, 60);
  
  // Torso
  ctx.fillRect(30, -166, 90, 90);
  
  // Arms
  ctx.fillRect(8, -146, 23, 50);
  ctx.fillRect(120, -146, 23, 50);
  
  // Head
  ctx.fillRect(45, -206, 60, 50);
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(53, -192, 18, 10);
  ctx.fillRect(86, -192, 18, 10);
  ctx.fillStyle = 'black';
  ctx.fillRect(56, -190, 8, 5);
  ctx.fillRect(89, -190, 8, 5);
}