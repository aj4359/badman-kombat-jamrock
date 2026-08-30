import * as THREE from 'three';

export class PerceptionDirector {
  private danger = 0;
  private pulse = 0;
  private baseFov: number;

  constructor(private readonly camera: THREE.PerspectiveCamera) {
    this.baseFov = camera.fov;
  }

  update(dt: number, playerHealth: number, enemyHealth: number) {
    const healthDanger = THREE.MathUtils.clamp((38 - playerHealth) / 38, 0, 1);
    const duelTension = THREE.MathUtils.clamp((55 - Math.min(playerHealth, enemyHealth)) / 55, 0, 1);
    const target = Math.max(healthDanger, duelTension * 0.35);
    this.danger = THREE.MathUtils.damp(this.danger, target, 2.8, dt);
    this.pulse += dt * (1.2 + this.danger * 2.2);

    const breath = Math.sin(this.pulse * Math.PI * 2) * this.danger;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, this.baseFov - this.danger * 2.4 + breath * 0.22, 4, dt);
    this.camera.updateProjectionMatrix();

    return {
      danger: this.danger,
      vignette: 0.72 + this.danger * 0.18,
      desaturation: this.danger * 0.18,
      heartbeat: this.danger > 0.35 ? this.danger : 0,
    };
  }

  reset() {
    this.danger = 0;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
  }
}
