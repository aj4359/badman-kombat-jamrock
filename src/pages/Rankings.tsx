import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Crown, Medal, Swords } from 'lucide-react';
import { RastaChatbot } from '@/components/RastaChatbot';

interface RankingEntry {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  winRate: number;
  favoriteCharacter: string;
  totalMatches: number;
}

const Rankings = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  useEffect(() => {
    // Load rankings from localStorage or generate sample data
    const savedRankings = localStorage.getItem('bmk-rankings');
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings));
    } else {
      // Sample data
      const sampleRankings: RankingEntry[] = [
        { rank: 1, name: 'KINGSTON CHAMPION', wins: 47, losses: 3, winRate: 94, favoriteCharacter: 'LEROY', totalMatches: 50 },
        { rank: 2, name: 'STREET WARRIOR', wins: 38, losses: 12, winRate: 76, favoriteCharacter: 'JORDAN', totalMatches: 50 },
        { rank: 3, name: 'KOMBAT LEGEND', wins: 35, losses: 15, winRate: 70, favoriteCharacter: 'SIFU', totalMatches: 50 },
        { rank: 4, name: 'BADMAN BOSS', wins: 30, losses: 20, winRate: 60, favoriteCharacter: 'RAZOR', totalMatches: 50 },
        { rank: 5, name: 'RUDE BOY', wins: 25, losses: 25, winRate: 50, favoriteCharacter: 'ROOTSMAN', totalMatches: 50 },
      ];
      setRankings(sampleRankings);
    }
  }, []);

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="h-6 w-6 text-neon-yellow" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'border-neon-yellow shadow-neon-yellow';
      case 2: return 'border-gray-400';
      case 3: return 'border-amber-600';
      default: return 'border-border';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="combat-border text-neon-cyan border-neon-cyan hover:bg-neon-cyan/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            BACK
          </Button>
          <h1 className="font-retro text-4xl md:text-6xl font-black text-neon-green text-center">
            RANKINGS
          </h1>
          <div className="w-32" /> {/* Spacer for alignment */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="combat-border bg-card/20 backdrop-blur-sm p-6 text-center">
            <Swords className="h-8 w-8 text-neon-orange mx-auto mb-2" />
            <div className="font-retro text-2xl text-neon-orange">{rankings.length}</div>
            <div className="text-xs text-muted-foreground font-body">Total Fighters</div>
          </Card>
          <Card className="combat-border bg-card/20 backdrop-blur-sm p-6 text-center">
            <Trophy className="h-8 w-8 text-neon-green mx-auto mb-2" />
            <div className="font-retro text-2xl text-neon-green">
              {rankings.reduce((sum, r) => sum + r.totalMatches, 0)}
            </div>
            <div className="text-xs text-muted-foreground font-body">Total Battles</div>
          </Card>
          <Card className="combat-border bg-card/20 backdrop-blur-sm p-6 text-center">
            <Crown className="h-8 w-8 text-neon-yellow mx-auto mb-2" />
            <div className="font-retro text-2xl text-neon-yellow">
              {rankings[0]?.name || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground font-body">Champion</div>
          </Card>
          <Card className="combat-border bg-card/20 backdrop-blur-sm p-6 text-center">
            <Medal className="h-8 w-8 text-neon-pink mx-auto mb-2" />
            <div className="font-retro text-2xl text-neon-pink">
              {rankings[0]?.winRate || 0}%
            </div>
            <div className="text-xs text-muted-foreground font-body">Top Win Rate</div>
          </Card>
        </div>

        {/* Rankings Table */}
        <Card className="combat-border bg-card/20 backdrop-blur-sm p-6">
          <h2 className="font-retro text-2xl font-black text-neon-cyan mb-6 text-center">
            TOURNAMENT STANDINGS
          </h2>
          <div className="space-y-4">
            {rankings.map((entry) => (
              <div
                key={entry.rank}
                className={`combat-border rounded-lg p-4 bg-background/50 hover:bg-background/70 transition-all ${getRankColor(entry.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Player Info */}
                    <div>
                      <div className="font-retro text-lg font-bold text-foreground">
                        {entry.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-body">
                        Main: {entry.favoriteCharacter}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm font-body">
                    <div className="text-center">
                      <div className="text-neon-green font-bold">{entry.wins}W</div>
                      <div className="text-xs text-muted-foreground">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neon-pink font-bold">{entry.losses}L</div>
                      <div className="text-xs text-muted-foreground">Losses</div>
                    </div>
                    <div className="text-center">
                      <Badge 
                        variant={entry.winRate >= 70 ? 'default' : 'secondary'}
                        className="font-retro"
                      >
                        {entry.winRate}%
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">Win Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground font-body mb-4">
              Think you can reach the top? Challenge the champions!
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="combat" 
                size="lg"
                onClick={() => navigate('/character-select')}
              >
                START FIGHTING
              </Button>
              <Button 
                variant="jamaica" 
                size="lg"
                onClick={() => navigate('/arcade')}
              >
                TOURNAMENT MODE
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Rasta Chatbot */}
      <RastaChatbot 
        onNavigateToGame={() => navigate('/game')}
        onNavigateToCharacterSelect={() => navigate('/character-select')}
        onNavigateToHome={() => navigate('/')}
      />
    </div>
  );
};

export default Rankings;
