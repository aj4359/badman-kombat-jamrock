import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TourStop {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STOPS: TourStop[] = [
  {
    id: 'hero',
    title: "Di Main Arena",
    description: "Dis where di action starts! Check out di latest fighters an' jump into battle.",
    targetSelector: '.hero-section',
    position: 'bottom',
  },
  {
    id: 'fighters',
    title: "Meet Di Warriors",
    description: "Kingston's baddest fighters ready fi kombat. Each one got unique moves an' style!",
    targetSelector: '.fighter-showcase',
    position: 'top',
  },
  {
    id: 'modes',
    title: "Choose Your Battleground",
    description: "Quick play, arcade mode, or practice - pick your path to glory!",
    targetSelector: '.game-modes',
    position: 'top',
  },
  {
    id: 'generator',
    title: "Create Your Champion",
    description: "Use AI fi create your own custom fighter! Give dem moves, style, everything!",
    targetSelector: '[href="/fighter-generator"]',
    position: 'bottom',
  },
  {
    id: 'play',
    title: "Ready Fi Kombat?",
    description: "When you ready fi throw down, click here an' show dem what you made of!",
    targetSelector: '[href="/3d-ultimate"]',
    position: 'left',
  },
];

interface SiteTourGuideProps {
  active: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const SiteTourGuide: React.FC<SiteTourGuideProps> = ({
  active,
  onComplete,
  onSkip,
}) => {
  const [currentStop, setCurrentStop] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const stop = TOUR_STOPS[currentStop];

  useEffect(() => {
    if (!active) return;

    const element = document.querySelector(stop.targetSelector) as HTMLElement;
    setTargetElement(element);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('tour-highlight');
    }

    return () => {
      element?.classList.remove('tour-highlight');
    };
  }, [currentStop, active, stop.targetSelector]);

  if (!active) return null;

  const handleNext = () => {
    if (currentStop < TOUR_STOPS.length - 1) {
      setCurrentStop(currentStop + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStop > 0) {
      setCurrentStop(currentStop - 1);
    }
  };

  const getCardPosition = () => {
    if (!targetElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = targetElement.getBoundingClientRect();
    const offset = 20;

    switch (stop.position) {
      case 'top':
        return { top: `${rect.top - 200}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: `${rect.bottom + offset}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translateX(-50%)' };
      case 'left':
        return { top: `${rect.top + rect.height / 2}px`, left: `${rect.left - 320}px`, transform: 'translateY(-50%)' };
      case 'right':
        return { top: `${rect.top + rect.height / 2}px`, left: `${rect.right + offset}px`, transform: 'translateY(-50%)' };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-[9998] pointer-events-none" />

      {/* Spotlight on target */}
      {targetElement && (
        <div
          className="fixed z-[9999] pointer-events-none border-4 border-primary rounded-lg shadow-2xl shadow-primary/50"
          style={{
            top: targetElement.getBoundingClientRect().top - 8,
            left: targetElement.getBoundingClientRect().left - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
          }}
        />
      )}

      {/* Tour Card */}
      <Card
        className="fixed z-[10000] w-80 bg-background border-2 border-primary shadow-2xl animate-in fade-in zoom-in duration-300"
        style={getCardPosition()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="text-2xl">🗺️</div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-2 text-primary">{stop.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{stop.description}</p>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {TOUR_STOPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index === currentStop ? 'bg-primary' : index < currentStop ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStop === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentStop + 1} / {TOUR_STOPS.length}
            </span>

            <Button size="sm" onClick={handleNext}>
              {currentStop === TOUR_STOPS.length - 1 ? 'Finish' : 'Next'}
              {currentStop < TOUR_STOPS.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Global Styles for Highlight */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 9999;
        }
      `}</style>
    </>
  );
};
