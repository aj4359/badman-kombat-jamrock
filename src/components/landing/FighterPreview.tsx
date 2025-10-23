import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';

interface FighterPreviewProps {
  id: string;
  name: string;
  title: string;
  image: string;
  stats: {
    speed: number;
    power: number;
    technique: number;
  };
  voiceLine?: string;
  isLocked?: boolean;
}

export const FighterPreview = ({
  id,
  name,
  title,
  image,
  stats,
  voiceLine = "Ready to fight!",
  isLocked = false
}: FighterPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [playingVoice, setPlayingVoice] = useState(false);

  const playVoiceLine = () => {
    setPlayingVoice(true);
    // Simulate voice playback
    setTimeout(() => setPlayingVoice(false), 2000);
  };

  const StatBar = ({ label, value }: { label: string; value: number }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/70">{label}</span>
        <span className="text-white font-bold">{value}/10</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500"
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );

  return (
    <Card
      className="relative overflow-hidden group cursor-pointer bg-gradient-to-b from-gray-900 to-black border-2 border-gray-800 hover:border-red-600 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fighter Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${isLocked ? 'grayscale' : ''}`}
        />
        
        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-white font-bold">LOCKED</div>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        {!isLocked && isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Stats */}
              <StatBar label="SPEED" value={stats.speed} />
              <StatBar label="POWER" value={stats.power} />
              <StatBar label="TECHNIQUE" value={stats.technique} />
            </div>
          </div>
        )}
      </div>

      {/* Fighter Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-bold text-lg">{name}</h3>
            <p className="text-orange-500 text-sm">{title}</p>
          </div>
          
          {!isLocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playVoiceLine();
              }}
              className={`p-2 rounded-full transition-colors ${
                playingVoice 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${playingVoice ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </div>

        {/* Voice Line Text */}
        {playingVoice && (
          <div className="mt-2 text-xs text-white/70 italic animate-fade-in">
            "{voiceLine}"
          </div>
        )}

        {/* Style Badge */}
        {!isLocked && (
          <Badge variant="outline" className="mt-2 border-red-600 text-red-500">
            {id === 'leroy' ? 'RUSHDOWN' : 
             id === 'jordan' ? 'ALL-ROUNDER' :
             id === 'razor' ? 'ZONER' :
             id === 'sifu' ? 'GRAPPLER' : 'BALANCED'}
          </Badge>
        )}
      </div>
    </Card>
  );
};
