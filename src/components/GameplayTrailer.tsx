import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

const GameplayTrailer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-retro text-5xl md:text-6xl font-black mb-4 text-neon-pink">
            GAMEPLAY TRAILER
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Experience the intense action of BadMan Kombat in this exclusive gameplay preview
          </p>
        </div>

        {/* Video Player Container */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative aspect-video combat-border rounded-lg overflow-hidden bg-black group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="/assets/bmk-reveal.gif"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => {
                if (videoRef.current) {
                  videoRef.current.muted = isMuted;
                }
              }}
            >
              <source src="/assets/bmk-trailer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <Button
                  variant="neon"
                  size="lg"
                  onClick={togglePlay}
                  className="text-2xl px-8 py-6 rounded-full"
                >
                  <Play className="h-8 w-8 mr-2" />
                  WATCH TRAILER
                </Button>
              </div>
            )}

            {/* Custom Video Controls */}
            {isPlaying && (
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="cyber"
                      size="icon"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="cyber"
                      size="icon"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <Button
                    variant="cyber"
                    size="icon"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            <div className="absolute top-4 right-4">
              <div className="text-neon-green font-retro text-sm animate-pulse">
                [REC]
              </div>
            </div>
          </div>

          {/* Trailer Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center combat-border rounded-lg p-4 bg-card/10 backdrop-blur-sm">
              <h3 className="text-neon-cyan font-retro text-lg mb-2">FEATURING</h3>
              <p className="text-muted-foreground font-body text-sm">
                All 8 fighters in epic kombat
              </p>
            </div>
            <div className="text-center combat-border rounded-lg p-4 bg-card/10 backdrop-blur-sm">
              <h3 className="text-neon-pink font-retro text-lg mb-2">LOCATIONS</h3>
              <p className="text-muted-foreground font-body text-sm">
                Iconic Kingston battlegrounds
              </p>
            </div>
            <div className="text-center combat-border rounded-lg p-4 bg-card/10 backdrop-blur-sm">
              <h3 className="text-neon-green font-retro text-lg mb-2">MOVES</h3>
              <p className="text-muted-foreground font-body text-sm">
                Special attacks & combos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-neon-pink/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </section>
  );
};

export default GameplayTrailer;