import { FighterData } from '@/types/gameTypes';

export const ENHANCED_FIGHTER_DATA: Record<string, FighterData> = {
  leroy: {
    id: 'leroy',
    name: 'Leroy "Digital Dread"',
    stats: {
      power: 85,
      speed: 90,
      defense: 75,
      walkSpeed: 4,
      jumpForce: -15
    },
    specialMoves: [
      {
        name: 'Digital Soundclash',
        input: 'down,down-right,right,punch',
        damage: 25,
        cost: 30,
        type: 'projectile',
        frames: { startup: 12, active: 8, recovery: 20 },
        effects: { type: 'stun', duration: 30 },
        projectile: {
          speed: 8,
          size: 40,
          range: 500,
          color: 'hsl(180, 100%, 50%)',
          type: 'soundwave'
        }
      },
      {
        name: 'Bass Uppercut',
        input: 'right,down,down-right,punch',
        damage: 30,
        cost: 25,
        type: 'melee',
        frames: { startup: 6, active: 4, recovery: 25 },
        effects: { type: 'launch', duration: 40 }
      }
    ],
    superMoves: [
      {
        name: 'Maximum Frequency',
        input: 'down,down-right,right,down,down-right,right,punch',
        damage: 60,
        cost: 100,
        type: 'projectile',
        frames: { startup: 20, active: 30, recovery: 40 },
        invulnerable: true,
        effects: { type: 'cinematic', duration: 120 }
      }
    ],
    voiceLines: [
      { trigger: 'special', text: 'DIGITAL CLASH!' },
      { trigger: 'super', text: 'MAXIMUM FREQUENCY!' },
      { trigger: 'victory', text: 'Sound system supremacy!' },
      { trigger: 'ko', text: 'The bass... drops...' }
    ],
    colors: {
      primary: 'hsl(180, 100%, 50%)',
      secondary: 'hsl(200, 80%, 60%)',
      aura: 'hsl(180, 100%, 50%)'
    }
  },

  jordan: {
    id: 'jordan',
    name: 'Jordan "Bassline Warrior"',
    stats: {
      power: 75,
      speed: 95,
      defense: 75,
      walkSpeed: 5,
      jumpForce: -16
    },
    specialMoves: [
      {
        name: 'Bass Drop Devastation',
        input: 'down,down-right,right,punch',
        damage: 28,
        cost: 32,
        type: 'projectile',
        frames: { startup: 14, active: 10, recovery: 22 },
        effects: { type: 'knockdown', duration: 45 },
        projectile: {
          speed: 6,
          size: 50,
          range: 400,
          color: 'hsl(270, 100%, 60%)',
          type: 'soundwave'
        }
      },
      {
        name: 'Rhythm Rush',
        input: 'right,right,punch',
        damage: 20,
        cost: 20,
        type: 'melee',
        frames: { startup: 8, active: 12, recovery: 15 },
        effects: { type: 'combo', duration: 30 }
      }
    ],
    superMoves: [
      {
        name: 'Sonic Boom Blast',
        input: 'down,down-left,left,down,down-left,left,punch',
        damage: 55,
        cost: 100,
        type: 'projectile',
        frames: { startup: 18, active: 25, recovery: 35 },
        effects: { type: 'wallbounce', duration: 60 }
      }
    ],
    voiceLines: [
      { trigger: 'special', text: 'Feel the bass!' },
      { trigger: 'super', text: 'SONIC BOOM!' },
      { trigger: 'victory', text: 'That\s how we do it!' },
      { trigger: 'ko', text: 'The rhythm... stops...' }
    ],
    colors: {
      primary: 'hsl(270, 100%, 60%)',
      secondary: 'hsl(280, 80%, 70%)',
      aura: 'hsl(270, 100%, 60%)'
    }
  },

  razor: {
    id: 'razor',
    name: 'Razor "Cyber Samurai"',
    stats: {
      power: 95,
      speed: 80,
      defense: 70,
      walkSpeed: 3.5,
      jumpForce: -14
    },
    specialMoves: [
      {
        name: 'Plasma Katana Slash',
        input: 'right,right,punch',
        damage: 30,
        cost: 35,
        type: 'melee',
        frames: { startup: 6, active: 4, recovery: 25 },
        effects: { type: 'stun', duration: 20 }
      },
      {
        name: 'Energy Projectile',
        input: 'down,down-right,right,kick',
        damage: 22,
        cost: 28,
        type: 'projectile',
        frames: { startup: 10, active: 6, recovery: 18 },
        projectile: {
          speed: 10,
          size: 30,
          range: 600,
          color: 'hsl(120, 100%, 50%)',
          type: 'energy'
        }
      }
    ],
    superMoves: [
      {
        name: 'Thousand Cuts',
        input: 'right,down,down-right,right,down,down-right,punch',
        damage: 70,
        cost: 100,
        type: 'melee',
        frames: { startup: 5, active: 45, recovery: 30 },
        invulnerable: true,
        effects: { type: 'cinematic', duration: 150 }
      }
    ],
    voiceLines: [
      { trigger: 'special', text: 'Blade of light!' },
      { trigger: 'super', text: 'THOUSAND CUTS!' },
      { trigger: 'victory', text: 'Honor in victory.' },
      { trigger: 'ko', text: 'The way... of the warrior...' }
    ],
    colors: {
      primary: 'hsl(120, 100%, 50%)',
      secondary: 'hsl(140, 80%, 60%)',
      aura: 'hsl(120, 100%, 50%)'
    }
  },

  sifu: {
    id: 'sifu',
    name: 'Sifu "Ancient Wisdom"',
    stats: {
      power: 90,
      speed: 85,
      defense: 95,
      walkSpeed: 3,
      jumpForce: -13
    },
    specialMoves: [
      {
        name: 'Five Point Palm Strike',
        input: 'right,right,punch',
        damage: 18,
        cost: 25,
        type: 'melee',
        frames: { startup: 4, active: 6, recovery: 20 },
        effects: { type: 'stun', duration: 90 }
      },
      {
        name: 'Chi Blast',
        input: 'down,down-right,right,punch',
        damage: 24,
        cost: 30,
        type: 'projectile',
        frames: { startup: 15, active: 8, recovery: 25 },
        projectile: {
          speed: 7,
          size: 35,
          range: 450,
          color: 'hsl(45, 100%, 50%)',
          type: 'energy'
        }
      }
    ],
    superMoves: [
      {
        name: 'Dragon Fist Fury',
        input: 'down,down-left,left,right,punch+kick',
        damage: 65,
        cost: 100,
        type: 'melee',
        frames: { startup: 8, active: 35, recovery: 25 },
        effects: { type: 'launch', duration: 80 }
      }
    ],
    voiceLines: [
      { trigger: 'special', text: 'Ancient power!' },
      { trigger: 'super', text: 'DRAGON FIST!' },
      { trigger: 'victory', text: 'Wisdom prevails.' },
      { trigger: 'ko', text: 'The student... becomes...' }
    ],
    colors: {
      primary: 'hsl(45, 100%, 50%)',
      secondary: 'hsl(30, 80%, 60%)',
      aura: 'hsl(45, 100%, 50%)'
    }
  },

  rootsman: {
    id: 'rootsman',
    name: 'Rootsman "Nature\s Voice"',
    stats: {
      power: 85,
      speed: 90,
      defense: 80,
      walkSpeed: 4.5,
      jumpForce: -16
    },
    specialMoves: [
      {
        name: 'Digital Root System',
        input: 'down,down-left,left,punch',
        damage: 20,
        cost: 28,
        type: 'grab',
        frames: { startup: 10, active: 15, recovery: 18 },
        effects: { type: 'stun', duration: 60 }
      },
      {
        name: 'Nature\s Fury',
        input: 'down,down-right,right,kick',
        damage: 26,
        cost: 32,
        type: 'projectile',
        frames: { startup: 12, active: 10, recovery: 20 },
        projectile: {
          speed: 9,
          size: 45,
          range: 500,
          color: 'hsl(120, 80%, 40%)',
          type: 'energy'
        }
      }
    ],
    superMoves: [
      {
        name: 'Gaia\s Wrath',
        input: 'down,down-right,right,down,down-left,left,punch',
        damage: 58,
        cost: 100,
        type: 'command',
        frames: { startup: 25, active: 40, recovery: 30 },
        effects: { type: 'knockdown', duration: 90 }
      }
    ],
    voiceLines: [
      { trigger: 'special', text: 'Feel nature\s power!' },
      { trigger: 'super', text: 'GAIA\S WRATH!' },
      { trigger: 'victory', text: 'One with nature.' },
      { trigger: 'ko', text: 'Return to... earth...' }
    ],
    colors: {
      primary: 'hsl(120, 80%, 40%)',
      secondary: 'hsl(100, 70%, 50%)',
      aura: 'hsl(120, 80%, 40%)'
    }
  }
};