import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParallaxHero = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentTagline, setCurrentTagline] = useState(0);

  const taglines = [
    "KINGSTON RISES",
    "CHOOSE YOUR DESTINY", 
    "ENTER THE ARENA"
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Parallax Background Layers */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-red-900/20 to-black"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      
      <div 
        className="absolute inset-0 bg-[url('/assets/kingston-street-scene-1.jpg')] bg-cover bg-center opacity-20"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: `translateY(${scrollY * 0.2}px)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Glitch Title */}
        <div className="mb-8 relative">
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-4 relative">
            <span className="relative inline-block animate-pulse">
              BADMAN
            </span>
            <br />
            <span className="relative inline-block bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text animate-pulse">
              KOMBAT
            </span>
          </h1>
          
          {/* Neon Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600/30 to-orange-600/30 blur-3xl -z-10 animate-pulse" />
        </div>

        {/* Dynamic Tagline */}
        <div className="h-16 mb-12">
          <p className="text-2xl md:text-3xl text-orange-500 font-bold animate-fade-in">
            {taglines[currentTagline]}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button
            size="lg"
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-xl px-12 py-8 shadow-2xl hover:scale-105 transition-transform"
          >
            <Play className="mr-2 h-6 w-6" />
            PLAY NOW
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/character-select')}
            className="border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold text-xl px-12 py-8 hover:scale-105 transition-transform"
          >
            <Users className="mr-2 h-6 w-6" />
            SELECT FIGHTER
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/john-wick-trailer')}
            className="border-2 border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white font-bold text-xl px-12 py-8 hover:scale-105 transition-transform"
          >
            <Zap className="mr-2 h-6 w-6" />
            WATCH TRAILER
          </Button>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-red-500 mb-2">9</div>
            <div className="text-white/70 text-sm uppercase">Fighters</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-orange-500 mb-2">15</div>
            <div className="text-white/70 text-sm uppercase">Stages</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-500 mb-2">100+</div>
            <div className="text-white/70 text-sm uppercase">Combos</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
