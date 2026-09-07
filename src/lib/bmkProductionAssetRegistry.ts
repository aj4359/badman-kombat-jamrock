import { z } from 'zod';
import {
  BMK_AUDIO_ASSET_CONTRACTS,
  BMK_CHARACTER_ART_CONTRACTS,
  BMK_ENVIRONMENT_ASSET_CONTRACTS,
  type ProductionAssetStatus,
} from '@/data/bmkProductionAssets';

const statusSchema = z.enum(['MISSING', 'PLACEHOLDER', 'REVIEW', 'APPROVED']);
const rightsSchema = z.enum([
  'ORIGINAL_BMK',
  'ORIGINAL_BMK_TEMP',
  'CLEARED',
  'CLEARED_TEMP',
  'RESEARCH_ONLY',
  'RESTRICTED',
]);

const baseSchema = z.object({
  status: statusSchema,
  approvedPath: z.string().min(1).optional(),
  requirements: z.array(z.string().min(1)).min(1),
});

const characterSchema = baseSchema.extend({
  characterId: z.string().regex(/^BMK-CHR-/),
  slot: z.string().min(1),
  sceneId: z.string().regex(/^BMK-COMIC-00-S\d{2}$/),
});

const environmentSchema = baseSchema.extend({
  assetId: z.string().regex(/^BMK-ENV-/),
  sceneId: z.string().regex(/^BMK-COMIC-00-S\d{2}$/),
});

const audioSchema = baseSchema.extend({
  assetId: z.string().regex(/^BMK-(AUD|MUS)-/),
  title: z.string().min(1),
  state: z.enum(['AMBIENT', 'ROOTS', 'DUB', 'DANCE', 'TENSION', 'COMBAT', 'ESCAPE', 'SILENCE', 'MYTHOLOGY']),
  rightsStatus: rightsSchema,
});

const assertUnique = (values: string[], label: string) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) throw new Error(`Duplicate ${label}: ${[...new Set(duplicates)].join(', ')}`);
};

const assertApprovalRules = (asset: { status: ProductionAssetStatus; approvedPath?: string }, label: string) => {
  if (asset.status === 'APPROVED' && !asset.approvedPath) {
    throw new Error(`${label} is APPROVED but has no approvedPath.`);
  }
};

export interface BMKProductionReadiness {
  total: number;
  approved: number;
  review: number;
  placeholder: number;
  missing: number;
  readyForCanonExpansion: boolean;
}

export const validateBMKProductionAssets = (): BMKProductionReadiness => {
  const characters = z.array(characterSchema).parse(BMK_CHARACTER_ART_CONTRACTS);
  const environments = z.array(environmentSchema).parse(BMK_ENVIRONMENT_ASSET_CONTRACTS);
  const audio = z.array(audioSchema).parse(BMK_AUDIO_ASSET_CONTRACTS);

  assertUnique(characters.map((asset) => asset.slot), 'character art slot');
  assertUnique(environments.map((asset) => asset.assetId), 'environment asset ID');
  assertUnique(audio.map((asset) => asset.assetId), 'audio asset ID');

  characters.forEach((asset) => assertApprovalRules(asset, asset.slot));
  environments.forEach((asset) => assertApprovalRules(asset, asset.assetId));
  audio.forEach((asset) => {
    assertApprovalRules(asset, asset.assetId);
    if (asset.status === 'APPROVED' && ['RESEARCH_ONLY', 'RESTRICTED'].includes(asset.rightsStatus)) {
      throw new Error(`${asset.assetId} cannot be APPROVED with rights status ${asset.rightsStatus}.`);
    }
  });

  const statuses = [...characters, ...environments, ...audio].map((asset) => asset.status);
  const count = (status: ProductionAssetStatus) => statuses.filter((value) => value === status).length;

  const readiness: BMKProductionReadiness = {
    total: statuses.length,
    approved: count('APPROVED'),
    review: count('REVIEW'),
    placeholder: count('PLACEHOLDER'),
    missing: count('MISSING'),
    readyForCanonExpansion: statuses.every((status) => status === 'APPROVED'),
  };

  return readiness;
};

export const BMK_PRODUCTION_READINESS = validateBMKProductionAssets();
