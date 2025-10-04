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
  ctx.fillRect(-15, 5, 90, 6);
  
  // Sneakers
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(-20, -12, 20, 12);
  ctx.fillRect(0, -12, 20, 12);
  
  // Legs
  ctx.fillStyle = 'hsl(220, 50%, 30%)';
  ctx.fillRect(-18, -48 + pose.leftLegOffsetY * SCALE, 16, 36 + pose.leftLegBend * SCALE);
  ctx.fillRect(2, -48 + pose.rightLegOffsetY * SCALE, 16, 36 + pose.rightLegBend * SCALE);
  
  // Torso
  ctx.fillStyle = profile.colors.shirt;
  ctx.fillRect(-24, -96, 48, 48);
  
  // Sound wave graphics
  ctx.strokeStyle = profile.colors.aura;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, -72, 12 + i * 5, 0, Math.PI);
    ctx.stroke();
  }
  
  // Arms
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30, -90);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 40 + pose.leftArmExtension * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30, -90);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 40 + pose.rightArmExtension * SCALE);
  ctx.restore();
  
  // Head
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(pose.headOffsetX * SCALE, pose.headOffsetY * SCALE);
  ctx.rotate((pose.headTilt * Math.PI) / 180);
  ctx.fillRect(-21, -132, 42, 36);
  ctx.restore();
  
  // Dreadlocks
  ctx.fillStyle = profile.colors.dreadlocks;
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(-27 + i * 9, -135, 6, 25);
  }
  
  // Headphones
  ctx.fillStyle = profile.colors.headphones;
  ctx.fillRect(-21, -120, 42, 6);
  ctx.fillRect(-21, -120, 8, 15);
  ctx.fillRect(13, -120, 8, 15);
  
  // Gold chain
  ctx.strokeStyle = profile.colors.chain;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -84, 12, 0, Math.PI);
  ctx.stroke();
  
  // Eyes
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -113, 5, 3);
  ctx.fillRect(3, -113, 5, 3);
  
  // Special effects
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.aura;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.aura;
    ctx.shadowBlur = 12;
    
    const pulseOffset = Math.sin(Date.now() / 100) * 4;
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = 0.8 - i * 0.15;
      ctx.beginPath();
      ctx.arc(0, -72, 25 + i * 8 + pulseOffset, 0, Math.PI * 2);
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
  ctx.fillRect(-15, 5, 90, 6);
  
  ctx.fillStyle = 'hsl(0, 0%, 10%)';
  ctx.fillRect(-25, -12, 20, 12);
  ctx.fillRect(5, -12, 20, 12);
  
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-22, -48 + pose.leftLegOffsetY * SCALE, 18, 36 + pose.leftLegBend * SCALE);
  ctx.fillRect(4, -48 + pose.rightLegOffsetY * SCALE, 18, 36 + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.gi;
  ctx.fillRect(-24, -96, 48, 48);
  
  ctx.fillStyle = profile.colors.belt;
  ctx.fillRect(-24, -60, 48, 8);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30, -90);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.leftArmExtension * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30, -90);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.rightArmExtension * SCALE);
  ctx.restore();
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  ctx.fillStyle = profile.colors.hair;
  ctx.fillRect(-18, -135, 36, 12);
  
  ctx.fillRect(-6, -102, 8, 8);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -118, 12, 6);
  ctx.fillRect(0, -118, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -116, 5, 3);
  ctx.fillRect(3, -116, 5, 3);
  
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.steel_wire;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, -84);
    ctx.quadraticCurveTo(50, -108, 65, -72);
    ctx.stroke();
  }
  
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
  
  ctx.restore();
}

function renderLeroyRootsman(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.leroy;
  
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  ctx.fillStyle = profile.colors.tech_accessories;
  ctx.fillRect(-20, -12, 18, 12);
  ctx.fillRect(2, -12, 18, 12);
  
  ctx.fillStyle = 'hsl(220, 40%, 25%)';
  ctx.fillRect(-18, -48 + pose.leftLegOffsetY * SCALE, 16, 36 + pose.leftLegBend * SCALE);
  ctx.fillRect(2, -48 + pose.rightLegOffsetY * SCALE, 16, 36 + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.rasta_shirt;
  ctx.fillRect(-24, -96, 48, 48);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30, -90);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.leftArmExtension * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30, -90);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.rightArmExtension * SCALE);
  ctx.restore();
  
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
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    ctx.fillRect(-27 + i * 9, -135, 6, 25);
  }
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -113, 5, 3);
  ctx.fillRect(3, -113, 5, 3);
  
  ctx.restore();
}

function renderRazorCyberSamurai(ctx: CanvasRenderingContext2D, fighter: Fighter, effects: any, pose: Pose) {
  const profile = AUTHENTIC_FIGHTER_PROFILES.razor;
  
  ctx.save();
  ctx.translate(0, pose.bodyOffsetY * SCALE);
  ctx.scale(1, pose.bodySquash);
  ctx.rotate((pose.bodyTilt * Math.PI) / 180);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-15, 5, 90, 6);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-20, -12, 20, 12);
  ctx.fillRect(0, -12, 20, 12);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-18, -48 + pose.leftLegOffsetY * SCALE, 16, 36 + pose.leftLegBend * SCALE);
  ctx.fillRect(2, -48 + pose.rightLegOffsetY * SCALE, 16, 36 + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-24, -96, 48, 48);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30, -90);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.leftArmExtension * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30, -90);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.rightArmExtension * SCALE);
  ctx.restore();
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  ctx.fillStyle = profile.colors.ninja_suit;
  ctx.fillRect(-21, -105, 42, 15);
  
  ctx.fillStyle = profile.colors.cyber_eyes;
  ctx.fillRect(-12, -115, 8, 4);
  ctx.fillRect(4, -115, 8, 4);
  
  if (fighter.state.current === 'attacking' || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.katana;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.katana;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(30, -90);
    ctx.lineTo(60, -120);
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
  ctx.fillRect(-15, 5, 90, 6);
  
  ctx.fillStyle = 'hsl(25, 50%, 25%)';
  ctx.fillRect(-20, -12, 20, 12);
  ctx.fillRect(0, -12, 20, 12);
  
  ctx.fillStyle = 'hsl(120, 80%, 30%)';
  ctx.fillRect(-18, -48 + pose.leftLegOffsetY * SCALE, 16, 36 + pose.leftLegBend * SCALE);
  ctx.fillRect(2, -48 + pose.rightLegOffsetY * SCALE, 16, 36 + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = profile.colors.nature_aura;
  ctx.fillRect(-24, -96, 48, 48);
  
  ctx.fillStyle = profile.colors.skin;
  ctx.save();
  ctx.translate(-30, -90);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.leftArmExtension * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30, -90);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 36 + pose.rightArmExtension * SCALE);
  ctx.restore();
  
  ctx.fillStyle = profile.colors.skin;
  ctx.fillRect(-21, -132, 42, 36);
  
  const rastaColors = ['hsl(120, 100%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 100%, 50%)'];
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = rastaColors[i % 3];
    ctx.fillRect(-27 + i * 9, -135, 6, 25);
  }
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -113, 5, 3);
  ctx.fillRect(3, -113, 5, 3);
  
  if (effects.special || fighter.state.current === 'special') {
    ctx.strokeStyle = profile.colors.mystical_energy;
    ctx.lineWidth = 2;
    ctx.shadowColor = profile.colors.mystical_energy;
    ctx.shadowBlur = 15;
    
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.6 - i * 0.15;
      ctx.beginPath();
      ctx.arc(0, -96, 30 + i * 10, 0, Math.PI * 2);
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
  ctx.fillRect(-15, 5, 90, 6);
  
  ctx.fillStyle = 'hsl(0, 0%, 15%)';
  ctx.fillRect(-20, -12, 20, 12);
  ctx.fillRect(0, -12, 20, 12);
  
  ctx.fillStyle = 'hsl(220, 50%, 30%)';
  ctx.fillRect(-18, -48 + pose.leftLegOffsetY * SCALE, 16, 36 + pose.leftLegBend * SCALE);
  ctx.fillRect(2, -48 + pose.rightLegOffsetY * SCALE, 16, 36 + pose.rightLegBend * SCALE);
  
  ctx.fillStyle = 'hsl(200, 80%, 30%)';
  ctx.fillRect(-24, -96, 48, 48);
  
  ctx.fillStyle = 'hsl(30, 45%, 35%)';
  ctx.save();
  ctx.translate(-30, -90);
  ctx.rotate((pose.leftArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 40 + pose.leftArmExtension * SCALE);
  ctx.restore();
  
  ctx.save();
  ctx.translate(30, -90);
  ctx.rotate((pose.rightArmAngle * Math.PI) / 180);
  ctx.fillRect(0, 0, 12, 40 + pose.rightArmExtension * SCALE);
  ctx.restore();
  
  ctx.fillStyle = 'hsl(30, 45%, 35%)';
  ctx.fillRect(-21, -132, 42, 36);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(-12, -115, 12, 6);
  ctx.fillRect(0, -115, 12, 6);
  ctx.fillStyle = 'black';
  ctx.fillRect(-9, -113, 5, 3);
  ctx.fillRect(3, -113, 5, 3);
  
  ctx.restore();
}
