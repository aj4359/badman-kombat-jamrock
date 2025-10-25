import { useState, useCallback, useEffect } from 'react';

type ColorGradingMode = 'neutral' | 'combo' | 'critical' | 'special';

interface ColorGradingState {
  mode: ColorGradingMode;
  intensity: number;
  contrast: number;
  saturation: number;
  brightness: number;
  hueShift: number;
}

export const useColorGrading = () => {
  const [grading, setGrading] = useState<ColorGradingState>({
    mode: 'neutral',
    intensity: 0,
    contrast: 1.0,
    saturation: 1.0,
    brightness: 1.0,
    hueShift: 0
  });

  const applyColorGrading = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (grading.intensity === 0) return;

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Apply color grading based on mode
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply contrast
      r = ((r / 255 - 0.5) * grading.contrast + 0.5) * 255;
      g = ((g / 255 - 0.5) * grading.contrast + 0.5) * 255;
      b = ((b / 255 - 0.5) * grading.contrast + 0.5) * 255;

      // Apply saturation
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = gray + (r - gray) * grading.saturation;
      g = gray + (g - gray) * grading.saturation;
      b = gray + (b - gray) * grading.saturation;

      // Apply brightness
      r *= grading.brightness;
      g *= grading.brightness;
      b *= grading.brightness;

      // Apply mode-specific color shifts
      const modeIntensity = grading.intensity;
      
      if (grading.mode === 'combo') {
        // Warm colors (orange/yellow)
        r = r + (255 - r) * 0.2 * modeIntensity;
        g = g + (200 - g) * 0.15 * modeIntensity;
        b = b * (1 - 0.2 * modeIntensity);
      } else if (grading.mode === 'critical') {
        // Red/black desaturation
        const criticalGray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        r = criticalGray + (r - criticalGray) * 0.3 + 50 * modeIntensity;
        g = criticalGray + (g - criticalGray) * 0.3;
        b = criticalGray + (b - criticalGray) * 0.3;
      } else if (grading.mode === 'special') {
        // Intense saturation boost
        const specialGray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        r = specialGray + (r - specialGray) * 1.8;
        g = specialGray + (g - specialGray) * 1.8;
        b = specialGray + (b - specialGray) * 1.8;
      } else {
        // Neutral - cool colors (blue/purple)
        r = r * (1 - 0.05 * modeIntensity);
        g = g * (1 - 0.02 * modeIntensity);
        b = b + (255 - b) * 0.1 * modeIntensity;
      }

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imageData, 0, 0);
  }, [grading]);

  const setColorGradingMode = useCallback((
    mode: ColorGradingMode,
    duration: number = 1000
  ) => {
    // Set target values based on mode
    const targetGrading: Partial<ColorGradingState> = {
      mode,
      intensity: 1.0
    };

    if (mode === 'combo') {
      targetGrading.contrast = 1.3;
      targetGrading.saturation = 1.2;
      targetGrading.brightness = 1.1;
    } else if (mode === 'critical') {
      targetGrading.contrast = 1.4;
      targetGrading.saturation = 0.6;
      targetGrading.brightness = 0.8;
    } else if (mode === 'special') {
      targetGrading.contrast = 1.5;
      targetGrading.saturation = 1.5;
      targetGrading.brightness = 1.2;
    } else {
      targetGrading.contrast = 1.0;
      targetGrading.saturation = 1.0;
      targetGrading.brightness = 1.0;
    }

    setGrading(prev => ({ ...prev, ...targetGrading as ColorGradingState }));

    // Fade out after duration
    setTimeout(() => {
      setGrading(prev => ({ ...prev, intensity: 0 }));
    }, duration);
  }, []);

  const resetColorGrading = useCallback(() => {
    setGrading({
      mode: 'neutral',
      intensity: 0,
      contrast: 1.0,
      saturation: 1.0,
      brightness: 1.0,
      hueShift: 0
    });
  }, []);

  return {
    grading,
    applyColorGrading,
    setColorGradingMode,
    resetColorGrading
  };
};
