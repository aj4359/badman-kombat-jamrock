import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Target, Users, Trophy, Volume2, VolumeX, Zap, MapPin, Swords } from 'lucide-react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';

interface Fighter {
  id: string;
  name: string;
  role: string;
  color: string;
  lore: string;
}

interface Arena {
  id: string;
  name: string;
  description: string;
  color: string;
}

const FIGHTERS: Fighter[] = [
  {
    id: 'leroy',
    name: 'Leroy "Tek-9" King',
    role: 'Tank',
    color: '#00ff00',
    lore: 'Project CYBER YARD survivor with cybernetic enhancements'
  },
  {
    id: 'jordan',
    name: 'Jordan Sound Master',
    role: 'DPS',
    color: '#ffaa00',
    lore: 'Dancehall specialist who weaponizes sound waves'
  },
  {
    id: 'sifu',
    name: 'Sifu Drone 09',
    role: 'Support',
    color: '#ff0000',
    lore: 'Corrupted cyber-monk seeking redemption'
  },
  {
    id: 'razor',
    name: 'Razor Cyber Samurai',
    role: 'DPS',
    color: '#00ffff',
    lore: 'Blade master from the digital underworld'
  },
  {
    id: 'asha',
    name: 'Asha Spear Maiden',
    role: 'DPS',
    color: '#ff00ff',
    lore: 'Lightning warrior channeling ancient power'
  },
  {
    id: 'rootsman',
    name: 'Rootsman Nature Voice',
    role: 'Flanker',
    color: '#00ff88',
    lore: 'Guardian of nature in a corrupted world'
  }
];

const ARENAS: Arena[] = [
  {
    id: 'kingston',
    name: 'Downtown Kingston Dockyard',
    description: 'Rain-soaked streets with VHS aesthetic',
    color: '#1a1a2e'
  },
  {
    id: 'mountains',
    name: 'Blue Mountains Shrine',
    description: 'Mystical temple with glowing glyphs',
    color: '#0f3460'
  },
  {
    id: 'negril',
    name: 'Negril Sunset Battlefield',
    description: 'Tropical combat zone at golden hour',
    color: '#533483'
  }
];

const VOICE_LINES = [
  'RASSCLAART!',
  'BOMBOCLAART!',
  'YUH DUN KNOW!',
  'WICKED!',
  'BIG UP!',
  'FORWARD!'
];

const BadManKombatUltimate3D = () => {
  const [gameState, setGameState] = useState<'menu' | 'select' | 'arena' | 'fight'>('menu');
  const [selectedHero, setSelectedHero] = useState<Fighter | null>(null);
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const enemyRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const keyStates = useRef(new Set<string>());
  const inputBuffer = useRef<{ key: string; time: number }[]>([]);
  
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [playerSuper, setPlayerSuper] = useState(0);
  const [comboText, setComboText] = useState('');
  const [comboCount, setComboCount] = useState(0);
  const [showShout, setShowShout] = useState(false);
  const [currentShout, setCurrentShout] = useState('');

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Arena-specific lighting and background
    const arenaColor = selectedArena?.color || '#1a1a2e';
    scene.background = new THREE.Color(arenaColor);
    scene.fog = new THREE.Fog(arenaColor, 10, 50);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Player (superhero-style character)
    const playerGeometry = new THREE.BoxGeometry(1, 2, 0.5);
    const playerMaterial = new THREE.MeshStandardMaterial({
      color: selectedHero?.color || '#00ff00',
      emissive: selectedHero?.color || '#00ff00',
      emissiveIntensity: 0.3
    });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(-5, 1, 0);
    scene.add(player);

    // Enemy
    const enemyGeometry = new THREE.BoxGeometry(1, 2, 0.5);
    const enemyMaterial = new THREE.MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 0.3
    });
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.set(5, 1, 0);
    scene.add(enemy);

    // Camera position
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 1, 0);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    playerRef.current = player;
    enemyRef.current = enemy;
  }, [selectedHero, selectedArena]);

  // Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !playerRef.current) {
      return;
    }

    // Handle movement
    const moveSpeed = 0.1;
    if (keyStates.current.has('w')) playerRef.current.position.z -= moveSpeed;
    if (keyStates.current.has('s')) playerRef.current.position.z += moveSpeed;
    if (keyStates.current.has('a')) playerRef.current.position.x -= moveSpeed;
    if (keyStates.current.has('d')) playerRef.current.position.x += moveSpeed;

    // Keep player in bounds
    playerRef.current.position.x = Math.max(-10, Math.min(10, playerRef.current.position.x));
    playerRef.current.position.z = Math.max(-10, Math.min(10, playerRef.current.position.z));

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Input handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    keyStates.current.add(key);
    
    // Add to input buffer for combo detection
    inputBuffer.current.push({ key, time: Date.now() });
    if (inputBuffer.current.length > 10) {
      inputBuffer.current.shift();
    }

    // Attack buttons
    if (key === 'j') {
      // Punch/Special
      const damage = 10;
      setEnemyHealth(prev => Math.max(0, prev - damage));
      setPlayerSuper(prev => Math.min(100, prev + 5));
      setComboCount(prev => prev + 1);
      setComboText('HIT!');
      
      // Random voice line
      if (audioEnabled) {
        const shout = VOICE_LINES[Math.floor(Math.random() * VOICE_LINES.length)];
        setCurrentShout(shout);
        setShowShout(true);
        setTimeout(() => setShowShout(false), 1000);
      }
    }

    if (key === 'k' && playerSuper >= 100) {
      // Super move
      const damage = 30;
      setEnemyHealth(prev => Math.max(0, prev - damage));
      setPlayerSuper(0);
      setComboCount(prev => prev + 3);
      setComboText('SUPER MOVE!');
      
      if (audioEnabled) {
        setCurrentShout('BOMBOCLAART!');
        setShowShout(true);
        setTimeout(() => setShowShout(false), 2000);
      }
    }
  }, [audioEnabled, playerSuper]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keyStates.current.delete(e.key.toLowerCase());
  }, []);

  // Start fight
  const startFight = useCallback(() => {
    setGameState('fight');
    setPlayerHealth(100);
    setEnemyHealth(100);
    setPlayerSuper(0);
    setComboCount(0);
    initScene();
    animate();
  }, [initScene, animate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Event listeners
  useEffect(() => {
    if (gameState === 'fight') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [gameState, handleKeyDown, handleKeyUp]);

  // Reset combo text
  useEffect(() => {
    if (comboText) {
      const timer = setTimeout(() => setComboText(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [comboText]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden relative">
      {/* Menu */}
      {gameState === 'menu' && (
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 animate-pulse">
            BADMAN KOMBAT ULTIMATE 3D
          </h1>
          <p className="text-xl text-center max-w-2xl">
            1980s Kingston Underground Tournament • Project CYBER YARD
          </p>
          <div className="flex gap-4">
            <Button onClick={() => setGameState('select')} className="text-2xl p-8">
              <Swords className="mr-2" /> START FIGHT
            </Button>
          </div>
        </div>
      )}

      {/* Fighter Selection */}
      {gameState === 'select' && (
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
          <h2 className="text-4xl font-bold">SELECT YOUR FIGHTER</h2>
          <div className="grid grid-cols-3 gap-6 max-w-6xl">
            {FIGHTERS.map(fighter => (
              <button
                key={fighter.id}
                onClick={() => {
                  setSelectedHero(fighter);
                  setGameState('arena');
                }}
                className="p-6 bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-yellow-400 transition-all transform hover:scale-105"
                style={{ borderColor: selectedHero?.id === fighter.id ? fighter.color : undefined }}
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center text-6xl"
                     style={{ backgroundColor: fighter.color }}>
                  👊
                </div>
                <h3 className="text-xl font-bold mb-2">{fighter.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{fighter.role}</p>
                <p className="text-xs text-gray-500">{fighter.lore}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Arena Selection */}
      {gameState === 'arena' && (
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
          <h2 className="text-4xl font-bold">SELECT ARENA</h2>
          <div className="grid grid-cols-3 gap-6 max-w-6xl">
            {ARENAS.map(arena => (
              <button
                key={arena.id}
                onClick={() => {
                  setSelectedArena(arena);
                  startFight();
                }}
                className="p-6 bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-yellow-400 transition-all transform hover:scale-105"
                style={{ backgroundColor: arena.color }}
              >
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{arena.name}</h3>
                <p className="text-sm text-gray-400">{arena.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fight Screen */}
      {gameState === 'fight' && (
        <>
          <div ref={mountRef} className="absolute inset-0" />
          
          {/* HUD */}
          <div className="absolute top-0 left-0 right-0 p-4 z-10">
            {/* Health Bars */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 mr-4">
                <div className="text-sm mb-1">{selectedHero?.name}</div>
                <div className="h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-green-500">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${playerHealth}%` }}
                  />
                </div>
              </div>
              <div className="flex-1 ml-4">
                <div className="text-sm mb-1 text-right">Enemy</div>
                <div className="h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-red-500">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300 ml-auto"
                    style={{ width: `${enemyHealth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Super Meter */}
            <div className="max-w-md mx-auto">
              <div className="text-xs mb-1 text-center">SUPER METER</div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-yellow-500">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${playerSuper}%` }}
                />
              </div>
            </div>
          </div>

          {/* Combo Counter */}
          {comboCount > 0 && (
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-yellow-400 animate-bounce">
              {comboCount} HIT COMBO!
            </div>
          )}

          {/* Combo Text */}
          {comboText && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-red-500 animate-pulse">
              {comboText}
            </div>
          )}

          {/* Voice Shout */}
          {showShout && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-yellow-400 animate-ping">
              {currentShout}
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-4 bg-black/50 p-4 rounded-lg text-sm">
            <div>WASD - Move</div>
            <div>J - Punch/Special</div>
            <div>K - Super (100%)</div>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="absolute bottom-4 right-4 p-4 bg-black/50 rounded-lg hover:bg-black/70"
          >
            {audioEnabled ? <Volume2 /> : <VolumeX />}
          </button>
        </>
      )}
    </div>
  );
};

export default BadManKombatUltimate3D;

