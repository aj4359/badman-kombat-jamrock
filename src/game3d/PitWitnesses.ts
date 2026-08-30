export type WitnessTemperament = 'warm' | 'watchful' | 'volatile' | 'skeptical' | 'protective' | 'competitive';

export type WitnessMemoryTag =
  | 'saw_leroy_win_clean'
  | 'saw_leroy_show_mercy'
  | 'saw_leroy_fight_dirty'
  | 'saw_leroy_get_dropped'
  | 'lost_bet_on_leroy'
  | 'won_bet_on_leroy'
  | 'player_rushes_bell'
  | 'player_guards_patiently';

export type PitWitness = {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  reasonForBeingHere: string;
  temperament: WitnessTemperament;
  allegiance: 'leroy' | 'marcus' | 'neutral';
  personalObject: string;
  relationships: string[];
  gestureFamily: string;
  memories: WitnessMemoryTag[];
};

export const PIT_WITNESSES: PitWitness[] = [
  { id: 'marcia', name: 'Marcia Campbell', nickname: 'Auntie Marcia', role: 'night-shift nurse and neighbourhood anchor', reasonForBeingHere: 'checking on a younger relative working the door', temperament: 'protective', allegiance: 'leroy', personalObject: 'folded rain scarf', relationships: ['knows Leroy from the neighbourhood', 'aunt of Devon at the door'], gestureFamily: 'arms-folded, small nods, sharp side-eye', memories: [] },
  { id: 'devon', name: 'Devon Blake', nickname: 'Locks', role: 'door runner and amateur boxer', reasonForBeingHere: 'working the entrance while studying every fighter', temperament: 'competitive', allegiance: 'neutral', personalObject: 'worn hand wraps', relationships: ['nephew of Marcia', 'trains occasionally with Winston'], gestureFamily: 'shadow-boxing, chin rub, weight shifts', memories: [] },
  { id: 'winston', name: 'Winston Reid', nickname: 'Coach Win', role: 'retired boxing coach', reasonForBeingHere: 'watching for discipline rather than spectacle', temperament: 'skeptical', allegiance: 'leroy', personalObject: 'old stopwatch', relationships: ['once coached Devon', 'respects Leroy but challenges him'], gestureFamily: 'still posture, stopwatch glance, slow head shake', memories: [] },
  { id: 'nadine', name: 'Nadine Foster', role: 'dressmaker', reasonForBeingHere: 'delivering a repaired jacket and staying for one bout', temperament: 'watchful', allegiance: 'neutral', personalObject: 'small sewing tin', relationships: ['knows Marcia', 'made stage clothes for Ellis'], gestureFamily: 'measured gaze, sleeve adjustment, restrained clap', memories: [] },
  { id: 'ellis', name: 'Ellis Grant', nickname: 'Professor', role: 'sound-system selector', reasonForBeingHere: 'running the room sound and reading the crowd', temperament: 'warm', allegiance: 'leroy', personalObject: 'record sleeve marked by hand', relationships: ['works with Nadine', 'friendly rivalry with Carlton'], gestureFamily: 'finger on headphone cup, shoulder bounce, cue-point gestures', memories: [] },
  { id: 'carlton', name: 'Carlton James', nickname: 'CJ', role: 'motor mechanic', reasonForBeingHere: 'settling a friendly wager after closing the garage', temperament: 'volatile', allegiance: 'marcus', personalObject: 'grease-marked rag', relationships: ['friendly rival of Ellis', 'Marcus once helped his brother'], gestureFamily: 'leans forward, palms out, explosive reactions', memories: [] },
  { id: 'yvonne', name: 'Yvonne Clarke', role: 'shopkeeper', reasonForBeingHere: 'collecting a debt from a promoter and refusing to leave empty-handed', temperament: 'skeptical', allegiance: 'neutral', personalObject: 'small receipt book', relationships: ['supplies Marcia on credit', 'does not trust the promoter'], gestureFamily: 'receipt tapping, eyebrow raise, economical applause', memories: [] },
  { id: 'dwayne', name: 'Dwayne Morgan', nickname: 'Mouse', role: 'apprentice electrician', reasonForBeingHere: 'maintaining temperamental lights above the ring', temperament: 'warm', allegiance: 'leroy', personalObject: 'insulated screwdriver', relationships: ['works jobs for Yvonne', 'looks up to Devon'], gestureFamily: 'light-check glances, nervous grin, sudden cheers', memories: [] },
];

export class PitWitnessMemory {
  private readonly state = new Map(PIT_WITNESSES.map((w) => [w.id, new Set<WitnessMemoryTag>(w.memories)]));

  remember(witnessIds: string[], tag: WitnessMemoryTag) {
    witnessIds.forEach((id) => this.state.get(id)?.add(tag));
  }

  memoriesFor(witnessId: string) {
    return [...(this.state.get(witnessId) ?? new Set<WitnessMemoryTag>())];
  }

  reset() {
    this.state.clear();
    PIT_WITNESSES.forEach((w) => this.state.set(w.id, new Set(w.memories)));
  }
}
