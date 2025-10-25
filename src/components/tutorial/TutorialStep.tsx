import React, { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TutorialStepProps {
  title: string;
  instruction: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  children?: ReactNode;
}

export const TutorialStep: React.FC<TutorialStepProps> = ({
  title,
  instruction,
  progress,
  maxProgress,
  completed,
  children,
}) => {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[600px]">
      <Card className="bg-black/90 border-4 border-yellow-400 p-6 shadow-2xl animate-in fade-in slide-in-from-top duration-500">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-yellow-400">{title}</h2>
          {completed && (
            <div className="bg-green-500 text-white rounded-full p-2 animate-in zoom-in">
              <Check className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Instruction */}
        <p className="text-xl text-white mb-4">{instruction}</p>

        {/* Progress Bar */}
        {!completed && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-yellow-400 mb-2">
              <span>Progress</span>
              <span>{progress} / {maxProgress}</span>
            </div>
            <div className="h-4 bg-black/50 rounded-full overflow-hidden border-2 border-yellow-400/30">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                style={{ width: `${(progress / maxProgress) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}

        {/* Completion Message */}
        {completed && (
          <div className="text-center">
            <div className="text-green-400 text-2xl font-bold animate-pulse">
              ✓ STEP COMPLETED!
            </div>
            <div className="text-white/80 mt-2">Get ready fi di next challenge...</div>
          </div>
        )}
      </Card>
    </div>
  );
};
