import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Menu, 
  Home, 
  Users, 
  Gamepad2, 
  Video, 
  Sparkles, 
  GraduationCap,
  Trophy,
  Play,
  X
} from 'lucide-react';

export const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const routes = [
    { path: '/', icon: Home, label: 'Home', color: 'text-neon-green' },
    { path: '/character-select', icon: Users, label: 'Character Select', color: 'text-neon-cyan' },
    { path: '/game', icon: Gamepad2, label: 'Game', color: 'text-neon-orange' },
    { path: '/drone-trailer', icon: Video, label: 'Drone Trailer', color: 'text-neon-pink' },
    { path: '/fighter-generator', icon: Sparkles, label: 'Fighter Generator', color: 'text-neon-purple' },
    { path: '/tutorial', icon: GraduationCap, label: 'Tutorial', color: 'text-neon-yellow' },
    { path: '/arcade', icon: Play, label: 'Arcade Mode', color: 'text-neon-orange' },
    { path: '/rankings', icon: Trophy, label: 'Rankings', color: 'text-neon-yellow' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full combat-border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 shadow-neon-cyan"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-background/95 combat-border border-neon-cyan shadow-neon-cyan p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="font-retro text-3xl font-black text-neon-green mb-2">
                NAVIGATION
              </h2>
              <p className="text-xs text-muted-foreground font-body">
                Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+M</kbd> to toggle
              </p>
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {routes.map((route) => {
                const isActive = location.pathname === route.path;
                return (
                  <Button
                    key={route.path}
                    variant={isActive ? 'default' : 'outline'}
                    className={`h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all ${route.color}`}
                    onClick={() => handleNavigate(route.path)}
                  >
                    <route.icon className="h-6 w-6" />
                    <span className="text-xs font-retro text-center leading-tight">
                      {route.label}
                    </span>
                  </Button>
                );
              })}
            </div>

            {/* Current Location */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-body">
                Current: <span className="text-neon-cyan font-retro">{location.pathname}</span>
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
