# BMK — Warp Speed Parallel Workstreams

## Commander's intent
Ship one unforgettable, playable Kingston 1986 vertical slice before expanding roster or world breadth. Every workstream protects originality, human weight and Kingston specificity.

## CODEX — Runtime / integration
Own: `src/game3d` and `/next-gen-fight` engineering.
1. Integrate `PitAtmosphere`, `ImpactFX`, `CrowdDirector`, `CombatFeel`, `PerceptionDirector`, `MatchDrama` and `Haptics` into `NextGenFightV2`.
2. Fix transient animation cancellation: locomotion must never override light/heavy/hit/knockdown/victory one-shots.
3. Apply hit-stop to fighter animation/movement without freezing UI incorrectly.
4. Make attack collision respect facing and active windows, not distance alone.
5. Add whiff recovery and guard-facing logic.
6. Keep low/medium/high quality tiers and mobile performance budget.
7. CI must lint active V2 + `src/game3d` and build full app.
Definition: a real GLB can be dropped in and the fight remains stable, readable and cinematic.

## MOTION AIDE — Cinematic direction
Own: entrance, round transition, KO and trailer grammar.
- No hard cut from movie to gameplay if a camera handoff can achieve it.
- Entrance reveals Leroy face late.
- Marcus reveal is a story beat.
- KO holds consequence before results.
- Capture list: rain/zinc macro, shoe/puddle, shoulder entrance, opponent reveal, first playable frame, heavy hit, KO hold.

## REECE / CREATIVE AIDE — Kingston authenticity
Own: environmental storytelling.
- 1986 street tailoring references without copying identifiable people.
- zinc, timber, concrete, hand-painted venue details, speaker-stack culture, practical lighting.
- Future technology is intrusion/accent only.
- Reject generic neon cyberpunk.

## SOUND AIDE — The Pit sound world
Own: audio asset brief and mix map.
Layers: rain on zinc, distant exterior rain, crowd beds, individual reactions, speaker hum, bass leakage, shoes/wet floor, breath, cloth, jab transient, heavy body, guard, room slap, air horn, KO silence/room return.
Rule: silence and music ducking are effects. Do not fill every second.

## CIPHER AIDE — IP / originality gate
Own: pre-merge visual/IP review.
- no celebrity likenesses
- no identifiable film/game character imitation
- no copied costumes/logos/music
- document original character and environment decisions
- public material reveals experience, not proprietary scoring/runtime internals

## QA AIDE — Feel gate
Test desktop and mobile.
- controls responsive
- no foot float/sliding from integration
- no attack animation cancellation
- heavy hit visibly/heard/felt stronger than jab
- camera never loses fighters
- haptics optional, not required for information
- reduced sensory-effects path before public release
- muted HUD-off screenshot still reads Kingston/BMK

## ART AIDE — Leroy production gate
Highest-priority external asset dependency remains `public/assets/game3d/fighters/leroy/leroy.glb`.
Do not scale roster until Leroy passes face, hands, silhouette, skin, clothing, rig, animation and performance checks in `LEROY_HERO_ASSET_SPEC.md`.

## Sequence
CODEX integration and QA run in parallel with Leroy production. Motion, Sound and Creative prepare assets/briefs against the same vertical slice. Cipher reviews before public trailer/export. No workstream is allowed to substitute placeholder art for the hero quality gate.
