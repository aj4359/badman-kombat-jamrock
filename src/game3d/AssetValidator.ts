import * as THREE from 'three';

export type AssetValidationSeverity = 'error' | 'warning';

export type AssetValidationIssue = {
  severity: AssetValidationSeverity;
  code: string;
  message: string;
};

export type AssetValidationReport = {
  ok: boolean;
  meshCount: number;
  skinnedMeshCount: number;
  materialCount: number;
  animationNames: string[];
  bounds: { width: number; height: number; depth: number };
  issues: AssetValidationIssue[];
};

const REQUIRED_ANIMATION_GROUPS: Array<{ state: string; aliases: string[] }> = [
  { state: 'idle', aliases: ['idle', 'fight_idle', 'combat_idle'] },
  { state: 'walk', aliases: ['walk', 'walk_forward', 'locomotion'] },
  { state: 'guard', aliases: ['guard', 'block', 'blocking'] },
  { state: 'light', aliases: ['light', 'jab', 'punch', 'attack_light'] },
  { state: 'heavy', aliases: ['heavy', 'hook', 'attack_heavy'] },
  { state: 'hit', aliases: ['hit', 'hit_reaction', 'impact'] },
  { state: 'knockdown', aliases: ['knockdown', 'ko', 'death'] },
  { state: 'victory', aliases: ['victory', 'win', 'celebrate'] },
];

export function validateFighterAsset(scene: THREE.Object3D, animations: THREE.AnimationClip[]): AssetValidationReport {
  let meshCount = 0;
  let skinnedMeshCount = 0;
  const materialIds = new Set<string>();
  const issues: AssetValidationIssue[] = [];

  scene.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    meshCount += 1;
    if ((mesh as THREE.SkinnedMesh).isSkinnedMesh) skinnedMeshCount += 1;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) if (material) materialIds.add(material.uuid);
  });

  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  if (meshCount === 0) {
    issues.push({ severity: 'error', code: 'NO_MESH', message: 'Asset contains no renderable meshes.' });
  }
  if (skinnedMeshCount === 0) {
    issues.push({ severity: 'warning', code: 'NO_SKINNED_MESH', message: 'No skinned mesh detected; combat deformation may be unavailable.' });
  }
  if (!Number.isFinite(size.y) || size.y <= 0.5) {
    issues.push({ severity: 'error', code: 'INVALID_BOUNDS', message: 'Character bounds are invalid or implausibly small.' });
  }
  if (size.y > 4.5 || size.x > 4.5 || size.z > 4.5) {
    issues.push({ severity: 'warning', code: 'LARGE_BOUNDS', message: 'Character bounds are unusually large; verify export scale and origin.' });
  }
  if (materialIds.size < 3) {
    issues.push({ severity: 'warning', code: 'LOW_MATERIAL_SEPARATION', message: 'Fewer than three materials detected; verify skin, clothing and accessory separation.' });
  }

  const names = animations.map((clip) => clip.name.toLowerCase());
  for (const group of REQUIRED_ANIMATION_GROUPS) {
    const found = group.aliases.some((alias) => names.some((name) => name === alias || name.includes(alias)));
    if (!found) {
      issues.push({ severity: 'warning', code: `MISSING_${group.state.toUpperCase()}`, message: `No animation clip found for ${group.state}.` });
    }
  }

  const errors = issues.filter((issue) => issue.severity === 'error');
  return {
    ok: errors.length === 0,
    meshCount,
    skinnedMeshCount,
    materialCount: materialIds.size,
    animationNames: animations.map((clip) => clip.name),
    bounds: { width: size.x, height: size.y, depth: size.z },
    issues,
  };
}
