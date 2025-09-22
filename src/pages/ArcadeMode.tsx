import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProgressionSystem } from '@/hooks/useProgressionSystem';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';

interface ArcadeStage {
  id: number;
  title: string;
  description: string;
  opponent: string;
  location: string;
  difficulty: number;
  storyText: string;
  victory_text: string;
  rewards?: string[];
}

const ARCADE_STAGES: ArcadeStage[] = [
  {
    id: 1,
    title: 'Street Rumble',
    description: 'First blood in the underground scene',
    opponent: 'jordan',
    location: 'Downtown Kingston Alley',
    difficulty: 1,
    storyText: 'Word spreads quickly in Kingston. A new fighter has entered the underground scene, and the established warriors want to test your mettle.',
    victory_text: 'Your reputation grows on the streets. The real challenges lie ahead.',
    rewards: ['500 XP', 'Street Cred +1']
  },
  {
    id: 2,
    title: 'Electric Encounter',
    description: 'Face the power of JPS',
    opponent: 'voltage',
    location: 'Power Plant Ruins',
    difficulty: 2,
    storyText: 'The blackouts of 1980 left many scars on Kingston. Voltage controls the grid now, and she won\'t let anyone pass without proving their worth.',
    victory_text: 'The lights flicker, but your resolve burns bright. The grid acknowledges your strength.',
    rewards: ['750 XP', 'Unlock: Voltage', 'New Stage: Power Plant']
  },
  {
    id: 3,
    title: 'Blade Dance',
    description: 'Spanish Town\'s finest warrior',
    opponent: 'razor',
    location: 'Spanish Town Yards',
    difficulty: 3,
    storyText: 'Honor runs deep in Spanish Town. Razor has protected these streets since arriving from Osaka, and she measures every challenger by their code.',
    victory_text: 'Respect earned through combat. The way of the warrior transcends all boundaries.',
    rewards: ['1000 XP', 'Unlock: Razor', 'Honor Badge']
  },
  {
    id: 4,
    title: 'Mountain Fire',
    description: 'The Blue Mountain mystic awaits',
    opponent: 'blaze',
    location: 'Blue Mountain Peak',
    difficulty: 4,
    storyText: 'High above Kingston, where the coffee grows and the mist hides ancient secrets, the fire spirits have chosen their champion.',
    victory_text: 'The ancestors nod in approval. Your spirit burns with righteous fire.',
    rewards: ['1500 XP', 'Unlock: Blaze', 'Spiritual Awakening']
  },
  {
    id: 5,
    title: 'Steel Wire Wisdom',
    description: 'The master\'s final test',
    opponent: 'sifu',
    location: 'Barry Street Dojo',
    difficulty: 5,
    storyText: 'In the heart of Kingston\'s Chinese quarter, Master Leung has been waiting. His wisdom spans continents, and his wire techniques are unmatched.',
    victory_text: 'The student becomes the teacher. Ancient wisdom flows through modern veins.',
    rewards: ['2000 XP', 'Unlock: Sifu', 'Master\'s Respect']
  },
  {
    id: 6,
    title: 'Digital Convergence',
    description: 'Nature meets technology',
    opponent: 'rootsman',
    location: 'UWI Mona Gardens',
    difficulty: 6,
    storyText: 'Where the digital meets the natural, Rootsman has created something unprecedented. The future of Jamaica hangs in the balance.',
    victory_text: 'Balance achieved. Technology and nature unite under your guidance.',
    rewards: ['3000 XP', 'Unlock: Rootsman', 'Digital Harmony']
  },
  {
    id: 7,
    title: 'The Final Clash',
    description: 'Champion of Kingston',
    opponent: 'leroy',
    location: 'Trench Town Memorial',
    difficulty: 7,
    storyText: 'Back where it all began. Trench Town\'s cyber-enhanced son stands between you and ultimate victory. This is more than a fight - it\'s a legacy.',
    victory_text: 'Kingston has a new champion. The streets remember this day forever.',
    rewards: ['5000 XP', 'Champion Title', 'Unlock: Tournament Mode']
  }
];

const ArcadeMode = () => {
  const navigate = useNavigate();
  const { fighters, recordWin, recordLoss } = useProgressionSystem();
  const [selectedFighter, setSelectedFighter] = useState<string>('');
  const [currentStage, setCurrentStage] = useState(1);
  const [showStory, setShowStory] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const availableFighters = fighters.filter(f => f.unlocked);
  const stage = ARCADE_STAGES.find(s => s.id === currentStage);

  const startArcade = () => {
    if (!selectedFighter) return;
    setShowStory(true);
  };

  const proceedToFight = () => {
    setGameStarted(true);
    // Navigate to game with arcade mode params
    navigate(`/game?mode=arcade&player1=${selectedFighter}&player2=${stage?.opponent}&stage=${currentStage}`);
  };

  const handleVictory = () => {
    recordWin(selectedFighter);
    if (currentStage < ARCADE_STAGES.length) {
      setCurrentStage(prev => prev + 1);
      setShowStory(false);
      setGameStarted(false);
    } else {
      // Arcade complete
      navigate('/arcade-complete');
    }
  };

  if (showStory && stage) {
    return (
      <div className="min-h-screen bg-gradient-cyber flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full p-8 bg-card/90 backdrop-blur border-neon-cyan/30">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-retro text-neon-cyan mb-2">
              STAGE {stage.id}: {stage.title}
            </h1>
            <h2 className="text-xl font-retro text-neon-pink mb-4">
              {stage.location}
            </h2>
          </div>

          <div className="mb-6">
            <div className="aspect-video bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-6xl">🏙️</div>
            </div>
            <p className="text-foreground/80 font-body leading-relaxed text-center">
              {stage.storyText}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-retro text-neon-cyan mb-2">YOUR FIGHTER</h3>
              <div className="p-4 bg-card/50 rounded-lg border border-neon-cyan/30">
                <div className="text-lg font-retro text-neon-green">
                  {ENHANCED_FIGHTER_DATA[selectedFighter]?.name || 'Unknown'}
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-retro text-neon-pink mb-2">OPPONENT</h3>
              <div className="p-4 bg-card/50 rounded-lg border border-neon-pink/30">
                <div className="text-lg font-retro text-neon-orange">
                  {ENHANCED_FIGHTER_DATA[stage.opponent]?.name || 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowStory(false)}
              className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
            >
              BACK
            </Button>
            <Button 
              variant="cyber"
              onClick={proceedToFight}
              className="px-8"
            >
              ENTER KOMBAT
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cyber p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-retro font-bold text-neon-cyan mb-4 glitch" data-text="ARCADE MODE">
            ARCADE MODE
          </h1>
          <h2 className="text-2xl font-retro text-neon-pink mb-2">KINGSTON UNDERGROUND</h2>
          <p className="text-lg font-body text-foreground/80">
            Fight through the streets and claim your throne
          </p>
        </div>

        {!selectedFighter ? (
          <div className="mb-8">
            <h3 className="text-2xl font-retro text-neon-green mb-6 text-center">SELECT YOUR FIGHTER</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableFighters.map((fighter) => {
                const fighterData = ENHANCED_FIGHTER_DATA[fighter.id];
                if (!fighterData) return null;

                return (
                  <Card key={fighter.id} className="p-4 bg-card/80 backdrop-blur border-neon-cyan/30 hover:border-neon-cyan cursor-pointer" 
                        onClick={() => setSelectedFighter(fighter.id)}>
                    <div className="text-center">
                      <div className="w-full h-32 rounded mb-3 bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 flex items-center justify-center">
                        <div className="text-4xl">🥊</div>
                      </div>
                      <h4 className="text-lg font-retro text-neon-cyan mb-1">{fighterData.name}</h4>
                      <div className="text-sm text-foreground/70">
                        Wins: {fighter.wins} | Battles: {fighter.battlesWon}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-retro text-neon-green mb-2">SELECTED FIGHTER</h3>
              <div className="text-xl font-retro text-neon-cyan">
                {ENHANCED_FIGHTER_DATA[selectedFighter]?.name}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedFighter('')}
                className="mt-2 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
              >
                Change Fighter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {ARCADE_STAGES.map((arcadeStage) => (
                <Card key={arcadeStage.id} className={`p-4 border-2 ${
                  arcadeStage.id === currentStage ? 'border-neon-yellow bg-neon-yellow/10' :
                  arcadeStage.id < currentStage ? 'border-neon-green bg-neon-green/10' :
                  'border-neon-cyan/30 bg-card/50'
                }`}>
                  <div className="text-center">
                    <h4 className="text-lg font-retro text-neon-cyan mb-2">
                      STAGE {arcadeStage.id}
                    </h4>
                    <h5 className="text-md font-retro text-neon-pink mb-2">
                      {arcadeStage.title}
                    </h5>
                    <p className="text-sm text-foreground/70 mb-3">
                      {arcadeStage.description}
                    </p>
                    <div className="text-sm text-neon-orange mb-2">
                      vs {ENHANCED_FIGHTER_DATA[arcadeStage.opponent]?.name}
                    </div>
                    <div className="text-xs text-foreground/60">
                      {arcadeStage.location}
                    </div>
                    <div className="flex justify-center mt-2">
                      {Array.from({ length: arcadeStage.difficulty }).map((_, i) => (
                        <span key={i} className="text-neon-orange">⭐</span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="cyber"
                size="lg"
                onClick={startArcade}
                className="px-12 py-6 text-xl"
                disabled={!stage}
              >
                START STAGE {currentStage}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
          >
            BACK TO MAIN MENU
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArcadeMode;