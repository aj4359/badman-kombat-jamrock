export interface AudioCue {
  timestamp: number; // milliseconds into sequence
  sound: string; // sound file or type
  volume: number;
}

export const JOHN_WICK_AUDIO_SEQUENCE: AudioCue[] = [
  { timestamp: 0, sound: 'continental_ambience', volume: 0.3 },
  { timestamp: 4000, sound: 'suit_rustle', volume: 0.5 },
  { timestamp: 6000, sound: 'gun_cock', volume: 0.7 },
  { timestamp: 8000, sound: 'combat_music', volume: 0.8 },
  { timestamp: 14000, sound: 'headshot_sound', volume: 1.0 },
  { timestamp: 16000, sound: 'bullet_time_whoosh', volume: 0.6 },
  { timestamp: 20000, sound: 'brass_casing', volume: 0.5 },
  { timestamp: 27000, sound: 'victory_theme', volume: 0.7 }
];

export const JORDAN_AUDIO_SEQUENCE: AudioCue[] = [
  { timestamp: 0, sound: 'vinyl_scratch', volume: 0.6 },
  { timestamp: 4000, sound: 'bass_drop', volume: 0.9 },
  { timestamp: 7000, sound: 'beat_loop', volume: 0.7 },
  { timestamp: 15000, sound: 'soundwave_blast', volume: 0.8 },
  { timestamp: 19000, sound: 'crowd_cheer', volume: 0.6 }
];

export const LEROY_AUDIO_SEQUENCE: AudioCue[] = [
  { timestamp: 0, sound: 'digital_glitch', volume: 0.5 },
  { timestamp: 4000, sound: 'circuit_hum', volume: 0.6 },
  { timestamp: 7000, sound: 'hologram_activate', volume: 0.7 },
  { timestamp: 15000, sound: 'cyber_strike', volume: 0.9 },
  { timestamp: 23000, sound: 'matrix_code', volume: 0.6 }
];

export const SIFU_AUDIO_SEQUENCE: AudioCue[] = [
  { timestamp: 0, sound: 'temple_bell', volume: 0.4 },
  { timestamp: 5000, sound: 'chi_energy', volume: 0.6 },
  { timestamp: 8000, sound: 'steel_wire', volume: 0.7 },
  { timestamp: 16000, sound: 'dragon_roar', volume: 0.8 },
  { timestamp: 26000, sound: 'meditation_gong', volume: 0.5 }
];

export class AudioSyncManager {
  private audioContext: AudioContext | null = null;
  private startTime: number = 0;
  private scheduledSounds: number[] = [];

  constructor() {
    try {
      this.audioContext = new AudioContext();
    } catch (error) {
      console.warn('AudioContext not available:', error);
    }
  }

  startSequence(audioCues: AudioCue[]) {
    this.startTime = Date.now();
    this.scheduledSounds = [];

    audioCues.forEach(cue => {
      const timeoutId = window.setTimeout(() => {
        this.playSound(cue.sound, cue.volume);
      }, cue.timestamp);
      
      this.scheduledSounds.push(timeoutId);
    });

    console.log(`🎵 [AUDIO SYNC] Started sequence with ${audioCues.length} cues`);
  }

  private playSound(sound: string, volume: number) {
    console.log(`🔊 [AUDIO SYNC] Playing: ${sound} at volume ${volume}`);
    // Actual audio playback would be implemented here
    // For now, just logging for demonstration
  }

  stopSequence() {
    this.scheduledSounds.forEach(id => clearTimeout(id));
    this.scheduledSounds = [];
    console.log('🛑 [AUDIO SYNC] Sequence stopped');
  }

  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }
}
