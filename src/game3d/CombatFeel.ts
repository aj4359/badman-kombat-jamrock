export type AttackKind = 'light' | 'heavy';

export type AttackProfile = {
  startup: number;
  active: number;
  recovery: number;
  damage: number;
  range: number;
  hitStop: number;
  knockback: number;
  cameraImpulse: number;
};

export const ATTACKS: Record<AttackKind, AttackProfile> = {
  light: { startup: 0.075, active: 0.07, recovery: 0.19, damage: 8, range: 2.25, hitStop: 0.045, knockback: 0.1, cameraImpulse: 0.1 },
  heavy: { startup: 0.17, active: 0.09, recovery: 0.36, damage: 17, range: 2.55, hitStop: 0.085, knockback: 0.28, cameraImpulse: 0.22 },
};

export class CombatFeel {
  private freeze = 0;
  private comboWindow = 0;
  private combo = 0;

  hit(kind: AttackKind) {
    const profile = ATTACKS[kind];
    this.freeze = Math.max(this.freeze, profile.hitStop);
    this.comboWindow = 0.72;
    this.combo += 1;
    return profile;
  }

  update(dt: number) {
    if (this.freeze > 0) {
      this.freeze = Math.max(0, this.freeze - dt);
      return { frozen: true, dt: 0, combo: this.combo };
    }
    this.comboWindow = Math.max(0, this.comboWindow - dt);
    if (this.comboWindow === 0) this.combo = 0;
    return { frozen: false, dt, combo: this.combo };
  }

  getCombo() { return this.combo; }
}
