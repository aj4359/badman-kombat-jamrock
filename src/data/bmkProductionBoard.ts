import {
  BMK_AUDIO_ASSET_CONTRACTS,
  BMK_CHARACTER_ART_CONTRACTS,
  BMK_ENVIRONMENT_ASSET_CONTRACTS,
  type ProductionAssetStatus,
} from '@/data/bmkProductionAssets';

export type ProductionLane = 'CHARACTER' | 'WORLD' | 'SOUND';

export interface ProductionBoardItem {
  id: string;
  lane: ProductionLane;
  sceneId: string;
  status: ProductionAssetStatus;
  approvedPath?: string;
}

export const BMK_PRODUCTION_BOARD: ProductionBoardItem[] = [
  ...BMK_CHARACTER_ART_CONTRACTS.map((asset) => ({
    id: `${asset.characterId}:${asset.slot}`,
    lane: 'CHARACTER' as const,
    sceneId: asset.sceneId,
    status: asset.status,
    approvedPath: asset.approvedPath,
  })),
  ...BMK_ENVIRONMENT_ASSET_CONTRACTS.map((asset) => ({
    id: asset.assetId,
    lane: 'WORLD' as const,
    sceneId: asset.sceneId,
    status: asset.status,
    approvedPath: asset.approvedPath,
  })),
  ...BMK_AUDIO_ASSET_CONTRACTS.map((asset) => ({
    id: asset.assetId,
    lane: 'SOUND' as const,
    sceneId: asset.state,
    status: asset.status,
    approvedPath: asset.approvedPath,
  })),
];

export const BMK_PRODUCTION_SUMMARY = BMK_PRODUCTION_BOARD.reduce(
  (summary, asset) => {
    summary.total += 1;
    summary[asset.status] += 1;
    return summary;
  },
  { total: 0, MISSING: 0, PLACEHOLDER: 0, REVIEW: 0, APPROVED: 0 },
);

export const BMK_VERTICAL_SLICE_READY =
  BMK_PRODUCTION_SUMMARY.total > 0 && BMK_PRODUCTION_SUMMARY.APPROVED === BMK_PRODUCTION_SUMMARY.total;
