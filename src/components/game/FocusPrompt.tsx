import React, { useState, useEffect } from 'react';

interface FocusPromptProps {
  onDismiss: () => void;
}

export const FocusPrompt: React.FC<FocusPromptProps> = ({ onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleKeyPress = () => {
      setVisible(false);
      setTimeout(onDismiss, 500);
    };

    window.addEventListener('keydown', handleKeyPress, { once: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">
          PRESS ANY KEY
        </div>
        <div className="text-2xl text-white/80">
          TO START FIGHTING
        </div>
      </div>
    </div>
  );
};
