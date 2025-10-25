import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad2, ChevronUp, ChevronDown } from 'lucide-react';

interface ControlsSidebarProps {
  player?: 1 | 2;
}

export const ControlsSidebar: React.FC<ControlsSidebarProps> = ({ player = 1 }) => {
  const [expanded, setExpanded] = useState(false);

  const controls = player === 1 ? {
    move: 'W A S D',
    lightPunch: 'J',
    lightKick: 'L',
    block: 'K',
    special: '↓↘→ + Punch',
    super: '↓↘→↓↘→ + Punch',
    color: 'yellow',
  } : {
    move: '↑ ↓ ← →',
    lightPunch: '1 (Numpad)',
    lightKick: '3 (Numpad)',
    block: '2 (Numpad)',
    special: '↓↘→ + Punch',
    super: '↓↘→↓↘→ + Punch',
    color: 'cyan',
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!expanded ? (
        <Button
          onClick={() => setExpanded(true)}
          className={`bg-${controls.color}-500 hover:bg-${controls.color}-600 text-black font-bold shadow-lg`}
          size="lg"
        >
          <Gamepad2 className="h-5 w-5 mr-2" />
          Controls
          <ChevronUp className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Card className={`bg-black/95 border-2 border-${controls.color}-400 p-4 w-72 shadow-2xl animate-in slide-in-from-bottom duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className={`h-5 w-5 text-${controls.color}-400`} />
              <h3 className={`font-bold text-${controls.color}-400`}>
                PLAYER {player} CONTROLS
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(false)}
              className="hover:bg-white/10"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 text-white">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Movement</div>
              <div className="font-mono bg-white/10 px-3 py-2 rounded text-sm">
                {controls.move}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Punch</div>
                <div className={`font-mono bg-${controls.color}-400/20 px-2 py-2 rounded text-sm text-center`}>
                  {controls.lightPunch}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Block</div>
                <div className={`font-mono bg-${controls.color}-400/20 px-2 py-2 rounded text-sm text-center`}>
                  {controls.block}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Kick</div>
                <div className={`font-mono bg-${controls.color}-400/20 px-2 py-2 rounded text-sm text-center`}>
                  {controls.lightKick}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Special Move</div>
              <div className="font-mono bg-purple-500/20 px-3 py-2 rounded text-sm text-purple-300">
                {controls.special}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Super Move</div>
              <div className="font-mono bg-red-500/20 px-3 py-2 rounded text-sm text-red-300">
                {controls.super}
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t border-white/10">
              💡 Tip: Chain attacks together for devastating combos!
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
