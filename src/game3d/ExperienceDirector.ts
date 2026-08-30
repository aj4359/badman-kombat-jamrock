import type { WitnessMemoryTag } from './PitWitnesses';

export type ExperienceBeat = 'arrival' | 'recognition' | 'pressure' | 'danger' | 'consequence' | 'aftermath';

export type ExperienceSignal = {
  beat: ExperienceBeat;
  intensity: number;
  crowdEnergy: number;
  roomFocus: number;
  musicDuck: number;
  rainPresence: number;
  allowPersonalEcho: boolean;
  witnessMemory?: WitnessMemoryTag;
};

export type ExperienceInput = {
  elapsed: number;
  playerHealth: number;
  enemyHealth: number;
  crowdEnergy: number;
  fightActive: boolean;
  knockout: boolean;
  meaningfulHit?: 'light' | 'heavy' | 'guard';
};

/**
 * Converts combat state into authored dramatic state.
 * It does not generate dialogue or personal data. It tells presentation,
 * crowd and narrative systems when the room should feel different.
 */
export class ExperienceDirector {
  private beat: ExperienceBeat = 'arrival';
  private lastEchoAt = -Infinity;
  private readonly directEchoCooldown = 180;

  update(input: ExperienceInput): ExperienceSignal {
    const lowHealth = Math.min(input.playerHealth, input.enemyHealth);

    if (input.knockout) this.beat = 'consequence';
    else if (!input.fightActive) this.beat = input.elapsed < 12 ? 'arrival' : 'recognition';
    else if (lowHealth <= 18) this.beat = 'danger';
    else if (lowHealth <= 40 || input.crowdEnergy > 0.65) this.beat = 'pressure';
    else this.beat = 'recognition';

    const intensity = this.beat === 'danger' ? 1 : this.beat === 'pressure' ? 0.72 : this.beat === 'consequence' ? 0.9 : 0.35;
    const allowPersonalEcho = this.beat === 'recognition' && input.elapsed - this.lastEchoAt >= this.directEchoCooldown;

    let witnessMemory: WitnessMemoryTag | undefined;
    if (input.meaningfulHit === 'heavy') witnessMemory = 'saw_leroy_win_clean';
    if (input.playerHealth <= 0) witnessMemory = 'saw_leroy_get_dropped';

    return {
      beat: this.beat,
      intensity,
      crowdEnergy: Math.max(input.crowdEnergy, intensity * 0.55),
      roomFocus: this.beat === 'danger' ? 1 : this.beat === 'consequence' ? 0.92 : 0.45,
      musicDuck: this.beat === 'danger' ? 0.5 : this.beat === 'consequence' ? 0.72 : 0,
      rainPresence: this.beat === 'danger' ? 0.8 : this.beat === 'arrival' ? 1 : 0.45,
      allowPersonalEcho,
      witnessMemory,
    };
  }

  consumePersonalEcho(elapsed: number) {
    this.lastEchoAt = elapsed;
  }

  enterAftermath() {
    this.beat = 'aftermath';
  }

  reset() {
    this.beat = 'arrival';
    this.lastEchoAt = -Infinity;
  }
}
