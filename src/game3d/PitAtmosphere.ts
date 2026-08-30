import * as THREE from 'three';

export class PitAtmosphere {
  readonly group = new THREE.Group();
  private rain?: THREE.Points;
  private rainPositions?: Float32Array;
  private motes?: THREE.Points;
  private signs: THREE.Mesh[] = [];
  private time = 0;

  constructor(private readonly quality: 'low' | 'medium' | 'high') {
    this.buildArchitecture();
    this.buildRain();
    this.buildMotes();
  }

  private buildArchitecture() {
    const concrete = new THREE.MeshStandardMaterial({ color: 0x191715, roughness: 0.96 });
    const zinc = new THREE.MeshStandardMaterial({ color: 0x343b3d, roughness: 0.62, metalness: 0.34 });
    const timber = new THREE.MeshStandardMaterial({ color: 0x2b1c12, roughness: 0.94 });

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 14.2;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 7.5, 0.7), concrete);
      pillar.position.set(Math.sin(a) * r, 3.2, Math.cos(a) * r);
      pillar.rotation.y = a;
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.group.add(pillar);
    }

    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.18;
      const sheet = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.1, 0.09), zinc);
      sheet.position.set(Math.sin(a) * 16.2, 4.8 + (i % 2) * 0.7, Math.cos(a) * 16.2);
      sheet.rotation.y = a;
      this.group.add(sheet);
    }

    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.78 });
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.66 });
    [-1, 1].forEach((side) => {
      const stack = new THREE.Group();
      for (let y = 0; y < 3; y++) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.45, 1.05), speakerMat);
        box.position.y = y * 1.38;
        stack.add(box);
        const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.06, 24), coneMat);
        cone.rotation.x = Math.PI / 2;
        cone.position.set(0, y * 1.38, 0.55);
        stack.add(cone);
      }
      stack.position.set(side * 7.7, 0.72, -7.2);
      stack.rotation.y = side * -0.16;
      this.group.add(stack);
    });

    const beam = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.34, 0.5), timber);
    beam.position.set(0, 6.8, -10.4);
    this.group.add(beam);

    this.addSign('KINGSTON', new THREE.Vector3(-5.5, 5.6, -10.05), 0xe89a42);
    this.addSign('1986', new THREE.Vector3(5.6, 5.6, -10.05), 0x4fcbd7);
  }

  private addSign(label: string, position: THREE.Vector3, color: number) {
    // Geometric sign plate; DOM typography remains in HUD to avoid texture dependencies.
    const material = new THREE.MeshStandardMaterial({ color: 0x0a0a09, emissive: color, emissiveIntensity: 0.28, roughness: 0.52 });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(label.length * 0.36 + 1.2, 0.62, 0.12), material);
    sign.position.copy(position);
    this.signs.push(sign);
    this.group.add(sign);
  }

  private buildRain() {
    if (this.quality === 'low') return;
    const count = this.quality === 'high' ? 1000 : 480;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 34;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x9bb7bd, size: 0.035, transparent: true, opacity: 0.34, depthWrite: false });
    this.rain = new THREE.Points(geometry, material);
    this.rainPositions = positions;
    this.group.add(this.rain);
  }

  private buildMotes() {
    const count = this.quality === 'high' ? 180 : 70;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = 0.3 + Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.motes = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xe0a45d, size: 0.028, transparent: true, opacity: 0.22, depthWrite: false }));
    this.group.add(this.motes);
  }

  update(dt: number, combatIntensity: number) {
    this.time += dt;
    if (this.rain && this.rainPositions) {
      for (let i = 1; i < this.rainPositions.length; i += 3) {
        this.rainPositions[i] -= dt * 10.5;
        if (this.rainPositions[i] < 0) this.rainPositions[i] = 10 + Math.random() * 4;
      }
      this.rain.geometry.attributes.position.needsUpdate = true;
    }
    if (this.motes) {
      this.motes.rotation.y += dt * 0.018;
      const material = this.motes.material as THREE.PointsMaterial;
      material.opacity = 0.18 + combatIntensity * 0.12;
    }
    this.signs.forEach((sign, index) => {
      const material = sign.material as THREE.MeshStandardMaterial;
      const flicker = Math.sin(this.time * (5.4 + index) + index * 1.7) > 0.92 ? 0.12 : 0;
      material.emissiveIntensity = 0.24 + combatIntensity * 0.18 + flicker;
    });
  }

  dispose() {
    this.group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh && !(o instanceof THREE.Points)) return;
      const drawable = o as THREE.Mesh | THREE.Points;
      drawable.geometry?.dispose();
      const materials = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
      materials.forEach((m) => m?.dispose());
    });
  }
}
