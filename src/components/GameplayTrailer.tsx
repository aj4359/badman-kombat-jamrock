import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from "lucide-react";
import { useAudioManager } from "@/hooks/useAudioManager";

const GameplayTrailer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerStarted, setTrailerStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stopAll, playLayer, currentLayer } = useAudioManager();

  useEffect(() => {
    // Check if video can load
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleError = () => {
        setHasError(true);
        setIsLoading(false);
        console.warn('Video failed to load: /assets/bmk-trailer.mp4');
      };

      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, []);

  const togglePlay = async () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Stop all background audio and switch to gameplay audio
        stopAll();
        playLayer('gameplay'); // Start gameplay audio for trailer
        setTrailerStarted(true);
        
        try {
          // Reset video for clean playback and audio sync
          videoRef.current.currentTime = 0;
          videoRef.current.playbackRate = 1.0;
          
          // Enhanced audio sync setup
          if (videoRef.current.readyState >= 3) { // HAVE_FUTURE_DATA for smoother sync
            try {
              // Force immediate audio context activation
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                await playPromise;
                setIsPlaying(true);
                console.log('Video started with audio sync');
              }
            } catch (error) {
              console.warn('Video playback failed:', error);
              setHasError(true);
            }
          } else {
            // Wait for sufficient buffering for audio sync
            videoRef.current.addEventListener('canplaythrough', async () => {
              try {
                await videoRef.current!.play();
                setIsPlaying(true);
                console.log('Video started after buffering with audio sync');
              } catch (error) {
                console.warn('Video playback failed:', error);
                setHasError(true);
              }
            }, { once: true });
          }
        } catch (error) {
          console.warn('Video playback failed:', error);
          setHasError(true);
        }
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
    <section id="trailer" className="py-20 relative">
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
            {/* Video Element or Fallback */}
            {!hasError ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="/assets/bmk-reveal.gif"
                preload="auto"
                crossOrigin="anonymous"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onLoadedData={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = isMuted;
                    // Configure for optimal audio sync
                    videoRef.current.setAttribute('playsinline', 'true');
                    videoRef.current.setAttribute('webkit-playsinline', 'true');
                    // Enhanced audio sync configuration
                    videoRef.current.preload = 'auto';
                    videoRef.current.volume = 1.0;
                    // Force audio to sync properly
                    videoRef.current.defaultPlaybackRate = 1.0;
                    videoRef.current.playbackRate = 1.0;
                    // Configure for immediate audio startup
                    videoRef.current.autoplay = false;
                    videoRef.current.controls = false;
                  }
                }}
                onTimeUpdate={() => {
                  // Ensure audio stays in sync during playback
                  if (videoRef.current && isPlaying) {
                    const video = videoRef.current;
                    // Check for audio desync and correct if needed
                    if (video.readyState >= 2) {
                      video.playbackRate = 1.0; // Ensure normal playback rate
                    }
                  }
                }}
              >
                <source src="/assets/bmk-trailer.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              // Fallback content when video fails to load
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background/80 to-muted/20">
                <div className="text-center p-8">
                  <AlertCircle className="h-16 w-16 text-neon-orange mx-auto mb-4" />
                  <h3 className="text-2xl font-retro text-neon-pink mb-4">TRAILER COMING SOON</h3>
                  <p className="text-muted-foreground font-body mb-6">
                    Epic gameplay footage is being prepared for your viewing experience
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground/80">
                    <div>• 8 Unique Fighters</div>
                    <div>• Special Attacks & Combos</div>
                    <div>• Kingston Battlegrounds</div>
                    <div>• Intense Combat Action</div>
                  </div>
                </div>
              </div>
            )}

            {/* Play Overlay - Only show if trailer hasn't started */}
            {!trailerStarted && !isPlaying && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                    <div className="text-neon-cyan font-retro">LOADING...</div>
                  </div>
                ) : (
                  <Button
                    variant="neon"
                    size="lg"
                    onClick={togglePlay}
                    className="text-2xl px-8 py-6 rounded-full"
                  >
                    <Play className="h-8 w-8 mr-2" />
                    WATCH TRAILER
                  </Button>
                )}
              </div>
            )}

            {/* Replay Overlay - Show if trailer ended */}
            {trailerStarted && !isPlaying && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <Button
                  variant="cyber"
                  size="lg"
                  onClick={togglePlay}
                  className="text-xl px-6 py-4 rounded-full"
                >
                  <Play className="h-6 w-6 mr-2" />
                  REPLAY
                </Button>
              </div>
            )}

            {/* Custom Video Controls */}
            {isPlaying && !hasError && (
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