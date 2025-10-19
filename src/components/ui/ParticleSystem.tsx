import React from 'react';

const ParticleSystem = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}
      
      {/* Larger glowing orbs */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full blur-xl animate-float"
          style={{
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 
              ? 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' 
              : 'radial-gradient(circle, rgba(139,0,255,0.15) 0%, transparent 70%)',
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 15}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;
