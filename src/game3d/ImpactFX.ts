import * as THREE from 'three';

export class ImpactFX {
  readonly group = new THREE.Group();
  private particles: { mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; maxLife: number }[] = [];
  private flash?: THREE.PointLight;

  constructor(private readonly scene: THREE.Scene) {
    scene.add(this.group);
  }

  burst(position: THREE.Vector3, strength = 1) {
    const count = Math.round(5 + strength * 8);
    const geometry = new THREE.SphereGeometry(0.025 + strength * 0.008, 5, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0xd8a15b, transparent: true, opacity: 0.85 });
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geometry.clone(), material.clone());
      mesh.position.copy(position).add(new THREE.Vector3((Math.random() - 0.5) * 0.35, Math.random() * 0.45, (Math.random() - 0.5) * 0.35));
      this.group.add(mesh);
      const life = 0.16 + Math.random() * 0.22;
      this.particles.push({
        mesh,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 2.8, 1.2 + Math.random() * 2.6, (Math.random() - 0.5) * 2.8).multiplyScalar(0.7 + strength * 0.35),
        life,
        maxLife: life,
      });
    }
    if (this.flash) this.scene.remove(this.flash);
    this.flash = new THREE.PointLight(0xffb35b, 2.8 + strength * 4, 4.5, 2);
    this.flash.position.copy(position).add(new THREE.Vector3(0, 0.25, 0.4));
    this.scene.add(this.flash);
  }

  update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.velocity.y -= 5.2 * dt;
      p.mesh.position.addScaledVector(p.velocity, dt);
      const material = p.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, p.life / p.maxLife) * 0.82;
      p.mesh.scale.setScalar(0.65 + (1 - p.life / p.maxLife) * 1.8);
      if (p.life <= 0) {
        this.group.remove(p.mesh);
        p.mesh.geometry.dispose();
        material.dispose();
        this.particles.splice(i, 1);
      }
    }
    if (this.flash) {
      this.flash.intensity *= Math.pow(0.001, dt);
      if (this.flash.intensity < 0.03) {
        this.scene.remove(this.flash);
        this.flash.dispose();
        this.flash = undefined;
      }
    }
  }

  dispose() {
    this.particles.forEach((p) => {
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    });
    this.particles = [];
    if (this.flash) {
      this.scene.remove(this.flash);
      this.flash.dispose();
    }
    this.scene.remove(this.group);
  }
}
