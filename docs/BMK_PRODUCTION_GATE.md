# BADMAN KOMBAT™ — VERTICAL SLICE PRODUCTION GATE

Status: ACTIVE
Target: `BMK #0: BEFORE THE KOMBAT`
North star: **READ THE STORY. OWN THE SOUND. PLAY THE WORLD.**
Public line: **JAMAICA YOU CAN PLAY.™**

## Stop building sideways

The software foundation is sufficiently mature for the six-scene proof. Until this gate passes, new characters, chapters, maps and mythology exposition are secondary.

The production objective is now simple: make six scenes feel like one premium, culturally grounded Kingston 1987 experience.

## Gate A — Leroy exists

Authority: `BMK-CHR-LEROY-001` and `docs/BMK_LEROY_CHARACTER_BIBLE.md`.

Required master reference pack before final scene art:
1. neutral front portrait
2. left/right profile
3. full-body neutral stance
4. fighting silhouette
5. expression sheet
6. wardrobe/material detail sheet

Required story-state proof:
- `LEROY-RAIN`
- `LEROY-DANCE`
- `LEROY-CONFRONTATION`

All three must be recognisably the same man. Attractive but inconsistent images fail.

## Gate B — Kingston exists

Required environment IDs:
- `BMK-ENV-KINGSTON-STREET-1987-001`
- `BMK-ENV-KINGSTON-RAIN-1987-001`
- `BMK-ENV-SOUNDSYSTEM-1987-001`
- `BMK-ENV-JAMAICA-DEEP-001`

Acceptance:
- feels lived-in rather than touristic
- period detail survives inspection
- no generic cyberpunk neon
- no modern objects that break 1987
- sound-system scene feels communal and Jamaican, not like a generic nightclub
- mythology begins credible and becomes subtly impossible

## Gate C — Kingston sounds alive

Required audio IDs:
- `BMK-AUD-AMBIENT-K87-001`
- `BMK-MUS-K87-ROOTS-001-A`
- `BMK-MUS-K87-DUB-001-B`
- `BMK-MUS-K87-MYTH-001`

Acceptance:
- original/cleared provenance only
- Roots and Dub versions belong to one musical family
- bass behaves as part of the world
- confrontation uses subtraction and negative space
- mythology transforms familiar BMK sonic material instead of switching to generic horror music

## Gate D — Six-scene audience test

A new viewer gets no explanation before entering.

After the experience, test whether they can answer:
1. Where and when are we?
2. Who is Leroy?
3. Did Kingston feel like a place rather than a backdrop?
4. Did the sound system feel physically present?
5. Did the confrontation create anticipation without over-explaining combat?
6. Did the final scene make the world feel larger?
7. Would you continue into the game?

Target reaction: **“What the hell is BADMAN KOMBAT, and when can I play it?”**

## Gate E — Technical release

Before PR #11 leaves draft:
- BMK Canon CI green
- no approved asset without a real path
- no restricted/research-only audio in runtime
- mobile layout checked
- reduced-motion path checked
- sound opt-in works
- keyboard/touch navigation works
- scene progression cannot escape bounds
- final credits/provenance present

## Approval rule

`MISSING` → `REVIEW` → `APPROVED`.

Do not use `APPROVED` as a synonym for “good enough”. Approval means the asset has passed canon, cultural, rights and technical review and has a stable production path.

## Expansion rule

Only after Gates A–E pass do we expand from six scenes toward the full BMK #0 story and wider playable Kingston slice.
