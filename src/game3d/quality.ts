export type QualityTier = 'low' | 'medium' | 'high';

export type QualitySettings = {
  tier: QualityTier;
  pixelRatioCap: number;
  shadows: boolean;
  shadowMapSize: number;
  crowdDensity: number;
  fogDensity: number;
};

export function detectQualityTier(): QualitySettings {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;

  if (memory <= 2 || cores <= 4 || coarse) {
    return {
      tier: 'low',
      pixelRatioCap: 1.15,
      shadows: true,
      shadowMapSize: 768,
      crowdDensity: 0.38,
      fogDensity: 0.026,
    };
  }

  if (memory <= 4 || cores <= 6) {
    return {
      tier: 'medium',
      pixelRatioCap: 1.5,
      shadows: true,
      shadowMapSize: 1024,
      crowdDensity: 0.68,
      fogDensity: 0.03,
    };
  }

  return {
    tier: 'high',
    pixelRatioCap: 1.9,
    shadows: true,
    shadowMapSize: 1536,
    crowdDensity: 1,
    fogDensity: 0.032,
  };
}
