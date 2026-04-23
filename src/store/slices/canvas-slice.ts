/**
 * Canvas operations slice.
 * Manages local (non-AI) canvas transformations: adjustments, crop, text, flip, rotate, effects, sharpen.
 */
import type { StateCreator } from 'zustand';
import type { EditorState, CanvasSlice } from '@/types/editor.types';
import { ToolType } from '@/config/tools.config';
import { DEFAULT_ADJUSTMENTS, DEFAULT_CANVAS_EFFECTS } from '@/config/editor.config';
import { applyKernelFilter } from '@/lib/utils/canvas.utils';
import { pushToHistory } from './core-slice';
import { nanoid } from 'nanoid';

export const createCanvasSlice: StateCreator<EditorState, [], [], CanvasSlice> = (
  set,
  get,
) => ({
  textLayers: [],

  applyAdjustments: () => {
    const state = get();
    if (!state.image) return;
    const { brightness, contrast, saturation } = state.adjustments;
    if (brightness === 100 && contrast === 100 && saturation === 100) return;
    const img = new window.Image();
    img.src = state.image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
      const newImg = canvas.toDataURL('image/png');
      set({
        ...pushToHistory(get(), newImg),
        adjustments: { ...DEFAULT_ADJUSTMENTS },
      });
    };
  },

  applyCrop: () => {
    const state = get();
    if (!state.image || !state.cropRect) return;
    const { x, y, width, height } = state.cropRect;
    if (width <= 0 || height <= 0) return;
    const img = new window.Image();
    img.src = state.image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(
        img,
        Math.round(x), Math.round(y), Math.round(width), Math.round(height),
        0, 0, Math.round(width), Math.round(height),
      );
      const newImg = canvas.toDataURL('image/png');
      set({
        ...pushToHistory(get(), newImg),
        cropRect: null,
        selectedTool: ToolType.MOVE,
      });
    };
  },

  addTextLayer: (text, x = 0.5, y = 0.5, options) => {
    set((s) => ({
      textLayers: [
        ...s.textLayers,
        {
          id: nanoid(),
          text,
          x,
          y,
          fontSize: options?.fontSize ?? 32,
          color: options?.color ?? '#ffffff',
          fontFamily: options?.fontFamily ?? 'Inter, sans-serif',
        },
      ],
    }));
  },

  updateTextLayer: (id, updates) => {
    set((s) => ({
      textLayers: s.textLayers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  removeTextLayer: (id) => {
    set((s) => ({ textLayers: s.textLayers.filter((l) => l.id !== id) }));
  },

  flattenTextLayers: () => {
    const state = get();
    if (!state.image || state.textLayers.length === 0) return;
    const img = new window.Image();
    img.src = state.image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      for (const layer of state.textLayers) {
        ctx.save();
        ctx.font = `bold ${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.color;
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText(layer.text, layer.x * canvas.width, layer.y * canvas.height);
        ctx.restore();
      }
      const newImg = canvas.toDataURL('image/png');
      set({ ...pushToHistory(get(), newImg), textLayers: [] });
    };
  },

  flipHorizontal: () => {
    const { image } = get();
    if (!image) return;
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      set({ ...pushToHistory(get(), canvas.toDataURL('image/png')) });
    };
  },

  flipVertical: () => {
    const { image } = get();
    if (!image) return;
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0);
      set({ ...pushToHistory(get(), canvas.toDataURL('image/png')) });
    };
  },

  rotateLeft: () => {
    const { image } = get();
    if (!image) return;
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalHeight;
      canvas.height = img.naturalWidth;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(0, canvas.height);
      ctx.rotate(-Math.PI / 2);
      ctx.drawImage(img, 0, 0);
      set({ ...pushToHistory(get(), canvas.toDataURL('image/png')) });
    };
  },

  rotateRight: () => {
    const { image } = get();
    if (!image) return;
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalHeight;
      canvas.height = img.naturalWidth;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width, 0);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, 0, 0);
      set({ ...pushToHistory(get(), canvas.toDataURL('image/png')) });
    };
  },

  applyCanvasEffects: () => {
    const state = get();
    if (!state.image) return;
    const { blur, vignette, grain } = state.canvasEffects;
    if (blur === 0 && vignette === 0 && grain === 0) return;

    // Dynamic import to keep the canvas utils tree-shakeable
    import('@/lib/utils/canvas.utils').then(({ applyCanvasEffectsToImage }) => {
      applyCanvasEffectsToImage(state.image!, state.canvasEffects).then((newImg) => {
        set({
          ...pushToHistory(get(), newImg),
          canvasEffects: { ...DEFAULT_CANVAS_EFFECTS },
        });
      });
    });
  },

  applySharpen: () => {
    const { image } = get();
    if (!image) return;
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      applyKernelFilter(ctx, canvas.width, canvas.height);
      set({ ...pushToHistory(get(), canvas.toDataURL('image/png')) });
    };
  },

  commitCanvas: (imageData) => set({ ...pushToHistory(get(), imageData) }),
});
