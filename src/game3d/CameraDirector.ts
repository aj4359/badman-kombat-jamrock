import * as THREE from 'three';

export type CameraMode = 'entrance' | 'fight' | 'ko';

export class CameraDirector {
  private mode: CameraMode = 'entrance';
  private modeTime = 0;

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  setMode(mode: CameraMode) {
    if (mode === this.mode) return;
    this.mode = mode;
    this.modeTime = 0;
  }

  update(dt: number, player: THREE.Object3D, enemy: THREE.Object3D) {
    this.modeTime += dt;
    if (this.mode === 'entrance') return this.updateEntrance(player, enemy);
    if (this.mode === 'ko') return this.updateKo(player, enemy, dt);
    return this.updateFight(player, enemy, dt);
  }

  private updateEntrance(player: THREE.Object3D, enemy: THREE.Object3D) {
    const t = THREE.MathUtils.clamp(this.modeTime / 8.5, 0, 1);
    const target = player.position.clone().lerp(enemy.position, 0.62);
    const shoulder = new THREE.Vector3(
      player.position.x + Math.sin(t * Math.PI) * 0.75,
      3.65,
      player.position.z + THREE.MathUtils.lerp(5.8, 3.6, t),
    );
    this.camera.position.lerp(shoulder, 0.08);
    this.camera.lookAt(target.x, 2.35, target.z);
  }

  private updateFight(player: THREE.Object3D, enemy: THREE.Object3D, dt: number) {
    const center = player.position.clone().lerp(enemy.position, 0.5);
    const separation = player.position.distanceTo(enemy.position);
    const distance = THREE.MathUtils.clamp(7.2 + separation * 0.35, 7.5, 10.2);
    const desired = new THREE.Vector3(center.x + 0.25, 3.25, center.z + distance);
    this.camera.position.lerp(desired, 1 - Math.pow(0.002, dt));
    this.camera.lookAt(center.x, 2.2, center.z);
  }

  private updateKo(player: THREE.Object3D, enemy: THREE.Object3D, dt: number) {
    const winner = enemy.position.y > -0.4 ? enemy : player;
    const orbit = this.modeTime * 0.35;
    const desired = new THREE.Vector3(
      winner.position.x + Math.sin(orbit) * 4.2,
      2.8,
      winner.position.z + Math.cos(orbit) * 4.2,
    );
    this.camera.position.lerp(desired, 1 - Math.pow(0.01, dt));
    this.camera.lookAt(winner.position.x, 2.1, winner.position.z);
  }
}
