import React, { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delay = 0,
  duration = 2000,
  onComplete 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      if (onComplete) {
        setTimeout(onComplete, duration);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, onComplete]);

  if (!visible) return null;

  return (
    <div className={`animate-fade-in ${className}`}>
      {text}
    </div>
  );
};