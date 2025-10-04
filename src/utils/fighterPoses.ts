/**
 * Procedural Animation Pose System for Geometric Fighters
 * Defines keyframe poses and interpolation for Street Fighter-style animations
 */

export interface Pose {
  // Body
  bodyOffsetY: number;
  bodyTilt: number;
  bodySquash: number; // Vertical scale factor
  
  // Head
  headOffsetX: number;
  headOffsetY: number;
  headTilt: number;
  
  // Arms
  leftArmAngle: number;
  leftArmExtension: number;
  rightArmAngle: number;
  rightArmExtension: number;
  
  // Legs
  leftLegOffsetY: number;
  leftLegBend: number;
  rightLegOffsetY: number;
  rightLegBend: number;
}

export const DEFAULT_POSE: Pose = {
  bodyOffsetY: 0,
  bodyTilt: 0,
  bodySquash: 1.0,
  headOffsetX: 0,
  headOffsetY: 0,
  headTilt: 0,
  leftArmAngle: -30,
  leftArmExtension: 0,
  rightArmAngle: 30,
  rightArmExtension: 0,
  leftLegOffsetY: 0,
  leftLegBend: 0,
  rightLegOffsetY: 0,
  rightLegBend: 0,
};

// Idle breathing animation - Enhanced with 8 frames for smooth motion
export const IDLE_POSES: Pose[] = [
  { ...DEFAULT_POSE, bodyOffsetY: 0, headOffsetY: 0 },
  { ...DEFAULT_POSE, bodyOffsetY: -1, headOffsetY: -1 },
  { ...DEFAULT_POSE, bodyOffsetY: -2, headOffsetY: -1.5 },
  { ...DEFAULT_POSE, bodyOffsetY: -3, headOffsetY: -2 },
  { ...DEFAULT_POSE, bodyOffsetY: -4, headOffsetY: -2.5 },
  { ...DEFAULT_POSE, bodyOffsetY: -3, headOffsetY: -2 },
  { ...DEFAULT_POSE, bodyOffsetY: -2, headOffsetY: -1.5 },
  { ...DEFAULT_POSE, bodyOffsetY: -1, headOffsetY: -1 },
];

// Walking cycle - Enhanced with 10 frames for smoother movement
export const WALK_POSES: Pose[] = [
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -1,
    leftLegOffsetY: -18,
    rightLegOffsetY: 12,
    leftArmAngle: -50,
    rightArmAngle: 10,
    bodyTilt: 2,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -2,
    leftLegOffsetY: -15,
    rightLegOffsetY: 10,
    leftArmAngle: -45,
    rightArmAngle: 15,
    bodyTilt: 1,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -1,
    leftLegOffsetY: -8,
    rightLegOffsetY: 5,
    leftArmAngle: -35,
    rightArmAngle: 20,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: 0,
    leftLegOffsetY: 0,
    rightLegOffsetY: 0,
    leftArmAngle: -25,
    rightArmAngle: 25,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -1,
    leftLegOffsetY: 5,
    rightLegOffsetY: -8,
    leftArmAngle: -20,
    rightArmAngle: 35,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -2,
    leftLegOffsetY: 10,
    rightLegOffsetY: -15,
    leftArmAngle: -15,
    rightArmAngle: 45,
    bodyTilt: -1,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -1,
    leftLegOffsetY: 12,
    rightLegOffsetY: -18,
    leftArmAngle: -10,
    rightArmAngle: 50,
    bodyTilt: -2,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -1,
    leftLegOffsetY: 8,
    rightLegOffsetY: -12,
    leftArmAngle: -15,
    rightArmAngle: 40,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: 0,
    leftLegOffsetY: 0,
    rightLegOffsetY: 0,
    leftArmAngle: -25,
    rightArmAngle: 25,
  },
  {
    ...DEFAULT_POSE,
    bodyOffsetY: -1,
    leftLegOffsetY: -5,
    rightLegOffsetY: 8,
    leftArmAngle: -35,
    rightArmAngle: 20,
  },
];

// Light punch animation
export const LIGHT_PUNCH_POSES: Pose[] = [
  // Startup (frames 0-2)
  { ...DEFAULT_POSE, rightArmAngle: 30, rightArmExtension: -10 },
  { ...DEFAULT_POSE, rightArmAngle: 40, rightArmExtension: -15 },
  // Active (frames 3-5)
  { ...DEFAULT_POSE, rightArmAngle: 0, rightArmExtension: 60, bodyTilt: 5 },
  { ...DEFAULT_POSE, rightArmAngle: 0, rightArmExtension: 65, bodyTilt: 8 },
  { ...DEFAULT_POSE, rightArmAngle: 0, rightArmExtension: 60, bodyTilt: 5 },
  // Recovery (frames 6-10)
  { ...DEFAULT_POSE, rightArmAngle: 10, rightArmExtension: 40, bodyTilt: 3 },
  { ...DEFAULT_POSE, rightArmAngle: 20, rightArmExtension: 20 },
  { ...DEFAULT_POSE, rightArmAngle: 25, rightArmExtension: 10 },
  { ...DEFAULT_POSE, rightArmAngle: 30, rightArmExtension: 0 },
  { ...DEFAULT_POSE },
];

// Medium punch animation
export const MEDIUM_PUNCH_POSES: Pose[] = [
  // Startup
  { ...DEFAULT_POSE, rightArmAngle: 45, rightArmExtension: -20, bodyTilt: -5 },
  { ...DEFAULT_POSE, rightArmAngle: 50, rightArmExtension: -25, bodyTilt: -8 },
  { ...DEFAULT_POSE, rightArmAngle: 55, rightArmExtension: -30, bodyTilt: -10 },
  // Active
  { ...DEFAULT_POSE, rightArmAngle: -10, rightArmExtension: 80, bodyTilt: 15, bodySquash: 0.95 },
  { ...DEFAULT_POSE, rightArmAngle: -5, rightArmExtension: 85, bodyTilt: 18, bodySquash: 0.93 },
  { ...DEFAULT_POSE, rightArmAngle: 0, rightArmExtension: 80, bodyTilt: 15, bodySquash: 0.95 },
  // Recovery
  { ...DEFAULT_POSE, rightArmAngle: 10, rightArmExtension: 50, bodyTilt: 10 },
  { ...DEFAULT_POSE, rightArmAngle: 20, rightArmExtension: 30, bodyTilt: 5 },
  { ...DEFAULT_POSE, rightArmAngle: 25, rightArmExtension: 15 },
  { ...DEFAULT_POSE, rightArmAngle: 30, rightArmExtension: 5 },
  { ...DEFAULT_POSE },
];

// Heavy punch animation
export const HEAVY_PUNCH_POSES: Pose[] = [
  // Startup (wind-up)
  { ...DEFAULT_POSE, rightArmAngle: 60, rightArmExtension: -30, bodyTilt: -15 },
  { ...DEFAULT_POSE, rightArmAngle: 70, rightArmExtension: -35, bodyTilt: -20 },
  { ...DEFAULT_POSE, rightArmAngle: 80, rightArmExtension: -40, bodyTilt: -25 },
  { ...DEFAULT_POSE, rightArmAngle: 85, rightArmExtension: -45, bodyTilt: -28 },
  { ...DEFAULT_POSE, rightArmAngle: 90, rightArmExtension: -50, bodyTilt: -30 },
  // Active (massive extension)
  { ...DEFAULT_POSE, rightArmAngle: -20, rightArmExtension: 100, bodyTilt: 25, bodySquash: 0.9 },
  { ...DEFAULT_POSE, rightArmAngle: -15, rightArmExtension: 110, bodyTilt: 30, bodySquash: 0.88 },
  { ...DEFAULT_POSE, rightArmAngle: -10, rightArmExtension: 105, bodyTilt: 28, bodySquash: 0.9 },
  { ...DEFAULT_POSE, rightArmAngle: -5, rightArmExtension: 100, bodyTilt: 25, bodySquash: 0.92 },
  // Recovery
  { ...DEFAULT_POSE, rightArmAngle: 0, rightArmExtension: 70, bodyTilt: 15 },
  { ...DEFAULT_POSE, rightArmAngle: 10, rightArmExtension: 50, bodyTilt: 10 },
  { ...DEFAULT_POSE, rightArmAngle: 20, rightArmExtension: 30, bodyTilt: 5 },
  { ...DEFAULT_POSE, rightArmAngle: 25, rightArmExtension: 15 },
  { ...DEFAULT_POSE, rightArmAngle: 30, rightArmExtension: 5 },
  { ...DEFAULT_POSE },
];

// Light kick animation
export const LIGHT_KICK_POSES: Pose[] = [
  // Startup
  { ...DEFAULT_POSE, rightLegOffsetY: -10, rightLegBend: 20 },
  // Active
  { ...DEFAULT_POSE, rightLegOffsetY: -5, rightLegBend: -40, bodyTilt: -10 },
  { ...DEFAULT_POSE, rightLegOffsetY: 0, rightLegBend: -50, bodyTilt: -12 },
  { ...DEFAULT_POSE, rightLegOffsetY: -5, rightLegBend: -40, bodyTilt: -10 },
  // Recovery
  { ...DEFAULT_POSE, rightLegOffsetY: -10, rightLegBend: 10 },
  { ...DEFAULT_POSE, rightLegOffsetY: -5, rightLegBend: 5 },
  { ...DEFAULT_POSE },
];

// Medium kick animation
export const MEDIUM_KICK_POSES: Pose[] = [
  // Startup
  { ...DEFAULT_POSE, rightLegOffsetY: -15, rightLegBend: 30, bodyTilt: -5 },
  { ...DEFAULT_POSE, rightLegOffsetY: -20, rightLegBend: 35, bodyTilt: -8 },
  // Active
  { ...DEFAULT_POSE, rightLegOffsetY: -10, rightLegBend: -60, bodyTilt: -15, bodySquash: 0.95 },
  { ...DEFAULT_POSE, rightLegOffsetY: -5, rightLegBend: -70, bodyTilt: -18, bodySquash: 0.93 },
  { ...DEFAULT_POSE, rightLegOffsetY: -8, rightLegBend: -65, bodyTilt: -16, bodySquash: 0.94 },
  { ...DEFAULT_POSE, rightLegOffsetY: -10, rightLegBend: -60, bodyTilt: -15, bodySquash: 0.95 },
  // Recovery
  { ...DEFAULT_POSE, rightLegOffsetY: -15, rightLegBend: 20, bodyTilt: -8 },
  { ...DEFAULT_POSE, rightLegOffsetY: -10, rightLegBend: 10, bodyTilt: -5 },
  { ...DEFAULT_POSE, rightLegOffsetY: -5, rightLegBend: 5 },
  { ...DEFAULT_POSE },
];

// Heavy kick animation
export const HEAVY_KICK_POSES: Pose[] = [
  // Startup (big wind-up)
  { ...DEFAULT_POSE, rightLegOffsetY: -20, rightLegBend: 40, bodyTilt: -10 },
  { ...DEFAULT_POSE, rightLegOffsetY: -30, rightLegBend: 50, bodyTilt: -15 },
  { ...DEFAULT_POSE, rightLegOffsetY: -40, rightLegBend: 60, bodyTilt: -20 },
  // Active (full extension)
  { ...DEFAULT_POSE, rightLegOffsetY: -15, rightLegBend: -80, bodyTilt: -25, bodySquash: 0.9 },
  { ...DEFAULT_POSE, rightLegOffsetY: -10, rightLegBend: -90, bodyTilt: -30, bodySquash: 0.88 },
  { ...DEFAULT_POSE, rightLegOffsetY: -12, rightLegBend: -85, bodyTilt: -28, bodySquash: 0.89 },
  { ...DEFAULT_POSE, rightLegOffsetY: -15, rightLegBend: -80, bodyTilt: -25, bodySquash: 0.9 },
  // Recovery
  { ...DEFAULT_POSE, rightLegOffsetY: -25, rightLegBend: 30, bodyTilt: -15 },
  { ...DEFAULT_POSE, rightLegOffsetY: -20, rightLegBend: 20, bodyTilt: -10 },
  { ...DEFAULT_POSE, rightLegOffsetY: -15, rightLegBend: 15, bodyTilt: -5 },
  { ...DEFAULT_POSE, rightLegOffsetY: -10, rightLegBend: 10 },
  { ...DEFAULT_POSE, rightLegOffsetY: -5, rightLegBend: 5 },
  { ...DEFAULT_POSE },
];

// Jumping animation
export const JUMP_POSES: Pose[] = [
  // Crouch
  { ...DEFAULT_POSE, bodyOffsetY: 25, bodySquash: 0.7, leftLegBend: 40, rightLegBend: 40 },
  // Ascent
  { ...DEFAULT_POSE, bodyOffsetY: 0, bodySquash: 1.1, leftLegBend: -20, rightLegBend: -20 },
  { ...DEFAULT_POSE, bodyOffsetY: -10, bodySquash: 1.15, leftLegBend: -30, rightLegBend: -30 },
  // Apex
  { ...DEFAULT_POSE, bodyOffsetY: -15, bodySquash: 1.1, leftLegBend: -40, rightLegBend: -40 },
  // Descent
  { ...DEFAULT_POSE, bodyOffsetY: -10, bodySquash: 1.05, leftLegBend: -30, rightLegBend: -30 },
  { ...DEFAULT_POSE, bodyOffsetY: 0, bodySquash: 1.0, leftLegBend: -20, rightLegBend: -20 },
  // Land
  { ...DEFAULT_POSE, bodyOffsetY: 15, bodySquash: 0.85, leftLegBend: 20, rightLegBend: 20 },
  { ...DEFAULT_POSE, bodyOffsetY: 5, bodySquash: 0.95, leftLegBend: 10, rightLegBend: 10 },
  { ...DEFAULT_POSE },
];

// Hit reaction - Enhanced with impact frames
export const HIT_POSES: Pose[] = [
  { ...DEFAULT_POSE, bodyTilt: -25, headOffsetX: -15, bodyOffsetY: 8, bodySquash: 0.9 },
  { ...DEFAULT_POSE, bodyTilt: -30, headOffsetX: -18, bodyOffsetY: 10, bodySquash: 0.88 },
  { ...DEFAULT_POSE, bodyTilt: -25, headOffsetX: -15, bodyOffsetY: 8, bodySquash: 0.9 },
  { ...DEFAULT_POSE, bodyTilt: -20, headOffsetX: -12, bodyOffsetY: 6, bodySquash: 0.92 },
  { ...DEFAULT_POSE, bodyTilt: -15, headOffsetX: -10, bodyOffsetY: 4, bodySquash: 0.94 },
  { ...DEFAULT_POSE, bodyTilt: -10, headOffsetX: -7, bodyOffsetY: 3, bodySquash: 0.96 },
  { ...DEFAULT_POSE, bodyTilt: -5, headOffsetX: -4, bodyOffsetY: 2, bodySquash: 0.98 },
  { ...DEFAULT_POSE, bodyTilt: -2, headOffsetX: -2, bodyOffsetY: 1 },
  { ...DEFAULT_POSE },
];

// Blocking
export const BLOCK_POSES: Pose[] = [
  {
    ...DEFAULT_POSE,
    bodyTilt: -10,
    leftArmAngle: -80,
    rightArmAngle: 80,
    leftArmExtension: 20,
    rightArmExtension: 20,
    bodySquash: 0.95,
  },
];

/**
 * Get the current pose based on fighter state and animation timer
 */
export function getCurrentPose(
  state: string,
  animationTimer: number,
  attackType?: 'light' | 'medium' | 'heavy',
  moveType?: 'punch' | 'kick'
): Pose {
  let poses: Pose[] = [DEFAULT_POSE];
  
  switch (state) {
    case 'idle':
      poses = IDLE_POSES;
      break;
    case 'walking':
      poses = WALK_POSES;
      break;
    case 'attacking':
      if (moveType === 'kick') {
        poses = attackType === 'light' ? LIGHT_KICK_POSES :
                attackType === 'medium' ? MEDIUM_KICK_POSES : HEAVY_KICK_POSES;
      } else {
        poses = attackType === 'light' ? LIGHT_PUNCH_POSES :
                attackType === 'medium' ? MEDIUM_PUNCH_POSES : HEAVY_PUNCH_POSES;
      }
      break;
    case 'jumping':
      poses = JUMP_POSES;
      break;
    case 'hit':
    case 'stunned':
      poses = HIT_POSES;
      break;
    case 'blocking':
      poses = BLOCK_POSES;
      break;
    default:
      return DEFAULT_POSE;
  }
  
  // Calculate which pose to use based on animation timer
  const framesPerPose = state === 'idle' ? 12 : state === 'walking' ? 8 : 1;
  const poseIndex = Math.floor(animationTimer / framesPerPose) % poses.length;
  
  return poses[poseIndex];
}

/**
 * Interpolate between two poses
 */
export function interpolatePose(pose1: Pose, pose2: Pose, t: number): Pose {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  
  return {
    bodyOffsetY: lerp(pose1.bodyOffsetY, pose2.bodyOffsetY, t),
    bodyTilt: lerp(pose1.bodyTilt, pose2.bodyTilt, t),
    bodySquash: lerp(pose1.bodySquash, pose2.bodySquash, t),
    headOffsetX: lerp(pose1.headOffsetX, pose2.headOffsetX, t),
    headOffsetY: lerp(pose1.headOffsetY, pose2.headOffsetY, t),
    headTilt: lerp(pose1.headTilt, pose2.headTilt, t),
    leftArmAngle: lerp(pose1.leftArmAngle, pose2.leftArmAngle, t),
    leftArmExtension: lerp(pose1.leftArmExtension, pose2.leftArmExtension, t),
    rightArmAngle: lerp(pose1.rightArmAngle, pose2.rightArmAngle, t),
    rightArmExtension: lerp(pose1.rightArmExtension, pose2.rightArmExtension, t),
    leftLegOffsetY: lerp(pose1.leftLegOffsetY, pose2.leftLegOffsetY, t),
    leftLegBend: lerp(pose1.leftLegBend, pose2.leftLegBend, t),
    rightLegOffsetY: lerp(pose1.rightLegOffsetY, pose2.rightLegOffsetY, t),
    rightLegBend: lerp(pose1.rightLegBend, pose2.rightLegBend, t),
  };
}
