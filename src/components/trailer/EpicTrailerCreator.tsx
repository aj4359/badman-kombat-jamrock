import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, Play, Pause, Film, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';

interface TrailerScene {
  id: string;
  title: string;
  duration: number;
  voiceover: string;
  visualElement: string;
  effects: string[];
}

const TRAILER_SCRIPT: TrailerScene[] = [
  {
    id: 'studio',
    title: 'Studio Logo',
    duration: 2000,
    voiceover: "",
    visualElement: 'studio-logo',
    effects: ['cinematic-fade-in', 'orchestral-hit']
  },
  {
    id: 'darkness',
    title: 'Dark Opening',
    duration: 2500,
    voiceover: "In a world where honor meets violence...",
    visualElement: 'noir-opening',
    effects: ['film-noir', 'deep-shadows', 'subtle-grain']
  },
  {
    id: 'hero-intro',
    title: 'Hero Introduction',
    duration: 3000,
    voiceover: "One warrior emerges from the streets of Kingston.",
    visualElement: 'hero-silhouette',
    effects: ['dramatic-lighting', 'slow-motion-walk', 'lens-flare']
  },
  {
    id: 'villains',
    title: 'Villain Montage',
    duration: 2500,
    voiceover: "But darkness has many faces...",
    visualElement: 'villain-reveal',
    effects: ['evil-red-tint', 'quick-cuts', 'menacing-shadows']
  },
  {
    id: 'action-sequence',
    title: 'Pure Action',
    duration: 4000,
    voiceover: "When fists collide with destiny...",
    visualElement: 'john-wick-combat',
    effects: ['bullet-time', 'impact-frames', 'motion-blur', 'screen-shake']
  },
  {
    id: 'power-up',
    title: 'Special Powers',
    duration: 3000,
    voiceover: "Ancient Caribbean power flows through their veins!",
    visualElement: 'marvel-energy',
    effects: ['energy-surges', 'particle-effects', 'cosmic-background']
  },
  {
    id: 'team-assembly',
    title: 'Heroes Unite',
    duration: 2500,
    voiceover: "Together, they are unstoppable.",
    visualElement: 'avengers-assembly',
    effects: ['hero-poses', 'wind-effects', 'epic-lighting']
  },
  {
    id: 'final-showdown',
    title: 'Epic Climax',
    duration: 4000,
    voiceover: "The ultimate battle for Jamaica's soul begins NOW!",
    visualElement: 'final-battle',
    effects: ['explosive-chaos', 'rapid-cuts', 'intensity-max']
  },
  {
    id: 'title-drop',
    title: 'Title Reveal',
    duration: 3000,
    voiceover: "BadMan Kombat: Jamrock Edition",
    visualElement: 'epic-title-drop',
    effects: ['metallic-shine', 'dramatic-zoom', 'orchestral-crescendo']
  },
  {
    id: 'release-info',
    title: 'Coming Soon',
    duration: 2500,
    voiceover: "Experience the legend. Coming Soon.",
    visualElement: 'release-slate',
    effects: ['premium-fade', 'subtle-glow']
  }
];

interface EpicTrailerCreatorProps {
  className?: string;
}

export const EpicTrailerCreator: React.FC<EpicTrailerCreatorProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // ElevenLabs voice for epic movie trailer voice
  const { speak, isLoading: voiceLoading } = useElevenLabsVoice({
    voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel - Cinematic epic voice
    model: 'eleven_multilingual_v2'
  });

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Render trailer scene on canvas with cinematic effects
  const renderScene = (scene: TrailerScene, canvas: HTMLCanvasElement, time: number = 0) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions for 4K cinema quality
    canvas.width = 1920;
    canvas.height = 1080;

    // Clear canvas with pure black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply cinematic effects first
    applyCinematicEffects(ctx, canvas, scene.effects, time);

    // Render scene-specific content
    switch (scene.visualElement) {
      case 'studio-logo':
        renderStudioLogo(ctx, canvas, time);
        break;
      case 'noir-opening':
        renderNoirOpening(ctx, canvas, time);
        break;
      case 'hero-silhouette':
        renderHeroSilhouette(ctx, canvas, time);
        break;
      case 'villain-reveal':
        renderVillainReveal(ctx, canvas, time);
        break;
      case 'john-wick-combat':
        renderJohnWickCombat(ctx, canvas, time);
        break;
      case 'marvel-energy':
        renderMarvelEnergy(ctx, canvas, time);
        break;
      case 'avengers-assembly':
        renderAvengersAssembly(ctx, canvas, time);
        break;
      case 'final-battle':
        renderFinalBattle(ctx, canvas, time);
        break;
      case 'epic-title-drop':
        renderEpicTitleDrop(ctx, canvas, time);
        break;
      case 'release-slate':
        renderReleaseSlate(ctx, canvas, time);
        break;
    }

    // Apply post-processing effects
    applyPostProcessing(ctx, canvas, scene.effects, time);
  };

  // Advanced cinematic effects system
  const applyCinematicEffects = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, effects: string[], time: number) => {
    // Film grain with noise
    if (effects.includes('subtle-grain') || effects.includes('film-noir')) {
      ctx.save();
      ctx.globalAlpha = effects.includes('film-noir') ? 0.15 : 0.08;
      for (let i = 0; i < 2000; i++) {
        const noise = Math.random();
        ctx.fillStyle = noise > 0.5 ? '#ffffff' : '#000000';
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 2 + 1, Math.random() * 2 + 1
        );
      }
      ctx.restore();
    }

    // Color grading - Teal and Orange cinematic look
    if (effects.includes('cinematic-fade-in') || effects.includes('dramatic-lighting')) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 150, 180, 0.1)'); // Teal
      gradient.addColorStop(1, 'rgba(255, 140, 0, 0.1)'); // Orange
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Deep shadows for noir effect
    if (effects.includes('deep-shadows')) {
      const shadowGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = shadowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const applyPostProcessing = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, effects: string[], time: number) => {
    // Lens flare effects
    if (effects.includes('lens-flare')) {
      const flareX = canvas.width * 0.3;
      const flareY = canvas.height * 0.3;
      const flareGradient = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 200);
      flareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      flareGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      flareGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = flareGradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Screen shake effect
    if (effects.includes('screen-shake')) {
      const shakeX = (Math.random() - 0.5) * 10;
      const shakeY = (Math.random() - 0.5) * 10;
      ctx.translate(shakeX, shakeY);
    }
  };

  // Hollywood-style rendering functions
  const renderStudioLogo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Elegant black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Studio logo effect with golden letters
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 120px serif';
    ctx.textAlign = 'center';
    
    // Add metallic shine effect
    const shineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    shineGradient.addColorStop(0, '#FFD700');
    shineGradient.addColorStop(0.5, '#FFF8DC');
    shineGradient.addColorStop(1, '#B8860B');
    
    ctx.fillStyle = shineGradient;
    ctx.fillText('BADMAN STUDIOS', canvas.width / 2, canvas.height / 2);
    
    // Subtle glow
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.fillText('BADMAN STUDIOS', canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
  };

  const renderNoirOpening = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Dark, moody background
    const noirGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    noirGradient.addColorStop(0, '#1a1a1a');
    noirGradient.addColorStop(0.7, '#000000');
    noirGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = noirGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // City silhouette
    ctx.fillStyle = '#0f0f0f';
    for (let i = 0; i < 20; i++) {
      const buildingWidth = 60 + Math.random() * 80;
      const buildingHeight = 200 + Math.random() * 300;
      ctx.fillRect(i * 100, canvas.height - buildingHeight, buildingWidth, buildingHeight);
    }

    // Dramatic lighting from windows
    for (let i = 0; i < 50; i++) {
      if (Math.random() > 0.7) {
        ctx.fillStyle = '#ffff99';
        ctx.fillRect(
          Math.random() * canvas.width,
          canvas.height - Math.random() * 400,
          8, 12
        );
      }
    }
  };

  const renderHeroSilhouette = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Dramatic sunset background
    const heroGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    heroGradient.addColorStop(0, '#FF6B35');
    heroGradient.addColorStop(0.5, '#F7931E');
    heroGradient.addColorStop(1, '#2C1810');
    
    ctx.fillStyle = heroGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hero silhouette in center
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    // Simple hero figure silhouette
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.3;
    
    // Head
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Body (shoulders, torso, fighting stance)
    ctx.fillRect(centerX - 30, centerY + 40, 60, 120);
    ctx.fillRect(centerX - 50, centerY + 60, 30, 80); // Left arm
    ctx.fillRect(centerX + 20, centerY + 60, 30, 80); // Right arm
    ctx.fillRect(centerX - 20, centerY + 160, 15, 100); // Left leg
    ctx.fillRect(centerX + 5, centerY + 160, 15, 100); // Right leg

    // Dramatic backlighting
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const backlight = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
    backlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    backlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = backlight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const renderVillainReveal = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Evil red tint background
    ctx.fillStyle = '#200000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Multiple villain silhouettes emerging from shadows
    const villains = [
      { x: canvas.width * 0.2, scale: 0.8 },
      { x: canvas.width * 0.5, scale: 1.2 },
      { x: canvas.width * 0.8, scale: 0.9 }
    ];

    villains.forEach((villain, index) => {
      ctx.save();
      ctx.translate(villain.x, canvas.height * 0.3);
      ctx.scale(villain.scale, villain.scale);
      
      // Menacing figure
      ctx.fillStyle = '#000000';
      ctx.fillRect(-25, 0, 50, 100);
      ctx.arc(0, -20, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Red glowing eyes
      ctx.fillStyle = '#ff0000';
      ctx.arc(-10, -25, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.arc(10, -25, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });

    // Lightning effect
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * canvas.height);
    for (let i = 0; i < 8; i++) {
      ctx.lineTo(
        (i / 8) * canvas.width + (Math.random() - 0.5) * 100,
        Math.random() * canvas.height
      );
    }
    ctx.stroke();
  };

  const renderJohnWickCombat = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Dark action environment
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Motion blur streaks (bullet time effect)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + (Math.random() - 0.5) * 200, startY + (Math.random() - 0.5) * 100);
      ctx.stroke();
    }

    // Impact flashes
    for (let i = 0; i < 5; i++) {
      const impactX = Math.random() * canvas.width;
      const impactY = Math.random() * canvas.height;
      
      const impact = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, 80);
      impact.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      impact.addColorStop(0.3, 'rgba(255, 200, 0, 0.6)');
      impact.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = impact;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Action text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText('PRECISION', canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText('PRECISION', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.strokeText('COMBAT', canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('COMBAT', canvas.width / 2, canvas.height / 2 + 50);
  };

  const renderMarvelEnergy = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Cosmic background
    const spaceGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width
    );
    spaceGradient.addColorStop(0, '#001122');
    spaceGradient.addColorStop(0.5, '#000033');
    spaceGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Energy particles
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 4 + 1;
      
      ctx.fillStyle = `hsl(${180 + Math.random() * 180}, 100%, ${50 + Math.random() * 50}%)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Particle trail
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - Math.random() * 30, y - Math.random() * 30);
      ctx.stroke();
    }

    // Central energy surge
    const energyGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, 400
    );
    energyGradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
    energyGradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.4)');
    energyGradient.addColorStop(1, 'rgba(0, 0, 255, 0)');
    
    ctx.fillStyle = energyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Power text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 84px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.fillText('ANCIENT POWER', canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
  };

  const renderAvengersAssembly = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Epic assembly background
    const assemblyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    assemblyGradient.addColorStop(0, '#2C1810');
    assemblyGradient.addColorStop(0.7, '#1a1a1a');
    assemblyGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = assemblyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Multiple hero silhouettes in formation
    const heroes = [
      { x: canvas.width * 0.15, name: 'LEROY' },
      { x: canvas.width * 0.35, name: 'JORDAN' },
      { x: canvas.width * 0.55, name: 'RAZOR' },
      { x: canvas.width * 0.75, name: 'SIFU' }
    ];

    heroes.forEach((hero, index) => {
      // Hero silhouette
      ctx.fillStyle = '#000000';
      const heroY = canvas.height * 0.4;
      
      // Different poses for each hero
      ctx.save();
      ctx.translate(hero.x, heroY);
      
      // Head
      ctx.beginPath();
      ctx.arc(0, -20, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Body in action pose
      ctx.fillRect(-20, 10, 40, 80);
      
      // Arms in different positions
      if (index % 2 === 0) {
        ctx.fillRect(-40, 30, 25, 60); // Left arm extended
        ctx.fillRect(15, 20, 25, 70); // Right arm up
      } else {
        ctx.fillRect(-35, 20, 25, 70); // Left arm up
        ctx.fillRect(10, 30, 25, 60); // Right arm extended
      }
      
      // Legs
      ctx.fillRect(-15, 90, 12, 60);
      ctx.fillRect(3, 90, 12, 60);
      
      ctx.restore();

      // Wind effect around each hero
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let j = 0; j < 10; j++) {
        ctx.beginPath();
        ctx.arc(hero.x + (Math.random() - 0.5) * 100, heroY + (Math.random() - 0.5) * 100, 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Epic text overlay
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText('WARRIORS UNITE', canvas.width / 2, canvas.height * 0.8);
    ctx.fillText('WARRIORS UNITE', canvas.width / 2, canvas.height * 0.8);
  };

  const renderFinalBattle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Explosive chaos background
    ctx.fillStyle = '#330000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Multiple explosion effects
    for (let i = 0; i < 8; i++) {
      const expX = Math.random() * canvas.width;
      const expY = Math.random() * canvas.height;
      const expSize = 100 + Math.random() * 200;
      
      const explosion = ctx.createRadialGradient(expX, expY, 0, expX, expY, expSize);
      explosion.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      explosion.addColorStop(0.3, 'rgba(255, 200, 0, 0.7)');
      explosion.addColorStop(0.6, 'rgba(255, 100, 0, 0.5)');
      explosion.addColorStop(1, 'rgba(200, 0, 0, 0)');
      
      ctx.fillStyle = explosion;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Rapid combat flashes
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random()})`;
      ctx.lineWidth = Math.random() * 5 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Intensity text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 6;
    ctx.strokeText('ULTIMATE', canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText('ULTIMATE', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.strokeText('SHOWDOWN', canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('SHOWDOWN', canvas.width / 2, canvas.height / 2 + 50);
  };

  const renderEpicTitleDrop = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Dramatic black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Metallic title with dramatic lighting
    ctx.save();
    
    // Create metallic gradient
    const metallicGradient = ctx.createLinearGradient(0, canvas.height / 2 - 100, 0, canvas.height / 2 + 100);
    metallicGradient.addColorStop(0, '#FFD700');
    metallicGradient.addColorStop(0.3, '#FFF8DC');
    metallicGradient.addColorStop(0.7, '#DAA520');
    metallicGradient.addColorStop(1, '#B8860B');
    
    ctx.fillStyle = metallicGradient;
    ctx.font = 'bold 120px serif';
    ctx.textAlign = 'center';
    
    // Shadow for depth
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    ctx.fillText('BADMAN KOMBAT', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = 'bold 80px serif';
    ctx.fillText('JAMROCK EDITION', canvas.width / 2, canvas.height / 2 + 50);
    
    ctx.restore();

    // Lens flare burst
    const flareGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, 600
    );
    flareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    flareGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
    flareGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = flareGradient;
    ctx.globalCompositeOperation = 'screen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
  };

  const renderReleaseSlate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Elegant black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Premium gold accent line
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height / 2 - 100);
    ctx.lineTo(canvas.width * 0.8, canvas.height / 2 - 100);
    ctx.stroke();

    // Release info text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px serif';
    ctx.textAlign = 'center';
    ctx.fillText('COMING SOON', canvas.width / 2, canvas.height / 2);

    ctx.font = '48px serif';
    ctx.fillStyle = '#cccccc';
    ctx.fillText('Experience the Legend', canvas.width / 2, canvas.height / 2 + 80);

    ctx.font = '36px serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('lovable.dev/badman-kombat', canvas.width / 2, canvas.height / 2 + 140);

    // Bottom accent line
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height / 2 + 200);
    ctx.lineTo(canvas.width * 0.8, canvas.height / 2 + 200);
    ctx.stroke();

    // Subtle glow effect
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width * 0.1, canvas.height * 0.3, canvas.width * 0.8, canvas.height * 0.4);
    ctx.restore();
  };


  const createTrailer = async () => {
    if (!canvasRef.current) return;

    setIsCreating(true);
    setProgress(0);
    recordedChunks.current = [];

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30); // 30 FPS
    
    // Add audio track (placeholder - in real implementation would sync with voiceover)
    if (audioContextRef.current) {
      const audioDestination = audioContextRef.current.createMediaStreamDestination();
      stream.addTrack(audioDestination.stream.getAudioTracks()[0]);
    }

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9,opus'
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsCreating(false);
    };

    mediaRecorderRef.current.start(100); // Record in 100ms chunks

    // Animate through all scenes
    let sceneIndex = 0;
    const totalDuration = TRAILER_SCRIPT.reduce((sum, scene) => sum + scene.duration, 0);
    let elapsedTime = 0;

    const animateScene = () => {
      if (sceneIndex >= TRAILER_SCRIPT.length) {
        mediaRecorderRef.current?.stop();
        return;
      }

      const scene = TRAILER_SCRIPT[sceneIndex];
      setCurrentScene(sceneIndex);
      
      // Speak the voiceover for this scene (only if there's text)
      if (scene.voiceover && scene.voiceover.trim()) {
        speak(scene.voiceover);
      }
      
      // Animate the scene with time progression
      let sceneStartTime = Date.now();
      const animateFrame = () => {
        const currentTime = Date.now() - sceneStartTime;
        if (currentTime < scene.duration) {
          renderScene(scene, canvas, currentTime);
          requestAnimationFrame(animateFrame);
        }
      };
      animateFrame();
      
      // Update progress
      elapsedTime += scene.duration;
      setProgress((elapsedTime / totalDuration) * 100);

      // Move to next scene after duration
      setTimeout(() => {
        sceneIndex++;
        animateScene();
      }, scene.duration);
    };

    animateScene();
  };

  const downloadTrailer = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'badman-kombat-epic-trailer.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const previewTrailer = () => {
    if (!canvasRef.current) return;

    setIsPreviewPlaying(!isPreviewPlaying);
    
    if (!isPreviewPlaying) {
      // Start preview animation
      let sceneIndex = 0;
      const previewAnimation = () => {
        if (sceneIndex >= TRAILER_SCRIPT.length || !isPreviewPlaying) {
          setIsPreviewPlaying(false);
          return;
        }

        const scene = TRAILER_SCRIPT[sceneIndex];
        renderScene(scene, canvasRef.current!, 0);
        setCurrentScene(sceneIndex);

        setTimeout(() => {
          sceneIndex++;
          previewAnimation();
        }, 1000); // Faster preview
      };
      previewAnimation();
    }
  };

  return (
    <>
      {/* Floating Trailer Creator Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-600 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 shadow-xl border-2 border-gold animate-pulse"
          size="icon"
        >
          <Film className="w-10 h-10 text-white drop-shadow-lg" />
        </Button>
      )}

      {/* Epic Trailer Creator Panel */}
      {isOpen && (
        <Card className={cn(
          'fixed top-6 left-6 z-50 w-96 max-h-[600px] overflow-y-auto',
          'bg-black/95 backdrop-blur border-2 border-red-500/50 shadow-2xl',
          className
        )}>
          <CardHeader className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6 border-b border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">🎬 EPIC CINEMATIC TRAILER</CardTitle>
                  <p className="text-sm text-gray-300">Hollywood-Quality Movie Trailer Generator</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Canvas Preview */}
            <div className="bg-black rounded-lg overflow-hidden border border-gray-600">
              <canvas
                ref={canvasRef}
                width={320}
                height={180}
                className="w-full h-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Scene Progress */}
            {isCreating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Creating Epic Trailer...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Scene {currentScene + 1}: {TRAILER_SCRIPT[currentScene]?.title}
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                onClick={previewTrailer}
                disabled={isCreating}
                variant="outline"
                className="flex-1"
              >
                {isPreviewPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Preview
              </Button>
              
              <Button
                onClick={createTrailer}
                disabled={isCreating || voiceLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Mic className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>

            {/* Download */}
            {downloadUrl && (
              <Button
                onClick={downloadTrailer}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Epic Trailer
              </Button>
            )}

            {/* Trailer Script Preview */}
            <div className="space-y-2">
              <h4 className="font-retro font-bold text-sm text-yellow-400">Trailer Script</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {TRAILER_SCRIPT.map((scene, index) => (
                  <div
                    key={scene.id}
                    className={cn(
                      'p-3 rounded-lg border text-xs',
                      index === currentScene 
                        ? 'bg-red-500/20 border-red-500/70' 
                        : 'bg-gray-800/50 border-gray-600'
                    )}
                  >
                    <div className="font-bold text-yellow-400">{scene.title}</div>
                    <div className="text-gray-300 italic">"{scene.voiceover}"</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {scene.duration / 1000}s • {scene.effects.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};