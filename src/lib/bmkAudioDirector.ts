import type { AudioState } from '@/types/bmkCanon';

export type AudioDirectorListener = (state: AudioState) => void;

export class BMKAudioDirector {
  private state: AudioState = 'SILENCE';
  private enabled = false;
  private listeners = new Set<AudioDirectorListener>();

  get currentState() {
    return this.state;
  }

  get isEnabled() {
    return this.enabled;
  }

  enable() {
    this.enabled = true;
    this.emit();
  }

  disable() {
    this.enabled = false;
    this.transition('SILENCE');
  }

  transition(next: AudioState) {
    if (this.state === next) return;
    this.state = next;
    this.emit();
  }

  subscribe(listener: AudioDirectorListener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const listener of this.listeners) listener(this.state);
  }
}

export const bmkAudioDirector = new BMKAudioDirector();
