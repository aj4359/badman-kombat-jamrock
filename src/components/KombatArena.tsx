import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Zap } from "lucide-react";
import kingstonArena from '@/assets/kingston-downtown-arena.jpg';
import kingstonStreetScene from '@/assets/kingston-street-scene-1.jpg';
import kingstonAlleyScene from '@/assets/kingston-alley-scene.jpg';
import kingstonCommunityScene from '@/assets/kingston-community-scene.jpg';
import blueMountainsArena from '@/assets/blue-mountains-temple.jpg';
import negrilArena from '@/assets/negril-beach-arena.jpg';

const KombatArena = () => {
  const arenas = [
    {
      name: "DOWNTOWN KINGSTON",
      description: "Fight among the authentic streets of Jamaica's capital",
      features: ["Street Culture", "Community Vibes", "Real Kingston Energy"],
      difficulty: "Medium",
      icon: <MapPin className="h-6 w-6" />,
      color: "neon-cyan",
      image: kingstonStreetScene,
      additionalImages: [kingstonAlleyScene, kingstonCommunityScene]
    },
    {
      name: "BLUE MOUNTAINS TEMPLE",
      description: "Mystical ancient temple ruins with spiritual energy",
      features: ["Sacred Stones", "Waterfall Hazards", "Mystical Powers"],
      difficulty: "Hard",
      icon: <Zap className="h-6 w-6" />,
      color: "neon-green",
      image: blueMountainsArena
    },
    {
      name: "NEGRIL BEACH PIER",
      description: "Tropical paradise with sunset fighting vibes",
      features: ["Sand Traps", "Water Splash", "Sunset Power-ups"],
      difficulty: "Expert",
      icon: <Clock className="h-6 w-6" />,
      color: "neon-pink",
      image: negrilArena
    }
  ];

  return (
    <section className="game-modes py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-retro text-5xl md:text-6xl font-black mb-4 text-neon-green">
            KOMBAT ARENAS
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Battle across iconic Jamaica locations enhanced with 80's cyberpunk technology
          </p>
        </div>

        {/* Arenas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {arenas.map((arena, index) => (
            <Card 
              key={arena.name} 
              className="relative overflow-hidden combat-border bg-card/20 backdrop-blur-sm hover:bg-card/30 transition-all duration-300 group"
            >
              <div className="p-6">
                {/* Arena Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-${arena.color}/20 text-${arena.color}`}>
                    {arena.icon}
                  </div>
                  <div>
                    <h3 className={`font-retro text-lg font-bold text-${arena.color}`}>
                      {arena.name}
                    </h3>
                    <div className="text-xs text-muted-foreground font-body">
                      Difficulty: {arena.difficulty}
                    </div>
                  </div>
                </div>

                {/* Arena Preview */}
                <div className="w-full h-32 mb-4 rounded-lg relative overflow-hidden">
                  <img 
                    src={arena.image} 
                    alt={arena.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute inset-0 retro-grid opacity-20" />
                  <div className={`absolute inset-0 bg-${arena.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>

                {/* Arena Description */}
                <p className="text-sm text-muted-foreground font-body mb-4">
                  {arena.description}
                </p>

                {/* Arena Features */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-retro">
                    Features
                  </h4>
                  {arena.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full bg-${arena.color}`} />
                      <span className="text-xs text-muted-foreground font-body">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select Arena Button */}
                <Button 
                  variant="retro" 
                  className="w-full group-hover:scale-105 transition-transform duration-200"
                >
                  ENTER ARENA
                </Button>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-${arena.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            </Card>
          ))}
        </div>

        {/* Tournament Mode */}
        <div className="max-w-2xl mx-auto text-center combat-border rounded-lg p-8 bg-card/10 backdrop-blur-sm">
          <h3 className="font-retro text-3xl font-black text-neon-orange mb-4">
            TOURNAMENT MODE
          </h3>
          <p className="text-muted-foreground font-body mb-6">
            Fight through all arenas in sequence to become the ultimate BadMan Kombat champion. 
            Face increasingly difficult opponents in a gauntlet of cyberpunk street fighting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="combat" size="lg">
              START TOURNAMENT
            </Button>
            <Button variant="jamaica" size="lg">
              VIEW RANKINGS
            </Button>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-neon-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-neon-orange/10 rounded-full blur-3xl animate-pulse" />
      </div>
    </section>
  );
};

export default KombatArena;