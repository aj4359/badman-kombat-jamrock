# LEROY — HERO ASSET PRODUCTION CONTRACT

Purpose: give a character artist, Blender pipeline, asset generator or external vendor an unambiguous target that plugs into the BMK runtime.

## Deliverable
Final runtime file: `public/assets/game3d/fighters/leroy/leroy.glb`
Source artwork should remain editable outside the runtime export.

## Character direction
Original Jamaican BMK character. Do not imitate a real actor, athlete or existing game/film character.

Age read: mature adult.
Build: heavyweight athletic, powerful shoulders/traps/forearms, strong legs, believable waist and joint proportions. Powerful rather than grotesquely inflated.
Face: unique asymmetry, strong brow/jaw, lived-in skin, restrained scar history, focused eyes. Avoid generic 'perfect' face generation.
Hands: production priority. Correct finger count, believable knuckles/palms, closed-fist deformation tested.
Skin: dark complexion with separate roughness response; subtle variation across face, palms, elbows and scars; sweat response must survive warm/cool lighting.
Hair: period-appropriate original design with stable geometry/cards under combat motion.
Wardrobe: 1980s Kingston street tailoring with martial practicality. Garments must read as cloth/leather rather than painted skin. Restrained gold detail only.
Footwear: grounded, period-plausible, combat-readable sole.

## Runtime geometry targets
Hero desktop target: approximately 70k–140k triangles including clothing/hair, subject to visual result.
LOD1: approximately 45–60% of hero.
LOD2/mobile: approximately 20–30% of hero.
Prefer efficient topology around shoulders, elbows, wrists, hips, knees, jaw and hands.
No hidden duplicate bodies/materials in export.

## Texture/material contract
PBR metallic/roughness workflow.
Desktop hero: up to 4K for face/body hero sets where justified; 2K for most garments/accessories.
Mobile tier: provide/downsample to 2K/1K as appropriate.
Use compressed runtime texture formats during optimisation pass.
Required visual separation: skin, cloth/leather, metal, hair, eyes/teeth.
Do not bake cinematic lighting into albedo/base colour.

## Skeleton
Humanoid skeleton with stable root/hips hierarchy.
Root at world origin; feet rest at y=0 in neutral export pose.
Forward direction: -Z for BMK runtime convention.
Scale: real-world coherent; manifest performs final gameplay scaling.
Hands require finger bones if available; face blendshapes/bones strongly preferred for cinematics.

## Required animation clips
Names should include these canonical tokens so `FighterEntity` can resolve them:
- `idle`
- `walk`
- `guard`
- `jab` or `light`
- `hook` or `heavy`
- `hit`
- `knockdown`
- `victory`

Next animation pass:
- backstep
- sidestep_left / sidestep_right
- body_hit
- head_hit
- guard_hit
- getup
- intro_walk
- intro_pose
- finisher

## Animation principles
Weight starts at the feet and hips, not only arms.
No foot sliding in idle/walk/attack recoveries.
Attacks have anticipation, acceleration, impact, recoil and recovery.
Heavy attack must visually justify higher damage.
Guard changes centre of mass and shoulder posture.
Hit reactions indicate strike direction without rag-doll comedy.
Knockdown has consequence and believable body mass.

## Validation checklist
1. Import GLB into BMK loader without console errors.
2. `idle` auto-plays.
3. All required clips resolve through the animation alias system.
4. Character faces opponent with BMK forward convention.
5. Feet touch arena floor without manual per-animation offsets.
6. No severe clipping in idle, guard, jab, hook, hit or knockdown.
7. Dark skin remains readable under The Pit's warm key + cool rim.
8. 60fps target assessed on desktop performance tier and 30/60 adaptive target on mobile.
9. Close entrance camera passes face/hands/material quality gate.
10. Silhouette remains recognisably Leroy with materials rendered black.

## Acceptance rule
Do not expand the roster from this asset until Leroy passes the close-up entrance shot and live combat test. A merely functional GLB is not an approved BMK hero character.
