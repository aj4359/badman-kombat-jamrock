import { useState, useCallback, useRef, useEffect } from 'react';
import { CameraShotType } from './useCinematicCamera';

export interface GameplayAction {
  fighter: 'player1' | 'player2';
  move: string;
  timing: number;
  cameraHint: CameraShotType;
}

export interface GameplaySequence {
  name: string;
  duration: number;
  actions: GameplayAction[];
}

// Pre-scripted cinematic sequences
const CINEMATIC_SEQUENCES: GameplaySequence[] = [
  {
    name: 'Opening Exchange',
    duration: 3000,
    actions: [
      { fighter: 'player1', move: 'forward', timing: 0, cameraHint: 'wide' },
      { fighter: 'player2', move: 'forward', timing: 0, cameraHint: 'wide' },
      { fighter: 'player1', move: 'punch', timing: 1000, cameraHint: 'medium' },
      { fighter: 'player2', move: 'block', timing: 1000, cameraHint: 'medium' },
      { fighter: 'player2', move: 'punch', timing: 1500, cameraHint: 'medium' },
      { fighter: 'player1', move: 'block', timing: 1500, cameraHint: 'medium' }
    ]
  },
  {
    name: 'Combo Attack',
    duration: 4000,
    actions: [
      { fighter: 'player1', move: 'punch', timing: 0, cameraHint: 'closeup' },
      { fighter: 'player1', move: 'punch', timing: 300, cameraHint: 'closeup' },
      { fighter: 'player1', move: 'kick', timing: 600, cameraHint: 'closeup' },
      { fighter: 'player2', move: 'backward', timing: 1000, cameraHint: 'medium' },
      { fighter: 'player2', move: 'special', timing: 2000, cameraHint: 'dramatic-angle' }
    ]
  },
  {
    name: 'Projectile Exchange',
    duration: 3000,
    actions: [
      { fighter: 'player1', move: 'special', timing: 0, cameraHint: 'over-shoulder' },
      { fighter: 'player2', move: 'jump', timing: 500, cameraHint: 'wide' },
      { fighter: 'player2', move: 'special', timing: 1500, cameraHint: 'over-shoulder' }
    ]
  },
  {
    name: 'Super Move Finish',
    duration: 4000,
    actions: [
      { fighter: 'player1', move: 'forward', timing: 0, cameraHint: 'medium' },
      { fighter: 'player1', move: 'super', timing: 1000, cameraHint: 'slow-motion' },
      { fighter: 'player2', move: 'knockdown', timing: 2500, cameraHint: 'closeup' }
    ]
  },
  {
    name: 'John Wick Gun-Fu Showcase',
    duration: 5000,
    actions: [
      { fighter: 'player1', move: 'forward', timing: 0, cameraHint: 'wide' },
      { fighter: 'player1', move: 'special', timing: 500, cameraHint: 'over-shoulder' },
      { fighter: 'player2', move: 'backward', timing: 500, cameraHint: 'closeup' },
      { fighter: 'player1', move: 'forward', timing: 1500, cameraHint: 'medium' },
      { fighter: 'player1', move: 'punch', timing: 2000, cameraHint: 'closeup' },
      { fighter: 'player1', move: 'punch', timing: 2300, cameraHint: 'closeup' },
      { fighter: 'player1', move: 'kick', timing: 2600, cameraHint: 'closeup' },
      { fighter: 'player2', move: 'knockdown', timing: 3000, cameraHint: 'dramatic-angle' }
    ]
  },
  {
    name: 'Continental Protocol Finisher',
    duration: 6000,
    actions: [
      { fighter: 'player1', move: 'backward', timing: 0, cameraHint: 'medium' },
      { fighter: 'player2', move: 'forward', timing: 500, cameraHint: 'wide' },
      { fighter: 'player1', move: 'super', timing: 1500, cameraHint: 'slow-motion' },
      { fighter: 'player2', move: 'knockdown', timing: 4000, cameraHint: 'closeup' }
    ]
  },
  {
    name: 'Rapid Fire Assault',
    duration: 4000,
    actions: [
      { fighter: 'player1', move: 'special', timing: 0, cameraHint: 'over-shoulder' },
      { fighter: 'player1', move: 'special', timing: 800, cameraHint: 'over-shoulder' },
      { fighter: 'player1', move: 'special', timing: 1600, cameraHint: 'over-shoulder' },
      { fighter: 'player2', move: 'jump', timing: 2000, cameraHint: 'wide' },
      { fighter: 'player1', move: 'special', timing: 2500, cameraHint: 'closeup' }
    ]
  }
];

export const useAIGameplayDirector = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [sequenceStartTime, setSequenceStartTime] = useState(0);
  const [autonomousMode, setAutonomousMode] = useState(false);
  
  const pendingActionsRef = useRef<GameplayAction[]>([]);
  const lastActionTimeRef = useRef<number>(0);

  // Start AI director
  const startDirector = useCallback(() => {
    setIsActive(true);
    setCurrentSequenceIndex(0);
    setSequenceStartTime(Date.now());
    console.log('🎬 AI Gameplay Director started');
  }, []);

  // Stop AI director
  const stopDirector = useCallback(() => {
    setIsActive(false);
    pendingActionsRef.current = [];
    console.log('🎬 AI Gameplay Director stopped');
  }, []);

  // Get next sequence
  const getNextSequence = useCallback(() => {
    if (currentSequenceIndex >= CINEMATIC_SEQUENCES.length) {
      setCurrentSequenceIndex(0);
      return CINEMATIC_SEQUENCES[0];
    }
    return CINEMATIC_SEQUENCES[currentSequenceIndex];
  }, [currentSequenceIndex]);

  // Get AI input for fighter
  const getAIInput = useCallback((fighter: 'player1' | 'player2'): string[] => {
    if (!isActive) return [];

    const now = Date.now();
    const elapsedInSequence = now - sequenceStartTime;
    const currentSequence = getNextSequence();

    // Check if we need to advance to next sequence
    if (elapsedInSequence > currentSequence.duration) {
      setCurrentSequenceIndex(prev => (prev + 1) % CINEMATIC_SEQUENCES.length);
      setSequenceStartTime(now);
      return [];
    }

    // Find actions for this fighter at this time
    const inputs: string[] = [];
    currentSequence.actions.forEach(action => {
      if (action.fighter === fighter) {
        const actionTime = sequenceStartTime + action.timing;
        // Execute action if it's time (within 100ms window)
        if (Math.abs(now - actionTime) < 100 && actionTime > lastActionTimeRef.current) {
          inputs.push(action.move);
          lastActionTimeRef.current = actionTime;
        }
      }
    });

    return inputs;
  }, [isActive, sequenceStartTime, getNextSequence]);

  // Get camera hint for current action
  const getCurrentCameraHint = useCallback((): CameraShotType | null => {
    if (!isActive) return null;

    const now = Date.now();
    const elapsedInSequence = now - sequenceStartTime;
    const currentSequence = getNextSequence();

    // Find most recent action with camera hint
    let latestHint: CameraShotType | null = null;
    let latestTime = -1;

    currentSequence.actions.forEach(action => {
      const actionTime = action.timing;
      if (actionTime <= elapsedInSequence && actionTime > latestTime) {
        latestHint = action.cameraHint;
        latestTime = actionTime;
      }
    });

    return latestHint;
  }, [isActive, sequenceStartTime, getNextSequence]);

  // Get current sequence info
  const getCurrentSequenceInfo = useCallback(() => {
    if (!isActive) return null;

    const sequence = getNextSequence();
    const elapsed = Date.now() - sequenceStartTime;
    
    return {
      name: sequence.name,
      progress: Math.min((elapsed / sequence.duration) * 100, 100),
      timeRemaining: Math.max(sequence.duration - elapsed, 0)
    };
  }, [isActive, sequenceStartTime, getNextSequence]);

  return {
    isActive,
    startDirector,
    stopDirector,
    getAIInput,
    getCurrentCameraHint,
    getCurrentSequenceInfo,
    autonomousMode,
    setAutonomousMode
  };
};
