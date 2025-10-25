import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTutorialProgress, TutorialStep as TutorialStepType } from '@/hooks/useTutorialProgress';
import { useFirstTimeVisitor } from '@/hooks/useFirstTimeVisitor';
import { TutorialStep } from '@/components/tutorial/TutorialStep';
import { MotionInputDisplay } from '@/components/tutorial/MotionInputDisplay';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trophy, Home } from 'lucide-react';

const Tutorial = () => {
  const navigate = useNavigate();
  const { progress, completeStep, updateStepProgress, setCurrentStep } = useTutorialProgress();
  const { markTutorialCompleted } = useFirstTimeVisitor();
  const [tutorialComplete, setTutorialComplete] = useState(false);

  // Tutorial step data
  const steps: Record<TutorialStepType, { title: string; instruction: string; maxProgress: number }> = {
    'movement': {
      title: 'Movement Basics',
      instruction: 'Use WASD to move around. Walk forward, backward, jump, and crouch.',
      maxProgress: 4,
    },
    'basic-attacks': {
      title: 'Basic Attacks',
      instruction: 'Press J for Light Punch, L for Light Kick. Land 3 punches and 3 kicks!',
      maxProgress: 6,
    },
    'blocking': {
      title: 'Blocking & Defense',
      instruction: 'Press K to Block incoming attacks. Successfully block 5 attacks!',
      maxProgress: 5,
    },
    'special-moves': {
      title: 'Special Moves',
      instruction: 'Execute a special move: ↓↘→ + Punch. Perform it 2 times!',
      maxProgress: 2,
    },
    'combos': {
      title: 'Combos',
      instruction: 'Chain attacks together: J → J → L (Punch Punch Kick). Land a 3-hit combo!',
      maxProgress: 1,
    },
    'super-moves': {
      title: 'Super Moves',
      instruction: 'Unleash your ultimate power: ↓↘→↓↘→ + Punch. Execute once!',
      maxProgress: 1,
    },
    'final-match': {
      title: 'Final Test',
      instruction: 'Time to test yourself! Win a match against the AI opponent.',
      maxProgress: 1,
    },
  };

  const currentStepData = steps[progress.currentStep];
  const currentProgress = progress.stepProgress[progress.currentStep] || 0;
  const isStepCompleted = progress.completedSteps.includes(progress.currentStep);

  // Simulate tutorial progression (in real game, this would be triggered by actual game events)
  useEffect(() => {
    // Auto-advance completed steps after delay
    if (isStepCompleted) {
      const timer = setTimeout(() => {
        const stepOrder: TutorialStepType[] = ['movement', 'basic-attacks', 'blocking', 'special-moves', 'combos', 'super-moves', 'final-match'];
        const currentIndex = stepOrder.indexOf(progress.currentStep);
        
        if (currentIndex < stepOrder.length - 1) {
          setCurrentStep(stepOrder[currentIndex + 1]);
          toast.success('Next step unlocked!');
        } else {
          // Tutorial complete
          setTutorialComplete(true);
          markTutorialCompleted();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isStepCompleted, progress.currentStep, setCurrentStep, markTutorialCompleted]);

  // Demo: Simulate progress (remove this in real implementation)
  const simulateProgress = () => {
    const newProgress = Math.min(currentProgress + 1, currentStepData.maxProgress);
    updateStepProgress(progress.currentStep, newProgress);
    
    if (newProgress >= currentStepData.maxProgress) {
      completeStep(progress.currentStep);
      toast.success('Step completed! 🎉');
    }
  };

  if (tutorialComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background flex items-center justify-center p-8">
        <div className="text-center max-w-2xl animate-in fade-in zoom-in duration-500">
          <Trophy className="h-32 w-32 text-yellow-400 mx-auto mb-8 animate-bounce" />
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            TUTORIAL COMPLETE!
          </h1>
          <p className="text-2xl text-white mb-8">
            You ready fi Kingston now, champion! 🏆
          </p>
          <div className="space-y-4">
            <div className="bg-green-500/20 border-2 border-green-400 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-2">Achievement Unlocked:</h3>
              <p className="text-white">"Street Fighter Graduate"</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/3d-ultimate')}
                className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 text-white font-bold text-xl px-8 py-6"
              >
                START KOMBAT! ⚡
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/')}
                className="border-2"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-950/20 to-background relative">
      {/* Tutorial Canvas Placeholder */}
      <div className="w-full h-screen bg-gradient-to-b from-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🥊</div>
          <div className="text-2xl text-white/60 mb-8">Tutorial Arena</div>
          
          {/* Demo Progress Button */}
          <Button
            size="lg"
            onClick={simulateProgress}
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-500"
          >
            Simulate Progress ({currentProgress}/{currentStepData.maxProgress})
          </Button>
        </div>
      </div>

      {/* Tutorial Step Overlay */}
      <TutorialStep
        title={currentStepData.title}
        instruction={currentStepData.instruction}
        progress={currentProgress}
        maxProgress={currentStepData.maxProgress}
        completed={isStepCompleted}
      >
        {/* Show motion input display for special moves */}
        {progress.currentStep === 'special-moves' && (
          <MotionInputDisplay motion="quarter-circle-forward" button="J" size="md" />
        )}
        {progress.currentStep === 'super-moves' && (
          <MotionInputDisplay motion="double-quarter-circle" button="J" size="md" />
        )}
      </TutorialStep>

      {/* Exit Button */}
      <Button
        variant="outline"
        className="fixed top-4 left-4 z-50"
        onClick={() => navigate('/')}
      >
        <Home className="mr-2 h-4 w-4" />
        Exit Tutorial
      </Button>
    </div>
  );
};

export default Tutorial;
