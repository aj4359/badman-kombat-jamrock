import { Card } from '@/components/ui/card';
import { Gamepad2, Trophy, Zap, GraduationCap, Users } from 'lucide-react';

const gameModes = [
  {
    id: 'story',
    name: 'Story Mode',
    icon: Gamepad2,
    description: 'Experience the epic journey of Kingston\'s warriors',
    status: 'available',
    features: ['10+ Chapters', 'Cinematic Cutscenes', 'Boss Battles']
  },
  {
    id: 'arcade',
    name: 'Arcade Mode',
    icon: Trophy,
    description: 'Classic ladder battles against all fighters',
    status: 'available',
    features: ['9 Fighter Gauntlet', 'Increasing Difficulty', 'Leaderboards']
  },
  {
    id: 'training',
    name: 'Training Mode',
    icon: GraduationCap,
    description: 'Master combos and perfect your technique',
    status: 'available',
    features: ['Frame Data', 'Combo Trials', 'AI Dummy']
  },
  {
    id: 'versus',
    name: 'VS Mode',
    icon: Zap,
    description: 'Battle against friends locally',
    status: 'available',
    features: ['2 Player', 'Custom Rules', 'Stage Select']
  },
  {
    id: 'online',
    name: 'Online Multiplayer',
    icon: Users,
    description: 'Compete against players worldwide',
    status: 'coming-soon',
    features: ['Ranked Matches', 'Casual Play', 'Tournaments']
  }
];

export const GameModes = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            GAME MODES
          </span>
        </h2>
        <p className="text-white/70 text-center mb-12 text-lg">
          Multiple ways to prove your skills
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className={`bg-gradient-to-b from-gray-900 to-black border-2 p-6 transition-all hover:scale-105 ${
                  mode.status === 'available' 
                    ? 'border-red-900/50 hover:border-red-600' 
                    : 'border-gray-800 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    mode.status === 'available' 
                      ? 'bg-red-600/20 text-red-500' 
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {mode.status === 'coming-soon' && (
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                      COMING SOON
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{mode.name}</h3>
                <p className="text-white/70 mb-4">{mode.description}</p>

                <ul className="space-y-2">
                  {mode.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-white/60">
                      <span className="text-red-500 mr-2">▸</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
