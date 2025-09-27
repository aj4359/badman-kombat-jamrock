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
    id: 'intro',
    title: 'Opening',
    duration: 3000,
    voiceover: "In the digital streets of Kingston...",
    visualElement: 'kingston-street-pan',
    effects: ['film-grain', 'neon-glow']
  },
  {
    id: 'fighters',
    title: 'Character Showcase',
    duration: 5000,
    voiceover: "Warriors from every corner of Jamaica unite for the ultimate kombat!",
    visualElement: 'fighter-montage',
    effects: ['character-spotlight', 'energy-bursts']
  },
  {
    id: 'action',
    title: 'Combat Sequences',
    duration: 4000,
    voiceover: "Experience the power of authentic Jamaican martial arts!",
    visualElement: 'combat-showcase',
    effects: ['hit-sparks', 'screen-shake', 'slow-motion']
  },
  {
    id: 'special',
    title: 'Special Moves',
    duration: 4000,
    voiceover: "Master devastating special moves inspired by Caribbean culture!",
    visualElement: 'special-moves',
    effects: ['super-effects', 'energy-waves']
  },
  {
    id: 'climax',
    title: 'Epic Finish',
    duration: 3000,
    voiceover: "This is BadMan Kombat... Jamrock Edition!",
    visualElement: 'title-reveal',
    effects: ['title-glow', 'epic-music-crescendo']
  },
  {
    id: 'cta',
    title: 'Call to Action',
    duration: 2000,
    voiceover: "Coming Soon to digital battlegrounds everywhere!",
    visualElement: 'coming-soon',
    effects: ['fade-to-black', 'release-info']
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
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - Deep movie trailer voice
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

  // Render trailer scene on canvas
  const renderScene = (scene: TrailerScene, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions for cinema quality
    canvas.width = 1920;
    canvas.height = 1080;

    // Clear canvas with cinematic black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply film grain effect
    if (scene.effects.includes('film-grain')) {
      ctx.save();
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          1, 1
        );
      }
      ctx.restore();
    }

    // Render scene-specific content
    switch (scene.visualElement) {
      case 'kingston-street-pan':
        renderKingstonStreet(ctx, canvas);
        break;
      case 'fighter-montage':
        renderFighterMontage(ctx, canvas);
        break;
      case 'combat-showcase':
        renderCombatShowcase(ctx, canvas);
        break;
      case 'special-moves':
        renderSpecialMoves(ctx, canvas);
        break;
      case 'title-reveal':
        renderTitleReveal(ctx, canvas);
        break;
      case 'coming-soon':
        renderComingSoon(ctx, canvas);
        break;
    }

    // Apply neon glow effects
    if (scene.effects.includes('neon-glow')) {
      ctx.save();
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
      ctx.restore();
    }
  };

  const renderKingstonStreet = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Gradient sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FF6B35'); // Orange sunset
    gradient.addColorStop(0.6, '#F7931E'); // Yellow
    gradient.addColorStop(1, '#2E1A47'); // Dark purple
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Street silhouettes
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    // Palm trees silhouettes
    drawPalmTree(ctx, 200, canvas.height * 0.4);
    drawPalmTree(ctx, canvas.width - 200, canvas.height * 0.5);

    // Text overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('KINGSTON STREETS', canvas.width / 2, canvas.height / 2);
  };

  const renderFighterMontage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Dark background with spotlight effects
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Character spotlight circles
    const spotlights = [
      { x: canvas.width * 0.25, y: canvas.height * 0.5, name: 'LEROY' },
      { x: canvas.width * 0.75, y: canvas.height * 0.5, name: 'JORDAN' }
    ];

    spotlights.forEach(spot => {
      // Spotlight gradient
      const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, 200);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Character name
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(spot.name, spot.x, spot.y + 150);
    });
  };

  const renderCombatShowcase = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Action background
    ctx.fillStyle = '#1a0000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Energy burst effects
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Combat text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.strokeText('AUTHENTIC KOMBAT', canvas.width / 2, canvas.height / 2);
    ctx.fillText('AUTHENTIC KOMBAT', canvas.width / 2, canvas.height / 2);
  };

  const renderSpecialMoves = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Electric blue background
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lightning effects
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, 0);
      
      for (let j = 0; j < 5; j++) {
        ctx.lineTo(
          Math.random() * canvas.width,
          (j + 1) * (canvas.height / 5)
        );
      }
      ctx.stroke();
    }

    // Special moves text
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DEVASTATING SPECIALS', canvas.width / 2, canvas.height / 2);
  };

  const renderTitleReveal = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Jamaica flag colors background
    const sections = [
      { color: '#009639', height: canvas.height / 3 },
      { color: '#FFD320', height: canvas.height / 3 },
      { color: '#009639', height: canvas.height / 3 }
    ];

    let y = 0;
    sections.forEach(section => {
      ctx.fillStyle = section.color;
      ctx.fillRect(0, y, canvas.width, section.height);
      y += section.height;
    });

    // Epic title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeText('BADMAN KOMBAT', canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText('BADMAN KOMBAT', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = 'bold 72px Arial';
    ctx.strokeText('JAMROCK EDITION', canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('JAMROCK EDITION', canvas.width / 2, canvas.height / 2 + 50);
  };

  const renderComingSoon = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Fade to black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Coming soon text
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 84px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('COMING SOON', canvas.width / 2, canvas.height / 2);

    // Website/info
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px Arial';
    ctx.fillText('lovable.dev', canvas.width / 2, canvas.height / 2 + 100);
  };

  const drawPalmTree = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Tree trunk
    ctx.fillStyle = '#4a3728';
    ctx.fillRect(x - 10, y, 20, 200);

    // Palm fronds
    ctx.strokeStyle = '#2d5a2d';
    ctx.lineWidth = 8;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * 80, y + Math.sin(angle) * 80);
      ctx.stroke();
    }
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
      
      // Speak the voiceover for this scene
      speak(scene.voiceover);
      
      // Render the scene
      renderScene(scene, canvas);
      
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
        renderScene(scene, canvasRef.current!);
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
          className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 hover:scale-110 transition-all duration-300 shadow-lg"
          size="icon"
        >
          <Film className="w-8 h-8 text-white" />
        </Button>
      )}

      {/* Epic Trailer Creator Panel */}
      {isOpen && (
        <Card className={cn(
          'fixed top-6 left-6 z-50 w-96 max-h-[600px] overflow-y-auto',
          'bg-black/95 backdrop-blur border-2 border-red-500/50 shadow-2xl',
          className
        )}>
          <CardHeader className="bg-gradient-to-r from-red-600 to-yellow-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Film className="w-6 h-6" />
                <div>
                  <CardTitle className="text-lg font-retro">🎬 Epic Trailer</CardTitle>
                  <p className="text-sm opacity-90">Professional Movie Trailer Creator</p>
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