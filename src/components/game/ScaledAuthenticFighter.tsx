import { Fighter } from '@/types/gameTypes';
import { getCurrentPose, type Pose } from '@/utils/fighterPoses';

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

// Scale factor: 60% of original (0.4x instead of 2.5x)
const SCALE = 0.4;

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
  
  const GROUND_LEVEL = 456;
  
  const attackType = fighter.state?.current === 'attacking' ? 'medium' : undefined;
  const moveType = fighter.animation?.currentMove?.toLowerCase().includes('kick') ? 'kick' : 'punch';
  
  const pose = getCurrentPose(
    fighter.state?.current || 'idle',
    fighter.animationTimer || 0,
    attackType as 'light' | 'medium' | 'heavy' | undefined,
    moveType
  );
  
  // If we have a sprite image, use it instead of geometric rendering
  if (spriteImage && spriteImage.complete) {
    if (effects.alpha !== undefined) {
      ctx.globalAlpha = effects.alpha;
    }
    
    if (effects.shake) {
      ctx.translate(effects.shake.x, effects.shake.y);
    }
    
    if (effects.hueRotation) {
      ctx.filter = `hue-rotate(${effects.hueRotation}deg)`;
    }
    
    const drawX = fighter.x;
    const drawY = GROUND_LEVEL - fighter.height;
    
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
  
  // Geometric rendering fallback
  if (effects.alpha !== undefined) {
    ctx.globalAlpha = effects.alpha;
  }
  
  if (effects.shake) {
    ctx.translate(effects.shake.x, effects.shake.y);
  }
  
  if (effects.hueRotation) {
    ctx.filter = `hue-rotate(${effects.hueRotation}deg)`;
  }
  
  const feetY = GROUND_LEVEL;
  ctx.translate(fighter.x, feetY);
  
  if (fighter.facing === 'left') {
    ctx.translate(fighter.width, 0);
    ctx.scale(-1, 1);
  }
  
  // Choose rendering function based on fighter ID
  switch (fighter.id) {
    case 'jordan':
      renderJordanSoundMaster(ctx, fighter, effects, pose);
      break;
    case 'sifu':
      renderSifuMaster(ctx, fighter, effects, pose);
      break;
    case 'leroy':
      renderLeroyRootsman(ctx, fighter, effects, pose);
      break;
    case 'razor':
      renderRazorCyberSamurai(ctx, fighter, effects, pose);
      break;
    case 'rootsman':
      renderRootsmanMystic(ctx, fighter, effects, pose);
      break;
    default:
      renderDefaultStreetFighter(ctx, fighter, effects, pose);
  }
  
  ctx.restore();
}

function renderJordanSoundMaster(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.jordan;
  
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15*SCALE, 5*SCALE, 90*SCALE, 6*SCALE);
  
  // Sneakers
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(-20*SCALE, -12*SCALE, 20*SCALE, 12*SCALE);
  ctx.fillRect(0, -12*SCALE, 20*SCALE, 12*SCALE);
  
  // Legs
  ctx.fillStyle = 'hsl(220, 50%, 30%)';
  ctx.fillRect(-18*SCALE, -48*SCALE + pose.leftLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.leftLegBend * SCALE);
  ctx.fillRect(2*SCALE, -48*SCALE + pose.rightLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.rightLegBend * SCALE);
  
  // Torso
  ctx.fillStyle = profile.colors.shirt;
  ctx.fillRect(-24*SCALE, -96*SCALE, 48*SCALE, 48*SCALE);
  
  // Sound wave graphics
  ctx.strokeStyle = profile.colors.aura;
  ctx.lineWidth = 1.5*SCALE;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, -72*SCALE, (12 + i * 5)*SCALE, 0, Math.PI);
    ctx.stroke();
  }
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30*SCALE, -90*SCALE);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (40 + pose.leftArmExtension) * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30*SCALE, -90*SCALE);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (40 + pose.rightArmExtension) * SCALE);
  ctx.restore();
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(pose.headOffsetX * SCALE, pose.headOffsetY * SCALE);
  ctx.rotate((pose.headTilt * Math.PI) / 180);
  ctx.fillRect(-21*SCALE, -132*SCALE, 42*SCALE, 36*SCALE);
  ctx.restore();
  
  // Dreadlocks
  ctx.fillStyle = profile.colors.dreadlocks;
  for (let i = 0; i < 7; i++) {
    ctx.fillRect((-27 + i * 9)*SCALE, -135*SCALE, 6*SCALE, 25*SCALE);
  }
  
  // Headphones
  ctx.fillStyle = profile.colors.headphones;
  ctx.fillRect(-21*SCALE, -120*SCALE, 42*SCALE, 6*SCALE);
  ctx.fillRect(-21*SCALE, -120*SCALE, 8*SCALE, 15*SCALE);
  ctx.fillRect(13*SCALE, -120*SCALE, 8*SCALE, 15*SCALE);
  
  // Gold chain
  ctx.strokeStyle = profile.colors.chain;
  ctx.lineWidth = 2*SCALE;
  ctx.beginPath();
  ctx.arc(0, -84*SCALE, 12*SCALE, 0, Math.PI);
  ctx.stroke();
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-12*SCALE, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillRect(0, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  ctx.fillRect(3*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  
  // Special effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.aura;
    ctx.lineWidth = 2*SCALE;
    ctx.shadowColor = profile.colors.aura;
    ctx.shadowBlur = 12*SCALE;
    
    const pulseOffset = Math.sin(Date.now() / 100) * 4 * SCALE;
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = 0.8 - i * 0.15;
      ctx.beginPath();
      ctx.arc(0, -72*SCALE, (25 + i * 8)*SCALE + pulseOffset, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
}

function renderSifuMaster(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.sifu;
  
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15*SCALE, 5*SCALE, 90*SCALE, 6*SCALE);
  
  ctx.fillStyle = 'hsl(0, 0%, 10%)';
  ctx.fillRect(-25*SCALE, -12*SCALE, 20*SCALE, 12*SCALE);
  ctx.fillRect(5*SCALE, -12*SCALE, 20*SCALE, 12*SCALE);
  
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-22*SCALE, -48*SCALE + pose.leftLegOffsetY * SCALE, 18*SCALE, 36*SCALE + pose.leftLegBend * SCALE);
  ctx.fillRect(4*SCALE, -48*SCALE + pose.rightLegOffsetY * SCALE, 18*SCALE, 36*SCALE + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-24*SCALE, -96*SCALE, 48*SCALE, 48*SCALE);
  
  ctx.fillStyle = profile.colors.belt;
  ctx.fillRect(-24*SCALE, -60*SCALE, 48*SCALE, 8*SCALE);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30*SCALE, -90*SCALE);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.leftArmExtension) * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30*SCALE, -90*SCALE);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.rightArmExtension) * SCALE);
  ctx.restore();
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21*SCALE, -132*SCALE, 42*SCALE, 36*SCALE);
  
  ctx.fillStyle = profile.colors.hair;
  ctx.fillRect(-18*SCALE, -135*SCALE, 36*SCALE, 12*SCALE);
  
  ctx.fillRect(-6*SCALE, -102*SCALE, 8*SCALE, 8*SCALE);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12*SCALE, -118*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillRect(0, -118*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9*SCALE, -116*SCALE, 5*SCALE, 3*SCALE);
  ctx.fillRect(3*SCALE, -116*SCALE, 5*SCALE, 3*SCALE);
  
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.steel_wire;
    ctx.lineWidth = 1.5*SCALE;
    ctx.beginPath();
    ctx.moveTo(30*SCALE, -84*SCALE);
    ctx.quadraticCurveTo(50*SCALE, -108*SCALE, 65*SCALE, -72*SCALE);
    ctx.stroke();
  }
  
  if (effects.special || fighter.state.current === 'special') {
    ctx.fillStyle = profile.colors.chi_aura;
    ctx.shadowColor = profile.colors.chi_aura;
    ctx.shadowBlur = 12*SCALE;
    
    ctx.beginPath();
    ctx.arc(-30*SCALE, -78*SCALE, 8*SCALE, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30*SCALE, -78*SCALE, 8*SCALE, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
}

function renderLeroyRootsman(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.leroy;
  
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15*SCALE, 5*SCALE, 90*SCALE, 6*SCALE);
  
  ctx.fillStyle = profile.colors.tech_accessories;
  ctx.fillRect(-20*SCALE, -12*SCALE, 18*SCALE, 12*SCALE);
  ctx.fillRect(2*SCALE, -12*SCALE, 18*SCALE, 12*SCALE);
  
  ctx.fillStyle = 'hsl(220, 40%, 25%)';
  ctx.fillRect(-18*SCALE, -48*SCALE + pose.leftLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.leftLegBend * SCALE);
  ctx.fillRect(2*SCALE, -48*SCALE + pose.rightLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.rasta_shirt;
  ctx.fillRect(-24*SCALE, -96*SCALE, 48*SCALE, 48*SCALE);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30*SCALE, -90*SCALE);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.leftArmExtension) * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30*SCALE, -90*SCALE);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.rightArmExtension) * SCALE);
  ctx.restore();
  
  ctx.strokeStyle = profile.colors.cyber_tattoos;
  ctx.lineWidth = 1.5*SCALE;
  ctx.shadowColor = profile.colors.circuit_glow;
  ctx.shadowBlur = 8*SCALE;
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-34*SCALE, (-86 + i * 8)*SCALE);
    ctx.lineTo(-24*SCALE, (-86 + i * 8)*SCALE);
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21*SCALE, -132*SCALE, 42*SCALE, 36*SCALE);
  
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    ctx.fillRect((-27 + i * 9)*SCALE, -135*SCALE, 6*SCALE, 25*SCALE);
  }
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12*SCALE, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillRect(0, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  ctx.fillRect(3*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  
  ctx.restore();
}

function renderRazorCyberSamurai(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.razor;
  
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15*SCALE, 5*SCALE, 90*SCALE, 6*SCALE);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-20*SCALE, -12*SCALE, 20*SCALE, 12*SCALE);
  ctx.fillRect(0, -12*SCALE, 20*SCALE, 12*SCALE);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-18*SCALE, -48*SCALE + pose.leftLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.leftLegBend * SCALE);
  ctx.fillRect(2*SCALE, -48*SCALE + pose.rightLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-24*SCALE, -96*SCALE, 48*SCALE, 48*SCALE);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30*SCALE, -90*SCALE);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.leftArmExtension) * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30*SCALE, -90*SCALE);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.rightArmExtension) * SCALE);
  ctx.restore();
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21*SCALE, -132*SCALE, 42*SCALE, 36*SCALE);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-21*SCALE, -105*SCALE, 42*SCALE, 15*SCALE);
  
  ctx.fillStyle = profile.colors.cyber_eyes;
  ctx.fillRect(-12*SCALE, -115*SCALE, 8*SCALE, 4*SCALE);
  ctx.fillRect(4*SCALE, -115*SCALE, 8*SCALE, 4*SCALE);
  
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.katana;
    ctx.lineWidth = 2*SCALE;
    ctx.shadowColor = profile.colors.katana;
    ctx.shadowBlur = 10*SCALE;
    ctx.beginPath();
    ctx.moveTo(30*SCALE, -90*SCALE);
    ctx.lineTo(60*SCALE, -120*SCALE);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
}

function renderRootsmanMystic(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.rootsman;
  
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15*SCALE, 5*SCALE, 90*SCALE, 6*SCALE);
  
  ctx.fillStyle = 'hsl(25, 50%, 25%)';
  ctx.fillRect(-20*SCALE, -12*SCALE, 20*SCALE, 12*SCALE);
  ctx.fillRect(0, -12*SCALE, 20*SCALE, 12*SCALE);
  
  ctx.fillStyle = 'hsl(120, 80%, 30%)';
  ctx.fillRect(-18*SCALE, -48*SCALE + pose.leftLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.leftLegBend * SCALE);
  ctx.fillRect(2*SCALE, -48*SCALE + pose.rightLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.nature_aura;
  ctx.fillRect(-24*SCALE, -96*SCALE, 48*SCALE, 48*SCALE);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30*SCALE, -90*SCALE);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.leftArmExtension) * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30*SCALE, -90*SCALE);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (36 + pose.rightArmExtension) * SCALE);
  ctx.restore();
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21*SCALE, -132*SCALE, 42*SCALE, 36*SCALE);
  
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    ctx.fillRect((-27 + i * 9)*SCALE, -135*SCALE, 6*SCALE, 25*SCALE);
  }
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12*SCALE, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillRect(0, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  ctx.fillRect(3*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.mystical_energy;
    ctx.lineWidth = 2*SCALE;
    ctx.shadowColor = profile.colors.mystical_energy;
    ctx.shadowBlur = 15*SCALE;
    
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.6 - i * 0.15;
      ctx.beginPath();
      ctx.arc(0, -96*SCALE, (30 + i * 10)*SCALE, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
}

function renderDefaultStreetFighter(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15*SCALE, 5*SCALE, 90*SCALE, 6*SCALE);
  
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(-20*SCALE, -12*SCALE, 20*SCALE, 12*SCALE);
  ctx.fillRect(0, -12*SCALE, 20*SCALE, 12*SCALE);
  
  ctx.fillStyle = 'hsl(220, 50%, 30%)';
  ctx.fillRect(-18*SCALE, -48*SCALE + pose.leftLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.leftLegBend * SCALE);
  ctx.fillRect(2*SCALE, -48*SCALE + pose.rightLegOffsetY * SCALE, 16*SCALE, 36*SCALE + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = 'hsl(200, 80%, 30%)';
  ctx.fillRect(-24*SCALE, -96*SCALE, 48*SCALE, 48*SCALE);
  
  ctx.fillStyle = 'hsl(30, 45%, 35%)';
  ctx.save();
  ctx.translate(-30*SCALE, -90*SCALE);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (40 + pose.leftArmExtension) * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30*SCALE, -90*SCALE);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12*SCALE, (40 + pose.rightArmExtension) * SCALE);
  ctx.restore();
  
  ctx.fillStyle = 'hsl(30, 45%, 35%)';
  ctx.fillRect(-21*SCALE, -132*SCALE, 42*SCALE, 36*SCALE);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12*SCALE, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillRect(0, -115*SCALE, 12*SCALE, 6*SCALE);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  ctx.fillRect(3*SCALE, -113*SCALE, 5*SCALE, 3*SCALE);
  
  ctx.restore();
}
