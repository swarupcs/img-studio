import {
  Crop,
  Film,
  Frame,
  Monitor,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  Square,
} from 'lucide-react';
import type { RatioConfig } from '@/types/config.types';

export const ratios: RatioConfig[] = [
  {
    label: 'Square (1:1)',
    value: 1,
    aspectRatio: '1:1',
    icon: Square,
    desc: 'Instagram Feed',
  },
  {
    label: 'Wide (16:9)',
    value: 16 / 9,
    aspectRatio: '16:9',
    icon: Monitor,
    desc: 'YouTube / Video',
  },
  {
    label: 'Standard (4:3)',
    value: 4 / 3,
    aspectRatio: '4:3',
    icon: RectangleHorizontal,
    desc: 'Classic Camera',
  },
  {
    label: 'Classic (3:2)',
    value: 3 / 2,
    aspectRatio: '3:2',
    icon: Frame,
    desc: 'DSLR / Print',
  },
  {
    label: 'Cinema (21:9)',
    value: 21 / 9,
    aspectRatio: '21:9',
    icon: Film,
    desc: 'Ultrawide',
  },
  {
    label: 'Story (9:16)',
    value: 9 / 16,
    aspectRatio: '9:16',
    icon: Smartphone,
    desc: 'TikTok / Reels',
  },
  {
    label: 'Social (4:5)',
    value: 4 / 5,
    aspectRatio: '4:5',
    icon: Crop,
    desc: 'Insta Portrait',
  },
  {
    label: 'Poster (2:3)',
    value: 2 / 3,
    aspectRatio: '2:3',
    icon: RectangleVertical,
    desc: 'Pinterest',
  },
];
