import { useState, useCallback } from 'react';

interface ScreenEffect {
  shake: {
    intensity: number;
    duration: number;
    active: boolean;
  };
  hitstop: {
    active: boolean;
    duration: number;
  };
  flash: {
    active: boolean;
    color: string;
    intensity: number;
  };
}

export const useScreenEffects = () => {
  const [effects, setEffects] = useState<ScreenEffect>({
    shake: { intensity: 0, duration: 0, active: false },
    hitstop: { active: false, duration: 0 },
    flash: { active: false, color: '#ffffff', intensity: 0 }
  });

  const addScreenShake = useCallback((intensity: number = 10, duration: number = 300) => {
    setEffects(prev => ({
      ...prev,
      shake: { intensity, duration, active: true }
    }));

    setTimeout(() => {
      setEffects(prev => ({
        ...prev,
        shake: { ...prev.shake, active: false }
      }));
    }, duration);
  }, []);

  const addHitstop = useCallback((duration: number = 100) => {
    setEffects(prev => ({
      ...prev,
      hitstop: { active: true, duration }
    }));

    setTimeout(() => {
      setEffects(prev => ({
        ...prev,
        hitstop: { active: false, duration: 0 }
      }));
    }, duration);
  }, []);

  const addFlash = useCallback((color: string = '#ffffff', intensity: number = 0.3, duration: number = 150) => {
    setEffects(prev => ({
      ...prev,
      flash: { active: true, color, intensity }
    }));

    setTimeout(() => {
      setEffects(prev => ({
        ...prev,
        flash: { active: false, color: '', intensity: 0 }
      }));
    }, duration);
  }, []);

  const getShakeStyle = () => {
    if (!effects.shake.active) return {};
    
    const { intensity } = effects.shake;
    const x = (Math.random() - 0.5) * intensity;
    const y = (Math.random() - 0.5) * intensity;
    
    return {
      transform: `translate(${x}px, ${y}px)`,
      transition: 'none'
    };
  };

  const getFlashStyle = () => {
    if (!effects.flash.active) return {};
    
    return {
      position: 'absolute' as const,
      inset: 0,
      backgroundColor: effects.flash.color,
      opacity: effects.flash.intensity,
      pointerEvents: 'none' as const,
      zIndex: 30,
      mixBlendMode: 'overlay' as const
    };
  };

  return {
    effects,
    addScreenShake,
    addHitstop,
    addFlash,
    getShakeStyle,
    getFlashStyle
  };
};