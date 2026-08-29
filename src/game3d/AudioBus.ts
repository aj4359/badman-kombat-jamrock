import { AUDIO_ASSETS } from './assets';

export class AudioBus {
  private arena?: HTMLAudioElement;
  private music?: HTMLAudioElement;
  private enabled = true;
  private intensity = 0;
  private context?: AudioContext;

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
    const delta = t - this.intensity;
    this.intensity = t;
    if (this.arena) this.arena.volume = 0.26 + t * 0.12;
    if (this.music) this.music.volume = 0.38 + t * 0.18;
    if (delta > 0.035) this.impactThump(Math.min(1, 0.45 + delta * 2.6));
  }

  private impactThump(strength: number) {
    if (!this.enabled || typeof window === 'undefined') return;
    const AudioContextCtor = window.AudioContext;
    if (!AudioContextCtor) return;
    this.context ??= new AudioContextCtor();
    const ctx = this.context;
    if (ctx.state === 'suspended') void ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(92, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.11);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.13 * strength, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  dispose() {
    for (const track of [this.arena, this.music]) {
      if (!track) continue;
      track.pause();
      track.src = '';
    }
    this.arena = undefined;
    this.music = undefined;
    if (this.context) void this.context.close();
    this.context = undefined;
  }
}
