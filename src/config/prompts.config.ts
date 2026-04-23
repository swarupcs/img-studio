import type { PromptTemplate } from '@/types/config.types';

/** Quick-fill prompt templates shown below the prompt input */
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  { label: 'Golden Hour', prompt: 'Transform the lighting to a warm golden hour sunset. Soft orange and pink tones, long shadows, glowing highlights on surfaces.' },
  { label: 'Add Rain', prompt: 'Add heavy rain effect to the scene. Streaking rain drops, wet surfaces with reflections, moody overcast atmosphere.' },
  { label: 'Pencil Sketch', prompt: 'Convert this image to a detailed pencil sketch. Clean graphite lines, cross-hatching for shadows, white paper background.' },
  { label: 'Neon Night', prompt: 'Transform to a neon-lit night scene. Vivid neon signs reflecting off wet streets, dark atmosphere with glowing cyan and magenta lights.' },
  { label: 'Cinematic', prompt: 'Apply cinematic color grading with widescreen letterbox bars. Film grain, lifted shadows, warm highlight tones, desaturated midtones.' },
  { label: 'Soft Portrait', prompt: 'Apply a soft focus portrait effect. Gentle bokeh background blur, smooth skin tones, dreamy ethereal quality with warm light.' },
  { label: 'Vintage Film', prompt: 'Apply vintage film photography effect. Faded colors, light leaks, visible grain, slight vignette, warm brownish tones.' },
  { label: 'Snow Scene', prompt: 'Add realistic snowfall to the scene. Snowflakes mid-air, snow accumulation on surfaces, cold blue-white ambient light.' },
];

// ── AI system prompts used in store actions ──────────────────────────────────

export const INPAINTING_PROMPT = (userGoal: string) => `
TASK: Professional Image In-painting / Generative Fill.
ROLE: Expert Photo Retoucher.
INPUT DATA EXPLANATION:
- WHITE pixels in the mask = area to edit. BLACK pixels = preserve exactly.
USER GOAL: "${userGoal}"
EXECUTION GUIDELINES:
1. IF REMOVING: Perform Background Reconstruction. Seamlessly extend surrounding background over masked area.
2. IF CHANGING: Generate new content strictly within white mask, matching scene lighting and perspective.
3. SEAMLESS INTEGRATION: Match surrounding perspective, lighting, shadows, color grading.
4. TEXTURE MATCHING: Replicate film grain, noise, sharpness. Transition at mask boundary must be invisible.
5. STRICT ISOLATION: Do not modify pixels outside the white masked area.`;

export const FILTER_PROMPT_SUFFIX = `
TECHNICAL CONSTRAINTS:
1. STRICTLY PRESERVE COMPOSITION: Do not change pose, camera angle, or object placement.
2. Style transfer only — keep structure identical, only change texture/lighting/colors.`;

export const EXPANSION_PROMPT = (additionalContext: string) =>
  `High-fidelity outpainting. Seamlessly extend the scenery into empty areas. Person's face and features remain completely unchanged.
Maintain continuity of lines, horizon, textures, lighting, perspective. Transition must be invisible.
${additionalContext ? `Additional context: ${additionalContext}` : ''}`;

export const REMOVE_BG_PROMPT =
  'Remove the background from this image completely. Replace with clean solid white background. Keep only the main subject perfectly intact with clean, precise edges.';

export const ENHANCE_IMAGE_PROMPT =
  'Enhance and upscale this image: improve sharpness, clarity, fine detail. Reconstruct high-frequency textures. Remove noise, compression artifacts, blur. Improve color vibrancy and dynamic range while maintaining natural look. No compositional changes.';

export const ENHANCE_FACE_PROMPT =
  "Enhance the face(s) in this portrait photo: smooth skin texture while keeping natural pores, reduce blemishes, brighten and sharpen eyes, enhance eyelashes, slightly whiten teeth if visible, reduce under-eye shadows, improve overall skin tone evenness. Keep all facial features, expressions, and identity exactly the same. Do not alter background, hair, or clothing.";

export const BLEND_PROMPT_DEFAULT =
  'Seamlessly blend and composite these two images together. Merge subjects naturally with matching lighting, perspective and color grading. The result should look like a single cohesive photograph.';

export const RECOLOR_PROMPT = (targetColor: string) =>
  `Recolor only the masked white area to exactly ${targetColor}. Maintain all existing textures, material properties, lighting direction, shadows, and highlights. Only change the hue and saturation. The result must look photorealistic and seamlessly integrated.`;

export const REPLACE_BG_PROMPT = (scene: string) =>
  `Replace the background of this image with: ${scene}. Keep the main subject (person/object) completely unchanged with precise edges. The new background should seamlessly integrate with the subject's existing lighting and shadows. Photorealistic result.`;

export const SMART_REMOVE_PROMPT =
  'Remove the selected object from the image completely and fill the area with a seamless, natural-looking background that matches the surroundings';
