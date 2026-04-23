export enum ToolType {
  MOVE = 'MOVE',
  RECTANGLE = 'RECTANGLE',
  BRUSH = 'BRUSH',
  ERASER = 'ERASER',
  CROP = 'CROP',
  TEXT = 'TEXT',
  COLOR_PICKER = 'COLOR_PICKER',
  SMART_REMOVE = 'SMART_REMOVE',
  PEN = 'PEN',
}

/** Keyboard key → tool mapping for shortcuts */
export const TOOL_KEYS: Record<string, ToolType> = {
  m: ToolType.MOVE,
  b: ToolType.BRUSH,
  e: ToolType.ERASER,
  c: ToolType.CROP,
  t: ToolType.TEXT,
  p: ToolType.COLOR_PICKER,
  w: ToolType.SMART_REMOVE,
};
