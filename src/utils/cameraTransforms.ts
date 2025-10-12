import { CameraState } from '@/hooks/useCinematicCamera';

export const applyCameraTransform = (
  ctx: CanvasRenderingContext2D,
  camera: CameraState,
  canvasWidth: number,
  canvasHeight: number
) => {
  ctx.save();
  
  // Center the canvas
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  
  // Apply zoom
  ctx.scale(camera.zoom, camera.zoom);
  
  // Apply rotation (convert degrees to radians)
  ctx.rotate((camera.rotation * Math.PI) / 180);
  
  // Apply camera position and shake
  ctx.translate(
    -(camera.x + camera.shake.x),
    -(camera.y + camera.shake.y)
  );
};

export const resetCameraTransform = (ctx: CanvasRenderingContext2D) => {
  ctx.restore();
};

export const worldToScreen = (
  worldX: number,
  worldY: number,
  camera: CameraState,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } => {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  
  // Apply camera transformations
  const dx = (worldX - camera.x) * camera.zoom;
  const dy = (worldY - camera.y) * camera.zoom;
  
  // Rotate around center
  const angle = (camera.rotation * Math.PI) / 180;
  const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
  const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
  
  return {
    x: centerX + rotatedX + camera.shake.x,
    y: centerY + rotatedY + camera.shake.y
  };
};

export const screenToWorld = (
  screenX: number,
  screenY: number,
  camera: CameraState,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } => {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  
  // Reverse shake
  const dx = (screenX - centerX - camera.shake.x) / camera.zoom;
  const dy = (screenY - centerY - camera.shake.y) / camera.zoom;
  
  // Reverse rotation
  const angle = -(camera.rotation * Math.PI) / 180;
  const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
  const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
  
  return {
    x: camera.x + rotatedX,
    y: camera.y + rotatedY
  };
};
