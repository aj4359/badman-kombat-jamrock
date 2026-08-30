export type HapticEvent = 'lightHit' | 'heavyHit' | 'guard' | 'hurt' | 'ko';

const PATTERNS: Record<HapticEvent, number | number[]> = {
  lightHit: 18,
  heavyHit: [28, 24, 52],
  guard: [12, 18, 12],
  hurt: 34,
  ko: [55, 35, 90, 45, 130],
};

export function haptic(event: HapticEvent) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  navigator.vibrate(PATTERNS[event]);
}
