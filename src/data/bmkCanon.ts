import type { CanonRecord, ComicScene } from '@/types/bmkCanon';

export const BMK_CANON: CanonRecord[] = [
  { assetId: 'BMK-CHR-LEROY-001', assetType: 'CHARACTER', name: 'Leroy', canonicalVersion: '1.0', status: 'CANON', usage: ['comic', 'game', 'cinematics', 'promotion'], notes: 'Identity is immutable. Wardrobe, injury, weather and story state are variables.' },
  { assetId: 'BMK-CHR-ASHA-001', assetType: 'CHARACTER', name: 'Asha', canonicalVersion: '1.0', status: 'CANON', usage: ['comic', 'game', 'cinematics', 'promotion'] },
  { assetId: 'BMK-CHR-MARCUS-001', assetType: 'CHARACTER', name: 'Marcus', canonicalVersion: '1.0', status: 'CANON', usage: ['comic', 'game', 'cinematics', 'promotion'] },
  { assetId: 'BMK-CHR-MONKWU-001', assetType: 'CHARACTER', name: 'Monk Wu', canonicalVersion: '1.0', status: 'CANON', usage: ['comic', 'game', 'cinematics', 'promotion'] },
  { assetId: 'BMK-CHR-ELDERZION-001', assetType: 'CHARACTER', name: 'Elder Zion', canonicalVersion: '1.0', status: 'CANON', usage: ['comic', 'game', 'cinematics', 'promotion'] },
  { assetId: 'BMK-OBJ-VINYL-K87-001', assetType: 'OBJECT', name: "BADMAN KOMBAT — KINGSTON '87", canonicalVersion: '1.0', status: 'CANON', usage: ['comic', 'music', 'physical-vinyl'], notes: 'Canonical in-world object intended to become a real limited physical release.' },
];

export const BMK_ZERO_SCENES: ComicScene[] = [
  { sceneId: 'BMK-COMIC-00-S01', issueId: 'BMK-COMIC-00', order: 1, title: 'Enter Kingston', characters: [], audioState: 'SILENCE', caption: 'HEADPHONES RECOMMENDED', transition: 'BLACK' },
  { sceneId: 'BMK-COMIC-00-S02', issueId: 'BMK-COMIC-00', order: 2, title: 'Kingston, Jamaica — 1987', locationId: 'BMK-LOC-KINGSTON-1987', characters: [], audioState: 'AMBIENT', transition: 'FADE' },
  { sceneId: 'BMK-COMIC-00-S03', issueId: 'BMK-COMIC-00', order: 3, title: 'Rain', locationId: 'BMK-LOC-KINGSTON-STREET-001', characters: [{ characterId: 'BMK-CHR-LEROY-001', wardrobeId: 'BMK-WRD-LEROY-K87-STREET-001', wet: true, referenceSlot: 'LEROY-RAIN' }], audioState: 'ROOTS', transition: 'DISSOLVE' },
  { sceneId: 'BMK-COMIC-00-S04', issueId: 'BMK-COMIC-00', order: 4, title: 'The Sound System', locationId: 'BMK-LOC-SOUNDSYSTEM-001', characters: [{ characterId: 'BMK-CHR-LEROY-001', wardrobeId: 'BMK-WRD-LEROY-K87-STREET-001', wet: true, referenceSlot: 'LEROY-DANCE' }], audioState: 'DANCE', transition: 'CUT' },
  { sceneId: 'BMK-COMIC-00-S05', issueId: 'BMK-COMIC-00', order: 5, title: 'Badman Reach', locationId: 'BMK-LOC-SOUNDSYSTEM-001', characters: [{ characterId: 'BMK-CHR-LEROY-001', wardrobeId: 'BMK-WRD-LEROY-K87-STREET-001', wet: true, referenceSlot: 'LEROY-CONFRONTATION' }], audioState: 'DUB', dialogue: [{ text: 'Badman reach.' }], transition: 'CUT' },
  { sceneId: 'BMK-COMIC-00-S06', issueId: 'BMK-COMIC-00', order: 6, title: 'Only The Beginning', locationId: 'BMK-LOC-JAMAICA-DEEP-001', characters: [], audioState: 'MYTHOLOGY', caption: 'KINGSTON IS ONLY THE BEGINNING.', transition: 'BLACK' },
];

export const LEROY_CONTINUITY_GATE = [
  { slot: 'LEROY-RAIN', characterId: 'BMK-CHR-LEROY-001', requirement: 'Rainy Kingston street. Same canonical face, age, physique, hair, skin tone and distinguishing features.' },
  { slot: 'LEROY-DANCE', characterId: 'BMK-CHR-LEROY-001', requirement: 'Crowded sound-system dance. Preserve canonical identity and silhouette.' },
  { slot: 'LEROY-CONFRONTATION', characterId: 'BMK-CHR-LEROY-001', requirement: 'Post-confrontation close-up. Injury/expression may vary; identity may not.' },
] as const;
