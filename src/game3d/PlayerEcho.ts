export type PlayerEchoProfile = {
  preferredName?: string;
  homeRegion?: string;
  musicAffinity?: string;
  selfDescription?: 'patient' | 'bold' | 'curious' | 'unpredictable';
};

export type ObservedPlayerTraits = {
  aggression: number;
  patience: number;
  guardReliance: number;
  exploration: number;
  mercy: number;
};

export type WorldMemory = {
  id: string;
  tag: string;
  weight: number;
  witnessedBy: string[];
  createdAtSessionMinute: number;
};

export class PlayerEcho {
  private profile: PlayerEchoProfile = {};
  private observed: ObservedPlayerTraits = { aggression: 0, patience: 0, guardReliance: 0, exploration: 0, mercy: 0 };
  private memories: WorldMemory[] = [];

  setProfile(profile: PlayerEchoProfile) {
    this.profile = { ...profile };
  }

  observe(trait: keyof ObservedPlayerTraits, amount: number) {
    this.observed[trait] = Math.max(0, Math.min(1, this.observed[trait] + amount));
  }

  remember(memory: WorldMemory) {
    const existing = this.memories.find((item) => item.id === memory.id);
    if (existing) {
      existing.weight = Math.max(existing.weight, memory.weight);
      existing.witnessedBy = [...new Set([...existing.witnessedBy, ...memory.witnessedBy])];
      return;
    }
    this.memories.push({ ...memory, weight: Math.max(0, Math.min(1, memory.weight)) });
    this.memories.sort((a, b) => b.weight - a.weight);
    this.memories = this.memories.slice(0, 64);
  }

  contextFor(witnessId: string) {
    return {
      profile: { ...this.profile },
      observed: { ...this.observed },
      witnessed: this.memories.filter((m) => m.witnessedBy.includes(witnessId)).slice(0, 8),
    };
  }

  resetPersonalisation() {
    this.profile = {};
    this.observed = { aggression: 0, patience: 0, guardReliance: 0, exploration: 0, mercy: 0 };
    this.memories = [];
  }
}
