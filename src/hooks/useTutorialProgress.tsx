import { useState, useEffect } from 'react';

export type TutorialStep = 
  | 'movement'
  | 'basic-attacks'
  | 'blocking'
  | 'special-moves'
  | 'combos'
  | 'super-moves'
  | 'final-match';

interface TutorialProgress {
  currentStep: TutorialStep;
  completedSteps: TutorialStep[];
  stepProgress: Record<string, number>;
}

const STORAGE_KEY = 'bmk-tutorial-progress';
const DEFAULT_PROGRESS: TutorialProgress = {
  currentStep: 'movement',
  completedSteps: [],
  stepProgress: {},
};

export const useTutorialProgress = () => {
  const [progress, setProgress] = useState<TutorialProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tutorial progress:', e);
      }
    }
  }, []);

  const saveProgress = (newProgress: TutorialProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const completeStep = (step: TutorialStep) => {
    const newProgress = {
      ...progress,
      completedSteps: [...progress.completedSteps, step],
    };
    saveProgress(newProgress);
  };

  const updateStepProgress = (step: string, value: number) => {
    const newProgress = {
      ...progress,
      stepProgress: {
        ...progress.stepProgress,
        [step]: value,
      },
    };
    saveProgress(newProgress);
  };

  const setCurrentStep = (step: TutorialStep) => {
    saveProgress({ ...progress, currentStep: step });
  };

  const resetProgress = () => {
    saveProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isStepCompleted = (step: TutorialStep) => {
    return progress.completedSteps.includes(step);
  };

  const getStepProgress = (step: string) => {
    return progress.stepProgress[step] || 0;
  };

  return {
    progress,
    completeStep,
    updateStepProgress,
    setCurrentStep,
    resetProgress,
    isStepCompleted,
    getStepProgress,
  };
};
