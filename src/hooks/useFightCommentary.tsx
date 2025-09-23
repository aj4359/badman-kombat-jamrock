import { useState, useCallback } from 'react';

interface CommentaryState {
  isVisible: boolean;
  currentShout: string;
}

export const useFightCommentary = () => {
  const [commentary, setCommentary] = useState<CommentaryState>({
    isVisible: false,
    currentShout: ''
  });

  const triggerCommentary = useCallback((trigger: 'hit' | 'special' | 'super' | 'ko' | 'block') => {
    // Don't show if already showing
    if (commentary.isVisible) return;

    let chance = 0;
    
    // Different chances for different events
    switch (trigger) {
      case 'hit':
        chance = 0.3; // 30% chance on hit
        break;
      case 'special':
        chance = 0.7; // 70% chance on special move
        break;
      case 'super':
        chance = 0.9; // 90% chance on super move
        break;
      case 'ko':
        chance = 1.0; // Always on KO
        break;
      case 'block':
        chance = 0.2; // 20% chance on block
        break;
    }

    if (Math.random() < chance) {
      setCommentary({
        isVisible: true,
        currentShout: ''
      });
    }
  }, [commentary.isVisible]);

  const hideCommentary = useCallback(() => {
    setCommentary({
      isVisible: false,
      currentShout: ''
    });
  }, []);

  return {
    commentary,
    triggerCommentary,
    hideCommentary
  };
};