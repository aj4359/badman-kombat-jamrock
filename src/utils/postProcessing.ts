export const applyMotionBlur = (
  ctx: CanvasRenderingContext2D,
  intensity: number = 0.3
) => {
  ctx.globalAlpha = intensity;
  ctx.filter = 'blur(2px)';
};

export const applyVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number = 0.5
) => {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) / 1.5
  );
  
  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

export const applyColorGrading = (
  ctx: CanvasRenderingContext2D,
  contrast: number = 1.2,
  saturation: number = 0.9,
  brightness: number = 1.0
) => {
  ctx.filter = `contrast(${contrast}) saturate(${saturation}) brightness(${brightness})`;
};

export const applyFilmGrain = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number = 0.05
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i] += noise;     // Red
    data[i + 1] += noise; // Green
    data[i + 2] += noise; // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyChromaticAberration = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offset: number = 2
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(imageData, 0, 0);
  
  // Clear original
  ctx.clearRect(0, 0, width, height);
  
  // Red channel - shifted left
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(tempCanvas, -offset, 0);
  
  // Green channel - normal
  ctx.drawImage(tempCanvas, 0, 0);
  
  // Blue channel - shifted right
  ctx.drawImage(tempCanvas, offset, 0);
  
  ctx.globalCompositeOperation = 'source-over';
};

export const applyLensDistortion = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number = 0.02
) => {
  // Barrel distortion effect (subtle)
  const imageData = ctx.getImageData(0, 0, width, height);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(imageData, 0, 0);
  
  ctx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
  
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const factor = 1 + (distance / maxRadius) * strength;
      
      const sourceX = centerX + dx * factor;
      const sourceY = centerY + dy * factor;
      
      if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
        const pixel = tempCtx.getImageData(sourceX, sourceY, 1, 1);
        ctx.putImageData(pixel, x, y);
      }
    }
  }
};
