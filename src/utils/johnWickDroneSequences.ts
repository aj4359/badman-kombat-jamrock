import { DroneShotConfig } from '@/hooks/useDroneCamera';

export interface JohnWickTrailerSequence {
  name: string;
  description: string;
  totalDuration: number;
  shots: DroneShotConfig[];
}

export const JOHN_WICK_ACTION_SEQUENCE: JohnWickTrailerSequence = {
  name: 'John Wick Action',
  description: 'Fast-paced combat sequence with headshots and bullet time',
  totalDuration: 26000,
  shots: [
    {
      name: 'continental_establishing',
      duration: 3000,
      zoom: 0.8,
      rotation: 0,
      elevation: 100
    },
    {
      name: 'combat_orbit',
      duration: 8000,
      zoom: 1.2,
      rotation: 0,
      elevation: 40,
      orbit: true,
      orbitSpeed: 2
    },
    {
      name: 'headshot_closeup',
      duration: 2000,
      zoom: 2.5,
      rotation: 15,
      elevation: 20
    },
    {
      name: 'bullet_time',
      duration: 3000,
      zoom: 1.8,
      rotation: -30,
      elevation: 30
    },
    {
      name: 'rapid_fire',
      duration: 4000,
      zoom: 1.5,
      rotation: 8,
      elevation: 50
    },
    {
      name: 'crane_down',
      duration: 6000,
      zoom: 1.0,
      rotation: 0,
      elevation: 80,
      path: 'crane'
    }
  ]
};

export const JOHN_WICK_EPIC_SEQUENCE: JohnWickTrailerSequence = {
  name: 'John Wick Epic',
  description: 'Full cinematic 60-second John Wick trailer with all signature moments',
  totalDuration: 60000,
  shots: [
    {
      name: 'title_reveal',
      duration: 4000,
      zoom: 0.6,
      rotation: 0,
      elevation: 150
    },
    {
      name: 'hero_intro',
      duration: 3000,
      zoom: 1.4,
      rotation: -5,
      elevation: 50
    },
    {
      name: 'establishing_wide',
      duration: 5000,
      zoom: 0.7,
      rotation: 0,
      elevation: 120
    },
    {
      name: 'combat_begin',
      duration: 6000,
      zoom: 1.3,
      rotation: 0,
      elevation: 60,
      orbit: true,
      orbitSpeed: 1.5
    },
    {
      name: 'headshot_moment',
      duration: 2000,
      zoom: 2.8,
      rotation: 20,
      elevation: 15
    },
    {
      name: 'bullet_time_matrix',
      duration: 4000,
      zoom: 2.0,
      rotation: -25,
      elevation: 35
    },
    {
      name: 'rapid_assault',
      duration: 8000,
      zoom: 1.6,
      rotation: 10,
      elevation: 45,
      orbit: true,
      orbitSpeed: 2.5
    },
    {
      name: 'second_headshot',
      duration: 2000,
      zoom: 3.0,
      rotation: -15,
      elevation: 20
    },
    {
      name: 'final_combat',
      duration: 10000,
      zoom: 1.4,
      rotation: 5,
      elevation: 55
    },
    {
      name: 'victory_crane',
      duration: 8000,
      zoom: 0.9,
      rotation: 0,
      elevation: 100,
      path: 'crane'
    },
    {
      name: 'final_pose',
      duration: 8000,
      zoom: 1.2,
      rotation: 0,
      elevation: 40
    }
  ]
};

export const ALL_JOHN_WICK_SEQUENCES: JohnWickTrailerSequence[] = [
  JOHN_WICK_ACTION_SEQUENCE,
  JOHN_WICK_EPIC_SEQUENCE
];
