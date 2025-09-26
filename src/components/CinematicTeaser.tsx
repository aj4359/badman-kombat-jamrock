import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Play, Pause } from 'lucide-react';

// Import fighter images
import leroySprite from '@/assets/leroy-sprite.png';
import razorSprite from '@/assets/razor-sprite.png';
import voltageSprite from '@/assets/voltage-sprite.png';
import blazeSprite from '@/assets/blaze-sprite.png';
import jordanSprite from '@/assets/jordan-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';
import rootsmanSprite from '@/assets/rootsman-sprite.png';
import elderZionSprite from '@/assets/elder-zion-sprite.png';
import marcusSprite from '@/assets/marcus-sprite.png';

const fighters = [
  { name: 'Leroy "Cyber Storm"', image: leroySprite, title: 'TRENCH TOWN TECHNOMANCER' },
  { name: 'Razor "Neon Blade"', image: razorSprite, title: 'SPANISH TOWN SAMURAI' },
  { name: 'Voltage "Electric Queen"', image: voltageSprite, title: 'LIGHTNING EMPRESS' },
  { name: 'Blaze "Fire Rasta"', image: blazeSprite, title: 'BLUE MOUNTAIN MYSTIC' },
  { name: 'Jordan "Sound Master"', image: jordanSprite, title: 'DANCEHALL WARRIOR' },
  { name: 'Sifu YK Leung', image: sifuSprite, title: 'STEEL WIRE SAGE' },
  { name: 'Rootsman Zion', image: rootsmanSprite, title: 'TECH-NATURE HYBRID' },
  { name: 'Elder Zion', image: elderZionSprite, title: 'SPIRITUAL WARRIOR' },
  { name: 'Marcus "Iron Fist"', image: marcusSprite, title: 'STREET CHAMPION' }
];

export const CinematicTeaser: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const scenes = [
    { type: 'title', duration: 2000 },
    { type: 'fighters', duration: 4000 },
    { type: 'action', duration: 3000 },
    { type: 'coming-soon', duration: 2000 },
    { type: 'credits', duration: 1500 }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, scenes[currentScene]?.duration || 2000);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for TikTok/Instagram (9:16 aspect ratio)
    canvas.width = 540;
    canvas.height = 960;

    renderScene(ctx, canvas);
  }, [currentScene, isPlaying]);

  const renderScene = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;
    
    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Add neon grid background
    drawNeonGrid(ctx, width, height);

    const scene = scenes[currentScene];
    
    switch (scene?.type) {
      case 'title':
        renderTitleScene(ctx, width, height);
        break;
      case 'fighters':
        renderFightersScene(ctx, width, height);
        break;
      case 'action':
        renderActionScene(ctx, width, height);
        break;
      case 'coming-soon':
        renderComingSoonScene(ctx, width, height);
        break;
      case 'credits':
        renderCreditsScene(ctx, width, height);
        break;
    }

    // Add cinematic black bars
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, 60);
    ctx.fillRect(0, height - 60, width, 60);
  };

  const drawNeonGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const renderTitleScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Glitch effect background
    ctx.fillStyle = 'rgba(255, 0, 100, 0.1)';
    ctx.fillRect(Math.random() * 20, Math.random() * 20, width, height);

    // Main title
    ctx.font = 'bold 48px "Orbitron", monospace';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 20;
    ctx.fillText('BADMAN', width / 2, height / 2 - 40);
    
    ctx.font = 'bold 52px "Orbitron", monospace';
    ctx.fillStyle = '#FF0080';
    ctx.shadowColor = '#FF0080';
    ctx.fillText('KOMBAT', width / 2, height / 2 + 20);

    // Subtitle
    ctx.font = 'bold 20px "Rajdhani", sans-serif';
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 10;
    ctx.fillText('KINGSTON RISING', width / 2, height / 2 + 80);

    // Year
    ctx.font = 'bold 16px "Rajdhani", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 5;
    ctx.fillText('1980', width / 2, height / 2 + 120);
  };

  const renderFightersScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const fighterIndex = Math.floor((Date.now() / 500) % fighters.length);
    const fighter = fighters[fighterIndex];

    // Load and draw fighter image
    const img = new Image();
    img.onload = () => {
      // Draw fighter with cinematic effect
      ctx.save();
      ctx.globalAlpha = 0.9;
      
      // Calculate position to center the fighter
      const imgWidth = 300;
      const imgHeight = 400;
      const x = (width - imgWidth) / 2;
      const y = (height - imgHeight) / 2 - 50;
      
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
      
      // Add neon outline
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00FFFF';
      ctx.shadowBlur = 15;
      ctx.strokeRect(x, y, imgWidth, imgHeight);
      
      ctx.restore();

      // Fighter name
      ctx.font = 'bold 24px "Orbitron", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 10;
      ctx.fillText(fighter.name, width / 2, height - 150);

      // Fighter title
      ctx.font = 'bold 16px "Rajdhani", sans-serif';
      ctx.fillStyle = '#FF0080';
      ctx.shadowColor = '#FF0080';
      ctx.fillText(fighter.title, width / 2, height - 120);
    };
    img.src = fighter.image;
  };

  const renderActionScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Action burst effect
    const time = Date.now() / 1000;
    const burst = Math.sin(time * 10) * 0.5 + 0.5;
    
    ctx.fillStyle = `rgba(255, 255, 0, ${burst * 0.3})`;
    ctx.fillRect(0, 0, width, height);

    // Action text
    ctx.font = 'bold 36px "Orbitron", monospace';
    ctx.fillStyle = '#FFFF00';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 20;
    ctx.fillText('FIGHT FOR', width / 2, height / 2 - 60);
    
    ctx.font = 'bold 42px "Orbitron", monospace';
    ctx.fillStyle = '#00FF00';
    ctx.shadowColor = '#00FF00';
    ctx.fillText('KINGSTON', width / 2, height / 2);
    
    ctx.font = 'bold 38px "Orbitron", monospace';
    ctx.fillStyle = '#FF4444';
    ctx.shadowColor = '#FF4444';
    ctx.fillText('SURVIVE THE STREETS', width / 2, height / 2 + 80);
  };

  const renderComingSoonScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Pulsing background
    const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(0, 255, 255, ${pulse * 0.1})`;
    ctx.fillRect(0, 0, width, height);

    // Coming Soon text
    ctx.font = 'bold 48px "Orbitron", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 30;
    ctx.fillText('COMING', width / 2, height / 2 - 40);
    
    ctx.font = 'bold 52px "Orbitron", monospace';
    ctx.fillStyle = '#00FFFF';
    ctx.shadowColor = '#00FFFF';
    ctx.fillText('SOON', width / 2, height / 2 + 20);

    // Tagline
    ctx.font = 'bold 18px "Rajdhani", sans-serif';
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 10;
    ctx.fillText('The Ultimate Street Fighter Experience', width / 2, height / 2 + 100);
  };

  const renderCreditsScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark background with subtle glow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, width, height);

    // TA GuruLabs branding
    ctx.font = 'bold 24px "Orbitron", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 15;
    ctx.fillText('A TA GURULABS', width / 2, height / 2 - 20);
    
    ctx.font = 'bold 28px "Orbitron", monospace';
    ctx.fillStyle = '#00FFFF';
    ctx.shadowColor = '#00FFFF';
    ctx.fillText('PRODUCTION', width / 2, height / 2 + 20);

    // Copyright notice
    ctx.font = 'bold 14px "Rajdhani", sans-serif';
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 8;
    ctx.fillText('© 2024 TA GuruLabs. All Rights Reserved.', width / 2, height / 2 + 80);

    // Built with Lovable
    ctx.font = 'bold 12px "Rajdhani", sans-serif';
    ctx.fillStyle = '#FF0080';
    ctx.shadowColor = '#FF0080';
    ctx.shadowBlur = 5;
    ctx.fillText('Built with Lovable.dev', width / 2, height / 2 + 120);
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stream = canvas.captureStream(30); // 30 FPS
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'badman-kombat-teaser.webm';
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setIsPlaying(true);
    setCurrentScene(0);

    // Stop recording after full cycle
    setTimeout(() => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsPlaying(false);
      }
    }, 12500); // Total duration of all scenes including credits
  };

  const togglePlayback = () => {
    if (isRecording) return;
    
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentScene(0);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-retro font-bold text-neon-cyan mb-2 glitch" data-text="CINEMATIC TEASER">
          CINEMATIC TEASER
        </h1>
        <p className="text-lg font-body text-foreground/80">
          John Wick style promotional video for social media
        </p>
      </div>

      <div className="relative mb-6">
        <canvas 
          ref={canvasRef}
          className="border-2 border-neon-cyan/50 rounded-lg shadow-neon-cyan/20"
          style={{ maxWidth: '300px', height: 'auto' }}
        />
        
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            REC
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={togglePlayback}
          disabled={isRecording}
          variant="neon"
          className="flex items-center gap-2"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Preview'}
        </Button>
        
        <Button 
          onClick={startRecording}
          disabled={isRecording}
          variant="combat"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isRecording ? 'Recording...' : 'Download Teaser'}
        </Button>
      </div>

      <div className="mt-6 text-center max-w-md">
        <p className="text-sm text-foreground/60">
          Creates a cinematic teaser video optimized for TikTok/LinkedIn. 
          Features all your fighters with John Wick-style effects and transitions.
          Video duration: ~12.5 seconds, perfect for social media.
          © 2024 TA GuruLabs Production.
        </p>
      </div>
    </div>
  );
};