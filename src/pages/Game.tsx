import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntegratedGameSystem } from '@/hooks/useIntegratedGameSystem';
import EnhancedGameCanvas from '@/components/game/EnhancedGameCanvas';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RastaChatbot } from '@/components/RastaChatbot';

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const integratedSystem = useIntegratedGameSystem();
  const [gameReady, setGameReady] = useState(false);
  
  // Get enhanced fighter data from character select or vs screen
  const fighterData = location.state?.fighterData || {
    player1: { id: 'leroy', name: 'Leroy', colors: { primary: 'hsl(180, 100%, 50%)', secondary: 'hsl(180, 100%, 30%)' } },
    player2: { id: 'jordan', name: 'Jordan', colors: { primary: 'hsl(270, 100%, 60%)', secondary: 'hsl(270, 100%, 40%)' } }
  };
  
  const integratedMode = location.state?.integratedMode || false;

  // EMERGENCY AUDIO KILL SWITCH - Destroy any existing audio
  useEffect(() => {
    console.log('🔇 EMERGENCY AUDIO KILL SWITCH ACTIVATED');
    
    // Emergency stop all audio contexts
    if (window.AudioContext || (window as any).webkitAudioContext) {
      const contexts = (window as any)._audioContexts || [];
      contexts.forEach((ctx: AudioContext) => {
        try {
          ctx.close();
          console.log('🔇 Closed AudioContext');
        } catch (e) {
          console.log('🔇 Error closing AudioContext:', e);
        }
      });
    }
    
    // Stop all HTML audio elements
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      console.log('🔇 Stopped HTML audio element');
    });
    
    // Initialize integrated system if in integrated mode
    if (integratedMode && fighterData.player1 && fighterData.player2) {
      console.log('Initializing integrated game system...');
      integratedSystem.initializeWithCharacterData(
        fighterData.player1.id,
        fighterData.player2.id,
        fighterData
      );
    }
    
    // INSTANT LOADING - No audio delays
    setGameReady(true);
    console.log('✅ Game marked as ready INSTANTLY - BELL ELIMINATED');

  }, [integratedMode, fighterData, integratedSystem]);

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
          
          {/* Audio errors removed since audio manager is disabled */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-black/90 text-green-400 font-mono text-xs p-3 rounded border">
          <div className="mb-2 font-bold text-red-400">🔇 EMERGENCY GAME DEBUG</div>
          <div>🔇 Audio Manager: DISABLED</div>
          <div>🔇 Bell Sounds: ELIMINATED</div>
          <div>Game Ready: {gameReady ? '✅ INSTANT' : '⏳'}</div>
          <div>Mode: {integratedMode ? '🥊 STREET FIGHTER' : '🎮 NORMAL'}</div>
        </div>
      )}
      
      {/* Enhanced Game Integration Wrapper */}
      {integratedMode ? (
        <div className="relative">
          <EnhancedGameCanvas />
          <div className="fixed bottom-4 left-4 z-50 bg-neon-cyan/10 border border-neon-cyan/30 
                         rounded-lg px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-neon-cyan">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
              STREET FIGHTER MODE ACTIVE
            </div>
          </div>
        </div>
      ) : (
        <EnhancedGameCanvas />
      )}

      {/* Enhanced Rasta Chatbot Navigator */}
      <RastaChatbot 
        onNavigateToGame={() => navigate('/game')}
        onNavigateToCharacterSelect={() => navigate('/character-select')}
        onNavigateToHome={() => navigate('/')}
      />
    </div>
  );
};

export default Game;