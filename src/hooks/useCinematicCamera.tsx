import { useState, useCallback, useRef, useEffect } from 'react';

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
  shake: { x: number; y: number };
  targetX: number;
  targetY: number;
  targetZoom: number;
  targetRotation: number;
}

export type CameraShotType = 'wide' | 'medium' | 'closeup' | 'over-shoulder' | 'dramatic-angle' | 'slow-motion';

export interface CameraShot {
  type: CameraShotType;
  duration: number;
  easing: 'smooth' | 'snap' | 'elastic';
}

const CAMERA_PRESETS = {
  wide: { zoom: 0.9, rotation: 0 },
  medium: { zoom: 1.0, rotation: 0 },
  closeup: { zoom: 1.3, rotation: 0 },
  'over-shoulder': { zoom: 1.1, rotation: 2 },
  'dramatic-angle': { zoom: 1.2, rotation: -3 },
  'slow-motion': { zoom: 1.4, rotation: 0 }
};

export const useCinematicCamera = () => {
  const [camera, setCamera] = useState<CameraState>({
    x: 400,
    y: 300,
    zoom: 1.0,
    rotation: 0,
    shake: { x: 0, y: 0 },
    targetX: 400,
    targetY: 300,
    targetZoom: 1.0,
    targetRotation: 0
  });

  const currentShotRef = useRef<CameraShot | null>(null);
  const shotStartTimeRef = useRef<number>(0);

  // Smooth camera interpolation
  const updateCamera = useCallback(() => {
    setCamera(prev => {
      const lerpFactor = 0.1; // Smooth interpolation
      
      return {
        ...prev,
        x: prev.x + (prev.targetX - prev.x) * lerpFactor,
        y: prev.y + (prev.targetY - prev.y) * lerpFactor,
        zoom: prev.zoom + (prev.targetZoom - prev.zoom) * lerpFactor,
        rotation: prev.rotation + (prev.targetRotation - prev.rotation) * lerpFactor,
        shake: {
          x: prev.shake.x * 0.9,
          y: prev.shake.y * 0.9
        }
      };
    });
  }, []);

  // Track fighters and adjust camera
  const trackFighters = useCallback((fighter1X: number, fighter2X: number, fighter1Y: number, fighter2Y: number) => {
    const midX = (fighter1X + fighter2X) / 2;
    const midY = (fighter1Y + fighter2Y) / 2;
    const distance = Math.abs(fighter1X - fighter2X);

    setCamera(prev => ({
      ...prev,
      targetX: midX,
      targetY: midY - 50, // Slightly above center
      // Dynamic zoom based on distance
      targetZoom: distance < 150 ? 1.3 : distance > 400 ? 0.9 : 1.0
    }));
  }, []);

  // Set camera shot with preset
  const setCameraShot = useCallback((shot: CameraShot) => {
    currentShotRef.current = shot;
    shotStartTimeRef.current = Date.now();

    const preset = CAMERA_PRESETS[shot.type];
    
    setCamera(prev => ({
      ...prev,
      targetZoom: preset.zoom,
      targetRotation: preset.rotation
    }));
  }, []);

  // Add camera shake effect
  const addShake = useCallback((intensity: number) => {
    setCamera(prev => ({
      ...prev,
      shake: {
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * intensity
      }
    }));
  }, []);

  // Focus on specific position
  const focusOn = useCallback((x: number, y: number, zoom: number = 1.2) => {
    setCamera(prev => ({
      ...prev,
      targetX: x,
      targetY: y,
      targetZoom: zoom
    }));
  }, []);

  // Camera director AI - automatically choose shots
  const autoDirectShot = useCallback((gameEvent: string) => {
    switch (gameEvent) {
      case 'round-start':
        setCameraShot({ type: 'wide', duration: 2000, easing: 'smooth' });
        break;
      case 'combo':
        setCameraShot({ type: 'closeup', duration: 1500, easing: 'snap' });
        break;
      case 'special-move':
        setCameraShot({ type: 'dramatic-angle', duration: 2000, easing: 'smooth' });
        break;
      case 'super-move':
        setCameraShot({ type: 'slow-motion', duration: 2500, easing: 'elastic' });
        break;
      case 'knockdown':
        setCameraShot({ type: 'closeup', duration: 2000, easing: 'smooth' });
        break;
      case 'projectile':
        setCameraShot({ type: 'over-shoulder', duration: 1000, easing: 'smooth' });
        break;
      default:
        setCameraShot({ type: 'medium', duration: 1000, easing: 'smooth' });
    }
  }, [setCameraShot]);

  // Reset to default
  const resetCamera = useCallback(() => {
    setCamera({
      x: 400,
      y: 300,
      zoom: 1.0,
      rotation: 0,
      shake: { x: 0, y: 0 },
      targetX: 400,
      targetY: 300,
      targetZoom: 1.0,
      targetRotation: 0
    });
  }, []);

  return {
    camera,
    updateCamera,
    trackFighters,
    setCameraShot,
    addShake,
    focusOn,
    autoDirectShot,
    resetCamera
  };
};
