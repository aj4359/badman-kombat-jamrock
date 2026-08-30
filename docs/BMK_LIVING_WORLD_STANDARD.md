# BADMAN KOMBAT — Living World Standard

## Benchmark, not imitation
BMK uses the best contemporary AAA world-building as a quality benchmark, never as content to copy. Our target is not a raw animation-count arms race. It is the *perceived specificity per character, room and encounter* that hand-authored detail creates.

## Core rule: nobody is background
Every visible person should answer at least five questions:
1. Why are they here?
2. Who do they know?
3. What were they doing before Leroy arrived?
4. What changes when violence begins?
5. What will they remember afterward?

## NPC identity packet
Each authored NPC gets a compact data packet rather than being a random body/clothes combination:
- stable ID + name/nickname
- age band and neighbourhood connection
- occupation/role
- relationship links to other local NPCs
- reason for being at current location
- temperament and risk tolerance
- fighter allegiance/reputation bias
- current need/activity
- clothing logic appropriate to person/time/place
- prop/personal-object logic
- voice/reaction family
- movement/gesture family
- memory tags from witnessed events

## Animation grammar instead of brute-force clips
We cannot and should not chase hundreds of thousands of bespoke clips at vertical-slice scale. Build combinatorial authored behaviour from layers:
- locomotion: stand, walk, hurry, run, turn, step-aside
- posture: relaxed, guarded, leaning, seated, working, dancing
- social: greet, point, laugh, argue, whisper, embrace, dismiss
- object: drink, smoke, carry, wipe, tune, stack, count, repair
- fight reaction: notice, lean-in, flinch, cheer, recoil, scatter, intervene
- emotional modifier: bored, amused, tense, afraid, angry, impressed
- relationship modifier: stranger, friend, rival, family, regular
- world-state modifier: calm, rain, police pressure, fight, aftermath

Animation layers + IK + gaze + timing offsets + prop state + authored personality should create many believable variations without pretending each permutation is a hand-made clip.

## Room biography
Every important room gets a one-paragraph biography before dressing.
- owner/user
- purpose
- time-of-day use
- maintenance level
- economic reality
- recent event
- personal traces
- sound source
- smell/weather implication where relevant
- 3 signature objects that could only belong here

No generic prop scatter. A photograph, cup, towel, ledger, radio or chair exists because somebody uses it.

## The Pit population tiers
### Tier A — named witnesses
6–12 recurring authored NPCs. Distinct faces/silhouettes, relationships, allegiance and persistent memory. They can reappear across fights/story.

### Tier B — local regulars
20–40 identity packets assembled from curated components. Stable enough to recognise, lighter narrative depth.

### Tier C — pressure crowd
Instanced/performance-oriented crowd bodies for density. They inherit zone-level behaviour and animation variation but never masquerade as close-up hero NPCs.

Camera distance decides fidelity tier. Never put Tier C in a hero close-up.

## Memory loop
Witness event → interpret through temperament/allegiance → store compact memory tag → modify later greeting/position/reaction/dialogue → player perceives consequence.

Examples:
- `saw_leroy_ko_marcus`
- `leroy_fought_dirty`
- `leroy_protected_local`
- `lost_money_betting_leroy`
- `marcus_family_connection`

## Kingston specificity gate
An NPC is rejected if swapping them into another generic cyberpunk city would make no difference. Clothing, occupation, gesture, social relation, sound environment and material world should reinforce Kingston 1986 without caricature.

## Ethical/cultural gate
Research real history, architecture, music culture, language and everyday life. Do not reduce Jamaican identity to patois catchphrases, crime tropes or tourist imagery. Fictional characters must remain original and human.

## Vertical-slice target
For The Pit, prove the philosophy with depth rather than scale:
- 8 named witnesses
- 24 local regulars
- scalable pressure crowd
- 3 authored micro-scenes before the fight
- 5 crowd reaction states
- persistent allegiance/memory for named witnesses
- 1 post-fight aftermath state

If those 32 foreground people feel genuinely situated, that is a stronger proof than 500 interchangeable NPCs.

## Long-term ambition
Scale the same authored-data model with tools and procedural assistance, but preserve human creative direction. Automation should multiply authored intent, not replace it with randomness.
