import React, { useState, useEffect, useCallback } from 'react';

interface FocusPromptProps {
  onDismiss: () => void;
}

export const FocusPrompt: React.FC<FocusPromptProps> = ({ onDismiss }) => {
  const [visible, setVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(onDismiss, 500);
  }, [onDismiss]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.stopPropagation();
      handleDismiss();
    };

    window.addEventListener('keydown', handleKeyPress, { once: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleDismiss]);

  if (!visible) return null;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in cursor-pointer"
      onClick={handleDismiss}
    >
      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">
          PRESS ANY KEY
        </div>
        <div className="text-2xl text-white/80">
          TO START FIGHTING
        </div>
        <div className="text-sm text-white/60 mt-4">
          (or click anywhere)
        </div>
      </div>
    </div>
  );
};
