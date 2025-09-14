import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fighters = [
  {
    id: 'leroy',
    name: 'Leroy "Cyber Storm"',
    description: 'Street-smart hacker from Trench Town',
    color: 'hsl(180, 100%, 50%)',
    stats: {
      power: 85,
      speed: 90,
      defense: 75
    }
  },
  {
    id: 'razor',
    name: 'Razor "Neon Blade"',
    description: 'Cybernetic assassin from Spanish Town',
    color: 'hsl(320, 100%, 60%)',
    stats: {
      power: 95,
      speed: 80,
      defense: 70
    }
  },
  {
    id: 'voltage',
    name: 'Voltage "Electric Queen"',
    description: 'Electro-powered warrior from Downtown',
    color: 'hsl(120, 100%, 50%)',
    stats: {
      power: 80,
      speed: 95,
      defense: 80
    }
  },
  {
    id: 'blaze',
    name: 'Blaze "Fire Rasta"',
    description: 'Pyro-kinetic fighter from the hills',
    color: 'hsl(30, 100%, 60%)',
    stats: {
      power: 90,
      speed: 75,
      defense: 90
    }
  }
];

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [selectedP1, setSelectedP1] = useState<string | null>(null);
  const [selectedP2, setSelectedP2] = useState<string | null>(null);

  const handleFighterSelect = (fighterId: string, player: 1 | 2) => {
    if (player === 1) {
      setSelectedP1(fighterId);
    } else {
      setSelectedP2(fighterId);
    }
  };

  const canProceed = selectedP1 && selectedP2;

  return (
    <div className="min-h-screen bg-gradient-cyber flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-retro font-bold text-neon-cyan mb-4 glitch" data-text="SELECT FIGHTERS">
          SELECT FIGHTERS
        </h1>
        <p className="text-xl font-body text-foreground/80">
          Choose your kombatants for the ultimate showdown
        </p>
      </div>

      <div className="flex gap-8 mb-8">
        {/* Player 1 Selection */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-retro text-neon-cyan mb-4">PLAYER 1</h2>
          <div className="grid grid-cols-2 gap-4">
            {fighters.map((fighter) => (
              <div
                key={`p1-${fighter.id}`}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedP1 === fighter.id 
                    ? 'scale-105 shadow-neon-cyan' 
                    : 'hover:scale-102 hover:shadow-neon-cyan/50'
                }`}
                onClick={() => handleFighterSelect(fighter.id, 1)}
              >
                <div className={`p-4 rounded-lg border-2 bg-card/80 backdrop-blur ${
                  selectedP1 === fighter.id 
                    ? 'border-neon-cyan shadow-neon-cyan' 
                    : 'border-neon-cyan/30'
                }`}>
                  <div 
                    className="w-24 h-32 rounded mb-3 border-2 border-neon-cyan/50"
                    style={{ backgroundColor: fighter.color }}
                  />
                  <h3 className="text-sm font-retro font-bold text-neon-cyan mb-1">
                    {fighter.name}
                  </h3>
                  <p className="text-xs text-foreground/70 mb-2">
                    {fighter.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Power:</span>
                      <span className="text-neon-green">{fighter.stats.power}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Speed:</span>
                      <span className="text-neon-green">{fighter.stats.speed}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Defense:</span>
                      <span className="text-neon-green">{fighter.stats.defense}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="text-6xl font-retro font-bold text-neon-pink animate-neon-pulse">
            VS
          </div>
        </div>

        {/* Player 2 Selection */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-retro text-neon-pink mb-4">PLAYER 2</h2>
          <div className="grid grid-cols-2 gap-4">
            {fighters.map((fighter) => (
              <div
                key={`p2-${fighter.id}`}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedP2 === fighter.id 
                    ? 'scale-105 shadow-neon-pink' 
                    : 'hover:scale-102 hover:shadow-neon-pink/50'
                }`}
                onClick={() => handleFighterSelect(fighter.id, 2)}
              >
                <div className={`p-4 rounded-lg border-2 bg-card/80 backdrop-blur ${
                  selectedP2 === fighter.id 
                    ? 'border-neon-pink shadow-neon-pink' 
                    : 'border-neon-pink/30'
                }`}>
                  <div 
                    className="w-24 h-32 rounded mb-3 border-2 border-neon-pink/50"
                    style={{ backgroundColor: fighter.color }}
                  />
                  <h3 className="text-sm font-retro font-bold text-neon-pink mb-1">
                    {fighter.name}
                  </h3>
                  <p className="text-xs text-foreground/70 mb-2">
                    {fighter.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Power:</span>
                      <span className="text-neon-green">{fighter.stats.power}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Speed:</span>
                      <span className="text-neon-green">{fighter.stats.speed}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Defense:</span>
                      <span className="text-neon-green">{fighter.stats.defense}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant="retro" 
          onClick={() => navigate('/')}
          className="text-lg px-8"
        >
          Back to Menu
        </Button>
        <Button 
          variant="combat" 
          disabled={!canProceed}
          onClick={() => navigate('/game')}
          className="text-lg px-8"
        >
          START KOMBAT!
        </Button>
      </div>
    </div>
  );
};

export default CharacterSelect;