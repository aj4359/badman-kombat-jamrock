export type FighterAssetId = 'leroy' | 'opponent';

export type FighterAnimationState = 'idle' | 'walk' | 'guard' | 'light' | 'heavy' | 'hit' | 'knockdown' | 'victory';

export type FighterAssetManifest = {
  id: FighterAssetId;
  model: string;
  animations?: Partial<Record<FighterAnimationState, string>>;
  scale: number;
  yOffset: number;
};

/**
 * Production assets live under /assets/game3d so the React shell never imports
 * hero meshes as source-code modules. GLB files can be replaced without changing
 * combat systems.
 */
export const FIGHTER_ASSETS: Record<FighterAssetId, FighterAssetManifest> = {
  leroy: {
    id: 'leroy',
    model: '/assets/game3d/fighters/leroy/leroy.glb',
    scale: 1,
    yOffset: 0,
    animations: {
      idle: 'idle',
      walk: 'walk',
      guard: 'guard',
      light: 'jab',
      heavy: 'hook',
      hit: 'hit',
      knockdown: 'knockdown',
      victory: 'victory',
    },
  },
  opponent: {
    id: 'opponent',
    model: '/assets/game3d/fighters/opponent/opponent.glb',
    scale: 1,
    yOffset: 0,
    animations: {
      idle: 'idle',
      walk: 'walk',
      guard: 'guard',
      light: 'jab',
      heavy: 'hook',
      hit: 'hit',
      knockdown: 'knockdown',
      victory: 'victory',
    },
  },
};

export const AUDIO_ASSETS = {
  arenaBed: '/assets/audio/badman-kombat-arena.mp3',
  fightMusic: '/assets/audio/bmk-champion-loop.mp3',
  airHorn: '/assets/audio/sound-system-air-horn.mp3',
} as const;
