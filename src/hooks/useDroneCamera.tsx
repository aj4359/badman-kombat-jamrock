import { useState, useCallback, useRef } from 'react';
import { CameraState, useCinematicCamera } from './useCinematicCamera';

export interface DroneCameraState extends CameraState {
  elevation: number;
  targetElevation: number;
  orbitAngle: number;
  orbitRadius: number;
  isOrbiting: boolean;
}

export interface DroneShotConfig {
  name: string;
  duration: number;
  zoom: number;
  rotation: number;
  elevation: number;
  orbit?: boolean;
  orbitSpeed?: number;
  path?: 'linear' | 'bezier' | 'crane';
}

const DRONE_PRESETS: Record<string, DroneShotConfig> = {
  'aerial-overview': { 
    name: 'Aerial Overview', 
    duration: 5000, 
    zoom: 0.5, 
    rotation: 0, 
    elevation: 800 
  },
  'drone-high': { 
    name: 'High Drone', 
    duration: 4000, 
    zoom: 0.6, 
    rotation: 0, 
    elevation: 500 
  },
  'crane-down': { 
    name: 'Crane Down', 
    duration: 3000, 
    zoom: 0.8, 
    rotation: -5, 
    elevation: 400, 
    path: 'crane' 
  },
  'orbit-360': { 
    name: '360 Orbit', 
    duration: 8000, 
    zoom: 1.0, 
    rotation: 0, 
    elevation: 200, 
    orbit: true, 
    orbitSpeed: 0.5 
  },
  'dutch-angle': { 
    name: 'Dutch Angle', 
    duration: 2000, 
    zoom: 1.1, 
    rotation: 15, 
    elevation: 100 
  },
  'hero-closeup': { 
    name: 'Hero Closeup', 
    duration: 3000, 
    zoom: 1.4, 
    rotation: -3, 
    elevation: 50 
  },
  'establishing': { 
    name: 'Establishing Shot', 
    duration: 6000, 
    zoom: 0.7, 
    rotation: 0, 
    elevation: 600 
  },
  'action-pan': { 
    name: 'Action Pan', 
    duration: 2000, 
    zoom: 1.2, 
    rotation: 8, 
    elevation: 150 
  }
};

export const useDroneCamera = () => {
  const baseCamera = useCinematicCamera();
  
  const [droneState, setDroneState] = useState<DroneCameraState>({
    ...baseCamera.camera,
    elevation: 0,
    targetElevation: 0,
    orbitAngle: 0,
    orbitRadius: 300,
    isOrbiting: false
  });

  const activePresetRef = useRef<DroneShotConfig | null>(null);
  const orbitStartTimeRef = useRef<number>(0);

  // Update drone camera with smooth interpolation
  const updateDroneCamera = useCallback(() => {
    baseCamera.updateCamera();
    
    setDroneState(prev => {
      const lerpFactor = 0.08;
      let newState = {
        ...prev,
        ...baseCamera.camera,
        elevation: prev.elevation + (prev.targetElevation - prev.elevation) * lerpFactor
      };

      // Handle orbital movement
      if (newState.isOrbiting && activePresetRef.current?.orbit) {
        const orbitSpeed = activePresetRef.current.orbitSpeed || 0.5;
        const elapsed = Date.now() - orbitStartTimeRef.current;
        newState.orbitAngle = (elapsed * orbitSpeed * 0.001) % (Math.PI * 2);
        
        // Calculate orbital position
        const centerX = 512; // Center of 1024px canvas
        const centerY = 288; // Center of 576px canvas
        newState.targetX = centerX + Math.cos(newState.orbitAngle) * newState.orbitRadius;
        newState.targetY = centerY + Math.sin(newState.orbitAngle) * newState.orbitRadius;
      }

      return newState;
    });
  }, [baseCamera]);

  // Apply drone camera preset
  const applyDroneShot = useCallback((presetName: keyof typeof DRONE_PRESETS) => {
    const preset = DRONE_PRESETS[presetName];
    if (!preset) return;

    activePresetRef.current = preset;
    
    setDroneState(prev => ({
      ...prev,
      targetZoom: preset.zoom,
      targetRotation: preset.rotation,
      targetElevation: preset.elevation,
      isOrbiting: preset.orbit || false,
      orbitRadius: 300
    }));

    if (preset.orbit) {
      orbitStartTimeRef.current = Date.now();
    }

    console.log(`🎥 [DRONE CAMERA] Applied shot: ${preset.name}`);
  }, []);

  // Execute drone camera sequence
  const executeDroneSequence = useCallback((sequence: DroneShotConfig[]) => {
    console.log(`🎬 [DRONE CAMERA] Starting sequence with ${sequence.length} shots`);
    
    let currentIndex = 0;
    const executeNextShot = () => {
      if (currentIndex >= sequence.length) {
        console.log('✅ [DRONE CAMERA] Sequence completed');
        return;
      }

      const shot = sequence[currentIndex];
      console.log(`🎥 [DRONE CAMERA] Shot ${currentIndex + 1}/${sequence.length}: ${shot.name}`);
      
      activePresetRef.current = shot;
      setDroneState(prev => ({
        ...prev,
        targetZoom: shot.zoom,
        targetRotation: shot.rotation,
        targetElevation: shot.elevation,
        isOrbiting: shot.orbit || false
      }));

      if (shot.orbit) {
        orbitStartTimeRef.current = Date.now();
      }

      currentIndex++;
      setTimeout(executeNextShot, shot.duration);
    };

    executeNextShot();
  }, []);

  // Focus on specific fighter with elevation
  const focusFighterWithElevation = useCallback((x: number, y: number, zoom: number, elevation: number) => {
    setDroneState(prev => ({
      ...prev,
      targetX: x,
      targetY: y,
      targetZoom: zoom,
      targetElevation: elevation
    }));
  }, []);

  // Reset drone camera
  const resetDroneCamera = useCallback(() => {
    baseCamera.resetCamera();
    setDroneState(prev => ({
      ...prev,
      elevation: 0,
      targetElevation: 0,
      orbitAngle: 0,
      isOrbiting: false
    }));
    activePresetRef.current = null;
  }, [baseCamera]);

  return {
    droneState,
    updateDroneCamera,
    applyDroneShot,
    executeDroneSequence,
    focusFighterWithElevation,
    resetDroneCamera,
    availableShots: Object.keys(DRONE_PRESETS),
    ...baseCamera
  };
};
