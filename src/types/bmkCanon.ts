export type CanonStatus = 'CONCEPT' | 'REVIEW' | 'CANON' | 'RETIRED';

export type CharacterId =
  | 'BMK-CHR-LEROY-001'
  | 'BMK-CHR-ASHA-001'
  | 'BMK-CHR-MARCUS-001'
  | 'BMK-CHR-MONKWU-001'
  | 'BMK-CHR-ELDERZION-001';

export type AudioState =
  | 'AMBIENT'
  | 'ROOTS'
  | 'DUB'
  | 'DANCE'
  | 'TENSION'
  | 'COMBAT'
  | 'ESCAPE'
  | 'SILENCE'
  | 'MYTHOLOGY';

export type RightsStatus = 'ORIGINAL_BMK' | 'ORIGINAL_BMK_TEMP' | 'CLEARED' | 'CLEARED_TEMP' | 'RESEARCH_ONLY' | 'RESTRICTED';

export interface CanonRecord {
  assetId: string;
  assetType: 'CHARACTER' | 'WARDROBE' | 'LOCATION' | 'OBJECT' | 'MUSIC' | 'SCENE';
  name: string;
  canonicalVersion: string;
  status: CanonStatus;
  sourceReference?: string;
  approvedReference?: string;
  usage: string[];
  notes?: string;
}

export interface CharacterAppearance {
  characterId: CharacterId;
  wardrobeId?: string;
  locationId?: string;
  wet?: boolean;
  injured?: boolean;
  referenceSlot?: string;
}

export interface MusicAsset {
  assetId: string;
  title: string;
  compositionId: string;
  version: string;
  audioState: AudioState;
  rightsStatus: RightsStatus;
  creator?: string;
  performers?: string[];
  stemLocations?: string[];
  approvedUse: string[];
}

export interface ComicScene {
  sceneId: string;
  issueId: string;
  order: number;
  title: string;
  locationId?: string;
  characters: CharacterAppearance[];
  audioState: AudioState;
  caption?: string;
  dialogue?: Array<{ speaker?: CharacterId; text: string }>;
  transition?: 'CUT' | 'FADE' | 'DISSOLVE' | 'BLACK';
}
