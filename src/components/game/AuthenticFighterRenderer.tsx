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
  
  // Scale for facing direction - FIXED POSITIONING
  const scaleX = fighter.facing === 'left' ? -1 : 1;
  if (scaleX === -1) {
    ctx.translate(fighter.x + fighter.width, 0);
    ctx.scale(scaleX, 1);
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
  const w = fighter.width;
  const h = fighter.height;
  
  // Authentic Street Fighter proportions - muscular fighter build
  const headSize = h * 0.4;   // Large head with strong jawline
  const torsoSize = h * 0.45; // Broad muscular chest
  const legSize = h * 0.4;    // Thick powerful legs
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(w * 0.1, h * 0.95, w * 0.8, h * 0.05);
  
  // Thicker muscular legs with Street Fighter stance
  ctx.fillStyle = 'hsl(220, 50%, 30%)'; // Jeans
  // Left leg - thicker and more muscular
  ctx.fillRect(w * 0.2, h * 0.65, w * 0.25, legSize);
  // Right leg - fighting stance, bigger
  ctx.fillRect(w * 0.55, h * 0.65, w * 0.25, legSize);
  
  // Street Fighter style sneakers - bigger
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(w * 0.15, h * 0.9, w * 0.35, h * 0.1);
  ctx.fillRect(w * 0.5, h * 0.9, w * 0.35, h * 0.1);
  
  // Muscular torso - DJ shirt with sound waves, Street Fighter style
  ctx.fillStyle = profile.colors.shirt;
  ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, torsoSize);
  
  // Sound wave graphics on shirt
  ctx.strokeStyle = profile.colors.aura;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.45, w * (0.15 + i * 0.05), 0, Math.PI);
    ctx.stroke();
  }
  
  // Muscular arms in DJ fighting pose - Street Fighter proportions
  ctx.fillStyle = profile.colors.skin;
  // Left arm - bigger and more muscular
  ctx.fillRect(w * 0.0, h * 0.25, w * 0.2, h * 0.35);
  // Right arm - raised fighting stance, bigger
  ctx.fillRect(w * 0.8, h * 0.15, w * 0.2, h * 0.4);
  
  // Larger head with Street Fighter proportions
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(w * 0.25, h * 0.0, w * 0.5, headSize);
  
  // Flowing dreadlocks - Street Fighter style
  ctx.fillStyle = profile.colors.dreadlocks;
  for (let i = 0; i < 8; i++) {
    const x = w * (0.2 + i * 0.075);
    ctx.fillRect(x, h * 0.0, w * 0.06, h * 0.45);
  }
  
  // Headphones (iconic DJ element)
  ctx.fillStyle = profile.colors.headphones;
  ctx.fillRect(w * 0.25, h * 0.08, w * 0.5, h * 0.06);
  ctx.fillRect(w * 0.25, h * 0.08, w * 0.08, h * 0.15);
  ctx.fillRect(w * 0.67, h * 0.08, w * 0.08, h * 0.15);
  
  // Gold chain (cultural element)
  ctx.strokeStyle = profile.colors.chain;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.35, w * 0.15, 0, Math.PI);
  ctx.stroke();
  
  // Eyes with Street Fighter style
  ctx.fillStyle = 'white';
  ctx.fillRect(w * 0.35, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillRect(w * 0.57, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillStyle = 'black';
  ctx.fillRect(w * 0.37, h * 0.13, w * 0.04, h * 0.02);
  ctx.fillRect(w * 0.59, h * 0.13, w * 0.04, h * 0.02);
  
  // Special effects
  if (effects.special || fighter.state.current === 'special') {
    // Sound wave aura
    ctx.strokeStyle = profile.colors.aura;
    ctx.lineWidth = 3;
    ctx.shadowColor = profile.colors.aura;
    ctx.shadowBlur = 15;
    
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, w * (0.3 + i * 0.1), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
}

function renderSifuMaster(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.sifu;
  const w = fighter.width;
  const h = fighter.height;
  
  // Street Fighter master proportions - wise but powerful
  const headSize = h * 0.38;  // Mature facial features
  const torsoSize = h * 0.47; // Strong martial artist build
  const legSize = h * 0.38;   // Stable stance legs
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(w * 0.1, h * 0.95, w * 0.8, h * 0.05);
  
  // Muscular legs in wide kung fu stance - Street Fighter style
  ctx.fillStyle = profile.colors.gi;
  // Wider, more muscular stance
  ctx.fillRect(w * 0.1, h * 0.65, w * 0.3, legSize);
  ctx.fillRect(w * 0.6, h * 0.65, w * 0.3, legSize);
  
  // Kung fu shoes
  ctx.fillStyle = 'hsl(0, 0%, 10%)';
  ctx.fillRect(w * 0.1, h * 0.92, w * 0.3, h * 0.08);
  ctx.fillRect(w * 0.6, h * 0.92, w * 0.3, h * 0.08);
  
  // Muscular torso in traditional gi - Street Fighter proportions
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, torsoSize);
  
  // Black belt
  ctx.fillStyle = profile.colors.belt;
  ctx.fillRect(w * 0.15, h * 0.55, w * 0.7, h * 0.08);
  
  // Powerful muscular arms in kung fu fighting pose
  ctx.fillStyle = profile.colors.skin;
  // Left arm - defensive, bigger and stronger
  ctx.fillRect(w * 0.0, h * 0.25, w * 0.2, h * 0.35);
  // Right arm - attacking, Street Fighter proportions
  ctx.fillRect(w * 0.8, h * 0.2, w * 0.2, h * 0.4);
  
  // Larger head with wise master features
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(w * 0.25, h * 0.0, w * 0.5, headSize);
  
  // Traditional hair
  ctx.fillStyle = profile.colors.hair;
  ctx.fillRect(w * 0.28, h * 0.02, w * 0.44, h * 0.12);
  
  // Goatee (traditional master look)
  ctx.fillRect(w * 0.45, h * 0.22, w * 0.1, h * 0.08);
  
  // Eyes with wisdom
  ctx.fillStyle = 'white';
  ctx.fillRect(w * 0.35, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillRect(w * 0.57, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillStyle = 'black';
  ctx.fillRect(w * 0.37, h * 0.13, w * 0.04, h * 0.02);
  ctx.fillRect(w * 0.59, h * 0.13, w * 0.04, h * 0.02);
  
  // Steel wire weapon (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.steel_wire;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.9, h * 0.4);
    ctx.quadraticCurveTo(w * 1.2, h * 0.2, w * 1.4, h * 0.5);
    ctx.stroke();
  }
  
  // Chi energy effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.chi_aura;
    ctx.shadowColor = profile.colors.chi_aura;
    ctx.shadowBlur = 20;
    
    // Chi energy around hands
    ctx.beginPath();
    ctx.arc(w * 0.12, h * 0.45, w * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.88, h * 0.47, w * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }
}

function renderLeroyRootsman(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.leroy;
  const w = fighter.width;
  const h = fighter.height;
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(w * 0.1, h * 0.95, w * 0.8, h * 0.05);
  
  // Legs
  ctx.fillStyle = 'hsl(220, 40%, 25%)'; // Dark pants
  ctx.fillRect(w * 0.25, h * 0.7, w * 0.2, h * 0.3);
  ctx.fillRect(w * 0.55, h * 0.7, w * 0.2, h * 0.3);
  
  // Tech boots
  ctx.fillStyle = profile.colors.tech_accessories;
  ctx.fillRect(w * 0.2, h * 0.9, w * 0.25, h * 0.1);
  ctx.fillRect(w * 0.55, h * 0.9, w * 0.25, h * 0.1);
  
  // Rasta colored shirt
  ctx.fillStyle = profile.colors.rasta_shirt;
  ctx.fillRect(w * 0.2, h * 0.25, w * 0.6, h * 0.45);
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(w * 0.05, h * 0.35, w * 0.15, h * 0.25);
  ctx.fillRect(w * 0.8, h * 0.35, w * 0.15, h * 0.25);
  
  // Cyber tattoos on arms
  ctx.strokeStyle = profile.colors.cyber_tattoos;
  ctx.lineWidth = 2;
  ctx.shadowColor = profile.colors.circuit_glow;
  ctx.shadowBlur = 10;
  
  // Circuit patterns on left arm
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.08, h * (0.37 + i * 0.05));
    ctx.lineTo(w * 0.18, h * (0.37 + i * 0.05));
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(w * 0.3, h * 0.05, w * 0.4, h * 0.25);
  
  // Dreadlocks with rasta colors
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    const x = w * (0.22 + i * 0.07);
    ctx.fillRect(x, h * 0.02, w * 0.03, h * 0.4);
  }
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(w * 0.35, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillRect(w * 0.57, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillStyle = 'black';
  ctx.fillRect(w * 0.37, h * 0.13, w * 0.04, h * 0.02);
  ctx.fillRect(w * 0.59, h * 0.13, w * 0.04, h * 0.02);
  
  // Circuit glow effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.circuit_glow;
    ctx.lineWidth = 3;
    ctx.shadowColor = profile.colors.circuit_glow;
    ctx.shadowBlur = 15;
    
    // Glowing circuit patterns across body
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.3);
    ctx.lineTo(w * 0.8, h * 0.3);
    ctx.moveTo(w * 0.5, h * 0.25);
    ctx.lineTo(w * 0.5, h * 0.7);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRazorCyberSamurai(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.razor;
  const w = fighter.width;
  const h = fighter.height;
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(w * 0.1, h * 0.95, w * 0.8, h * 0.05);
  
  // Ninja suit legs
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(w * 0.25, h * 0.7, w * 0.2, h * 0.3);
  ctx.fillRect(w * 0.55, h * 0.7, w * 0.2, h * 0.3);
  
  // Ninja boots
  ctx.fillStyle = 'hsl(0, 0%, 5%)';
  ctx.fillRect(w * 0.2, h * 0.92, w * 0.25, h * 0.08);
  ctx.fillRect(w * 0.55, h * 0.92, w * 0.25, h * 0.08);
  
  // Ninja suit torso
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(w * 0.2, h * 0.25, w * 0.6, h * 0.45);
  
  // Arms
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(w * 0.05, h * 0.35, w * 0.15, h * 0.25);
  ctx.fillRect(w * 0.8, h * 0.35, w * 0.15, h * 0.25);
  
  // Head/mask
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(w * 0.3, h * 0.05, w * 0.4, h * 0.25);
  
  // Glowing cyber eyes
  ctx.fillStyle = profile.colors.cyber_eyes;
  ctx.shadowColor = profile.colors.cyber_eyes;
  ctx.shadowBlur = 10;
  ctx.fillRect(w * 0.35, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillRect(w * 0.57, h * 0.12, w * 0.08, h * 0.04);
  ctx.shadowBlur = 0;
  
  // Katana (when attacking)
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    // Katana blade
    ctx.fillStyle = profile.colors.katana;
    ctx.shadowColor = profile.colors.katana;
    ctx.shadowBlur = 8;
    ctx.fillRect(w * 0.9, h * 0.1, w * 0.05, h * 0.5);
    
    // Energy trail
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.92, h * 0.1);
    ctx.lineTo(w * 0.92, h * 0.6);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
  
  // Energy field effects
  if (effects.special) {
    ctx.strokeStyle = profile.colors.energy_field;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.energy_field;
    ctx.shadowBlur = 12;
    
    // Energy aura around character
    ctx.beginPath();
    ctx.rect(w * 0.15, h * 0.05, w * 0.7, h * 0.9);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
}

function renderRootsmanMystic(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.rootsman;
  const w = fighter.width;
  const h = fighter.height;
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(w * 0.1, h * 0.95, w * 0.8, h * 0.05);
  
  // Legs
  ctx.fillStyle = 'hsl(30, 40%, 30%)'; // Earth tone pants
  ctx.fillRect(w * 0.25, h * 0.7, w * 0.2, h * 0.3);
  ctx.fillRect(w * 0.55, h * 0.7, w * 0.2, h * 0.3);
  
  // Natural sandals
  ctx.fillStyle = 'hsl(30, 50%, 25%)';
  ctx.fillRect(w * 0.22, h * 0.92, w * 0.26, h * 0.08);
  ctx.fillRect(w * 0.52, h * 0.92, w * 0.26, h * 0.08);
  
  // Earth-tone shirt with rasta accents
  const rastaColors = profile.colors.rasta_colors as string[];
  ctx.fillStyle = rastaColors[0]; // Green base
  ctx.fillRect(w * 0.2, h * 0.25, w * 0.6, h * 0.45);
  
  // Rasta color stripes
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = rastaColors[i];
    ctx.fillRect(w * 0.2, h * (0.25 + i * 0.15), w * 0.6, h * 0.05);
  }
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(w * 0.05, h * 0.35, w * 0.15, h * 0.25);
  ctx.fillRect(w * 0.8, h * 0.35, w * 0.15, h * 0.25);
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(w * 0.3, h * 0.05, w * 0.4, h * 0.25);
  
  // Long flowing dreadlocks
  ctx.fillStyle = profile.colors.dreads;
  for (let i = 0; i < 10; i++) {
    const x = w * (0.18 + i * 0.064);
    const length = h * (0.4 + Math.sin(i) * 0.1);
    ctx.fillRect(x, h * 0.02, w * 0.025, length);
  }
  
  // Eyes with mystical wisdom
  ctx.fillStyle = 'white';
  ctx.fillRect(w * 0.35, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillRect(w * 0.57, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillStyle = profile.colors.mystical_energy;
  ctx.fillRect(w * 0.37, h * 0.13, w * 0.04, h * 0.02);
  ctx.fillRect(w * 0.59, h * 0.13, w * 0.04, h * 0.02);
  
  // Nature's mystical aura
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.mystical_energy;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.mystical_energy;
    ctx.shadowBlur = 15;
    
    // Mystical energy vines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const startX = w * (0.1 + i * 0.2);
      ctx.moveTo(startX, h);
      ctx.quadraticCurveTo(startX + w * 0.1, h * 0.5, startX + w * 0.05, h * 0.2);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  }
}

function renderDefaultStreetFighter(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any) {
  const w = fighter.width;
  const h = fighter.height;
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(w * 0.1, h * 0.95, w * 0.8, h * 0.05);
  
  // Basic Street Fighter silhouette
  ctx.fillStyle = fighter.colors.primary;
  
  // Legs
  ctx.fillRect(w * 0.25, h * 0.7, w * 0.2, h * 0.3);
  ctx.fillRect(w * 0.55, h * 0.7, w * 0.2, h * 0.3);
  
  // Torso
  ctx.fillRect(w * 0.2, h * 0.25, w * 0.6, h * 0.45);
  
  // Arms
  ctx.fillRect(w * 0.05, h * 0.35, w * 0.15, h * 0.25);
  ctx.fillRect(w * 0.8, h * 0.35, w * 0.15, h * 0.25);
  
  // Head
  ctx.fillRect(w * 0.3, h * 0.05, w * 0.4, h * 0.25);
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(w * 0.35, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillRect(w * 0.57, h * 0.12, w * 0.08, h * 0.04);
  ctx.fillStyle = 'black';
  ctx.fillRect(w * 0.37, h * 0.13, w * 0.04, h * 0.02);
  ctx.fillRect(w * 0.59, h * 0.13, w * 0.04, h * 0.02);
}