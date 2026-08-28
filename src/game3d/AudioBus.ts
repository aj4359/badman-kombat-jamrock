import { AUDIO_ASSETS } from './assets';

export class AudioBus {
  private arena?: HTMLAudioElement;
  private music?: HTMLAudioElement;
  private enabled = true;

  async startArena() {
    if (!this.enabled || this.arena) return;
    this.arena = new Audio(AUDIO_ASSETS.arenaBed);
    this.arena.loop = true;
    this.arena.volume = 0.34;
    await this.arena.play().catch(() => undefined);
  }

  async startFight() {
    if (!this.enabled || this.music) return;
    this.music = new Audio(AUDIO_ASSETS.fightMusic);
    this.music.loop = true;
    this.music.volume = 0.46;
    await this.music.play().catch(() => undefined);
  }

  async airHorn() {
    if (!this.enabled) return;
    const horn = new Audio(AUDIO_ASSETS.airHorn);
    horn.volume = 0.7;
    await horn.play().catch(() => undefined);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.arena?.pause();
      this.music?.pause();
    } else {
      this.arena?.play().catch(() => undefined);
      this.music?.play().catch(() => undefined);
    }
  }

  setCombatIntensity(value: number) {
    const t = Math.max(0, Math.min(1, value));
    if (this.arena) this.arena.volume = 0.26 + t * 0.12;
    if (this.music) this.music.volume = 0.38 + t * 0.18;
  }

  dispose() {
    for (const track of [this.arena, this.music]) {
      if (!track) continue;
      track.pause();
      track.src = '';
    }
    this.arena = undefined;
    this.music = undefined;
  }
}
