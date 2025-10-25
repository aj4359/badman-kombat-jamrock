import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb } from 'lucide-react';

interface Hint {
  id: string;
  message: string;
  trigger: 'time' | 'event';
  delay?: number;
}

const HINTS: Hint[] = [
  {
    id: 'block-reminder',
    message: "Remember to block! Press K to defend against enemy attacks.",
    trigger: 'time',
    delay: 30000, // 30 seconds
  },
  {
    id: 'special-move',
    message: "Try a special move: ↓↘→ + Punch for a powerful attack!",
    trigger: 'time',
    delay: 45000, // 45 seconds
  },
  {
    id: 'combo-hint',
    message: "Chain attacks together! Try: Punch → Punch → Kick",
    trigger: 'time',
    delay: 60000, // 60 seconds
  },
];

interface InGameHintsProps {
  disabled?: boolean;
  onDisable?: () => void;
}

export const InGameHints: React.FC<InGameHintsProps> = ({ disabled, onDisable }) => {
  const [currentHint, setCurrentHint] = useState<Hint | null>(null);
  const [shownHints, setShownHints] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (disabled) return;

    const timers: NodeJS.Timeout[] = [];

    HINTS.forEach(hint => {
      if (hint.trigger === 'time' && hint.delay && !shownHints.has(hint.id)) {
        const timer = setTimeout(() => {
          setCurrentHint(hint);
          setShownHints(prev => new Set([...prev, hint.id]));
        }, hint.delay);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [disabled, shownHints]);

  const handleClose = () => {
    setCurrentHint(null);
  };

  const handleDisableHints = () => {
    setCurrentHint(null);
    onDisable?.();
    localStorage.setItem('bmk-hints-disabled', 'true');
  };

  if (!currentHint || disabled) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none">
      <Card className="bg-black/95 border-2 border-blue-400 p-6 w-96 shadow-2xl pointer-events-auto animate-in fade-in zoom-in duration-300">
        <div className="flex items-start gap-4">
          <Lightbulb className="h-8 w-8 text-blue-400 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-400 mb-2">💡 PRO TIP</h3>
            <p className="text-white">{currentHint.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisableHints}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Don't show hints again
          </Button>
          <Button
            size="sm"
            onClick={handleClose}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Got it!
          </Button>
        </div>
      </Card>
    </div>
  );
};
