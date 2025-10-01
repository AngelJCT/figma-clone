import { CanvasElement, Position, Dimensions } from '@/types';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isPointInRect = (
  point: Position,
  rect: Position & Dimensions
): boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

export const getBoundingBox = (elements: CanvasElement[]): Position & Dimensions => {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((element) => {
    minX = Math.min(minX, element.position.x);
    minY = Math.min(minY, element.position.y);
    maxX = Math.max(maxX, element.position.x + element.dimensions.width);
    maxY = Math.max(maxY, element.position.y + element.dimensions.height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const screenToCanvas = (
  screenX: number,
  screenY: number,
  viewport: { offsetX: number; offsetY: number; zoom: number }
): Position => {
  return {
    x: (screenX - viewport.offsetX) / viewport.zoom,
    y: (screenY - viewport.offsetY) / viewport.zoom,
  };
};

export const canvasToScreen = (
  canvasX: number,
  canvasY: number,
  viewport: { offsetX: number; offsetY: number; zoom: number }
): Position => {
  return {
    x: canvasX * viewport.zoom + viewport.offsetX,
    y: canvasY * viewport.zoom + viewport.offsetY,
  };
};
