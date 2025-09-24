import { Fighter, SpecialMove, SuperMove } from '@/types/gameTypes';

export interface CombatState {
  hitstun: number;
  blockstun: number;
  invulnerableFrames: number;
  comboCount: number;
  comboDamage: number;
  comboScaling: number;
  lastHitTimer: number;
}

export interface InputBuffer {
  sequence: string[];
  timestamp: number[];
  maxLength: number;
  windowMs: number;
}

export interface FrameData {
  startup: number;
  active: number;
  recovery: number;
  advantage: number;
  damage: number;
  hitstun: number;
  blockstun: number;
}

// Input command patterns for special moves
export const INPUT_COMMANDS = {
  QCF: ['down', 'down-right', 'right'], // Quarter Circle Forward
  QCB: ['down', 'down-left', 'left'],   // Quarter Circle Back
  DP: ['right', 'down', 'down-right'],  // Dragon Punch
  HCF: ['left', 'down-left', 'down', 'down-right', 'right'], // Half Circle Forward
  HCB: ['right', 'down-right', 'down', 'down-left', 'left'], // Half Circle Back
  CHARGE_DOWN: ['down', 'down', 'up'], // Charge down then up
  CHARGE_BACK: ['left', 'left', 'right'], // Charge back then forward
  DOUBLE_QCF: ['down', 'down-right', 'right', 'down', 'down-right', 'right'], // Super input
};

export class CombatSystem {
  private static readonly COMBO_TIMEOUT = 60; // frames
  private static readonly INPUT_BUFFER_SIZE = 10;
  private static readonly INPUT_WINDOW = 300; // ms

  static initializeCombatState(): CombatState {
    return {
      hitstun: 0,
      blockstun: 0,
      invulnerableFrames: 0,
      comboCount: 0,
      comboDamage: 0,
      comboScaling: 1.0,
      lastHitTimer: 0
    };
  }

  static initializeInputBuffer(): InputBuffer {
    return {
      sequence: [],
      timestamp: [],
      maxLength: this.INPUT_BUFFER_SIZE,
      windowMs: this.INPUT_WINDOW
    };
  }

  static updateCombatState(state: CombatState): CombatState {
    const newState = { ...state };
    
    // Decrease stun frames
    if (newState.hitstun > 0) newState.hitstun--;
    if (newState.blockstun > 0) newState.blockstun--;
    if (newState.invulnerableFrames > 0) newState.invulnerableFrames--;
    
    // Update combo timer
    if (newState.lastHitTimer > 0) {
      newState.lastHitTimer--;
      if (newState.lastHitTimer <= 0) {
        // Reset combo
        newState.comboCount = 0;
        newState.comboDamage = 0;
        newState.comboScaling = 1.0;
      }
    }
    
    return newState;
  }

  static addInputToBuffer(buffer: InputBuffer, input: string): InputBuffer {
    const now = Date.now();
    const newBuffer = { ...buffer };
    
    // Clean old inputs outside the window
    const validIndices: number[] = [];
    newBuffer.timestamp.forEach((timestamp, index) => {
      if (now - timestamp <= newBuffer.windowMs) {
        validIndices.push(index);
      }
    });
    
    newBuffer.sequence = validIndices.map(i => newBuffer.sequence[i]);
    newBuffer.timestamp = validIndices.map(i => newBuffer.timestamp[i]);
    
    // Add new input
    newBuffer.sequence.push(input);
    newBuffer.timestamp.push(now);
    
    // Limit buffer size
    if (newBuffer.sequence.length > newBuffer.maxLength) {
      newBuffer.sequence.shift();
      newBuffer.timestamp.shift();
    }
    
    return newBuffer;
  }

  static checkSpecialMoveInputs(
    buffer: InputBuffer, 
    fighter: Fighter
  ): SpecialMove | null {
    const sequence = buffer.sequence;
    
    for (const move of fighter.specialMoves) {
      if (this.matchesInputPattern(sequence, move.input)) {
        return move;
      }
    }
    
    return null;
  }

  static checkSuperMoveInputs(
    buffer: InputBuffer, 
    fighter: Fighter
  ): SuperMove | null {
    const sequence = buffer.sequence;
    
    for (const move of fighter.superMoves) {
      if (this.matchesInputPattern(sequence, move.input)) {
        return move;
      }
    }
    
    return null;
  }

  private static matchesInputPattern(sequence: string[], pattern: string): boolean {
    const patternParts = pattern.split(',').map(p => p.trim());
    
    // Check if the sequence ends with the required pattern
    if (sequence.length < patternParts.length) return false;
    
    const recentInputs = sequence.slice(-patternParts.length);
    
    for (let i = 0; i < patternParts.length; i++) {
      // Handle button combinations (e.g., "punch+kick")
      if (patternParts[i].includes('+')) {
        const buttons = patternParts[i].split('+');
        // For now, just check if any of the buttons match
        if (!buttons.some(button => recentInputs[i] === button)) {
          return false;
        }
      } else if (recentInputs[i] !== patternParts[i]) {
        return false;
      }
    }
    
    return true;
  }

  static calculateDamage(
    baseDamage: number, 
    combatState: CombatState,
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super' = 'medium'
  ): number {
    let finalDamage = baseDamage;
    
    // Apply combo scaling
    finalDamage *= combatState.comboScaling;
    
    // Different scaling for different attack types
    switch (attackType) {
      case 'light':
        finalDamage *= 0.8;
        break;
      case 'medium':
        finalDamage *= 1.0;
        break;
      case 'heavy':
        finalDamage *= 1.3;
        break;
      case 'special':
        finalDamage *= 1.5;
        break;
      case 'super':
        finalDamage *= 2.0;
        break;
    }
    
    return Math.floor(finalDamage);
  }

  static applyHit(
    attacker: Fighter,
    defender: Fighter,
    damage: number,
    hitstun: number,
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super' = 'medium'
  ): { attacker: Fighter; defender: Fighter } {
    const newAttacker = { ...attacker };
    const newDefender = { ...defender };
    
    // Update defender's combat state
    const finalDamage = this.calculateDamage(damage, newDefender.combatState, attackType);
    
    newDefender.health = Math.max(0, newDefender.health - finalDamage);
    newDefender.combatState.hitstun = hitstun;
    newDefender.combatState.lastHitTimer = this.COMBO_TIMEOUT;
    
    // Update combo system
    newDefender.combatState.comboCount++;
    newDefender.combatState.comboDamage += finalDamage;
    
    // Apply combo scaling (damage reduction for longer combos)
    const scalingFactor = Math.max(0.1, 1.0 - (newDefender.combatState.comboCount * 0.1));
    newDefender.combatState.comboScaling = scalingFactor;
    
    // Update attacker's meter
    const meterGain = this.calculateMeterGain(attackType, finalDamage);
    newAttacker.meter = Math.min(100, newAttacker.meter + meterGain);
    
    // Put defender in hurt state
    newDefender.state.current = 'hurt';
    newDefender.state.timer = hitstun;
    
    // Add frame advantage for attacker
    newAttacker.combatState.advantage = Math.max(0, hitstun - 5);
    
    return { attacker: newAttacker, defender: newDefender };
  }

  static applyBlock(
    attacker: Fighter,
    defender: Fighter,
    damage: number,
    blockstun: number
  ): { attacker: Fighter; defender: Fighter } {
    const newAttacker = { ...attacker };
    const newDefender = { ...defender };
    
    // Chip damage (small damage through block)
    const chipDamage = Math.floor(damage * 0.1);
    newDefender.health = Math.max(1, newDefender.health - chipDamage);
    
    // Apply blockstun
    newDefender.combatState.blockstun = blockstun;
    newDefender.state.current = 'blocking';
    newDefender.state.timer = blockstun;
    
    // Reset combo for defender
    newDefender.combatState.comboCount = 0;
    newDefender.combatState.comboDamage = 0;
    newDefender.combatState.comboScaling = 1.0;
    
    // Less meter gain for blocked attacks
    const meterGain = this.calculateMeterGain('light', chipDamage);
    newAttacker.meter = Math.min(100, newAttacker.meter + meterGain);
    
    // Frame disadvantage for attacker on block
    newAttacker.combatState.advantage = -(blockstun - 2);
    
    return { attacker: newAttacker, defender: newDefender };
  }

  private static calculateMeterGain(
    attackType: 'light' | 'medium' | 'heavy' | 'special' | 'super',
    damage: number
  ): number {
    const baseGain = damage * 0.3;
    
    switch (attackType) {
      case 'light': return baseGain * 0.5;
      case 'medium': return baseGain * 1.0;
      case 'heavy': return baseGain * 1.5;
      case 'special': return baseGain * 2.0;
      case 'super': return 0; // Supers don't gain meter
      default: return baseGain;
    }
  }

  static canAct(fighter: Fighter): boolean {
    const { hitstun, blockstun, invulnerableFrames } = fighter.combatState;
    return hitstun <= 0 && blockstun <= 0 && fighter.state.current !== 'hurt';
  }

  static canCancel(fighter: Fighter): boolean {
    return fighter.state.canCancel && this.canAct(fighter);
  }

  static isInvulnerable(fighter: Fighter): boolean {
    return fighter.combatState.invulnerableFrames > 0;
  }

  static getFrameAdvantage(fighter: Fighter): number {
    return fighter.combatState.advantage;
  }

  static createFrameData(
    startup: number,
    active: number,
    recovery: number,
    damage: number,
    hitstun: number,
    blockstun: number
  ): FrameData {
    return {
      startup,
      active,
      recovery,
      advantage: hitstun - recovery,
      damage,
      hitstun,
      blockstun
    };
  }

  // Predefined frame data for common attacks
  static readonly FRAME_DATA = {
    lightPunch: { startup: 3, active: 2, recovery: 6, damage: 8, hitstun: 8, blockstun: 4 },
    mediumPunch: { startup: 5, active: 3, recovery: 8, damage: 12, hitstun: 12, blockstun: 6 },
    heavyPunch: { startup: 8, active: 4, recovery: 15, damage: 18, hitstun: 18, blockstun: 10 },
    lightKick: { startup: 4, active: 3, recovery: 7, damage: 10, hitstun: 10, blockstun: 5 },
    mediumKick: { startup: 6, active: 4, recovery: 10, damage: 15, hitstun: 15, blockstun: 8 },
    heavyKick: { startup: 10, active: 5, recovery: 18, damage: 22, hitstun: 22, blockstun: 12 },
  };
}