import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type FighterRig = {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  health: number;
  hitFlash: number;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function makeMaterial(color: number, roughness = 0.62, metalness = 0.03) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function shadow(mesh: THREE.Object3D) {
  mesh.traverse((child) => {
    const m = child as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
}

function createFighter(opts: {
  skin: number;
  shirt: number;
  trousers: number;
  accent: number;
  scale?: number;
}) : FighterRig {
  const root = new THREE.Group();
  const scale = opts.scale ?? 1;
  root.scale.setScalar(scale);

  const skin = makeMaterial(opts.skin, 0.78, 0.0);
  const shirt = makeMaterial(opts.shirt, 0.48, 0.05);
  const trousers = makeMaterial(opts.trousers, 0.72, 0.02);
  const accent = makeMaterial(opts.accent, 0.38, 0.08);
  const shoe = makeMaterial(0x090909, 0.32, 0.18);

  const torso = new THREE.Group();
  torso.position.y = 2.75;
  root.add(torso);

  const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.78, 1.0, 8, 18), shirt);
  chest.scale.set(1.34, 1.05, 0.8);
  torso.add(chest);

  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.68, 0.62, 20), trousers);
  waist.position.y = -0.92;
  torso.add(waist);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.065, 10, 28), accent);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = -0.66;
  torso.add(belt);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.31, 0.42, 18), skin);
  neck.position.y = 1.02;
  torso.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.43, 24, 18), skin);
  head.scale.set(0.9, 1.08, 0.9);
  head.position.y = 1.48;
  torso.add(head);

  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.08), makeMaterial(0x15100d, 0.9));
  brow.position.set(0, 1.6, 0.37);
  torso.add(brow);

  const makeArm = (side: number) => {
    const arm = new THREE.Group();
    arm.position.set(side * 1.03, 0.45, 0);
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 14), shirt);
    shoulder.scale.set(1.05, 1.25, 1.0);
    arm.add(shoulder);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.62, 8, 14), skin);
    upper.position.y = -0.58;
    upper.rotation.z = side * 0.06;
    arm.add(upper);
    const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.21, 0.58, 8, 14), skin);
    fore.position.y = -1.22;
    arm.add(fore);
    const fist = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.5), skin);
    fist.position.y = -1.72;
    arm.add(fist);
    torso.add(arm);
    return arm;
  };

  const leftArm = makeArm(-1);
  const rightArm = makeArm(1);

  const makeLeg = (side: number) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.38, 1.73, 0);
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.31, 0.92, 8, 16), trousers);
    thigh.position.y = -0.58;
    leg.add(thigh);
    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.86, 8, 16), trousers);
    shin.position.y = -1.55;
    leg.add(shin);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.3, 0.88), shoe);
    foot.position.set(0, -2.14, 0.18);
    leg.add(foot);
    root.add(leg);
    return leg;
  };

  const leftLeg = makeLeg(-1);
  const rightLeg = makeLeg(1);

  shadow(root);
  return { root, torso, head, leftArm, rightArm, leftLeg, rightLeg, health: 100, hitFlash: 0 };
}

function addArena(scene: THREE.Scene) {
  const floorMat = makeMaterial(0x7d684d, 0.93, 0.0);
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(8.8, 9.2, 0.45, 64), floorMat);
  floor.position.y = -0.28;
  floor.receiveShadow = true;
  scene.add(floor);

  const wallMat = makeMaterial(0x30261e, 0.92, 0.0);
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2;
    const r = 9.1;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.2, 0.32), wallMat);
    wall.position.set(Math.sin(a) * r, 0.9, Math.cos(a) * r);
    wall.rotation.y = a;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
  }

  const crowdMat = makeMaterial(0x101010, 0.98, 0.0);
  for (let tier = 0; tier < 3; tier++) {
    const radius = 10.5 + tier * 1.45;
    for (let i = 0; i < 72; i++) {
      if ((i + tier) % 3 === 0) continue;
      const a = (i / 72) * Math.PI * 2;
      const person = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.62, 4, 8), crowdMat);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), crowdMat);
      head.position.y = 0.55;
      person.add(body, head);
      person.position.set(Math.sin(a) * radius, 2.2 + tier * 1.7, Math.cos(a) * radius);
      person.rotation.y = a + Math.PI;
      scene.add(person);
    }
  }

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(9.65, 0.08, 8, 96),
    new THREE.MeshStandardMaterial({ color: 0xd59a47, emissive: 0x5b3714, emissiveIntensity: 0.25 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 2.3;
  scene.add(ring);
}

export default function NextGenFight() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [phase, setPhase] = useState<'entrance' | 'fight' | 'ko'>('entrance');
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080909);
    scene.fog = new THREE.FogExp2(0x120d09, 0.032);

    const camera = new THREE.PerspectiveCamera(43, mount.clientWidth / mount.clientHeight, 0.1, 120);
    camera.position.set(0, 4.7, 9.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0x6a7b89, 0x2b1609, 1.2);
    scene.add(hemi);
    const key = new THREE.SpotLight(0xffc875, 150, 28, Math.PI / 5, 0.55, 1.1);
    key.position.set(-4, 10, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536);
    scene.add(key);
    const rim = new THREE.SpotLight(0x8aa8ff, 85, 24, Math.PI / 4, 0.7, 1.2);
    rim.position.set(7, 6, -6);
    scene.add(rim);

    addArena(scene);

    const player = createFighter({ skin: 0x5a2d1b, shirt: 0x3d1a54, trousers: 0xe9e2d8, accent: 0xb68b40, scale: 1.08 });
    player.root.position.set(0, 0, 4.25);
    player.root.rotation.y = Math.PI;
    scene.add(player.root);

    const enemy = createFighter({ skin: 0x9b6546, shirt: 0xd9dedc, trousers: 0x272727, accent: 0x6d1f1f, scale: 1.02 });
    enemy.root.position.set(0, 0, -4.0);
    scene.add(enemy.root);

    const clock = new THREE.Clock();
    const keys = new Set<string>();
    let attackT = 0;
    let enemyAttackT = 0;
    let localPhase: 'entrance' | 'fight' | 'ko' = 'entrance';
    let entranceT = 0;
    let comboLocal = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase());
      if (e.key === ' ' || e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'k') e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const strike = (heavy = false) => {
      if (localPhase !== 'fight' || attackT > 0) return;
      attackT = heavy ? 0.52 : 0.34;
      const distance = player.root.position.distanceTo(enemy.root.position);
      if (distance < 2.35) {
        const damage = heavy ? 18 : 9;
        enemy.health = clamp(enemy.health - damage, 0, 100);
        enemy.hitFlash = 0.16;
        enemy.root.position.z -= 0.18;
        comboLocal += 1;
        setCombo(comboLocal);
        setEnemyHealth(enemy.health);
        camera.position.x += heavy ? 0.18 : 0.08;
        if (enemy.health <= 0) {
          localPhase = 'ko';
          setPhase('ko');
        }
      } else {
        comboLocal = 0;
        setCombo(0);
      }
    };

    let previousJ = false;
    let previousK = false;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.elapsedTime;
      entranceT += dt;
      attackT = Math.max(0, attackT - dt);
      enemyAttackT = Math.max(0, enemyAttackT - dt);

      if (localPhase === 'entrance') {
        const t = clamp(entranceT / 8.5, 0, 1);
        player.root.position.z = THREE.MathUtils.lerp(5.6, 2.9, t);
        camera.position.set(
          Math.sin(t * Math.PI) * 1.15,
          THREE.MathUtils.lerp(4.2, 3.4, t),
          THREE.MathUtils.lerp(10.4, 7.0, t)
        );
        camera.lookAt(0, 2.5, THREE.MathUtils.lerp(0.5, -1.2, t));
        if (entranceT > 8.5) {
          localPhase = 'fight';
          setPhase('fight');
        }
      } else if (localPhase === 'fight') {
        const speed = keys.has('shift') ? 4.4 : 3.1;
        let dx = 0;
        let dz = 0;
        if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
        if (keys.has('d') || keys.has('arrowright')) dx += 1;
        if (keys.has('w') || keys.has('arrowup')) dz -= 1;
        if (keys.has('s') || keys.has('arrowdown')) dz += 1;
        const len = Math.hypot(dx, dz) || 1;
        player.root.position.x += (dx / len) * speed * dt;
        player.root.position.z += (dz / len) * speed * dt;
        player.root.position.x = clamp(player.root.position.x, -5.5, 5.5);
        player.root.position.z = clamp(player.root.position.z, -1.7, 5.2);

        const j = keys.has('j') || keys.has(' ');
        const k = keys.has('k');
        if (j && !previousJ) strike(false);
        if (k && !previousK) strike(true);
        previousJ = j;
        previousK = k;

        const toEnemy = enemy.root.position.clone().sub(player.root.position);
        const targetYaw = Math.atan2(toEnemy.x, toEnemy.z);
        player.root.rotation.y = targetYaw;
        enemy.root.rotation.y = targetYaw + Math.PI;

        const fightCenter = player.root.position.clone().lerp(enemy.root.position, 0.48);
        const desired = new THREE.Vector3(fightCenter.x + 0.2, 3.25, fightCenter.z + 8.1);
        camera.position.lerp(desired, 1 - Math.pow(0.001, dt));
        camera.lookAt(fightCenter.x, 2.25, fightCenter.z);

        const distance = player.root.position.distanceTo(enemy.root.position);
        if (distance > 2.0) {
          const dir = player.root.position.clone().sub(enemy.root.position).normalize();
          enemy.root.position.addScaledVector(dir, Math.min(dt * 1.25, distance - 2.0));
        } else if (enemyAttackT <= 0 && Math.sin(elapsed * 2.1) > 0.93) {
          enemyAttackT = 0.8;
          const guarding = keys.has('l');
          const damage = guarding ? 3 : 11;
          player.health = clamp(player.health - damage, 0, 100);
          player.hitFlash = 0.14;
          setPlayerHealth(player.health);
          comboLocal = 0;
          setCombo(0);
          if (player.health <= 0) {
            localPhase = 'ko';
            setPhase('ko');
          }
        }
      }

      const breathing = Math.sin(elapsed * 2.15) * 0.02;
      player.torso.position.y = 2.75 + breathing;
      enemy.torso.position.y = 2.75 + Math.sin(elapsed * 2.0 + 1.1) * 0.018;

      const attackPose = attackT > 0 ? Math.sin((attackT / 0.52) * Math.PI) : 0;
      player.rightArm.rotation.x = -attackPose * 1.65;
      player.rightArm.rotation.z = -attackPose * 0.55;
      enemy.rightArm.rotation.x = enemyAttackT > 0 ? -Math.sin((enemyAttackT / 0.8) * Math.PI) * 1.45 : 0;

      for (const fighter of [player, enemy]) {
        fighter.hitFlash = Math.max(0, fighter.hitFlash - dt);
        fighter.head.scale.set(0.9, 1.08 - fighter.hitFlash * 0.55, 0.9 + fighter.hitFlash * 0.45);
      }

      if (localPhase === 'ko') {
        const loser = player.health <= 0 ? player : enemy;
        loser.root.rotation.z = THREE.MathUtils.lerp(loser.root.rotation.z, -1.35, 0.035);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m?.dispose());
        }
      });
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#080909] text-[#e9dfc8]">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.24) 0,rgba(255,255,255,.24) 1px,transparent 1px,transparent 3px)' }} />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-5 md:p-8">
        <div>
          <div className="text-[10px] uppercase tracking-[.45em] text-[#d59a47]">Kingston · 1986 · The Pit</div>
          <div className="mt-1 text-2xl font-black tracking-tight md:text-4xl">BADMAN KOMBAT</div>
        </div>
        <div className="rounded border border-[#d59a47]/40 bg-black/55 px-3 py-2 text-right backdrop-blur">
          <div className="text-[10px] uppercase tracking-[.32em] text-[#d59a47]">{phase === 'entrance' ? 'Approaching' : phase === 'fight' ? 'Round One' : 'K.O.'}</div>
          <div className="mt-1 text-xs text-white/65">WASD move · J light · K heavy · L guard</div>
        </div>
      </header>

      <div className="pointer-events-none absolute bottom-6 left-5 right-5 z-20 grid grid-cols-[1fr_auto_1fr] items-end gap-4 md:bottom-8 md:left-8 md:right-8">
        <div>
          <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-[.22em]"><span>Leroy</span><span>{playerHealth}</span></div>
          <div className="h-2 overflow-hidden bg-black/60 ring-1 ring-white/15"><div className="h-full bg-[#d59a47] transition-[width] duration-150" style={{ width: `${playerHealth}%` }} /></div>
        </div>
        <div className="min-w-20 text-center">
          {combo > 1 && <div className="text-3xl font-black text-[#d59a47] drop-shadow-lg">{combo} HIT</div>}
          <div className="text-[10px] uppercase tracking-[.35em] text-white/50">BMK Vertical Slice</div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-[.22em]"><span>{enemyHealth}</span><span>Marcus</span></div>
          <div className="h-2 overflow-hidden bg-black/60 ring-1 ring-white/15"><div className="ml-auto h-full bg-[#7d2323] transition-[width] duration-150" style={{ width: `${enemyHealth}%` }} /></div>
        </div>
      </div>

      {phase === 'entrance' && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="mt-48 text-center">
            <div className="text-[10px] uppercase tracking-[.55em] text-[#d59a47]">Some fights are won before the first strike</div>
            <div className="mt-2 text-4xl font-black uppercase tracking-tight md:text-6xl">Enter the Pit</div>
          </div>
        </div>
      )}
    </div>
  );
}
