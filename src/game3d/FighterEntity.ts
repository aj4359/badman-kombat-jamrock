import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { FighterAssetManifest } from './assets';

export type FighterState = 'idle' | 'walk' | 'guard' | 'light' | 'heavy' | 'hit' | 'knockdown' | 'victory';

export class FighterEntity {
  readonly root = new THREE.Group();
  readonly mixer = new THREE.AnimationMixer(this.root);
  readonly actions = new Map<string, THREE.AnimationAction>();
  state: FighterState = 'idle';
  health = 100;
  ready = false;

  private activeAction?: THREE.AnimationAction;

  async load(manifest: FighterAssetManifest) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(manifest.model);
    const model = gltf.scene;
    model.scale.setScalar(manifest.scale);
    model.position.y = manifest.yOffset;
    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    this.root.add(model);

    for (const clip of gltf.animations) {
      const action = this.mixer.clipAction(clip, model);
      this.actions.set(clip.name.toLowerCase(), action);
    }

    this.ready = true;
    this.play('idle', 0);
  }

  update(dt: number) {
    this.mixer.update(dt);
  }

  damage(amount: number) {
    this.health = THREE.MathUtils.clamp(this.health - amount, 0, 100);
    this.play(this.health <= 0 ? 'knockdown' : 'hit', 0.06, true);
    return this.health;
  }

  play(state: FighterState, fade = 0.12, once = false) {
    if (!this.ready) return;
    const next = this.findAction(state);
    if (!next || next === this.activeAction) return;

    next.reset();
    next.enabled = true;
    next.setEffectiveTimeScale(1);
    next.setEffectiveWeight(1);
    if (once) {
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = true;
    } else {
      next.setLoop(THREE.LoopRepeat, Infinity);
      next.clampWhenFinished = false;
    }

    if (this.activeAction) this.activeAction.crossFadeTo(next, fade, false);
    next.play();
    this.activeAction = next;
    this.state = state;
  }

  private findAction(state: FighterState) {
    const aliases: Record<FighterState, string[]> = {
      idle: ['idle', 'fight_idle', 'combat_idle'],
      walk: ['walk', 'walk_forward', 'locomotion'],
      guard: ['guard', 'block', 'blocking'],
      light: ['light', 'jab', 'punch', 'attack_light'],
      heavy: ['heavy', 'hook', 'attack_heavy'],
      hit: ['hit', 'hit_reaction', 'impact'],
      knockdown: ['knockdown', 'ko', 'death'],
      victory: ['victory', 'win', 'celebrate'],
    };
    for (const alias of aliases[state]) {
      const exact = this.actions.get(alias);
      if (exact) return exact;
      for (const [name, action] of this.actions) if (name.includes(alias)) return action;
    }
    return undefined;
  }

  dispose() {
    this.mixer.stopAllAction();
    this.root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((m) => m.dispose());
    });
  }
}
