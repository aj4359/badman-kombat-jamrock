import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FighterShowcase = () => {
  const navigate = useNavigate();
  const fighters = [
    {
      name: "LEROY",
      title: "Cyber Showdown Specialist", 
      description: "Master of digital combat from Downtown Kingston",
      stats: { power: 85, speed: 90, defense: 75 },
      color: "neon-cyan"
    },
    {
      name: "RAZOR",
      title: "Neon Street Warrior",
      description: "Electric fighter from Spanish Town roads",
      stats: { power: 90, speed: 80, defense: 85 },
      color: "neon-pink"
    },
    {
      name: "VOLTAGE",
      title: "Kingston Thunder",
      description: "Lightning-fast combos from Trench Town",
      stats: { power: 88, speed: 95, defense: 70 },
      color: "neon-green"
    },
    {
      name: "BLAZE",
      title: "Fire Kombat King",
      description: "Burning techniques from Half Way Tree",
      stats: { power: 95, speed: 75, defense: 80 },
      color: "neon-orange"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-retro text-5xl md:text-6xl font-black mb-4 text-neon-cyan">
            SELECT YOUR FIGHTER
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Choose from legendary badmen warriors, each with unique combat styles and special moves
          </p>
        </div>

        {/* Fighters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {fighters.map((fighter, index) => (
            <Card key={fighter.name} className="relative overflow-hidden combat-border bg-card/20 backdrop-blur-sm hover:bg-card/30 transition-all duration-300 group">
              <div className="p-6">
                {/* Fighter Avatar Placeholder */}
                <div className={`w-full h-48 mb-4 rounded-lg bg-gradient-to-br from-${fighter.color}/20 to-${fighter.color}/40 flex items-center justify-center relative overflow-hidden`}>
                  <div className={`text-6xl font-retro font-black text-${fighter.color} opacity-80 group-hover:scale-110 transition-transform duration-300`}>
                    {fighter.name[0]}
                  </div>
                  <div className="absolute inset-0 retro-grid opacity-20" />
                </div>

                {/* Fighter Info */}
                <h3 className={`font-retro text-2xl font-bold text-${fighter.color} mb-2`}>
                  {fighter.name}
                </h3>
                <p className="text-sm text-muted-foreground font-body mb-1">
                  {fighter.title}
                </p>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  {fighter.description}
                </p>

                {/* Fighter Stats */}
                <div className="space-y-2 mb-4">
                  {Object.entries(fighter.stats).map(([stat, value]) => (
                    <div key={stat} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {stat}
                      </span>
                      <div className="flex-1 mx-2 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${fighter.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className={`text-xs font-retro text-${fighter.color}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <Button 
                  variant="retro" 
                  className="w-full group-hover:scale-105 transition-transform duration-200"
                  onClick={() => navigate('/character-select')}
                >
                  SELECT
                </Button>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-${fighter.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            variant="combat" 
            size="lg" 
            className="text-xl px-12 py-6"
            onClick={() => navigate('/vs-screen')}
          >
            ENTER THE KOMBAT ARENA
          </Button>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" />
      </div>
    </section>
  );
};

export default FighterShowcase;