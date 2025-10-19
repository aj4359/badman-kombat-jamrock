import React from 'react';

interface VideoBackgroundProps {
  type?: 'hero' | 'section';
  overlay?: 'dark' | 'darker' | 'none';
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  type = 'hero',
  overlay = 'dark' 
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient that mimics video movement */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/50 to-black animate-slow-pan" />
      
      {/* Moving light rays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-scan-vertical" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-scan-vertical" 
          style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      
      {/* Spotlight effects */}
      {type === 'hero' && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" 
            style={{ animationDelay: '1s' }} />
        </>
      )}
      
      {/* Overlay */}
      {overlay === 'dark' && (
        <div className="absolute inset-0 bg-black/60" />
      )}
      {overlay === 'darker' && (
        <div className="absolute inset-0 bg-black/80" />
      )}
    </div>
  );
};

export default VideoBackground;
