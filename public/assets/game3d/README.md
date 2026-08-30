# Badman Kombat 3D Hero Asset Contract

This directory is the production boundary for next-generation BMK character and arena assets.

## Fighter paths

- `/assets/game3d/fighters/leroy/leroy.glb`
- `/assets/game3d/fighters/opponent/opponent.glb`

## Required animation names

The runtime accepts aliases, but production exports should use:

- `idle`
- `walk`
- `guard`
- `light`
- `heavy`
- `hit`
- `knockdown`
- `victory`

## Coordinate contract

- Y up
- character faces +Z at authoring time
- feet rest at Y=0
- real-world-ish scale; target hero height roughly 1.8-2.0 scene units before stylistic scale
- origin centred between feet

## Material contract

Use PBR metallic/roughness materials. Skin, cloth, leather, metal and hair should be separate logical material regions. Do not bake dramatic lighting into albedo.

## Quality bar

Hero assets must read as premium stylised realism. No billboard people, flat fighter sprites, single-plane cutouts, or pixel-art stand-ins are permitted on the hero route.

Leroy is the benchmark asset. Subsequent fighters may differ in body type, clothing and style, but must meet or exceed his technical standard.
