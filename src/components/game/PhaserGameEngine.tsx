import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { ENHANCED_FIGHTER_DATA } from '@/data/enhancedFighterData';

interface PhaserGameEngineProps {
  fighterData?: {
    player1: { id: string; name: string };
    player2: { id: string; name: string };
  };
}

// Motion input patterns for special moves
const MOTION_PATTERNS = {
  'QCF': ['down', 'down-forward', 'forward'], // Hadouken
  'QCB': ['down', 'down-back', 'back'],      // Tatsumaki
  'DP': ['forward', 'down', 'down-forward'], // Shoryuken
  'HCF': ['back', 'down-back', 'down', 'down-forward', 'forward'],
  'CHARGE_FORWARD': ['back', 'back', 'forward'], // Sonic Boom
};

interface InputBufferEntry {
  input: string;
  timestamp: number;
}

interface Projectile {
  sprite: Phaser.GameObjects.Sprite;
  velocity: number;
  damage: number;
  owner: number;
}

class FightingGameScene extends Phaser.Scene {
  private player1!: Phaser.GameObjects.Sprite;
  private player2!: Phaser.GameObjects.Sprite;
  private player1Health = 100;
  private player2Health = 100;
  private player1Meter = 0;
  private player2Meter = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;
  private player1PunchKey!: Phaser.Input.Keyboard.Key;
  private player1KickKey!: Phaser.Input.Keyboard.Key;
  private player2PunchKey!: Phaser.Input.Keyboard.Key;
  private player2KickKey!: Phaser.Input.Keyboard.Key;
  private healthBar1!: Phaser.GameObjects.Graphics;
  private healthBar2!: Phaser.GameObjects.Graphics;
  private meterBar1!: Phaser.GameObjects.Graphics;
  private meterBar2!: Phaser.GameObjects.Graphics;
  private timerText!: Phaser.GameObjects.Text;
  private roundTimer = 99;
  private timerEvent!: Phaser.Time.TimerEvent;
  private fighterData: any;
  private player1InputBuffer: InputBufferEntry[] = [];
  private player2InputBuffer: InputBufferEntry[] = [];
  private projectiles: Projectile[] = [];
  private specialMoveText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'FightingGameScene' });
  }

  init(data: any) {
    this.fighterData = data.fighterData || {
      player1: { id: 'leroy', name: 'LEROY' },
      player2: { id: 'jordan', name: 'JORDAN' }
    };
  }

  preload() {
    // Load fighter sprites
    const p1Data = ENHANCED_FIGHTER_DATA[this.fighterData.player1.id];
    const p2Data = ENHANCED_FIGHTER_DATA[this.fighterData.player2.id];

    // Load sprite sheets for both fighters
    this.load.spritesheet('player1', `/src/assets/${this.fighterData.player1.id}-sprite-sheet.png`, {
      frameWidth: 64,
      frameHeight: 64
    });

    this.load.spritesheet('player2', `/src/assets/${this.fighterData.player2.id}-sprite-sheet.png`, {
      frameWidth: 64,
      frameHeight: 64
    });

    // Load stage background
    this.load.image('stage', '/src/assets/kingston-street-scene-1.jpg');
  }

  create() {
    // Add background
    const bg = this.add.image(512, 288, 'stage');
    bg.setDisplaySize(1024, 576);
    bg.setAlpha(0.5);

    // Create ground
    const ground = this.add.rectangle(512, 500, 1024, 20, 0x444444);
    
    // Create players
    this.player1 = this.add.sprite(200, 450, 'player1', 0);
    this.player1.setScale(2);
    this.player1.setFlipX(false);

    this.player2 = this.add.sprite(824, 450, 'player2', 0);
    this.player2.setScale(2);
    this.player2.setFlipX(true);

    // Create animations
    this.createAnimations();

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.player1PunchKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.player1KickKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.player2PunchKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.player2KickKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);

    // Create UI
    this.createUI();

    // Start round timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }

  createAnimations() {
    // Player 1 animations
    this.anims.create({
      key: 'p1_idle',
      frames: this.anims.generateFrameNumbers('player1', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'p1_walk',
      frames: this.anims.generateFrameNumbers('player1', { start: 8, end: 13 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'p1_attack',
      frames: this.anims.generateFrameNumbers('player1', { start: 16, end: 19 }),
      frameRate: 15,
      repeat: 0
    });

    // Player 2 animations
    this.anims.create({
      key: 'p2_idle',
      frames: this.anims.generateFrameNumbers('player2', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'p2_walk',
      frames: this.anims.generateFrameNumbers('player2', { start: 8, end: 13 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'p2_attack',
      frames: this.anims.generateFrameNumbers('player2', { start: 16, end: 19 }),
      frameRate: 15,
      repeat: 0
    });

    // Start idle animations
    this.player1.play('p1_idle');
    this.player2.play('p2_idle');
  }

  createUI() {
    // Health bars background
    this.add.rectangle(150, 40, 264, 26, 0x000000, 0.5);
    this.add.rectangle(874, 40, 264, 26, 0x000000, 0.5);

    // Super meter bars background
    this.add.rectangle(150, 70, 264, 16, 0x000000, 0.5);
    this.add.rectangle(874, 70, 264, 16, 0x000000, 0.5);

    // Health bars
    this.healthBar1 = this.add.graphics();
    this.healthBar2 = this.add.graphics();
    this.meterBar1 = this.add.graphics();
    this.meterBar2 = this.add.graphics();
    this.updateHealthBars();

    // Player names
    this.add.text(20, 20, this.fighterData.player1.name, {
      fontSize: '20px',
      color: '#00ff00',
      fontFamily: 'Arial Black'
    });

    this.add.text(1004, 20, this.fighterData.player2.name, {
      fontSize: '20px',
      color: '#ff0000',
      fontFamily: 'Arial Black'
    }).setOrigin(1, 0);

    // Timer
    this.timerText = this.add.text(512, 30, '99', {
      fontSize: '48px',
      color: '#ffff00',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    // Special move text
    this.specialMoveText = this.add.text(512, 200, '', {
      fontSize: '32px',
      color: '#ffff00',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);

    // Controls hint
    this.add.text(20, 550, 'P1: WASD + J/K | QCF+P: Special', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    });

    this.add.text(1004, 550, 'P2: Arrows + 1/2 | QCF+P: Special', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setOrigin(1, 0);
  }

  updateHealthBars() {
    this.healthBar1.clear();
    this.healthBar1.fillStyle(0x00ff00);
    this.healthBar1.fillRect(20, 30, (this.player1Health / 100) * 260, 20);

    this.healthBar2.clear();
    this.healthBar2.fillStyle(0xff0000);
    const p2Width = (this.player2Health / 100) * 260;
    this.healthBar2.fillRect(1004 - p2Width, 30, p2Width, 20);

    // Update super meter bars
    this.meterBar1.clear();
    this.meterBar1.fillStyle(0x00ffff);
    this.meterBar1.fillRect(20, 60, (this.player1Meter / 100) * 260, 12);

    this.meterBar2.clear();
    this.meterBar2.fillStyle(0x00ffff);
    const m2Width = (this.player2Meter / 100) * 260;
    this.meterBar2.fillRect(1004 - m2Width, 60, m2Width, 12);
  }

  addToInputBuffer(player: number, input: string) {
    const buffer = player === 1 ? this.player1InputBuffer : this.player2InputBuffer;
    const now = this.time.now;
    
    buffer.push({ input, timestamp: now });
    
    // Keep only last 500ms of inputs
    const cutoff = now - 500;
    if (player === 1) {
      this.player1InputBuffer = buffer.filter(entry => entry.timestamp > cutoff);
    } else {
      this.player2InputBuffer = buffer.filter(entry => entry.timestamp > cutoff);
    }
  }

  getDirectionalInput(player: number): string {
    const keys = player === 1 ? this.wasdKeys : this.cursors;
    const directions: string[] = [];

    if (player === 1) {
      if (keys.W.isDown) directions.push('up');
      if (keys.S.isDown) directions.push('down');
      if (keys.A.isDown) directions.push('left');
      if (keys.D.isDown) directions.push('right');
    } else {
      if (keys.up?.isDown) directions.push('up');
      if (keys.down?.isDown) directions.push('down');
      if (keys.left?.isDown) directions.push('left');
      if (keys.right?.isDown) directions.push('right');
    }

    // Convert to fighting game notation
    const playerSprite = player === 1 ? this.player1 : this.player2;
    const facingRight = player === 1 ? !playerSprite.flipX : playerSprite.flipX;

    if (directions.includes('down') && directions.includes(facingRight ? 'right' : 'left')) {
      return 'down-forward';
    }
    if (directions.includes('down') && directions.includes(facingRight ? 'left' : 'right')) {
      return 'down-back';
    }
    if (directions.includes('down')) return 'down';
    if (directions.includes(facingRight ? 'right' : 'left')) return 'forward';
    if (directions.includes(facingRight ? 'left' : 'right')) return 'back';
    
    return 'neutral';
  }

  checkForSpecialMove(player: number): string | null {
    const buffer = player === 1 ? this.player1InputBuffer : this.player2InputBuffer;
    if (buffer.length < 3) return null;

    const recentInputs = buffer.slice(-10).map(entry => entry.input);

    // Check for motion patterns
    for (const [moveName, pattern] of Object.entries(MOTION_PATTERNS)) {
      let matchIndex = -1;
      for (let i = 0; i < pattern.length; i++) {
        const foundIndex = recentInputs.indexOf(pattern[i], matchIndex + 1);
        if (foundIndex === -1) break;
        matchIndex = foundIndex;
        if (i === pattern.length - 1) {
          return moveName;
        }
      }
    }

    return null;
  }

  createProjectile(x: number, y: number, direction: number, owner: number) {
    const projectile = this.add.sprite(x, y, 'player1', 20);
    projectile.setScale(1.5);
    projectile.setTint(owner === 1 ? 0x00ffff : 0xff00ff);

    this.projectiles.push({
      sprite: projectile,
      velocity: direction * 8,
      damage: 15,
      owner
    });

    // Add particle effect
    const particles = this.add.particles(x, y, 'player1', {
      frame: 20,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: owner === 1 ? 0x00ffff : 0xff00ff,
      lifespan: 300,
      frequency: 50
    });

    particles.startFollow(projectile);
  }

  showSpecialMoveText(moveName: string) {
    this.specialMoveText.setText(moveName + '!');
    this.specialMoveText.setAlpha(1);
    
    this.tweens.add({
      targets: this.specialMoveText,
      alpha: 0,
      y: 150,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.specialMoveText.y = 200;
      }
    });
  }

  updateTimer() {
    this.roundTimer--;
    this.timerText.setText(this.roundTimer.toString());
    
    if (this.roundTimer <= 0) {
      this.endRound();
    }
  }

  update() {
    // Track directional inputs for both players
    const p1Direction = this.getDirectionalInput(1);
    if (p1Direction !== 'neutral') {
      this.addToInputBuffer(1, p1Direction);
    }

    const p2Direction = this.getDirectionalInput(2);
    if (p2Direction !== 'neutral') {
      this.addToInputBuffer(2, p2Direction);
    }

    // Player 1 movement (WASD)
    let p1Moving = false;
    if (this.wasdKeys.A.isDown) {
      this.player1.x -= 3;
      this.player1.setFlipX(true);
      p1Moving = true;
    } else if (this.wasdKeys.D.isDown) {
      this.player1.x += 3;
      this.player1.setFlipX(false);
      p1Moving = true;
    }

    if (this.wasdKeys.W.isDown) {
      this.player1.y -= 3;
      p1Moving = true;
    } else if (this.wasdKeys.S.isDown) {
      this.player1.y += 3;
      p1Moving = true;
    }

    // Player 1 animation
    if (!this.player1.anims.isPlaying || this.player1.anims.currentAnim?.key !== 'p1_attack') {
      if (p1Moving) {
        if (this.player1.anims.currentAnim?.key !== 'p1_walk') {
          this.player1.play('p1_walk');
        }
      } else {
        if (this.player1.anims.currentAnim?.key !== 'p1_idle') {
          this.player1.play('p1_idle');
        }
      }
    }

    // Player 2 movement (Arrow Keys)
    let p2Moving = false;
    if (this.cursors.left?.isDown) {
      this.player2.x -= 3;
      this.player2.setFlipX(false);
      p2Moving = true;
    } else if (this.cursors.right?.isDown) {
      this.player2.x += 3;
      this.player2.setFlipX(true);
      p2Moving = true;
    }

    if (this.cursors.up?.isDown) {
      this.player2.y -= 3;
      p2Moving = true;
    } else if (this.cursors.down?.isDown) {
      this.player2.y += 3;
      p2Moving = true;
    }

    // Player 2 animation
    if (!this.player2.anims.isPlaying || this.player2.anims.currentAnim?.key !== 'p2_attack') {
      if (p2Moving) {
        if (this.player2.anims.currentAnim?.key !== 'p2_walk') {
          this.player2.play('p2_walk');
        }
      } else {
        if (this.player2.anims.currentAnim?.key !== 'p2_idle') {
          this.player2.play('p2_idle');
        }
      }
    }

    // Attack handling with special move detection
    if (Phaser.Input.Keyboard.JustDown(this.player1PunchKey)) {
      this.addToInputBuffer(1, 'punch');
      const specialMove = this.checkForSpecialMove(1);
      
      if (specialMove && this.player1Meter >= 25) {
        this.player1Meter -= 25;
        this.player1.play('p1_attack');
        const direction = this.player1.flipX ? -1 : 1;
        this.createProjectile(this.player1.x, this.player1.y, direction, 1);
        this.showSpecialMoveText(specialMove);
        this.updateHealthBars();
      } else {
        this.player1.play('p1_attack');
        this.checkHit(this.player1, this.player2, 1);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.player1KickKey)) {
      this.addToInputBuffer(1, 'kick');
      this.player1.play('p1_attack');
      this.checkHit(this.player1, this.player2, 1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.player2PunchKey)) {
      this.addToInputBuffer(2, 'punch');
      const specialMove = this.checkForSpecialMove(2);
      
      if (specialMove && this.player2Meter >= 25) {
        this.player2Meter -= 25;
        this.player2.play('p2_attack');
        const direction = this.player2.flipX ? 1 : -1;
        this.createProjectile(this.player2.x, this.player2.y, direction, 2);
        this.showSpecialMoveText(specialMove);
        this.updateHealthBars();
      } else {
        this.player2.play('p2_attack');
        this.checkHit(this.player2, this.player1, 2);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.player2KickKey)) {
      this.addToInputBuffer(2, 'kick');
      this.player2.play('p2_attack');
      this.checkHit(this.player2, this.player1, 2);
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.sprite.x += proj.velocity;

      // Check collision with players
      const target = proj.owner === 1 ? this.player2 : this.player1;
      const distance = Phaser.Math.Distance.Between(proj.sprite.x, proj.sprite.y, target.x, target.y);
      
      if (distance < 60) {
        if (proj.owner === 1) {
          this.player2Health -= proj.damage;
          this.player1Meter = Math.min(100, this.player1Meter + 10);
        } else {
          this.player1Health -= proj.damage;
          this.player2Meter = Math.min(100, this.player2Meter + 10);
        }
        
        this.updateHealthBars();
        this.cameras.main.shake(150, 0.01);
        proj.sprite.destroy();
        this.projectiles.splice(i, 1);
        
        if (this.player1Health <= 0 || this.player2Health <= 0) {
          this.endRound();
        }
        continue;
      }

      // Remove if off screen
      if (proj.sprite.x < -50 || proj.sprite.x > 1074) {
        proj.sprite.destroy();
        this.projectiles.splice(i, 1);
      }
    }

    // Boundary constraints
    this.player1.x = Phaser.Math.Clamp(this.player1.x, 50, 974);
    this.player1.y = Phaser.Math.Clamp(this.player1.y, 100, 480);
    this.player2.x = Phaser.Math.Clamp(this.player2.x, 50, 974);
    this.player2.y = Phaser.Math.Clamp(this.player2.y, 100, 480);
  }

  checkHit(attacker: Phaser.GameObjects.Sprite, defender: Phaser.GameObjects.Sprite, attackerNum: number) {
    const distance = Phaser.Math.Distance.Between(attacker.x, attacker.y, defender.x, defender.y);
    
    if (distance < 80) {
      const damage = 5;
      if (attackerNum === 1) {
        this.player2Health -= damage;
        this.player2Health = Math.max(0, this.player2Health);
        this.player1Meter = Math.min(100, this.player1Meter + 5);
      } else {
        this.player1Health -= damage;
        this.player1Health = Math.max(0, this.player1Health);
        this.player2Meter = Math.min(100, this.player2Meter + 5);
      }
      
      this.updateHealthBars();
      this.cameras.main.shake(100, 0.005);
      
      // Check for KO
      if (this.player1Health <= 0 || this.player2Health <= 0) {
        this.endRound();
      }
    }
  }

  endRound() {
    this.timerEvent.remove();
    
    const winner = this.player1Health > this.player2Health ? 
      this.fighterData.player1.name : this.fighterData.player2.name;
    
    const winText = this.add.text(512, 288, `${winner} WINS!`, {
      fontSize: '64px',
      color: '#ffff00',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.tweens.add({
      targets: winText,
      scale: { from: 0, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  }
}

export const PhaserGameEngine: React.FC<PhaserGameEngineProps> = ({ fighterData }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 576,
      parent: containerRef.current,
      backgroundColor: '#000000',
      scene: FightingGameScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(config);
    gameRef.current.scene.start('FightingGameScene', { fighterData });

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [fighterData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div 
        ref={containerRef} 
        className="rounded-lg shadow-2xl border-4 border-yellow-400/50"
        style={{ maxWidth: '1024px', width: '100%' }}
      />
    </div>
  );
};
