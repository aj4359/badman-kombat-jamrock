import React, { useEffect } from 'react';
import { useIntegratedGameSystem } from '@/hooks/useIntegratedGameSystem';
import { useAudioManager } from '@/hooks/useAudioManager';
import { toast } from 'sonner';

interface EnhancedGameIntegrationProps {
  fighterData?: {
    player1: any;
    player2: any;
  };
  integratedMode?: boolean;
  children: React.ReactNode;
}

export const EnhancedGameIntegration: React.FC<EnhancedGameIntegrationProps> = ({
  fighterData,
  integratedMode = false,
  children
}) => {
  const integratedSystem = useIntegratedGameSystem();
  const audioManager = useAudioManager();

  useEffect(() => {
    if (integratedMode && fighterData?.player1 && fighterData?.player2) {
      console.log('🎮 Initializing Enhanced Game Integration');
      console.log('Fighter Data:', fighterData);
      
      // Initialize the integrated system
      integratedSystem.initializeWithCharacterData(
        fighterData.player1.id,
        fighterData.player2.id,
        fighterData
      );

      // Show integration success toast
      toast.success('Game systems integrated successfully!', {
        description: `${fighterData.player1.name} vs ${fighterData.player2.name}`
      });

      // Play integration sound
      if (audioManager.isLoaded) {
        audioManager.playEffect('special');
      }
    }
  }, [fighterData, integratedMode, integratedSystem, audioManager]);

  // Provide integration context to children
  return (
    <div data-integration-mode={integratedMode}>
      {children}
      
      {/* Integration Status Indicator */}
      {integratedMode && (
        <div className="fixed bottom-4 left-4 z-50 bg-neon-cyan/10 border border-neon-cyan/30 
                       rounded-lg px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-neon-cyan">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            INTEGRATED MODE
          </div>
        </div>
      )}
    </div>
  );
};