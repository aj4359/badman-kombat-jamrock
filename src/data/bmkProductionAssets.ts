import type { CharacterId, RightsStatus } from '@/types/bmkCanon';

export type ProductionAssetStatus = 'MISSING' | 'PLACEHOLDER' | 'REVIEW' | 'APPROVED';

export interface CharacterArtContract {
  characterId: CharacterId;
  slot: string;
  sceneId: string;
  status: ProductionAssetStatus;
  approvedPath?: string;
  requirements: string[];
}

export interface EnvironmentAssetContract {
  assetId: string;
  sceneId: string;
  status: ProductionAssetStatus;
  approvedPath?: string;
  requirements: string[];
}

export interface AudioAssetContract {
  assetId: string;
  title: string;
  state: 'AMBIENT' | 'ROOTS' | 'DUB' | 'DANCE' | 'TENSION' | 'COMBAT' | 'ESCAPE' | 'SILENCE' | 'MYTHOLOGY';
  status: ProductionAssetStatus;
  rightsStatus: RightsStatus;
  approvedPath?: string;
  requirements: string[];
}

export const BMK_CHARACTER_ART_CONTRACTS: CharacterArtContract[] = [
  {
    characterId: 'BMK-CHR-LEROY-001',
    slot: 'LEROY-RAIN',
    sceneId: 'BMK-COMIC-00-S03',
    status: 'MISSING',
    requirements: [
      'Same canonical face, age, physique, hairstyle, skin tone and distinguishing features as approved Leroy reference.',
      'Kingston 1987 street wardrobe only; no cyberpunk or futuristic costume contamination.',
      'Wet/rain story state is permitted; identity changes are not.',
      'Realistic premium fighter presentation suitable for comic, game and cinematic reuse.',
    ],
  },
  {
    characterId: 'BMK-CHR-LEROY-001',
    slot: 'LEROY-DANCE',
    sceneId: 'BMK-COMIC-00-S04',
    status: 'MISSING',
    requirements: [
      'Must be recognisably identical to LEROY-RAIN.',
      'Crowded sound-system dance context; preserve canonical silhouette and wardrobe continuity.',
      'Lighting variation is permitted; facial structure and body proportions are not.',
    ],
  },
  {
    characterId: 'BMK-CHR-LEROY-001',
    slot: 'LEROY-CONFRONTATION',
    sceneId: 'BMK-COMIC-00-S05',
    status: 'MISSING',
    requirements: [
      'Must be recognisably identical to LEROY-RAIN and LEROY-DANCE.',
      'Expression, sweat, rain and minor injury may vary.',
      'Close-up quality must survive cinematic crop and mobile display.',
    ],
  },
];

export const BMK_ENVIRONMENT_ASSET_CONTRACTS: EnvironmentAssetContract[] = [
  {
    assetId: 'BMK-ENV-KINGSTON-STREET-1987-001',
    sceneId: 'BMK-COMIC-00-S02',
    status: 'MISSING',
    requirements: [
      'Kingston, Jamaica in 1987; lived-in rather than tourist-postcard presentation.',
      'Period-appropriate vehicles, signage, architecture, clothing and street texture.',
      'No modern smartphones, LED billboards, contemporary vehicles or generic cyberpunk neon.',
    ],
  },
  {
    assetId: 'BMK-ENV-KINGSTON-RAIN-1987-001',
    sceneId: 'BMK-COMIC-00-S03',
    status: 'MISSING',
    requirements: [
      'Wet Kingston street at night with practical light reflections and believable rain.',
      'Must accommodate canonical Leroy art without mismatched perspective or lighting.',
    ],
  },
  {
    assetId: 'BMK-ENV-SOUNDSYSTEM-1987-001',
    sceneId: 'BMK-COMIC-00-S04',
    status: 'MISSING',
    requirements: [
      'Authentic Jamaican sound-system environment with speaker stacks, crowd density and period texture.',
      "Include a plausible placement zone for canonical object BMK-OBJ-VINYL-K87-001.",
      'Atmosphere must feel communal and culturally grounded, not a generic nightclub.',
    ],
  },
  {
    assetId: 'BMK-ENV-JAMAICA-DEEP-001',
    sceneId: 'BMK-COMIC-00-S06',
    status: 'MISSING',
    requirements: [
      'Deep Jamaican landscape that begins natural and credible.',
      'Introduce one subtle impossible spatial phenomenon without referencing or copying existing superhero universes.',
      'Mystery before explanation.',
    ],
  },
];

export const BMK_AUDIO_ASSET_CONTRACTS: AudioAssetContract[] = [
  {
    assetId: 'BMK-AUD-AMBIENT-K87-001',
    title: 'Kingston Night Ambience',
    state: 'AMBIENT',
    status: 'MISSING',
    rightsStatus: 'ORIGINAL_BMK_TEMP',
    requirements: ['Original or explicitly cleared field-style ambience only.', 'Traffic, distant voices, rain and city texture without unlicensed recordings.'],
  },
  {
    assetId: 'BMK-MUS-K87-ROOTS-001-A',
    title: 'Kingston ’87 Roots Theme',
    state: 'ROOTS',
    status: 'MISSING',
    rightsStatus: 'ORIGINAL_BMK_TEMP',
    requirements: ['Original Roots Reggae composition.', 'No copied melody, lyric, bassline, hook, sample or recognisable protected element from existing recordings.'],
  },
  {
    assetId: 'BMK-MUS-K87-DUB-001-B',
    title: 'Kingston ’87 Dub Confrontation',
    state: 'DUB',
    status: 'MISSING',
    rightsStatus: 'ORIGINAL_BMK_TEMP',
    requirements: ['Dub version derived from an original BMK composition.', 'Bass and drums remain dominant while vocals/instrumentation can drop away for confrontation pacing.'],
  },
  {
    assetId: 'BMK-MUS-K87-MYTH-001',
    title: 'Kingston Beyond',
    state: 'MYTHOLOGY',
    status: 'MISSING',
    rightsStatus: 'ORIGINAL_BMK_TEMP',
    requirements: ['Begin from familiar Kingston sonic material then become subtly spatially impossible.', 'Avoid generic horror scoring.'],
  },
];
