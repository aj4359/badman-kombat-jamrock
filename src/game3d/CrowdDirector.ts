import * as THREE from 'three';

export type CrowdEvent = 'entrance' | 'lightHit' | 'heavyHit' | 'guard' | 'lowHealth' | 'ko';

export class CrowdDirector {
  private energy = 0.08;
  private target = 0.08;
  private memory = 0;
  private pulse = 0;

  react(event: CrowdEvent, favourPlayer = true) {
    const weight: Record<CrowdEvent, number> = {
      entrance: 0.28,
      lightHit: 0.18,
      heavyHit: 0.48,
      guard: 0.1,
      lowHealth: 0.36,
      ko: 1,
    };
    this.target = Math.max(this.target, weight[event]);
    this.pulse = event === 'ko' ? 1 : Math.max(this.pulse, weight[event]);
    this.memory = THREE.MathUtils.clamp(this.memory + (favourPlayer ? 1 : -1) * weight[event] * 0.08, -1, 1);
  }

  update(dt: number) {
    this.target = Math.max(0.08, this.target - dt * 0.22);
    this.energy = THREE.MathUtils.damp(this.energy, this.target, 4.2, dt);
    this.pulse = Math.max(0, this.pulse - dt * 1.7);
    return { energy: this.energy, pulse: this.pulse, memory: this.memory };
  }

  getEnergy() { return this.energy; }
  getMemory() { return this.memory; }
}
