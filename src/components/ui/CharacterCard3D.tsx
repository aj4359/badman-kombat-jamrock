import React, { useState } from 'react';

interface CharacterCard3DProps {
  name: string;
  title: string;
  image: string;
  accentColor: string;
  stats?: {
    power: number;
    speed: number;
    defense: number;
  };
  onClick?: () => void;
}

const CharacterCard3D: React.FC<CharacterCard3DProps> = ({
  name,
  title,
  image,
  accentColor,
  stats,
  onClick
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = (y - centerY) / 10;
    const rotateYValue = (centerX - x) / 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div 
      className="relative group cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div 
        className="relative w-full h-[500px] transition-all duration-300 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.05 : 1})`,
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute -inset-4 rounded-2xl blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ 
            background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
          }}
        />
        
        {/* Card container */}
        <div 
          className="relative w-full h-full rounded-xl overflow-hidden border-2 transition-all duration-300"
          style={{
            borderColor: isHovered ? accentColor : `${accentColor}40`,
            boxShadow: isHovered ? `0 0 40px ${accentColor}60` : 'none',
          }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
          
          {/* Fighter image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={image} 
              alt={name}
              className="h-full w-auto object-contain filter drop-shadow-2xl transition-transform duration-300"
              style={{
                filter: isHovered ? `drop-shadow(0 0 30px ${accentColor})` : 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
              }}
            />
          </div>
          
          {/* Character info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="text-xs font-bold tracking-widest mb-1" style={{ color: accentColor }}>
              {title}
            </div>
            <h3 className="text-2xl font-black text-white mb-3">{name}</h3>
            
            {/* Stats - show on hover */}
            {stats && (
              <div 
                className={`grid grid-cols-3 gap-3 transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div>
                  <div className="text-xs text-white/60 mb-1">POWER</div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.power}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">SPEED</div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.speed}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">DEFENSE</div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.defense}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Scan line effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterCard3D;
