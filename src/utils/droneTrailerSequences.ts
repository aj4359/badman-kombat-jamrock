import { DroneShotConfig } from '@/hooks/useDroneCamera';

export interface TrailerSequence {
  name: string;
  description: string;
  totalDuration: number;
  shots: DroneShotConfig[];
}

// 60-second epic trailer sequence
export const EPIC_TRAILER_SEQUENCE: TrailerSequence = {
  name: 'Epic Game Trailer',
  description: 'Cinematic 60-second trailer showcasing fighters, stages, and combat',
  totalDuration: 60000,
  shots: [
    {
      name: 'Aerial Establishing Shot',
      duration: 5000,
      zoom: 0.5,
      rotation: 0,
      elevation: 800,
      path: 'crane'
    },
    {
      name: 'Crane Down to Arena',
      duration: 4000,
      zoom: 0.7,
      rotation: -5,
      elevation: 400,
      path: 'crane'
    },
    {
      name: 'Fighter 1 Reveal',
      duration: 3000,
      zoom: 1.3,
      rotation: -3,
      elevation: 100
    },
    {
      name: 'Quick Pan to Fighter 2',
      duration: 2000,
      zoom: 1.3,
      rotation: 3,
      elevation: 100
    },
    {
      name: 'Wide Combat Shot',
      duration: 4000,
      zoom: 0.9,
      rotation: 0,
      elevation: 200
    },
    {
      name: 'Closeup Special Move',
      duration: 3000,
      zoom: 1.4,
      rotation: 8,
      elevation: 80
    },
    {
      name: 'Orbital Arena View',
      duration: 8000,
      zoom: 1.0,
      rotation: 0,
      elevation: 250,
      orbit: true,
      orbitSpeed: 0.4
    },
    {
      name: 'Dutch Angle Action',
      duration: 2500,
      zoom: 1.2,
      rotation: 15,
      elevation: 120
    },
    {
      name: 'Reverse Dutch',
      duration: 2500,
      zoom: 1.2,
      rotation: -15,
      elevation: 120
    },
    {
      name: 'Hero Moment Closeup',
      duration: 4000,
      zoom: 1.5,
      rotation: -5,
      elevation: 60
    },
    {
      name: 'Explosive Wide Shot',
      duration: 3000,
      zoom: 0.8,
      rotation: 0,
      elevation: 300
    },
    {
      name: 'Fast Orbit Finale',
      duration: 6000,
      zoom: 1.1,
      rotation: 0,
      elevation: 200,
      orbit: true,
      orbitSpeed: 0.8
    },
    {
      name: 'Final Aerial Pullout',
      duration: 5000,
      zoom: 0.5,
      rotation: 0,
      elevation: 900,
      path: 'crane'
    },
    {
      name: 'Title Card Hold',
      duration: 3000,
      zoom: 0.6,
      rotation: 0,
      elevation: 800
    }
  ]
};

// 30-second action-focused sequence
export const ACTION_SEQUENCE: TrailerSequence = {
  name: 'Action Highlight Reel',
  description: 'Fast-paced 30-second combat showcase',
  totalDuration: 30000,
  shots: [
    {
      name: 'Quick Establishing',
      duration: 2000,
      zoom: 0.7,
      rotation: 0,
      elevation: 400
    },
    {
      name: 'Fighter Intro Left',
      duration: 2000,
      zoom: 1.3,
      rotation: -5,
      elevation: 100
    },
    {
      name: 'Fighter Intro Right',
      duration: 2000,
      zoom: 1.3,
      rotation: 5,
      elevation: 100
    },
    {
      name: 'Combat Wide',
      duration: 3000,
      zoom: 1.0,
      rotation: 0,
      elevation: 200
    },
    {
      name: 'Rapid Fire Closeups',
      duration: 1500,
      zoom: 1.4,
      rotation: 10,
      elevation: 80
    },
    {
      name: 'Dutch Angle Hit',
      duration: 1500,
      zoom: 1.3,
      rotation: -12,
      elevation: 90
    },
    {
      name: 'Quick Orbit',
      duration: 5000,
      zoom: 1.1,
      rotation: 0,
      elevation: 180,
      orbit: true,
      orbitSpeed: 1.0
    },
    {
      name: 'Super Move Closeup',
      duration: 3000,
      zoom: 1.5,
      rotation: -8,
      elevation: 70
    },
    {
      name: 'Impact Wide',
      duration: 2000,
      zoom: 0.9,
      rotation: 0,
      elevation: 250
    },
    {
      name: 'Victory Pose',
      duration: 3000,
      zoom: 1.2,
      rotation: 0,
      elevation: 120
    },
    {
      name: 'Aerial Finale',
      duration: 4000,
      zoom: 0.6,
      rotation: 0,
      elevation: 700
    }
  ]
};

// 90-second cinematic showcase
export const CINEMATIC_SHOWCASE: TrailerSequence = {
  name: 'Cinematic Showcase',
  description: 'Full 90-second cinematic experience with story beats',
  totalDuration: 90000,
  shots: [
    {
      name: 'Opening Aerial',
      duration: 6000,
      zoom: 0.5,
      rotation: 0,
      elevation: 1000,
      path: 'bezier'
    },
    {
      name: 'Dramatic Descent',
      duration: 5000,
      zoom: 0.7,
      rotation: -3,
      elevation: 600,
      path: 'crane'
    },
    {
      name: 'Stage Atmosphere',
      duration: 4000,
      zoom: 0.9,
      rotation: 0,
      elevation: 300
    },
    {
      name: 'Fighter 1 Dramatic Reveal',
      duration: 5000,
      zoom: 1.4,
      rotation: -5,
      elevation: 100
    },
    {
      name: 'Slow Pan to Fighter 2',
      duration: 5000,
      zoom: 1.4,
      rotation: 5,
      elevation: 100
    },
    {
      name: 'Tension Wide Shot',
      duration: 4000,
      zoom: 1.0,
      rotation: 0,
      elevation: 200
    },
    {
      name: 'Combat Begins',
      duration: 3000,
      zoom: 1.1,
      rotation: 2,
      elevation: 150
    },
    {
      name: 'First Exchange',
      duration: 3000,
      zoom: 1.2,
      rotation: -2,
      elevation: 140
    },
    {
      name: 'Orbital Battle View',
      duration: 10000,
      zoom: 1.0,
      rotation: 0,
      elevation: 220,
      orbit: true,
      orbitSpeed: 0.3
    },
    {
      name: 'Special Move Build',
      duration: 4000,
      zoom: 1.3,
      rotation: 8,
      elevation: 90
    },
    {
      name: 'Special Move Impact',
      duration: 3000,
      zoom: 1.5,
      rotation: -10,
      elevation: 70
    },
    {
      name: 'Recovery Wide',
      duration: 3000,
      zoom: 0.9,
      rotation: 0,
      elevation: 280
    },
    {
      name: 'Counter Attack Dutch',
      duration: 2500,
      zoom: 1.3,
      rotation: 15,
      elevation: 110
    },
    {
      name: 'Intense Exchange',
      duration: 2500,
      zoom: 1.3,
      rotation: -15,
      elevation: 110
    },
    {
      name: 'Super Move Charge',
      duration: 4000,
      zoom: 1.4,
      rotation: -6,
      elevation: 80
    },
    {
      name: 'Ultimate Attack',
      duration: 5000,
      zoom: 1.6,
      rotation: 0,
      elevation: 50
    },
    {
      name: 'Explosion Wide',
      duration: 3000,
      zoom: 0.8,
      rotation: 0,
      elevation: 350
    },
    {
      name: 'Fast Victory Orbit',
      duration: 8000,
      zoom: 1.1,
      rotation: 0,
      elevation: 180,
      orbit: true,
      orbitSpeed: 0.7
    },
    {
      name: 'Winner Closeup',
      duration: 4000,
      zoom: 1.3,
      rotation: -3,
      elevation: 100
    },
    {
      name: 'Final Aerial Rise',
      duration: 6000,
      zoom: 0.5,
      rotation: 0,
      elevation: 950,
      path: 'crane'
    },
    {
      name: 'Title Card',
      duration: 5000,
      zoom: 0.6,
      rotation: 0,
      elevation: 850
    }
  ]
};

export const ALL_SEQUENCES = [
  EPIC_TRAILER_SEQUENCE,
  ACTION_SEQUENCE,
  CINEMATIC_SHOWCASE
];
