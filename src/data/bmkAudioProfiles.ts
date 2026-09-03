import type { AudioState } from '@/types/bmkCanon';

export interface BMKAudioProfile {
  state: AudioState;
  source: 'NONE' | 'CITY' | 'RADIO' | 'SOUND_SYSTEM' | 'ENVIRONMENT' | 'MYTHOLOGY';
  proximity: number;
  bass: number;
  ambience: number;
  dubSend: number;
  notes: string;
}

export const BMK_AUDIO_PROFILES: Record<string, BMKAudioProfile> = {
  'BMK-COMIC-00-S01': { state: 'SILENCE', source: 'NONE', proximity: 0, bass: 0, ambience: 0, dubSend: 0, notes: 'Near-black silence. User chooses whether sound begins.' },
  'BMK-COMIC-00-S02': { state: 'AMBIENT', source: 'CITY', proximity: 0.25, bass: 0.08, ambience: 0.9, dubSend: 0.05, notes: 'Kingston street bed: rain, vehicles, voices, distant radios. No generic tropical loop.' },
  'BMK-COMIC-00-S03': { state: 'ROOTS', source: 'RADIO', proximity: 0.4, bass: 0.32, ambience: 0.75, dubSend: 0.08, notes: 'Original BMK Roots composition heard in-world and partly masked by rain.' },
  'BMK-COMIC-00-S04': { state: 'DANCE', source: 'SOUND_SYSTEM', proximity: 0.88, bass: 0.82, ambience: 0.5, dubSend: 0.18, notes: 'Approach stack: bass increases with proximity; crowd and room/street reflections remain audible.' },
  'BMK-COMIC-00-S05': { state: 'DUB', source: 'SOUND_SYSTEM', proximity: 1, bass: 1, ambience: 0.28, dubSend: 0.72, notes: 'Confrontation: vocals/elements fall away, delay space grows, bass/drums remain. Badman reach lands in the gap.' },
  'BMK-COMIC-00-S06': { state: 'MYTHOLOGY', source: 'MYTHOLOGY', proximity: 0.55, bass: 0.38, ambience: 0.55, dubSend: 0.95, notes: 'Familiar Kingston sonics behave impossibly. Echo outlasts its source; bass seems to continue after the system is gone.' },
};
