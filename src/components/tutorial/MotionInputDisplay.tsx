import React from 'react';
import { ArrowDown, ArrowRight, ArrowDownRight } from 'lucide-react';

interface MotionInputDisplayProps {
  motion: 'quarter-circle-forward' | 'quarter-circle-back' | 'half-circle' | 'double-quarter-circle';
  button: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MotionInputDisplay: React.FC<MotionInputDisplayProps> = ({
  motion,
  button,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const renderMotion = () => {
    switch (motion) {
      case 'quarter-circle-forward':
        return (
          <div className="flex items-center gap-2">
            <ArrowDown className={iconSizes[size]} />
            <ArrowDownRight className={iconSizes[size]} />
            <ArrowRight className={iconSizes[size]} />
          </div>
        );
      case 'double-quarter-circle':
        return (
          <div className="flex items-center gap-2">
            <ArrowDown className={iconSizes[size]} />
            <ArrowDownRight className={iconSizes[size]} />
            <ArrowRight className={iconSizes[size]} />
            <ArrowDown className={iconSizes[size]} />
            <ArrowDownRight className={iconSizes[size]} />
            <ArrowRight className={iconSizes[size]} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 bg-black/80 border-4 border-yellow-400 rounded-xl p-8 shadow-2xl">
      <div className="text-yellow-400 animate-pulse">
        {renderMotion()}
      </div>
      <div className={`text-yellow-400 font-bold ${sizeClasses[size]}`}>
        +
      </div>
      <div className={`bg-yellow-400 text-black font-bold ${sizeClasses[size]} px-6 py-3 rounded-lg shadow-lg`}>
        {button}
      </div>
    </div>
  );
};
