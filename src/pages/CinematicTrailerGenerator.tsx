import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CinematicRecorder } from '@/components/game/CinematicRecorder';

interface TrailerSegment {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  prompt: string;
  visualType: 'title' | 'combat' | 'montage' | 'cameos' | 'finale' | 'outro';
}

const TRAILER_SEGMENTS: TrailerSegment[] = [
  {
    id: 1,
    name: 'Logo Reveal',
    startTime: 0,
    endTime: 6,
    duration: 6,
    prompt: 'Ultra-cinematic shot of a dark rainy Kingston street at night. Neon reflections in puddles. Camera slowly pushes in. A metallic BADMAN KOMBAT logo emerges from the shadows with subtle gold edges. Gritty anime realism, John Wick energy, soft thunder in the distance.',
    visualType: 'title'
  },
  {
    id: 2,
    name: 'Main Fight',
    startTime: 6,
    endTime: 20,
    duration: 14,
    prompt: 'Leroy and Elder Zion facing off in a narrow Kingston alley in heavy rain. Handheld camera feeling, close-ups of their eyes, fists, and feet. Fast but readable punches and blocks, each impact synced to the beat. Wet asphalt, streetlight glow, no superpowers yet, just raw skill. Style: 90s anime film.',
    visualType: 'combat'
  },
  {
    id: 3,
    name: 'Character Cameos',
    startTime: 20,
    endTime: 35,
    duration: 15,
    prompt: 'Very fast montage of silhouettes only: a long-haired suited gunfighter reloading in the rain (John Wick vibe), a cloaked hunter with invisible shimmer (Predator vibe), a sleek panther-like armored warrior landing (Black Panther vibe), a trenchcoat swordsman with glowing blade (Blade vibe), a caped vigilante on a rooftop (Batman vibe). Each shot 0.3–0.5s, hard cuts on the beat, no faces, no logos, just iconic shadows.',
    visualType: 'cameos'
  },
  {
    id: 4,
    name: 'Gameplay Montage',
    startTime: 35,
    endTime: 55,
    duration: 20,
    prompt: 'Gameplay-style montage of BadMan Kombat: multiple fighters battling across different arenas — Rain Kingston streets, neon-lit Cyber ALTAR temple, jungle ruins with old tech, futuristic rooftop at night. Show combos, specials, dodges, slow-motion impact moments, camera whip transitions. Art style: Street Fighter II The Animated Movie crossed with Afro-cyberpunk, sharp, bold, cinematic.',
    visualType: 'montage'
  },
  {
    id: 5,
    name: 'Final Clash',
    startTime: 55,
    endTime: 70,
    duration: 15,
    prompt: 'Back to Leroy versus Elder Zion. Leroy charges a golden Solar Chi Burn, smoke forming ancestral faces behind him. Elder Zion charges a thunder-infused knee strike. Both launch at each other in slow motion as the rain freezes around them. Massive energy collision lights up the city skyline. Shockwave and light fill the frame.',
    visualType: 'finale'
  },
  {
    id: 6,
    name: 'Credits',
    startTime: 70,
    endTime: 75,
    duration: 5,
    prompt: 'Black background with subtle drifting smoke and glowing particles. BADMAN KOMBAT logo in distressed gold stencil appears. Underneath: "THE FIGHT FOR LEGACY BEGINS." Then small text: "Always bet on Black." Subtle © TA GuruLabs / BadMan Kombat 2025 watermark at the bottom.',
    visualType: 'outro'
  }
];

export default function CinematicTrailerGenerator() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSegment, setCurrentSegment] = useState<TrailerSegment>(TRAILER_SEGMENTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
    }
  }, []);

  useEffect(() => {
    const segment = TRAILER_SEGMENTS.find(
      s => currentTime >= s.startTime && currentTime < s.endTime
    );
    if (segment && segment.id !== currentSegment.id) {
      setCurrentSegment(segment);
    }
  }, [currentTime]);

  const renderFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Background gradient based on segment
    const gradients = {
      title: ['#000000', '#1a0f2e'],
      combat: ['#0a0a1f', '#1f1f3a'],
      cameos: ['#000000', '#0a0520'],
      montage: ['#1a0520', '#3a1f5a'],
      finale: ['#2a1f0a', '#5a3f1a'],
      outro: ['#000000', '#000000']
    };

    const [color1, color2] = gradients[currentSegment.visualType];
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, color1);
    bgGrad.addColorStop(1, color2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Render segment-specific content
    switch (currentSegment.visualType) {
      case 'title':
        renderTitleSegment(ctx, width, height);
        break;
      case 'combat':
        renderCombatSegment(ctx, width, height);
        break;
      case 'cameos':
        renderCameosSegment(ctx, width, height);
        break;
      case 'montage':
        renderMontageSegment(ctx, width, height);
        break;
      case 'finale':
        renderFinaleSegment(ctx, width, height);
        break;
      case 'outro':
        renderOutroSegment(ctx, width, height);
        break;
    }

    // Progress indicator
    const progress = currentTime / 75;
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.fillRect(0, height - 4, width * progress, 4);
  };

  const renderTitleSegment = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const segmentProgress = (currentTime - 0) / 6;
    
    // Rain effect
    for (let i = 0; i < 50; i++) {
      ctx.strokeStyle = `rgba(100, 150, 255, ${0.3 * segmentProgress})`;
      ctx.lineWidth = 1;
      const x = (i * 37) % w;
      const y = ((currentTime * 200 + i * 50) % h);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 2, y + 20);
      ctx.stroke();
    }

    // Logo text
    ctx.save();
    ctx.translate(w / 2, h / 2);
    const scale = Math.min(1, segmentProgress * 2);
    ctx.scale(scale, scale);
    
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BADMAN', 0, -40);
    ctx.fillText('KOMBAT', 0, 60);
    
    ctx.restore();
  };

  const renderCombatSegment = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const segmentProgress = (currentTime - 6) / 14;
    
    // Rain
    for (let i = 0; i < 80; i++) {
      ctx.strokeStyle = 'rgba(150, 180, 255, 0.4)';
      ctx.lineWidth = 2;
      const x = (i * 23) % w;
      const y = ((currentTime * 300 + i * 70) % h);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 3, y + 30);
      ctx.stroke();
    }

    // Fighters silhouettes
    const shake = Math.sin(currentTime * 20) * 5;
    
    // Leroy (left)
    ctx.fillStyle = 'rgba(255, 200, 100, 0.9)';
    ctx.fillRect(w * 0.25 + shake, h * 0.4, 80, 200);
    
    // Elder Zion (right)
    ctx.fillStyle = 'rgba(150, 150, 200, 0.9)';
    ctx.fillRect(w * 0.65 - shake, h * 0.4, 80, 200);

    // Impact flashes
    if (Math.floor(currentTime * 4) % 2 === 0) {
      const flashX = w * 0.5 + Math.sin(currentTime * 10) * 100;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(flashX, h * 0.5, 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text overlay
    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RAW SKILL', w / 2, h * 0.15);
  };

  const renderCameosSegment = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const segmentTime = currentTime - 20;
    const cameoIndex = Math.floor(segmentTime / 0.5) % 5;
    
    const cameos = [
      { name: 'GUNSLINGER', color: '#8B4513' },
      { name: 'HUNTER', color: '#2F4F4F' },
      { name: 'PANTHER', color: '#4B0082' },
      { name: 'BLADE', color: '#8B0000' },
      { name: 'VIGILANTE', color: '#1C1C1C' }
    ];

    const cameo = cameos[cameoIndex];
    
    // Silhouette
    ctx.fillStyle = cameo.color;
    const silhouetteX = w / 2 + (Math.sin(cameoIndex) * 200);
    const silhouetteY = h / 2;
    ctx.fillRect(silhouetteX - 60, silhouetteY - 100, 120, 250);

    // Name flash
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(cameo.name, w / 2, h * 0.85);
  };

  const renderMontageSegment = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const segmentTime = currentTime - 35;
    const beat = Math.floor(segmentTime * 2) % 4;
    
    // Arena backgrounds (cycling)
    const arenas = ['KINGSTON', 'CYBER ALTAR', 'JUNGLE RUINS', 'ROOFTOP'];
    const arenaColors = ['#1a3a4a', '#4a1a4a', '#2a4a1a', '#4a2a1a'];
    
    ctx.fillStyle = arenaColors[beat];
    ctx.fillRect(0, 0, w, h);

    // Multiple fighters
    for (let i = 0; i < 4; i++) {
      const x = (w / 5) * (i + 1);
      const y = h / 2 + Math.sin(currentTime * 3 + i) * 100;
      const hue = (i * 90 + currentTime * 50) % 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.fillRect(x - 40, y - 80, 80, 160);
    }

    // Arena name
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(arenas[beat], w / 2, h * 0.12);

    // Combo text
    if (Math.floor(segmentTime * 4) % 3 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 96px Arial';
      ctx.fillText('COMBO!', w / 2, h / 2);
    }
  };

  const renderFinaleSegment = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const segmentProgress = (currentTime - 55) / 15;
    
    // Energy buildup
    const energy = segmentProgress * 200;
    
    // Leroy golden aura (left)
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + segmentProgress * 0.5})`;
    ctx.beginPath();
    ctx.arc(w * 0.3, h / 2, energy, 0, Math.PI * 2);
    ctx.fill();
    
    // Elder Zion blue aura (right)
    ctx.fillStyle = `rgba(100, 150, 255, ${0.3 + segmentProgress * 0.5})`;
    ctx.beginPath();
    ctx.arc(w * 0.7, h / 2, energy, 0, Math.PI * 2);
    ctx.fill();

    // Collision point
    if (segmentProgress > 0.7) {
      const collision = (segmentProgress - 0.7) * 5;
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, collision * 300, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ULTIMATE CLASH', w / 2, h * 0.15);
  };

  const renderOutroSegment = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const segmentProgress = (currentTime - 70) / 5;
    
    // Smoke particles
    for (let i = 0; i < 30; i++) {
      const x = w / 2 + Math.sin(i + currentTime) * 300;
      const y = h / 2 + Math.cos(i + currentTime * 0.5) * 200;
      ctx.fillStyle = `rgba(80, 80, 80, ${0.1 * segmentProgress})`;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Logo
    ctx.fillStyle = `rgba(255, 215, 0, ${segmentProgress})`;
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BADMAN KOMBAT', w / 2, h / 2 - 60);

    // Tagline
    ctx.font = 'bold 42px Arial';
    ctx.fillText('THE FIGHT FOR LEGACY BEGINS', w / 2, h / 2 + 30);

    // Signature
    ctx.font = '32px Arial';
    ctx.fillText('Always bet on Black.', w / 2, h / 2 + 90);

    // Copyright
    ctx.font = '20px Arial';
    ctx.fillStyle = `rgba(200, 200, 200, ${segmentProgress * 0.7})`;
    ctx.fillText('© TA GuruLabs / BadMan Kombat 2025', w / 2, h * 0.92);
  };

  const animate = () => {
    if (!isPlaying) return;
    
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }

    renderFrame();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      audioRef.current.play();
      animate();
    }
    setIsPlaying(!isPlaying);
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setIsPlaying(true);
    animate();
  };

  useEffect(() => {
    renderFrame();
  }, [currentSegment, currentTime]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Cinematic Trailer Generator</h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                className="w-full aspect-video bg-black"
              />
              <audio
                ref={audioRef}
                src="/assets/audio/battlefield-soundtrack.mp3"
                onEnded={() => {
                  setIsPlaying(false);
                  setIsGenerating(false);
                }}
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlayback}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>

              <div className="flex-1">
                <div className="text-sm font-mono text-muted-foreground">
                  {currentTime.toFixed(1)}s / 75.0s
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Segment {currentSegment.id}: {currentSegment.name}
                </div>
              </div>
            </div>
          </div>

          {/* Segment Timeline */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Trailer Timeline (75s)</h3>
              
              <div className="space-y-3">
                {TRAILER_SEGMENTS.map((segment) => (
                  <div
                    key={segment.id}
                    className={`p-4 rounded-lg border transition-all ${
                      currentSegment.id === segment.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{segment.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {segment.startTime}s - {segment.endTime}s ({segment.duration}s)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {segment.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={startGeneration}
              disabled={isGenerating}
              size="lg"
              className="w-full gap-2"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Generate Trailer'}
            </Button>

            {isGenerating && (
              <div className="text-center text-sm text-muted-foreground">
                Rendering cinematic trailer... {Math.round((currentTime / 75) * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>

      <CinematicRecorder
        canvasRef={canvasRef}
        config={{ duration: 75000 }}
      />
    </div>
  );
}
