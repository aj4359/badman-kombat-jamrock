import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { AudioBus } from '@/game3d/AudioBus';
import { CameraDirector } from '@/game3d/CameraDirector';
import { FighterEntity } from '@/game3d/FighterEntity';
import { FIGHTER_ASSETS } from '@/game3d/assets';
import { detectQualityTier } from '@/game3d/quality';

type Phase = 'ready' | 'entrance' | 'fight' | 'ko';
type InputState = { up: boolean; down: boolean; left: boolean; right: boolean; guard: boolean };
type FallbackRig = { root: THREE.Group; torso: THREE.Group; rightArm: THREE.Group };
type RuntimeFighter = { root: THREE.Group; entity?: FighterEntity; fallback?: FallbackRig; health: number };

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function mat(color: number, roughness = 0.6, metalness = 0.02) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function createFallbackFighter(opts: { skin: number; top: number; trousers: number; scale: number }): FallbackRig {
  const root = new THREE.Group();
  root.scale.setScalar(opts.scale);
  const skin = mat(opts.skin, 0.72, 0);
  const cloth = mat(opts.top, 0.58, 0.02);
  const pants = mat(opts.trousers, 0.78, 0.01);
  const shoe = mat(0x080808, 0.34, 0.12);

  const torso = new THREE.Group();
  torso.position.y = 2.55;
  root.add(torso);

  const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.72, 0.88, 8, 20), cloth);
  chest.scale.set(1.42, 1.05, 0.82);
  torso.add(chest);
  const shoulderBar = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 1.45, 6, 16), cloth);
  shoulderBar.rotation.z = Math.PI / 2;
  shoulderBar.position.y = 0.42;
  torso.add(shoulderBar);
  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.66, 0.72, 24), pants);
  waist.position.y = -0.92;
  torso.add(waist);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.31, 0.43, 18), skin);
  neck.position.y = 0.96;
  torso.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 22), skin);
  head.scale.set(0.91, 1.11, 0.9);
  head.position.y = 1.42;
  torso.add(head);

  const makeArm = (side: number) => {
    const arm = new THREE.Group();
    arm.position.set(side * 1.02, 0.35, 0);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.6, 8, 16), skin);
    upper.position.y = -0.48;
    arm.add(upper);
    const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.23, 0.56, 8, 16), skin);
    fore.position.y = -1.12;
    arm.add(fore);
    const fist = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.52), skin);
    fist.position.set(0, -1.61, 0.03);
    arm.add(fist);
    torso.add(arm);
    return arm;
  };

  const leftArm = makeArm(-1);
  const rightArm = makeArm(1);
  leftArm.rotation.z = 0.12;
  rightArm.rotation.z = -0.12;

  const makeLeg = (side: number) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.36, 1.58, 0);
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.31, 0.88, 8, 16), pants);
    thigh.position.y = -0.58;
    leg.add(thigh);
    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.82, 8, 16), pants);
    shin.position.y = -1.5;
    leg.add(shin);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.31, 0.86), shoe);
    foot.position.set(0, -2.05, 0.19);
    leg.add(foot);
    root.add(leg);
  };
  makeLeg(-1);
  makeLeg(1);

  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; }
  });
  return { root, torso, rightArm };
}

async function loadRuntimeFighter(kind: 'leroy' | 'opponent', fallback: () => FallbackRig): Promise<RuntimeFighter> {
  const entity = new FighterEntity();
  try {
    await entity.load(FIGHTER_ASSETS[kind]);
    return { root: entity.root, entity, health: 100 };
  } catch {
    entity.dispose();
    const rig = fallback();
    return { root: rig.root, fallback: rig, health: 100 };
  }
}

function buildArena(scene: THREE.Scene, crowdDensity: number) {
  const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(8.8, 9.1, 0.42, 64),
    new THREE.MeshPhysicalMaterial({ color: 0x2d2924, roughness: 0.3, metalness: 0.02, clearcoat: 0.22, clearcoatRoughness: 0.38 }),
  );
  floor.position.y = -0.24;
  floor.receiveShadow = true;
  scene.add(floor);

  const barrierMat = mat(0x35281d, 0.9, 0);
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.0, 0.26), barrierMat);
    panel.position.set(Math.sin(a) * 9.15, 0.85, Math.cos(a) * 9.15);
    panel.rotation.y = a;
    panel.castShadow = true;
    panel.receiveShadow = true;
    scene.add(panel);
  }

  const people = Math.max(42, Math.round(150 * crowdDensity));
  const bodyGeo = new THREE.CapsuleGeometry(0.16, 0.58, 4, 7);
  const headGeo = new THREE.SphereGeometry(0.15, 7, 6);
  const crowdMat = mat(0x11100f, 0.96, 0);
  const bodies = new THREE.InstancedMesh(bodyGeo, crowdMat, people);
  const heads = new THREE.InstancedMesh(headGeo, crowdMat, people);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < people; i++) {
    const tier = i % 3;
    const a = (i / people) * Math.PI * 2 * 3.2;
    const r = 10.6 + tier * 1.45;
    dummy.position.set(Math.sin(a) * r, 2.15 + tier * 1.55, Math.cos(a) * r);
    dummy.rotation.y = a + Math.PI;
    dummy.updateMatrix();
    bodies.setMatrixAt(i, dummy.matrix);
    dummy.position.y += 0.55;
    dummy.updateMatrix();
    heads.setMatrixAt(i, dummy.matrix);
  }
  scene.add(bodies, heads);

  const ringLight = new THREE.Mesh(
    new THREE.TorusGeometry(9.55, 0.055, 8, 96),
    new THREE.MeshStandardMaterial({ color: 0xe39a46, emissive: 0x8a3d12, emissiveIntensity: 0.8 }),
  );
  ringLight.rotation.x = Math.PI / 2;
  ringLight.position.y = 2.18;
  scene.add(ringLight);
}

export default function NextGenFightV2() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<InputState>({ up: false, down: false, left: false, right: false, guard: false });
  const attackRef = useRef<'light' | 'heavy' | null>(null);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>('ready');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [assetStatus, setAssetStatus] = useState('Preparing The Pit');
  const [qualityLabel, setQualityLabel] = useState('AUTO');
  const audio = useMemo(() => new AudioBus(), []);

  const setMove = (key: keyof InputState, value: boolean) => { inputRef.current[key] = value; };

  useEffect(() => {
    if (!started) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let frame = 0;
    const quality = detectQualityTier();
    setQualityLabel(quality.tier.toUpperCase());

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050707);
    scene.fog = new THREE.FogExp2(0x0d0b09, quality.fogDensity);

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 120);
    camera.position.set(0, 3.7, 10.5);
    const director = new CameraDirector(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: quality.tier !== 'low', powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.pixelRatioCap));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = quality.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x66727b, 0x1d1209, 0.78));
    const warm = new THREE.SpotLight(0xffa94d, 185, 28, Math.PI / 4.5, 0.55, 1.0);
    warm.position.set(-4.5, 10.5, 4.5);
    warm.castShadow = quality.shadows;
    warm.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
    scene.add(warm);
    const cool = new THREE.SpotLight(0x50cfe0, 92, 24, Math.PI / 4.3, 0.72, 1.15);
    cool.position.set(6.5, 7.2, -6.5);
    scene.add(cool);
    buildArena(scene, quality.crowdDensity);

    const clock = new THREE.Clock();
    const keys = new Set<string>();
    let phaseLocal: Phase = 'entrance';
    let entranceT = 0;
    let player: RuntimeFighter | undefined;
    let enemy: RuntimeFighter | undefined;
    let attackCooldown = 0;
    let enemyCooldown = 1;
    let impactKick = 0;

    setPhase('entrance');
    void audio.startArena();

    Promise.all([
      loadRuntimeFighter('leroy', () => createFallbackFighter({ skin: 0x4b2416, top: 0x2d182e, trousers: 0xe0ddd4, scale: 1.1 })),
      loadRuntimeFighter('opponent', () => createFallbackFighter({ skin: 0x87553d, top: 0xcfd3cf, trousers: 0x252525, scale: 1.03 })),
    ]).then(([p, e]) => {
      if (disposed) return;
      player = p; enemy = e;
      p.root.position.set(0, 0, 5.2);
      e.root.position.set(0, 0, -3.75);
      scene.add(p.root, e.root);
      setAssetStatus(p.entity ? 'Leroy GLB loaded' : 'Leroy hero GLB pending · production fallback active');
    });

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase(); keys.add(k);
      if (k === 'j' || k === ' ') attackRef.current = 'light';
      if (k === 'k') attackRef.current = 'heavy';
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const strike = (kind: 'light' | 'heavy') => {
      if (!player || !enemy || phaseLocal !== 'fight' || attackCooldown > 0) return;
      attackCooldown = kind === 'heavy' ? 0.62 : 0.34;
      player.entity?.play(kind, 0.04, true);
      if (player.root.position.distanceTo(enemy.root.position) > (kind === 'heavy' ? 2.55 : 2.25)) return;
      const damage = kind === 'heavy' ? 17 : 8;
      enemy.health = clamp(enemy.health - damage, 0, 100);
      enemy.entity?.damage(damage);
      setEnemyHealth(enemy.health);
      impactKick = kind === 'heavy' ? 0.24 : 0.11;
      enemy.root.position.z -= kind === 'heavy' ? 0.24 : 0.1;
      audio.setCombatIntensity(1 - enemy.health / 100);
      if (enemy.health <= 0) {
        phaseLocal = 'ko'; setPhase('ko'); director.setMode('ko'); player.entity?.play('victory', 0.18);
      }
    };

    const animate = () => {
      if (disposed) return;
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.elapsedTime;
      attackCooldown = Math.max(0, attackCooldown - dt);
      enemyCooldown = Math.max(0, enemyCooldown - dt);
      entranceT += dt;

      if (player && enemy) {
        player.entity?.update(dt); enemy.entity?.update(dt);
        if (phaseLocal === 'entrance') {
          player.root.position.z = THREE.MathUtils.lerp(5.6, 2.7, clamp(entranceT / 8.5, 0, 1));
          director.update(dt, player.root, enemy.root);
          if (entranceT >= 8.5) {
            phaseLocal = 'fight'; setPhase('fight'); director.setMode('fight');
            void audio.airHorn(); void audio.startFight();
          }
        } else if (phaseLocal === 'fight') {
          const input = inputRef.current;
          const dx = (keys.has('d') || keys.has('arrowright') || input.right ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') || input.left ? 1 : 0);
          const dz = (keys.has('s') || keys.has('arrowdown') || input.down ? 1 : 0) - (keys.has('w') || keys.has('arrowup') || input.up ? 1 : 0);
          const len = Math.hypot(dx, dz) || 1;
          const moving = Math.abs(dx) + Math.abs(dz) > 0;
          player.root.position.x = clamp(player.root.position.x + (dx / len) * 3.15 * dt, -5.25, 5.25);
          player.root.position.z = clamp(player.root.position.z + (dz / len) * 3.15 * dt, -1.55, 5.0);
          const guarding = keys.has('l') || input.guard;
          player.entity?.play(guarding ? 'guard' : moving ? 'walk' : 'idle');

          const queued = attackRef.current; attackRef.current = null;
          if (queued) strike(queued);

          const towardEnemy = enemy.root.position.clone().sub(player.root.position);
          const yaw = Math.atan2(towardEnemy.x, towardEnemy.z);
          player.root.rotation.y = yaw;
          enemy.root.rotation.y = yaw + Math.PI;
          const distance = player.root.position.distanceTo(enemy.root.position);
          if (distance > 1.95) {
            const dir = player.root.position.clone().sub(enemy.root.position).normalize();
            enemy.root.position.addScaledVector(dir, Math.min(dt * 1.25, distance - 1.95));
            enemy.entity?.play('walk');
          } else if (enemyCooldown <= 0) {
            enemyCooldown = 0.9 + Math.random() * 0.5;
            enemy.entity?.play('light', 0.05, true);
            const damage = guarding ? 2 : 10;
            player.health = clamp(player.health - damage, 0, 100);
            player.entity?.damage(damage);
            setPlayerHealth(player.health);
            impactKick = guarding ? 0.05 : 0.14;
            if (player.health <= 0) {
              phaseLocal = 'ko'; setPhase('ko'); director.setMode('ko'); enemy.entity?.play('victory', 0.18);
            }
          } else enemy.entity?.play('idle');
          director.update(dt, player.root, enemy.root);
        } else director.update(dt, player.root, enemy.root);

        if (player.fallback) {
          player.fallback.torso.position.y = 2.55 + Math.sin(elapsed * 2.2) * 0.018;
          const punch = attackCooldown > 0 ? Math.sin((attackCooldown / 0.62) * Math.PI) : 0;
          player.fallback.rightArm.rotation.x = -punch * 1.55;
        }
        if (enemy.fallback) enemy.fallback.torso.position.y = 2.55 + Math.sin(elapsed * 2.05 + 0.7) * 0.016;
      }

      if (impactKick > 0) {
        camera.position.x += (Math.random() - 0.5) * impactKick;
        camera.position.y += (Math.random() - 0.5) * impactKick * 0.35;
        impactKick *= 0.78;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true; cancelAnimationFrame(frame); audio.dispose();
      window.removeEventListener('resize', onResize); window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp);
      player?.entity?.dispose(); enemy?.entity?.dispose(); renderer.dispose();
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry?.dispose(); const materials = Array.isArray(m.material) ? m.material : [m.material]; materials.forEach((x) => x?.dispose()); } });
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, [audio, started]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-[#eee5d5] select-none touch-none">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,.72)_100%)]" />

      {!started && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#050707] px-6">
          <div className="max-w-xl text-center">
            <div className="mb-5 text-[11px] uppercase tracking-[.52em] text-[#d58c3c]">Kingston · 1986</div>
            <h1 className="text-5xl font-black uppercase leading-[.9] md:text-7xl">Badman<br/>Kombat</h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-white/60">Each fighter carries history. Each battle carries memory. Enter The Pit to begin the next-generation vertical slice.</p>
            <button onClick={() => setStarted(true)} className="mt-8 border border-[#d58c3c] bg-[#d58c3c] px-8 py-4 text-sm font-black uppercase tracking-[.22em] text-black transition hover:bg-[#f0a44f]">Enter The Pit</button>
          </div>
        </div>
      )}

      {started && (
        <>
          <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-5 md:p-8">
            <div><div className="text-[10px] uppercase tracking-[.42em] text-[#d58c3c]">The Pit · Kingston</div><div className="mt-1 text-xl font-black uppercase md:text-3xl">Badman Kombat</div></div>
            <div className="rounded-sm border border-white/10 bg-black/45 px-3 py-2 text-right backdrop-blur"><div className="text-[9px] uppercase tracking-[.3em] text-[#53c9d8]">{qualityLabel} · {phase}</div><div className="mt-1 max-w-[220px] text-[9px] text-white/45">{assetStatus}</div></div>
          </header>

          <div className="pointer-events-none absolute bottom-5 left-4 right-4 z-20 grid grid-cols-[1fr_auto_1fr] items-end gap-3 md:bottom-8 md:left-8 md:right-8">
            <div><div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-[.2em]"><span>Leroy</span><span>{playerHealth}</span></div><div className="h-2 bg-black/70 ring-1 ring-white/10"><div className="h-full bg-[#d58c3c] transition-all" style={{ width: `${playerHealth}%` }} /></div></div>
            <div className="pb-1 text-center text-[9px] uppercase tracking-[.3em] text-white/40">{phase === 'entrance' ? 'Approaching' : phase === 'fight' ? 'Round One' : 'K.O.'}</div>
            <div><div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-[.2em]"><span>{enemyHealth}</span><span>Marcus</span></div><div className="h-2 bg-black/70 ring-1 ring-white/10"><div className="ml-auto h-full bg-[#6e241f] transition-all" style={{ width: `${enemyHealth}%` }} /></div></div>
          </div>

          {phase === 'entrance' && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"><div className="mt-44 text-center"><div className="text-[9px] uppercase tracking-[.55em] text-[#d58c3c]">Some fights are won before the first strike</div><div className="mt-3 text-4xl font-black uppercase md:text-6xl">Enter The Pit</div></div></div>}

          {phase === 'fight' && (
            <div className="absolute inset-x-0 bottom-16 z-30 flex items-end justify-between px-4 md:hidden">
              <div className="grid grid-cols-3 gap-1">
                <span />
                <button onPointerDown={() => setMove('up', true)} onPointerUp={() => setMove('up', false)} onPointerCancel={() => setMove('up', false)} className="h-14 w-14 rounded-full border border-white/20 bg-black/45 text-xl backdrop-blur">↑</button>
                <span />
                <button onPointerDown={() => setMove('left', true)} onPointerUp={() => setMove('left', false)} onPointerCancel={() => setMove('left', false)} className="h-14 w-14 rounded-full border border-white/20 bg-black/45 text-xl backdrop-blur">←</button>
                <button onPointerDown={() => setMove('down', true)} onPointerUp={() => setMove('down', false)} onPointerCancel={() => setMove('down', false)} className="h-14 w-14 rounded-full border border-white/20 bg-black/45 text-xl backdrop-blur">↓</button>
                <button onPointerDown={() => setMove('right', true)} onPointerUp={() => setMove('right', false)} onPointerCancel={() => setMove('right', false)} className="h-14 w-14 rounded-full border border-white/20 bg-black/45 text-xl backdrop-blur">→</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onPointerDown={() => { inputRef.current.guard = true; }} onPointerUp={() => { inputRef.current.guard = false; }} onPointerCancel={() => { inputRef.current.guard = false; }} className="h-14 w-14 rounded-full border border-[#53c9d8]/60 bg-black/55 text-[10px] font-black uppercase tracking-wider">Guard</button>
                <button onPointerDown={() => { attackRef.current = 'light'; }} className="h-14 w-14 rounded-full border border-[#d58c3c]/70 bg-[#d58c3c]/20 text-[10px] font-black uppercase tracking-wider">Jab</button>
                <span />
                <button onPointerDown={() => { attackRef.current = 'heavy'; }} className="h-16 w-16 rounded-full border border-[#d58c3c] bg-[#d58c3c]/30 text-[10px] font-black uppercase tracking-wider">Heavy</button>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[9px] uppercase tracking-[.25em] text-white/35 md:block">WASD move · J light · K heavy · L guard</div>
        </>
      )}
    </main>
  );
}
