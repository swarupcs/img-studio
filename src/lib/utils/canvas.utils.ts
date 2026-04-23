/**
 * Canvas manipulation utilities.
 * Used by canvas-slice for local (non-AI) image transformations.
 */

import type { CanvasEffects } from '@/types';

/**
 * Apply a 3×3 convolution kernel to image data.
 * Used for sharpening. The default kernel sharpens edges.
 */
export function applyKernelFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  kernel: number[] = [0, -1, 0, -1, 5, -1, 0, -1, 0],
): void {
  const src = ctx.getImageData(0, 0, width, height);
  const s = src.data;
  const out = new Uint8ClampedArray(s.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let v = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            v += s[((y + ky) * width + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        out[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, v));
      }
      out[(y * width + x) * 4 + 3] = s[(y * width + x) * 4 + 3];
    }
  }

  // Copy border pixels unchanged
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        for (let c = 0; c < 4; c++) {
          out[(y * width + x) * 4 + c] = s[(y * width + x) * 4 + c];
        }
      }
    }
  }

  ctx.putImageData(new ImageData(out, width, height), 0, 0);
}

/** Apply film grain noise to image data in-place */
export function applyGrain(ctx: CanvasRenderingContext2D, width: number, height: number, grain: number): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * grain * 2;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(imageData, 0, 0);
}

/** Apply a vignette effect to the canvas */
export function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number, vignette: number): void {
  const g = ctx.createRadialGradient(
    width / 2, height / 2, width * 0.25,
    width / 2, height / 2, width * 0.75,
  );
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

/** Apply blur, grain, and vignette effects to an image data-URL. Returns new data-URL. */
export function applyCanvasEffectsToImage(imageDataUrl: string, effects: CanvasEffects): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = imageDataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;

      if (effects.blur > 0) ctx.filter = `blur(${effects.blur}px)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';

      if (effects.grain > 0) applyGrain(ctx, canvas.width, canvas.height, effects.grain);
      if (effects.vignette > 0) applyVignette(ctx, canvas.width, canvas.height, effects.vignette);

      resolve(canvas.toDataURL('image/png'));
    };
  });
}
