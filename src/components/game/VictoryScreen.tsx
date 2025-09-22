import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VictoryScreenProps {
  winner: {
    name: string;
    id: string;
  };
  quote: string;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  winner, 
  quote, 
  onPlayAgain, 
  onMainMenu 
}) => {
  const getVictoryQuote = (fighterId: string): string => {
    const quotes: Record<string, string[]> = {
      leroy: [
        "Mi reach di top! Nuh badda try again!",
        "Dat was easy work, seen?",
        "Yuh cyaa match di champion!"
      ],
      jordan: [
        "Justice always prevails in the end!",
        "The streets are safe once more.",
        "That's how we handle business!"
      ],
      razor: [
        "Cut down like grass before the blade!",
        "Swift and decisive, just like my moves.",
        "Another victory for the razor sharp!"
      ],
      sifu: [
        "The ancient ways prove superior once again.",
        "Balance and discipline overcome all.",
        "Your form needs much improvement, young one."
      ],
      rootsman: [
        "Jah guide mi hand to victory!",
        "Ital power flow through mi veins!",
        "Nature's strength cannot be defeated!"
      ]
    };

    const fighterQuotes = quotes[fighterId] || quotes.leroy;
    return fighterQuotes[Math.floor(Math.random() * fighterQuotes.length)];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur">
      <Card className="max-w-2xl mx-4 bg-card/95 border-neon-cyan combat-border">
        <CardContent className="p-8 text-center">
          {/* Victory Banner */}
          <div className="mb-6">
            <h1 className="font-retro text-4xl md:text-6xl text-neon-green mb-2 animate-scale-in"
                style={{ textShadow: '0 0 20px hsl(var(--neon-green))' }}>
              VICTORY!
            </h1>
            <div className="h-1 bg-gradient-neon rounded-full mx-auto w-32 animate-fade-in" />
          </div>

          {/* Winner Display */}
          <div className="mb-8">
            <div className="mb-4">
              <div className="text-2xl md:text-3xl font-retro text-neon-cyan mb-2">
                {winner.name.toUpperCase()}
              </div>
              <div className="text-lg text-muted-foreground">
                IS THE CHAMPION!
              </div>
            </div>

            {/* Character Portrait Placeholder */}
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-retro rounded-lg shadow-combat flex items-center justify-center">
              <div className="text-4xl font-retro text-background">
                {winner.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Victory Quote */}
          <div className="mb-8">
            <blockquote className="text-lg md:text-xl italic text-foreground/90 border-l-4 border-neon-pink pl-4">
              "{quote || getVictoryQuote(winner.id)}"
            </blockquote>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onPlayAgain}
              className="bg-neon-cyan text-background hover:bg-neon-cyan/80 font-retro font-bold px-8 py-3"
            >
              FIGHT AGAIN
            </Button>
            <Button 
              onClick={onMainMenu}
              variant="outline"
              className="border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-background font-retro font-bold px-8 py-3"
            >
              MAIN MENU
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-ping opacity-30" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-neon-pink rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-neon-green rounded-full animate-bounce opacity-50" />
      </div>
    </div>
  );
};