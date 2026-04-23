import type { LucideIcon } from 'lucide-react';

/** A single AI filter preset. */
export type FilterConfig = {
  id: string;
  name: string;
  prompt: string;
  image: string;
};

/** An aspect-ratio option for expansion / generation. */
export type RatioConfig = {
  label: string;
  value: number;
  aspectRatio: string;
  icon: LucideIcon;
  desc: string;
};

/** A quick-fill prompt template. */
export type PromptTemplate = {
  label: string;
  prompt: string;
};

/** Canvas size preset for blank canvas creation. */
export type BlankCanvasSize = {
  label: string;
  w: number;
  h: number;
};
