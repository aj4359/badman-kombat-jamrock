import { Fighter } from '@/types/gameTypes';
import { renderJordanSoundMaster } from './characters/JordanRenderer';
import { renderSifuMaster } from './characters/SifuRenderer';

interface AdvancedFighterRendererProps {
  ctx: CanvasRenderingContext2D;
  fighter: Fighter;
  effects?: {
    alpha?: number;
    shake?: { x: number; y: number };
    hueRotate?: number;
    glow?: boolean;
    flash?: boolean;
  };
}

export const renderAdvancedFighter = ({
  ctx,
  fighter,
  effects = {}
}: AdvancedFighterRendererProps) => {
  ctx.save();
  
  // Apply global effects
  if (effects.alpha !== undefined) {
    ctx.globalAlpha = effects.alpha;
  }
  
  if (effects.shake) {
    ctx.translate(effects.shake.x, effects.shake.y);
  }
  
  if (effects.hueRotate) {
    ctx.filter = `hue-rotate(${effects.hueRotate}deg)`;
  }
  
  if (effects.flash) {
    ctx.globalCompositeOperation = 'lighter';
  }
  
  // Route to character-specific renderer
  switch (fighter.id) {
    case 'jordan':
      renderJordanSoundMaster(ctx, fighter);
      break;
    case 'sifu':
      renderSifuMaster(ctx, fighter);
      break;
    case 'leroy':
    case 'rootsman':
    case 'razor':
    case 'johnwick':
      // Fallback to default for characters not yet implemented
      renderDefaultFighter(ctx, fighter);
      break;
    default:
      renderDefaultFighter(ctx, fighter);
  }
  
  ctx.restore();
};

const renderDefaultFighter = (ctx: CanvasRenderingContext2D, fighter: Fighter) => {
  const x = fighter.x;
  const y = fighter.y;
  const width = fighter.width;
  const height = fighter.height;
  
  // Simple fallback rendering
  ctx.fillStyle = '#666666';
  
  // Head
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height * 0.15, width * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // Body
  ctx.fillRect(x + width * 0.3, y + height * 0.25, width * 0.4, height * 0.4);
  
  // Arms
  ctx.fillRect(x + width * 0.1, y + height * 0.3, width * 0.15, height * 0.3);
  ctx.fillRect(x + width * 0.75, y + height * 0.3, width * 0.15, height * 0.3);
  
  // Legs
  ctx.fillRect(x + width * 0.3, y + height * 0.65, width * 0.15, height * 0.35);
  ctx.fillRect(x + width * 0.55, y + height * 0.65, width * 0.15, height * 0.35);
};
