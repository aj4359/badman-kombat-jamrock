import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fighters = [
  {
    id: 'leroy',
    name: 'Leroy "Cyber Storm"',
    title: 'The Trench Town Technomancer',
    description: 'Born in the heart of Trench Town during the 1980 election violence, Leroy discovered his gift for digital manipulation when sound systems became his refuge. Now wielding cyber-enhanced dreads and neural implants, he channels the rhythm of Kingston streets into devastating digital attacks.',
    origin: 'Trench Town, Kingston',
    age: 24,
    height: "6'1\"",
    weight: '180 lbs',
    color: 'hsl(180, 100%, 50%)',
    stats: {
      power: 85,
      speed: 90,
      defense: 75
    },
    specialMoves: [
      { name: 'Digital Soundclash', input: '↓↘→ + P', description: 'Cyber-enhanced sonic boom that stuns opponents' },
      { name: 'Neural Overload', input: '↓↙← + K', description: 'Electromagnetic pulse that disrupts enemy systems' },
      { name: 'Trench Town Fury', input: '→↓↘ + P+K', description: 'Ultimate combo channeling street survival instincts' }
    ],
    backstory: 'When the political violence of 1980 tore through Trench Town, young Leroy found solace in the massive sound systems that still played despite the chaos. The bass lines seemed to resonate with something deep within him - a digital consciousness awakening. Years of tinkering with electronics and studying under the legendary King Tubby\'s disciples led to his cyber-enhancement. Now he fights to protect Kingston\'s musical heritage from corporate exploitation.'
  },
  {
    id: 'razor',
    name: 'Razor "Neon Blade"',
    title: 'The Spanish Town Samurai',
    description: 'A mysterious warrior who emerged from Spanish Town\'s underground fighting circuits. Rumored to be a former yakuza enforcer who fled to Jamaica in 1979, she now protects the innocent with cybernetic katanas and a code of honor learned in Kingston\'s roughest yards.',
    origin: 'Spanish Town, St. Catherine',
    age: 28,
    height: "5'8\"",
    weight: '145 lbs',
    color: 'hsl(320, 100%, 60%)',
    stats: {
      power: 95,
      speed: 80,
      defense: 70
    },
    specialMoves: [
      { name: 'Plasma Katana', input: '→→ + P', description: 'Lightning-fast energy blade strike' },
      { name: 'Spanish Town Slice', input: '↓↘→ + K', description: 'Horizontal energy wave that travels across screen' },
      { name: 'Honor of the Yards', input: '↓↓ + P+K', description: 'Devastating combo honoring fallen comrades' }
    ],
    backstory: 'Keiko Nakamura fled Osaka in 1979 after witnessing corruption within her yakuza clan. Washing up on Kingston shores with nothing but her katanas, she found unexpected kinship in Spanish Town\'s tight-knit community. The locals dubbed her "Razor" for her precise fighting style and unwavering protection of their neighborhood. Her cyber-enhancements were jury-rigged by local mechanics using salvaged electronics, creating a unique fusion of Japanese steel and Jamaican ingenuity.'
  },
  {
    id: 'voltage',
    name: 'Voltage "Electric Queen"',
    title: 'Downtown\'s Lightning Empress',
    description: 'A former JPS power company engineer who gained electromagnetic abilities during the 1980 blackouts. She now controls Kingston\'s electrical grid with her mind, using the city\'s own power infrastructure as her weapon while fighting against the corrupt officials who caused the crisis.',
    origin: 'Downtown Kingston',
    age: 26,
    height: "5'6\"",
    weight: '135 lbs',
    color: 'hsl(120, 100%, 50%)',
    stats: {
      power: 80,
      speed: 95,
      defense: 80
    },
    specialMoves: [
      { name: 'JPS Surge', input: '↓↘→ + P', description: 'Channels city grid power into devastating electric bolts' },
      { name: 'Blackout Storm', input: '→↓↘ + K', description: 'Area-effect lightning that hits multiple targets' },
      { name: 'Grid Override', input: '←↙↓↘→ + P+K', description: 'Ultimate move that shorts out entire battlefield' }
    ],
    backstory: 'Marcia Campbell was Jamaica Public Service\'s youngest female engineer when the politically-motivated power cuts of 1980 began. During a particularly dangerous repair mission in downtown Kingston, a massive surge struck her while she was connected to the main grid. Instead of killing her, it awakened dormant electrokinetic abilities. Now she fights against the corruption that plunged Jamaica into darkness, wielding the very power they tried to control.'
  },
  {
    id: 'blaze',
    name: 'Blaze "Fire Rasta"',
    title: 'The Blue Mountain Mystic',
    description: 'A Rastafarian mystic from the Blue Mountains who channels the ancient fire spirits of the Maroons. His dreadlocks burn with eternal flames while he dispenses justice with moves passed down from the legendary warrior Nanny. He fights to preserve Jamaican culture against foreign corruption.',
    origin: 'Blue Mountains, St. Andrew',
    age: 32,
    height: "6'3\"",
    weight: '195 lbs',
    color: 'hsl(30, 100%, 60%)',
    stats: {
      power: 90,
      speed: 75,
      defense: 90
    },
    specialMoves: [
      { name: 'Maroon Fire', input: '↓↙← + P', description: 'Ancient flame technique inherited from Nanny\'s warriors' },
      { name: 'Rastafari Judgment', input: '→→ + K', description: 'Righteous fire pillar that burns with ancestral power' },
      { name: 'Babylon Burn', input: '↓↓↓ + P+K', description: 'Ultimate move that calls upon all ancestral spirits' }
    ],
    backstory: 'Born during a lightning storm atop Blue Mountain Peak, Marcus "Blaze" Johnson was marked by the ancestors from birth. Raised by elder Rastafarians who remembered the old ways, he learned to commune with the fire spirits that guided the Maroons in their fight against slavery. When corporate interests began encroaching on sacred Blue Mountain lands in 1980, the spirits awakened his pyrokinetic abilities. His burning dreadlocks are said to contain the souls of every Maroon warrior who died defending Jamaica\'s freedom.'
  }
];

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [selectedP1, setSelectedP1] = useState<string | null>(null);
  const [selectedP2, setSelectedP2] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleFighterSelect = (fighterId: string, player: 1 | 2) => {
    if (player === 1) {
      setSelectedP1(fighterId);
    } else {
      setSelectedP2(fighterId);
    }
  };

  const toggleDetails = (fighterId: string) => {
    setShowDetails(showDetails === fighterId ? null : fighterId);
  };

  const selectedP1Fighter = fighters.find(f => f.id === selectedP1);
  const selectedP2Fighter = fighters.find(f => f.id === selectedP2);
  const canProceed = selectedP1 && selectedP2;

  return (
    <div className="min-h-screen bg-gradient-cyber flex flex-col items-center justify-start p-8 overflow-y-auto">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-retro font-bold text-neon-cyan mb-4 glitch" data-text="BADMAN KOMBAT">
          BADMAN KOMBAT
        </h1>
        <h2 className="text-3xl font-retro font-bold text-neon-pink mb-2">KINGSTON RISING</h2>
        <p className="text-lg font-body text-foreground/80">
          Select your warrior for the streets of 1980s Kingston
        </p>
      </div>

      {/* Fighter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-7xl">
        {fighters.map((fighter) => (
          <div key={fighter.id} className="relative">
            <div
              className={`cursor-pointer transition-all duration-300 ${
                selectedP1 === fighter.id || selectedP2 === fighter.id
                  ? 'scale-105 shadow-neon-cyan'
                  : 'hover:scale-102 hover:shadow-neon-cyan/50'
              }`}
            >
              <div className={`p-4 rounded-lg border-2 bg-card/90 backdrop-blur ${
                selectedP1 === fighter.id || selectedP2 === fighter.id
                  ? 'border-neon-cyan shadow-neon-cyan'
                  : 'border-neon-cyan/30'
              }`}>
                <div 
                  className="w-full h-40 rounded mb-3 border-2 border-neon-cyan/50 relative overflow-hidden"
                  style={{ backgroundColor: fighter.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white font-bold text-sm">
                    {fighter.origin}
                  </div>
                </div>
                
                <h3 className="text-lg font-retro font-bold text-neon-cyan mb-1">
                  {fighter.name}
                </h3>
                <p className="text-sm text-neon-pink font-semibold mb-2">
                  {fighter.title}
                </p>
                <p className="text-xs text-foreground/70 mb-3 line-clamp-2">
                  {fighter.description}
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <div className="text-xs text-foreground/60">PWR</div>
                    <div className="text-sm font-bold text-neon-green">{fighter.stats.power}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-foreground/60">SPD</div>
                    <div className="text-sm font-bold text-neon-green">{fighter.stats.speed}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-foreground/60">DEF</div>
                    <div className="text-sm font-bold text-neon-green">{fighter.stats.defense}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 text-xs border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                    onClick={() => toggleDetails(fighter.id)}
                  >
                    {showDetails === fighter.id ? 'Hide' : 'Details'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 text-xs border-neon-pink/50 text-neon-pink hover:bg-neon-pink/10"
                    onClick={() => handleFighterSelect(fighter.id, 1)}
                    disabled={selectedP2 === fighter.id}
                  >
                    P1
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 text-xs border-neon-green/50 text-neon-green hover:bg-neon-green/10"
                    onClick={() => handleFighterSelect(fighter.id, 2)}
                    disabled={selectedP1 === fighter.id}
                  >
                    P2
                  </Button>
                </div>
              </div>
            </div>

            {/* Detailed Fighter Info */}
            {showDetails === fighter.id && (
              <div className="absolute top-full left-0 w-full z-10 mt-2 p-4 bg-card/95 backdrop-blur border border-neon-cyan/50 rounded-lg shadow-neon-cyan/20 max-h-96 overflow-y-auto">
                <h4 className="text-sm font-retro font-bold text-neon-cyan mb-2">Character Bio</h4>
                <div className="text-xs text-foreground/80 mb-3 space-y-1">
                  <div><span className="text-neon-pink">Age:</span> {fighter.age}</div>
                  <div><span className="text-neon-pink">Height:</span> {fighter.height}</div>
                  <div><span className="text-neon-pink">Weight:</span> {fighter.weight}</div>
                </div>
                
                <h4 className="text-sm font-retro font-bold text-neon-green mb-2">Special Moves</h4>
                <div className="space-y-2 mb-3">
                  {fighter.specialMoves?.map((move, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="text-neon-cyan font-semibold">{move.name}</div>
                      <div className="text-neon-pink">{move.input}</div>
                      <div className="text-foreground/70">{move.description}</div>
                    </div>
                  ))}
                </div>
                
                <h4 className="text-sm font-retro font-bold text-neon-cyan mb-2">Backstory</h4>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {fighter.backstory}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Fighters Display */}
      {(selectedP1Fighter || selectedP2Fighter) && (
        <div className="mb-6 p-4 bg-card/80 backdrop-blur rounded-lg border border-neon-cyan/30">
          <h3 className="text-xl font-retro text-neon-cyan mb-4 text-center">SELECTED FIGHTERS</h3>
          <div className="flex gap-8 justify-center items-center">
            {selectedP1Fighter && (
              <div className="text-center">
                <div className="text-sm text-neon-cyan font-semibold">PLAYER 1</div>
                <div className="text-lg font-retro text-neon-pink">{selectedP1Fighter.name}</div>
                <div className="text-sm text-foreground/70">{selectedP1Fighter.title}</div>
              </div>
            )}
            
            {selectedP1Fighter && selectedP2Fighter && (
              <div className="text-4xl font-retro font-bold text-neon-pink animate-neon-pulse">VS</div>
            )}
            
            {selectedP2Fighter && (
              <div className="text-center">
                <div className="text-sm text-neon-green font-semibold">PLAYER 2</div>
                <div className="text-lg font-retro text-neon-pink">{selectedP2Fighter.name}</div>
                <div className="text-sm text-foreground/70">{selectedP2Fighter.title}</div>
              </div>
            )}
          </div>
        </div>
      )}

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