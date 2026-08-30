import * as THREE from 'three';

export type CameraMode = 'entrance' | 'fight' | 'ko';

export class CameraDirector {
  private mode: CameraMode = 'entrance';
  private modeTime = 0;
  private impact = 0;
  private impactSeed = 0;
  private lastSeparation?: number;

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  setMode(mode: CameraMode) {
    if (mode === this.mode) return;
    this.mode = mode;
    this.modeTime = 0;
    this.lastSeparation = undefined;
  }

  punch(strength = 1) {
    this.impact = Math.max(this.impact, THREE.MathUtils.clamp(strength, 0, 1));
    this.impactSeed += 1;
  }

  update(dt: number, player: THREE.Object3D, enemy: THREE.Object3D) {
    this.modeTime += dt;
    const separation = player.position.distanceTo(enemy.position);
    if (this.mode === 'fight' && this.lastSeparation !== undefined) {
      const displacement = Math.abs(separation - this.lastSeparation);
      if (displacement > 0.075 && displacement / Math.max(dt, 0.001) > 3.2) {
        this.punch(THREE.MathUtils.clamp(displacement * 3.1, 0.28, 1));
      }
    }
    this.lastSeparation = separation;

    if (this.mode === 'entrance') this.updateEntrance(player, enemy, dt);
    else if (this.mode === 'ko') this.updateKo(player, enemy, dt);
    else this.updateFight(player, enemy, dt);
    this.applyImpact(dt);
  }

  private updateEntrance(player: THREE.Object3D, enemy: THREE.Object3D, dt: number) {
    const t = THREE.MathUtils.clamp(this.modeTime / 8.5, 0, 1);
    const target = player.position.clone().lerp(enemy.position, 0.64);

    let desired: THREE.Vector3;
    if (t < 0.28) {
      const local = t / 0.28;
      desired = new THREE.Vector3(
        player.position.x - 0.65,
        THREE.MathUtils.lerp(1.35, 2.1, local),
        player.position.z + THREE.MathUtils.lerp(2.8, 3.7, local),
      );
    } else if (t < 0.72) {
      const local = (t - 0.28) / 0.44;
      desired = new THREE.Vector3(
        player.position.x + THREE.MathUtils.lerp(-0.65, 0.8, local),
        THREE.MathUtils.lerp(2.1, 3.55, local),
        player.position.z + THREE.MathUtils.lerp(3.7, 4.5, local),
      );
    } else {
      const local = (t - 0.72) / 0.28;
      desired = new THREE.Vector3(
        THREE.MathUtils.lerp(player.position.x + 0.8, target.x + 0.15, local),
        THREE.MathUtils.lerp(3.55, 3.15, local),
        THREE.MathUtils.lerp(player.position.z + 4.5, target.z + 7.7, local),
      );
    }

    const ease = 1 - Math.pow(0.0015, dt);
    this.camera.position.lerp(desired, ease);
    const lookY = t < 0.2 ? 1.35 : THREE.MathUtils.lerp(1.8, 2.35, t);
    this.camera.lookAt(target.x, lookY, target.z);
  }

  private updateFight(player: THREE.Object3D, enemy: THREE.Object3D, dt: number) {
    const center = player.position.clone().lerp(enemy.position, 0.5);
    const separation = player.position.distanceTo(enemy.position);
    const distance = THREE.MathUtils.clamp(7.1 + separation * 0.42, 7.7, 10.4);
    const lateral = THREE.MathUtils.clamp((player.position.x - enemy.position.x) * 0.12, -0.55, 0.55);
    const breathe = Math.sin(this.modeTime * 0.9) * 0.035;
    const desired = new THREE.Vector3(center.x + lateral, 3.18 + breathe, center.z + distance);
    this.camera.position.lerp(desired, 1 - Math.pow(0.002, dt));
    this.camera.lookAt(center.x, 2.18, center.z);
  }

  private updateKo(player: THREE.Object3D, enemy: THREE.Object3D, dt: number) {
    const winner = enemy.position.y > -0.4 ? enemy : player;
    const orbit = this.modeTime * 0.27;
    const radius = THREE.MathUtils.lerp(4.8, 3.35, THREE.MathUtils.clamp(this.modeTime / 4.5, 0, 1));
    const desired = new THREE.Vector3(
      winner.position.x + Math.sin(orbit) * radius,
      THREE.MathUtils.lerp(3.0, 2.45, THREE.MathUtils.clamp(this.modeTime / 3.5, 0, 1)),
      winner.position.z + Math.cos(orbit) * radius,
    );
    this.camera.position.lerp(desired, 1 - Math.pow(0.01, dt));
    this.camera.lookAt(winner.position.x, 2.0, winner.position.z);
  }

  private applyImpact(dt: number) {
    if (this.impact <= 0.002) {
      this.impact = 0;
      return;
    }
    const frequency = 34 + this.impactSeed * 0.17;
    const x = Math.sin(this.modeTime * frequency + this.impactSeed) * 0.12 * this.impact;
    const y = Math.cos(this.modeTime * (frequency * 0.83) + this.impactSeed * 1.7) * 0.055 * this.impact;
    this.camera.position.x += x;
    this.camera.position.y += y;
    this.impact *= Math.pow(0.045, dt);
  }
}
