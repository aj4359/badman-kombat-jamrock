import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gamepad2, Zap, Map } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
  onStartQuickMatch: () => void;
  onStartTour: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  open,
  onClose,
  onStartTutorial,
  onStartQuickMatch,
  onStartTour,
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-background via-background to-primary/10 border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            WELCOME TO BAD MAN KOMBAT!
          </DialogTitle>
          <DialogDescription className="text-xl text-center mt-4 text-foreground/90">
            Yow badman! Welcome to Kingston's most brutal fighting game!
            <br />
            <span className="text-primary font-semibold">Choose your path:</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-6">
          {/* Tutorial Option */}
          <Button
            onClick={onStartTutorial}
            size="lg"
            className="h-24 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white group"
          >
            <div className="flex items-center gap-4 w-full">
              <Gamepad2 className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <div className="flex-1 text-left">
                <div className="text-xl">🎮 PLAY TUTORIAL</div>
                <div className="text-sm font-normal opacity-90">
                  Learn di moves, master di combat (Recommended!)
                </div>
              </div>
            </div>
          </Button>

          {/* Quick Match Option */}
          <Button
            onClick={onStartQuickMatch}
            size="lg"
            variant="outline"
            className="h-24 text-lg font-bold border-2 border-yellow-400 hover:bg-yellow-400/20 group"
          >
            <div className="flex items-center gap-4 w-full">
              <Zap className="h-8 w-8 text-yellow-400 group-hover:scale-110 transition-transform" />
              <div className="flex-1 text-left">
                <div className="text-xl">⚡ QUICK MATCH</div>
                <div className="text-sm font-normal opacity-90">
                  Jump straight inna di action, veteran!
                </div>
              </div>
            </div>
          </Button>

          {/* Explore Site Option */}
          <Button
            onClick={onStartTour}
            size="lg"
            variant="outline"
            className="h-24 text-lg font-bold border-2 border-cyan-400 hover:bg-cyan-400/20 group"
          >
            <div className="flex items-center gap-4 w-full">
              <Map className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="flex-1 text-left">
                <div className="text-xl">📖 EXPLORE SITE</div>
                <div className="text-sm font-normal opacity-90">
                  Take a tour of all features an' modes
                </div>
              </div>
            </div>
          </Button>

          {/* Skip Option */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="mt-2 text-muted-foreground hover:text-foreground"
          >
            Maybe later, mi know what mi doing
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 text-6xl opacity-20 animate-pulse">
          🥊
        </div>
        <div className="absolute bottom-4 right-4 text-6xl opacity-20 animate-pulse delay-500">
          ⚡
        </div>
      </DialogContent>
    </Dialog>
  );
};
