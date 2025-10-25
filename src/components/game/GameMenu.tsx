import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Play, 
  Users, 
  Video, 
  Sparkles, 
  GraduationCap, 
  Home,
  Settings,
  Trophy,
  X
} from 'lucide-react';

interface GameMenuProps {
  onResume: () => void;
  isPaused: boolean;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onResume, isPaused }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    setIsVisible(isPaused);
  }, [isPaused]);

  if (!isVisible) return null;

  const menuItems = [
    { icon: Play, label: 'Resume Game', action: () => { setIsVisible(false); onResume(); }, color: 'text-neon-green' },
    { icon: Users, label: 'Character Select', action: () => navigate('/character-select'), color: 'text-neon-cyan' },
    { icon: Video, label: 'Drone Trailer', action: () => navigate('/drone-trailer'), color: 'text-neon-pink' },
    { icon: Sparkles, label: 'Fighter Generator', action: () => navigate('/fighter-generator'), color: 'text-neon-orange' },
    { icon: Trophy, label: 'Arcade Mode', action: () => navigate('/arcade'), color: 'text-neon-yellow' },
    { icon: GraduationCap, label: 'Tutorial', action: () => navigate('/tutorial'), color: 'text-neon-purple' },
    { icon: Home, label: 'Main Menu', action: () => navigate('/'), color: 'text-neon-green' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <Card className="relative w-full max-w-4xl bg-background/95 border-2 border-neon-cyan shadow-neon-cyan p-8">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-neon-pink"
          onClick={() => { setIsVisible(false); onResume(); }}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-retro text-4xl font-black text-neon-green mb-2">
            GAME PAUSED
          </h2>
          <p className="text-muted-foreground font-body">
            Press ESC to resume or select an option below
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all ${item.color}`}
              onClick={item.action}
            >
              <item.icon className="h-8 w-8" />
              <span className="text-xs font-retro">{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="font-retro text-sm text-neon-cyan mb-3">KEYBOARD SHORTCUTS</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground font-body">
            <div><kbd className="px-2 py-1 bg-muted rounded">ESC</kbd> Pause/Resume</div>
            <div><kbd className="px-2 py-1 bg-muted rounded">WASD</kbd> Movement</div>
            <div><kbd className="px-2 py-1 bg-muted rounded">J/K/L</kbd> Punch/Kick/Block</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
