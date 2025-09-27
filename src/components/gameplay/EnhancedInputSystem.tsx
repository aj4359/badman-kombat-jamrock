import { useEffect, useRef, useCallback } from 'react';

interface InputMapping {
  [key: string]: string;
}

interface EnhancedInputSystemProps {
  onInput: (action: string, pressed: boolean, player: 1 | 2) => void;
  onCombo: (combo: string, player: 1 | 2) => void;
}

// High-performance input mappings optimized for 60fps fighting games
const PLAYER1_MAPPING: InputMapping = {
  'KeyA': 'left',
  'KeyD': 'right', 
  'KeyW': 'up',
  'KeyS': 'down',
  'KeyJ': 'punch',
  'KeyK': 'kick',
  'KeyL': 'block',
  'KeyI': 'special'
};

const PLAYER2_MAPPING: InputMapping = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'ArrowUp': 'up', 
  'ArrowDown': 'down',
  'Numpad1': 'punch',
  'Numpad2': 'kick',
  'Numpad3': 'block',
  'Numpad0': 'special'
};

// Street Fighter style motion inputs
const MOTION_PATTERNS = {
  'QCF': ['down', 'down-forward', 'forward'], // Quarter Circle Forward
  'QCB': ['down', 'down-back', 'back'],      // Quarter Circle Back  
  'HCF': ['back', 'down-back', 'down', 'down-forward', 'forward'], // Half Circle Forward
  'DP': ['forward', 'down', 'down-forward'], // Dragon Punch
  'RDP': ['back', 'down', 'down-back'],      // Reverse Dragon Punch
  'CHARGE': ['back', 'back', 'forward'],     // Charge motion
  '360': ['forward', 'down-forward', 'down', 'down-back', 'back', 'up-back', 'up', 'up-forward'] // Full circle
};

export const useEnhancedInputSystem = ({ onInput, onCombo }: EnhancedInputSystemProps) => {
  const keyStates = useRef<Set<string>>(new Set());
  const inputBuffer = useRef<{ [player: number]: Array<{ action: string; timestamp: number }> }>({
    1: [],
    2: []
  });
  const lastInputTime = useRef<{ [player: number]: number }>({ 1: 0, 2: 0 });

  // Convert directional inputs to fight stick notation
  const getDirectionalInput = useCallback((keys: Set<string>, player: 1 | 2): string => {
    const mapping = player === 1 ? PLAYER1_MAPPING : PLAYER2_MAPPING;
    const directions: string[] = [];
    
    // Check all directional keys
    for (const [key, action] of Object.entries(mapping)) {
      if (['left', 'right', 'up', 'down'].includes(action) && keys.has(key)) {
        directions.push(action);
      }
    }
    
    // Convert to fighting game notation
    if (directions.includes('down') && directions.includes('left')) return 'down-back';
    if (directions.includes('down') && directions.includes('right')) return 'down-forward';
    if (directions.includes('up') && directions.includes('left')) return 'up-back';
    if (directions.includes('up') && directions.includes('right')) return 'up-forward';
    if (directions.includes('down')) return 'down';
    if (directions.includes('up')) return 'up';
    if (directions.includes('left')) return 'back';
    if (directions.includes('right')) return 'forward';
    
    return 'neutral';
  }, []);

  // Add input to buffer with timestamp
  const addToInputBuffer = useCallback((action: string, player: 1 | 2) => {
    const now = performance.now();
    const buffer = inputBuffer.current[player];
    
    // Add new input
    buffer.push({ action, timestamp: now });
    
    // Clean old inputs (keep last 500ms for combo detection)
    const cutoff = now - 500;
    inputBuffer.current[player] = buffer.filter(input => input.timestamp > cutoff);
    
    lastInputTime.current[player] = now;
  }, []);

  // Check for combo patterns
  const checkCombos = useCallback((player: 1 | 2) => {
    const buffer = inputBuffer.current[player];
    if (buffer.length < 3) return;
    
    const recentInputs = buffer.slice(-8).map(input => input.action);
    
    // Check for motion patterns
    for (const [comboName, pattern] of Object.entries(MOTION_PATTERNS)) {
      if (pattern.every((move, index) => {
        const searchIndex = recentInputs.length - pattern.length + index;
        return searchIndex >= 0 && recentInputs[searchIndex] === move;
      })) {
        onCombo(comboName, player);
        return;
      }
    }
    
    // Check for button combinations
    const buttonSequence = recentInputs.filter(input => 
      ['punch', 'kick', 'block', 'special'].includes(input)
    ).slice(-3);
    
    if (buttonSequence.length >= 2) {
      const comboString = buttonSequence.join('+');
      onCombo(comboString, player);
    }
  }, [onCombo]);

  // High-performance keydown handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.code;
    
    // Prevent default for all game keys to avoid browser actions
    if (PLAYER1_MAPPING[key] || PLAYER2_MAPPING[key]) {
      event.preventDefault();
    }
    
    // Ignore if key already pressed (avoid repeat events)
    if (keyStates.current.has(key)) return;
    
    keyStates.current.add(key);
    
    // Determine player and action
    let player: 1 | 2 | null = null;
    let action: string | null = null;
    
    if (PLAYER1_MAPPING[key]) {
      player = 1;
      action = PLAYER1_MAPPING[key];
    } else if (PLAYER2_MAPPING[key]) {
      player = 2;
      action = PLAYER2_MAPPING[key];
    }
    
    if (player && action) {
      // Handle directional inputs specially
      if (['left', 'right', 'up', 'down'].includes(action)) {
        const directionalInput = getDirectionalInput(keyStates.current, player);
        addToInputBuffer(directionalInput, player);
        onInput(directionalInput, true, player);
      } else {
        addToInputBuffer(action, player);
        onInput(action, true, player);
      }
      
      // Check for combos after any input
      checkCombos(player);
    }
  }, [onInput, getDirectionalInput, addToInputBuffer, checkCombos]);

  // High-performance keyup handler  
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.code;
    
    if (keyStates.current.has(key)) {
      keyStates.current.delete(key);
      
      let player: 1 | 2 | null = null;
      let action: string | null = null;
      
      if (PLAYER1_MAPPING[key]) {
        player = 1;
        action = PLAYER1_MAPPING[key];
      } else if (PLAYER2_MAPPING[key]) {
        player = 2;
        action = PLAYER2_MAPPING[key];
      }
      
      if (player && action) {
        // Handle directional release
        if (['left', 'right', 'up', 'down'].includes(action)) {
          const directionalInput = getDirectionalInput(keyStates.current, player);
          onInput(directionalInput, false, player);
        } else {
          onInput(action, false, player);
        }
      }
    }
  }, [onInput, getDirectionalInput]);

  // Mobile input handling
  const handleMobileInput = useCallback((action: string, pressed: boolean, player: 1 | 2 = 1) => {
    if (pressed) {
      addToInputBuffer(action, player);
      checkCombos(player);
    }
    onInput(action, pressed, player);
  }, [onInput, addToInputBuffer, checkCombos]);

  // Setup keyboard listeners with optimal performance
  useEffect(() => {
    // Use passive listeners for better performance
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('keyup', handleKeyUp, { passive: false });
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Clear input buffer on component unmount
  useEffect(() => {
    return () => {
      inputBuffer.current = { 1: [], 2: [] };
      keyStates.current.clear();
    };
  }, []);

  return {
    handleMobileInput,
    getInputBuffer: (player: 1 | 2) => inputBuffer.current[player],
    clearInputBuffer: (player: 1 | 2) => { inputBuffer.current[player] = []; },
    getLastInputTime: (player: 1 | 2) => lastInputTime.current[player]
  };
};
