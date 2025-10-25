import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, BookOpen } from 'lucide-react';

interface TutorialPromptBannerProps {
  onStartTutorial: () => void;
}

export const TutorialPromptBanner: React.FC<TutorialPromptBannerProps> = ({
  onStartTutorial,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 text-white shadow-2xl border-t-4 border-yellow-400 animate-slide-up">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 animate-pulse flex-shrink-0" />
          <div className="text-sm md:text-base">
            <span className="font-bold">New here?</span>
            <span className="ml-2 hidden sm:inline">Take the 5-minute tutorial to master the moves!</span>
            <span className="ml-2 sm:hidden">Learn the moves in 5 min!</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onStartTutorial}
            size="sm"
            variant="secondary"
            className="font-bold bg-yellow-400 text-black hover:bg-yellow-300"
          >
            START TUTORIAL
          </Button>
          <Button
            onClick={() => setDismissed(true)}
            size="sm"
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/20 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
