import { Fighter, SpecialMove, SuperMove } from '@/types/gameTypes';

export interface CombatState {
  hitstun: number;
  blockstun: number;
  comboCount: number;
  comboDamage: number;
  comboScaling: number;
  invulnerableFrames: number;
  lastHitBy: string | null;
}

export interface InputBuffer {
  inputs: Array<{ input: string; timestamp: number }>;
  windowMs: number;
}

export interface FrameData {
  startup: number;
  active: number;
  recovery: number;
  hitstun: number;
  blockstun: number;
  advantage: number;
}

// Input command patterns for special moves
export const INPUT_COMMANDS = {
  QCF: ['down', 'down-right', 'right'], // Quarter Circle Forward
  QCB: ['down', 'down-left', 'left'],   // Quarter Circle Back
  DP: ['right', 'down', 'down-right'],  // Dragon Punch
  HCF: ['left', 'down-left', 'down', 'down-right', 'right'], // Half Circle Forward
  HCB: ['right', 'down-right', 'down', 'down-left', 'left']  // Half Circle Back
};

export class CombatSystem {
  static initializeCombatState(): CombatState {
    return {
      hitstun: 0,
      blockstun: 0,
      comboCount: 0,
      comboDamage: 0,
      comboScaling: 1.0,
      invulnerableFrames: 0,
      lastHitBy: null
    };
  }

  static initializeInputBuffer(): InputBuffer {
    return {
      inputs: [],
      windowMs: 500
    };
  }

  static updateCombatState(state: CombatState): CombatState {
    return {
      ...state,
      hitstun: Math.max(0, state.hitstun - 1),
      blockstun: Math.max(0, state.blockstun - 1),
      invulnerableFrames: Math.max(0, state.invulnerableFrames - 1),
      // Combo decay after 60 frames
      comboCount: state.comboCount > 0 && state.hitstun === 0 ? 0 : state.comboCount
    };
  }

  static addInputToBuffer(buffer: InputBuffer, input: string): InputBuffer {
    const now = Date.now();
    const newInputs = [
      ...buffer.inputs.filter(i => now - i.timestamp < buffer.windowMs),
      { input, timestamp: now }
    ];

    return {
      ...buffer,
      inputs: newInputs.slice(-8) // Keep only last 8 inputs
    };
  }

  static checkSpecialMoveInputs(buffer: InputBuffer, fighter: Fighter): SpecialMove | null {
    const inputString = buffer.inputs.map(i => i.input).join(',');
    
    for (const move of fighter.specialMoves) {
      if (inputString.includes(move.input)) {
        return move;
      }
    }
    
    return null;
  }

  static checkSuperMoveInputs(buffer: InputBuffer, fighter: Fighter): SuperMove | null {
    const inputString = buffer.inputs.map(i => i.input).join(',');
    
    for (const move of fighter.superMoves) {
      if (inputString.includes(move.input)) {
        return move;
      }
    }
    
    return null;
  }

  static calculateDamage(
    baseDamage: number, 
    combatState: CombatState, 
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super'
  ): number {
    let damage = baseDamage;
    
    // Apply combo scaling
    if (combatState.comboCount > 0) {
      const scaling = Math.max(0.1, 1.0 - (combatState.comboCount * 0.1));
      damage *= scaling;
    }
    
    // Attack type modifiers
    const typeModifiers = {
      light: 0.8,
      medium: 1.0,
      heavy: 1.3,
      special: 1.5,
      super: 2.0
    };
    
    damage *= typeModifiers[attackType];
    
    return Math.floor(damage);
  }

  static applyHit(
    attacker: Fighter, 
    defender: Fighter, 
    damage: number, 
    hitstun: number, 
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super'
  ): { attacker: Fighter; defender: Fighter } {
    const actualDamage = this.calculateDamage(damage, defender.combatState, attackType);
    
    const newDefender = {
      ...defender,
      health: Math.max(0, defender.health - actualDamage),
      combatState: {
        ...defender.combatState,
        hitstun: hitstun,
        comboCount: defender.combatState.comboCount + 1,
        comboDamage: defender.combatState.comboDamage + actualDamage,
        lastHitBy: attacker.id
      },
      state: {
        ...defender.state,
        current: 'hurt' as const,
        timer: hitstun
      }
    };

    const newAttacker = {
      ...attacker,
      superMeter: Math.min(attacker.maxSuperMeter, attacker.superMeter + 5)
    };

    return { attacker: newAttacker, defender: newDefender };
  }

  static applyBlock(
    attacker: Fighter, 
    defender: Fighter, 
    damage: number, 
    blockstun: number
  ): { attacker: Fighter; defender: Fighter } {
    const chipDamage = Math.floor(damage * 0.1); // 10% chip damage
    
    const newDefender = {
      ...defender,
      health: Math.max(0, defender.health - chipDamage),
      combatState: {
        ...defender.combatState,
        blockstun: blockstun
      },
      state: {
        ...defender.state,
        current: 'blocking' as const,
        timer: blockstun
      }
    };

    const newAttacker = {
      ...attacker,
      superMeter: Math.min(attacker.maxSuperMeter, attacker.superMeter + 2)
    };

    return { attacker: newAttacker, defender: newDefender };
  }

  static canAct(fighter: Fighter): boolean {
    return fighter.combatState.hitstun === 0 && 
           fighter.combatState.blockstun === 0 &&
           (fighter.state.current === 'idle' || 
            fighter.state.current === 'walking' || 
            fighter.state.current === 'blocking');
  }

  static canCancel(fighter: Fighter): boolean {
    return fighter.state.canCancel && fighter.combatState.hitstun === 0;
  }

  static isInvulnerable(fighter: Fighter): boolean {
    return fighter.combatState.invulnerableFrames > 0;
  }

  static createFrameData(
    startup: number,
    active: number, 
    recovery: number,
    hitstun: number,
    blockstun: number,
    advantage: number
  ): FrameData {
    return {
      startup,
      active, 
      recovery,
      hitstun,
      blockstun,
      advantage
    };
  }

  // Pre-defined frame data for common attacks
  static FRAME_DATA = {
    lightPunch: this.createFrameData(3, 2, 6, 8, 6, 2),
    mediumPunch: this.createFrameData(5, 3, 8, 12, 8, 0),
    heavyPunch: this.createFrameData(8, 4, 12, 18, 12, -2),
    lightKick: this.createFrameData(4, 3, 7, 10, 7, 1),
    mediumKick: this.createFrameData(6, 3, 9, 14, 9, -1),
    heavyKick: this.createFrameData(10, 4, 14, 20, 14, -4)
  };
}