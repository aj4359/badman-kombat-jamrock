export type DramaBeat = 'neutral' | 'pressure' | 'danger' | 'lastStand' | 'ko';

export class MatchDrama {
  private beat: DramaBeat = 'neutral';
  private announced = new Set<DramaBeat>();

  update(playerHealth: number, enemyHealth: number): { beat: DramaBeat; changed: boolean } {
    let next: DramaBeat = 'neutral';
    if (playerHealth <= 0 || enemyHealth <= 0) next = 'ko';
    else if (playerHealth <= 18) next = 'lastStand';
    else if (playerHealth <= 35) next = 'danger';
    else if (enemyHealth <= 45 || playerHealth <= 55) next = 'pressure';
    const changed = next !== this.beat;
    this.beat = next;
    return { beat: next, changed };
  }

  shouldAnnounce(beat: DramaBeat) {
    if (beat === 'neutral' || this.announced.has(beat)) return false;
    this.announced.add(beat);
    return true;
  }

  reset() {
    this.beat = 'neutral';
    this.announced.clear();
  }
}
