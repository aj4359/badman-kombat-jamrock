// Game Integration Utilities
export const GameIntegrationUtils = {
  // Validate fighter data from character select
  validateFighterData: (fighterData: any) => {
    return fighterData?.player1?.id && fighterData?.player2?.id;
  },

  // Create enhanced fighter payload
  createEnhancedFighterPayload: (player1Data: any, player2Data: any) => ({
    player1: {
      ...player1Data,
      timestamp: Date.now(),
      source: 'character-select'
    },
    player2: {
      ...player2Data,
      timestamp: Date.now(),
      source: 'character-select'
    }
  }),

  // Generate match ID for tracking
  generateMatchId: () => `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

  // Log integration event
  logIntegrationEvent: (event: string, data?: any) => {
    console.log(`🎮 [INTEGRATION] ${event}:`, data);
  }
};