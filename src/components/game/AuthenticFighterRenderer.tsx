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
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 60x120 base size
  // Shadow (flat, wide)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  // Sneakers (at ground level)
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(-20, -12, 20, 12); // Left shoe
  ctx.fillRect(0, -12, 20, 12); // Right shoe
  
  // Legs - thin, going upward
  ctx.fillStyle = 'hsl(220, 50%, 30%)'; // Jeans
  ctx.fillRect(-18, -48, 16, 36); // Left leg
  ctx.fillRect(2, -48, 16, 36); // Right leg
  
  // Torso - DJ shirt
  ctx.fillStyle = profile.colors.shirt;
  ctx.fillRect(-24, -96, 48, 48);
  
  // Sound wave graphics on shirt
  ctx.strokeStyle = profile.colors.aura;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, -72, 12 + i * 5, 0, Math.PI);
    ctx.stroke();
  }
  
  // Arms - thin, extending from sides
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-36, -90, 12, 40); // Left arm
  ctx.fillRect(24, -90, 12, 40); // Right arm
  
  // Head - wider than tall
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  // Dreadlocks - SHORT visible strands (NOT 90px!)
  ctx.fillStyle = profile.colors.dreadlocks;
  for (let i = 0; i < 7; i++) {
    const x = -27 + i * 9;
    ctx.fillRect(x, -135, 6, 25);
  }
  
  // Headphones
  ctx.fillStyle = profile.colors.headphones;
  ctx.fillRect(-21, -120, 42, 6); // Headband
  ctx.fillRect(-21, -120, 8, 15); // Left cup
  ctx.fillRect(13, -120, 8, 15); // Right cup
  
  // Gold chain
  ctx.strokeStyle = profile.colors.chain;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -84, 12, 0, Math.PI);
  ctx.stroke();
  
  // Eyes - horizontal ovals
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6); // Left eye
  ctx.fillRect(0, -115, 12, 6); // Right eye
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -113, 5, 3); // Left pupil
  ctx.fillRect(3, -113, 5, 3); // Right pupil
  
  // Special effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.aura;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.aura;
    ctx.shadowBlur = 10;
    
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(0, -72, 25 + i * 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
}

function renderSifuMaster(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.sifu;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 60x120 base size
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  // Kung fu shoes
  ctx.fillStyle = 'hsl(0, 0%, 10%)';
  ctx.fillRect(-25, -12, 20, 12);
  ctx.fillRect(5, -12, 20, 12);
  
  // Legs - wide kung fu stance
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-22, -48, 18, 36); // Left leg
  ctx.fillRect(4, -48, 18, 36); // Right leg
  
  // Torso in traditional gi
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-24, -96, 48, 48);
  
  // Black belt
  ctx.fillStyle = profile.colors.belt;
  ctx.fillRect(-24, -60, 48, 8);
  
  // Arms in fighting pose
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-36, -90, 12, 36); // Left arm
  ctx.fillRect(24, -90, 12, 36); // Right arm
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  // Traditional hair
  ctx.fillStyle = profile.colors.hair;
  ctx.fillRect(-18, -135, 36, 12);
  
  // Goatee
  ctx.fillRect(-6, -102, 8, 8);
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -118, 12, 6);
  ctx.fillRect(0, -118, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -116, 5, 3);
  ctx.fillRect(3, -116, 5, 3);
  
  // Steel wire weapon (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.steel_wire;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, -84);
    ctx.quadraticCurveTo(50, -108, 65, -72);
    ctx.stroke();
  }
  
  // Chi energy effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.chi_aura;
    ctx.shadowColor = profile.colors.chi_aura;
    ctx.shadowBlur = 12;
    
    ctx.beginPath();
    ctx.arc(-30, -78, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, -78, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }
}

function renderLeroyRootsman(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.leroy;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 60x120 base size
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  // Tech boots
  ctx.fillStyle = profile.colors.tech_accessories;
  ctx.fillRect(-20, -12, 18, 12);
  ctx.fillRect(2, -12, 18, 12);
  
  // Legs
  ctx.fillStyle = 'hsl(220, 40%, 25%)';
  ctx.fillRect(-18, -48, 16, 36);
  ctx.fillRect(2, -48, 16, 36);
  
  // Rasta shirt
  ctx.fillStyle = profile.colors.rasta_shirt;
  ctx.fillRect(-24, -96, 48, 48);
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-36, -90, 12, 36);
  ctx.fillRect(24, -90, 12, 36);
  
  // Cyber tattoos on arms
  ctx.strokeStyle = profile.colors.cyber_tattoos;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = profile.colors.circuit_glow;
  ctx.shadowBlur = 8;
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-34, -86 + i * 8);
    ctx.lineTo(-24, -86 + i * 8);
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  // Dreadlocks with rasta colors - SHORT strands
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    ctx.fillRect(-27 + i * 9, -135, 6, 25);
  }
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -113, 5, 3);
  ctx.fillRect(3, -113, 5, 3);
  
  // Circuit glow effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.circuit_glow;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.circuit_glow;
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(-24, -96);
    ctx.lineTo(24, -96);
    ctx.moveTo(0, -96);
    ctx.lineTo(0, -48);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRazorCyberSamurai(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.razor;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 60x120 base size
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  // Ninja boots
  ctx.fillStyle = 'hsl(0, 0%, 5%)';
  ctx.fillRect(-20, -12, 18, 12);
  ctx.fillRect(2, -12, 18, 12);
  
  // Ninja suit legs
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-18, -48, 16, 36);
  ctx.fillRect(2, -48, 16, 36);
  
  // Ninja suit torso
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-24, -96, 48, 48);
  
  // Arms
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-36, -90, 12, 36);
  ctx.fillRect(24, -90, 12, 36);
  
  // Head/mask
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-21, -132, 42, 36);
  
  // Glowing cyber eyes
  ctx.fillStyle = profile.colors.cyber_eyes;
  ctx.shadowColor = profile.colors.cyber_eyes;
  ctx.shadowBlur = 8;
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.shadowBlur = 0;
  
  // Katana (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.katana;
    ctx.shadowColor = profile.colors.katana;
    ctx.shadowBlur = 6;
    ctx.fillRect(30, -126, 5, 60);
    
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32, -126);
    ctx.lineTo(32, -66);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
  
  // Energy field effects
  if (effects.special) {
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = profile.colors.energy_field;
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.rect(-27, -135, 54, 120);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRootsmanMystic(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.rootsman;
  
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 60x120 base size
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  // Natural sandals
  ctx.fillStyle = 'hsl(30, 50%, 25%)';
  ctx.fillRect(-22, -12, 20, 12);
  ctx.fillRect(2, -12, 20, 12);
  
  // Legs
  ctx.fillStyle = 'hsl(30, 40%, 30%)';
  ctx.fillRect(-18, -48, 16, 36);
  ctx.fillRect(2, -48, 16, 36);
  
  // Earth-tone shirt with rasta accents
  const rastaColors = profile.colors.rasta_colors as string[];
  ctx.fillStyle = rastaColors[0];
  ctx.fillRect(-24, -96, 48, 48);
  
  // Rasta color stripes
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = rastaColors[i];
    ctx.fillRect(-24, -96 + i * 16, 48, 6);
  }
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-36, -90, 12, 36);
  ctx.fillRect(24, -90, 12, 36);
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  // Long flowing dreadlocks - SHORT strands
  ctx.fillStyle = profile.colors.dreads;
  for (let i = 0; i < 8; i++) {
    const x = -30 + i * 8;
    const length = 25 + Math.sin(i) * 5;
    ctx.fillRect(x, -138, 5, length);
  }
  
  // Eyes with mystical wisdom
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.fillStyle = profile.colors.mystical_energy;
  ctx.fillRect(-9, -113, 5, 3);
  ctx.fillRect(3, -113, 5, 3);
  
  // Nature's mystical aura
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.mystical_energy;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = profile.colors.mystical_energy;
    ctx.shadowBlur = 10;
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const startX = -30 + i * 15;
      ctx.moveTo(startX, 5);
      ctx.quadraticCurveTo(startX + 8, -60, startX + 4, -96);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
}

function renderDefaultStreetFighter(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  // Draw from feet (0,0) UPWARD using NEGATIVE Y - 60x120 base size
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  // Basic Street Fighter silhouette
  ctx.fillStyle = fighter.colors.primary;
  
  // Legs
  ctx.fillRect(-18, -48, 16, 36);
  ctx.fillRect(2, -48, 16, 36);
  
  // Torso
  ctx.fillRect(-24, -96, 48, 48);
  
  // Arms
  ctx.fillRect(-36, -90, 12, 36);
  ctx.fillRect(24, -90, 12, 36);
  
  // Head
  ctx.fillRect(-21, -132, 42, 36);
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -113, 5, 3);
  ctx.fillRect(3, -113, 5, 3);
}