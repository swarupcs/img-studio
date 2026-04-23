import type { FilterConfig } from '@/types/config.types';

export const filters: FilterConfig[] = [
  {
    id: 'cartoon',
    name: 'Toonify',
    prompt:
      'Redraw the entire image as a vibrant 2D cartoon. Apply bold black outlines, flat coloring, and cel-shading globally to both the subject and the background. Simplify details into a clean comic book style.',
    image: '/filters/toonify.png',
  },
  {
    id: 'ghibli',
    name: 'Ghibli Studio',
    prompt:
      'Transform the whole image into a Studio Ghibli anime scene. Redraw everything with hand-painted backgrounds, vibrant natural greens and blues, fluffy clouds, and cel-shaded characters. Maintain the original composition but strictly enforce the Hayao Miyazaki art style.',
    image: '/filters/ghibli.png',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt:
      'Apply a global Cyberpunk 2077 aesthetic. Shift the entire color palette to neon cyan, magenta, and deep black. Add a futuristic glow, rain reflections, and high-tech digital artifacts to the whole scene.',
    image: '/filters/cyberpunk.png',
  },
  {
    id: 'oil_painting',
    name: 'Oil Painting',
    prompt:
      "Re-imagine this image as a classic oil painting on canvas. Apply heavy, visible brushstrokes and rich impasto textures across the entire surface. Blend colors like an Impressionist master (Van Gogh style). Remove all photorealistic sharpness.",
    image: '/filters/oilpainting.png',
  },
];
