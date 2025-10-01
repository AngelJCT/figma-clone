export * from './templates';

export const DEFAULT_ELEMENT_PROPERTIES = {
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 1,
  borderRadius: 0,
  opacity: 1,
};

export const CANVAS_BACKGROUND = '#2c2c2c';
export const GRID_SIZE = 10;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;
export const ZOOM_STEP = 0.1;

export const KEYBOARD_SHORTCUTS = {
  SELECT: 'v',
  FRAME: 'f',
  RECTANGLE: 'r',
  CIRCLE: 'c',
  TEXT: 't',
  IMAGE: 'i',
  LINE: 'l',
  HAND: 'h',
  DELETE: ['Backspace', 'Delete'],
  DUPLICATE: ['Meta+d', 'Control+d'],
  COPY: ['Meta+c', 'Control+c'],
  PASTE: ['Meta+v', 'Control+v'],
  UNDO: ['Meta+z', 'Control+z'],
  REDO: ['Meta+Shift+z', 'Control+Shift+z'],
  GROUP: ['Meta+g', 'Control+g'],
  ZOOM_IN: ['Meta+=', 'Control+='],
  ZOOM_OUT: ['Meta+-', 'Control+-'],
};
