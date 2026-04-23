/**
 * Editor Store — composed from focused slices.
 *
 * This is the single entry point for all editor state.
 * Slices live in ./slices/ and are composed here with persist + devtools middleware.
 */
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { EditorState } from '@/types/editor.types';
import { PERSISTED_KEYS } from '@/config/editor.config';
import { createCoreSlice } from './slices/core-slice';
import { createUISlice } from './slices/ui-slice';
import { createCanvasSlice } from './slices/canvas-slice';
import { createAIActionsSlice } from './slices/ai-actions-slice';

// ── Safe localStorage adapter ───────────────────────────────────────────────
// Swallows quota errors and large payloads silently
const safeStorage = createJSONStorage(() => ({
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      // Skip writes larger than 30 MB to avoid quota errors on large undo stacks
      if (value.length > 30_000_000) return;
      localStorage.setItem(key, value);
    } catch {
      // QuotaExceededError — silently ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
}));

// ── Composed Store ──────────────────────────────────────────────────────────

export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (...a) => ({
        ...createCoreSlice(...a),
        ...createUISlice(...a),
        ...createCanvasSlice(...a),
        ...createAIActionsSlice(...a),
      }),
      {
        name: 'imgstudio-session',
        storage: safeStorage,
        // Only persist the listed keys — skip all UI/loading/transient state
        partialize: (state) =>
          Object.fromEntries(
            PERSISTED_KEYS.map((k) => [k, state[k]]),
          ) as Partial<EditorState>,
        // After rehydration, guard against a stale historyIndex
        onRehydrateStorage: () => (state) => {
          if (!state || !state.history.length) return;
          if (state.historyIndex >= state.history.length) {
            state.historyIndex = state.history.length - 1;
          }
          state.image = state.history[state.historyIndex];
        },
      },
    ),
  ),
);
