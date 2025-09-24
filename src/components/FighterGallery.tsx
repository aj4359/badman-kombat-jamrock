import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import elderZionSprite from '@/assets/elder-zion-sprite.png';
import marcusSprite from '@/assets/marcus-sprite.png';
import sifuSprite from '@/assets/sifu-sprite.png';

const fighters = [
  {
    id: 'elder-zion',
    name: 'Elder Zion',
    title: 'The Mystic Guardian',
    description: 'Ancient wisdom meets spiritual power. Master of the sacred herbs and keeper of the old ways.',
    image: elderZionSprite,
    origin: 'Blue Mountains, Jamaica',
    style: 'Spiritual Combat',
    special: 'Sacred Fire',
    color: 'from-jamaica-green to-jamaica-yellow'
  },
  {
    id: 'marcus',
    name: 'Marcus "Iron Fist"',
    title: 'The Street Champion',
    description: 'Young warrior from the concrete jungle. Boxing skills honed on Kingston streets.',
    image: marcusSprite,
    origin: 'Spanish Town, Jamaica',
    style: 'Street Boxing',
    special: 'Thunder Punch',
    color: 'from-jamaica-red to-jamaica-yellow'
  },
  {
    id: 'sifu-leung',
    name: 'Sifu Y.K. Leung',
    title: 'The Dragon Master',
    description: 'Legendary kung fu master who brought ancient Chinese martial arts to the Caribbean.',
    image: sifuSprite,
    origin: 'Hong Kong → Jamaica',
    style: 'Dragon Kung Fu',
    special: 'Celestial Strike',
    color: 'from-neon-orange to-neon-purple'
  }
];

export const FighterGallery: React.FC = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-cyber opacity-50"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-retro text-neon-cyan mb-4 glitch" data-text="LEGENDARY FIGHTERS">
            LEGENDARY FIGHTERS
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-body">
            Meet the warriors who have mastered the ancient arts and street combat techniques. Each fighter brings their unique style to the arena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {fighters.map((fighter) => (
            <Card key={fighter.id} className="group relative overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300">
              {/* Fighter Image */}
              <div className="relative h-80 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${fighter.color} opacity-20`}></div>
                <img 
                  src={fighter.image} 
                  alt={fighter.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                
                {/* Fighter Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-retro text-primary mb-1">{fighter.name}</h3>
                  <p className="text-sm text-neon-pink font-semibold">{fighter.title}</p>
                </div>
              </div>

              {/* Fighter Details */}
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {fighter.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Origin:</span>
                    <span className="text-foreground font-semibold">{fighter.origin}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Style:</span>
                    <span className="text-neon-green font-semibold">{fighter.style}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Special:</span>
                    <span className="text-neon-orange font-semibold">{fighter.special}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300"
                  onClick={() => console.log(`Selected ${fighter.name}`)}
                >
                  SELECT FIGHTER
                </Button>
              </div>

              {/* Combat Border Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 combat-border"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-retro hover:shadow-neon-pink text-lg px-8 py-4 font-retro transition-all duration-300"
          >
            ENTER THE TOURNAMENT
          </Button>
        </div>
      </div>
    </section>
  );
};