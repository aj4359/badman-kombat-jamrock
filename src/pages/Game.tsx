import React, { useEffect, useState } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import EnhancedGameCanvas from '@/components/game/EnhancedGameCanvas';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Game = () => {
  const { isLoaded, playLayer, currentLayer, audioErrors } = useAudioManager();
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    console.log('Game page mounted');
    console.log('Audio loaded:', isLoaded, 'Current layer:', currentLayer);
    
    // Ensure gameplay music is playing when audio loads
    if (isLoaded && currentLayer !== 'gameplay') {
      console.log('Starting gameplay audio...');
      playLayer('gameplay');
    }

    // Mark game as ready after brief delay
    const readyTimer = setTimeout(() => {
      setGameReady(true);
      console.log('Game marked as ready');
    }, 1000);

    return () => clearTimeout(readyTimer);
  }, [isLoaded, currentLayer, playLayer]);

  const handleRetry = () => {
    console.log('Retrying game initialization...');
    window.location.reload();
  };

  // Show loading screen while initializing
  if (!gameReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-3xl font-retro text-neon-cyan mb-4">PREPARING FOR KOMBAT</h2>
          <div className="space-y-2 text-muted-foreground">
            <div>Loading game engine...</div>
            <div>Initializing audio system...</div>
            <div>Setting up fighters...</div>
          </div>
          
          {audioErrors && audioErrors.length > 0 && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-retro">Audio Issues Detected</span>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                Some audio files couldn't load, but the game will continue with placeholder sounds.
              </div>
              <div className="text-xs text-destructive/80">
                Missing: {audioErrors.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Debug panel for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-green-400 font-mono text-xs p-3 rounded">
          <div className="mb-2 font-bold">GAME DEBUG</div>
          <div>Audio Loaded: {isLoaded ? '✓' : '✗'}</div>
          <div>Current Layer: {currentLayer}</div>
          <div>Audio Errors: {audioErrors ? audioErrors.length : 0}</div>
          <div>Game Ready: {gameReady ? '✓' : '✗'}</div>
          
          {audioErrors && audioErrors.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="mt-2 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}
      
      <EnhancedGameCanvas />
    </div>
  );
};

export default Game;