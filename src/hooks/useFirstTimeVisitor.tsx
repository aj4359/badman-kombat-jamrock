import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bmk-visited-before';
const TUTORIAL_COMPLETED_KEY = 'bmk-tutorial-completed';
const SITE_TOUR_KEY = 'bmk-site-tour-completed';

export const useFirstTimeVisitor = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [siteTourCompleted, setSiteTourCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem(STORAGE_KEY);
    const tutorialDone = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    const tourDone = localStorage.getItem(SITE_TOUR_KEY);

    setIsFirstVisit(!hasVisited);
    setTutorialCompleted(tutorialDone === 'true');
    setSiteTourCompleted(tourDone === 'true');
    setLoading(false);
  }, []);

  const markAsVisited = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsFirstVisit(false);
  };

  const markTutorialCompleted = () => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    setTutorialCompleted(true);
  };

  const markSiteTourCompleted = () => {
    localStorage.setItem(SITE_TOUR_KEY, 'true');
    setSiteTourCompleted(true);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
    localStorage.removeItem(SITE_TOUR_KEY);
    setIsFirstVisit(true);
    setTutorialCompleted(false);
    setSiteTourCompleted(false);
  };

  return {
    isFirstVisit,
    tutorialCompleted,
    siteTourCompleted,
    loading,
    markAsVisited,
    markTutorialCompleted,
    markSiteTourCompleted,
    resetProgress,
  };
};
