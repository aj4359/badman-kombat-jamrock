import React from 'react';

export const ControlDisplay: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 pointer-events-none">
      {/* Player 1 Controls */}
      <div className="bg-black/80 border-2 border-yellow-400 rounded-lg p-4 text-yellow-400">
        <div className="font-bold text-lg mb-2">PLAYER 1</div>
        <div className="space-y-1 text-sm">
          <div><span className="font-mono bg-yellow-400/20 px-2 py-1 rounded">W A S D</span> - Move</div>
          <div><span className="font-mono bg-yellow-400/20 px-2 py-1 rounded">J</span> - Light Punch</div>
          <div><span className="font-mono bg-yellow-400/20 px-2 py-1 rounded">K</span> - Block</div>
          <div><span className="font-mono bg-yellow-400/20 px-2 py-1 rounded">L</span> - Light Kick</div>
          <div className="text-xs mt-2 text-yellow-400/70">Special: ↓↘→ + Punch</div>
        </div>
      </div>
      
      {/* Player 2 Controls */}
      <div className="bg-black/80 border-2 border-cyan-400 rounded-lg p-4 text-cyan-400">
        <div className="font-bold text-lg mb-2">PLAYER 2</div>
        <div className="space-y-1 text-sm">
          <div><span className="font-mono bg-cyan-400/20 px-2 py-1 rounded">↑ ↓ ← →</span> - Move</div>
          <div><span className="font-mono bg-cyan-400/20 px-2 py-1 rounded">1</span> - Light Punch</div>
          <div><span className="font-mono bg-cyan-400/20 px-2 py-1 rounded">2</span> - Block</div>
          <div><span className="font-mono bg-cyan-400/20 px-2 py-1 rounded">3</span> - Light Kick</div>
          <div className="text-xs mt-2 text-cyan-400/70">Special: ↓↘→ + Punch</div>
        </div>
      </div>
    </div>
  );
};
