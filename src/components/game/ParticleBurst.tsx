import React from 'react';

interface ParticleBurstProps {
  count: number;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({ count }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 20,
    speed: 2 + Math.random() * 3,
    size: 8 + Math.random() * 12
  }));

  return (
    <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bg-yellow-400 rounded-full animate-ping"
          style={{
            left: `${Math.cos(p.angle) * 100}px`,
            top: `${Math.sin(p.angle) * 100}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: '0.8s',
            boxShadow: '0 0 20px rgba(255,215,0,0.8)'
          }}
        />
      ))}
    </div>
  );
};
