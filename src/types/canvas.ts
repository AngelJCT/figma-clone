export type ElementType = 'frame' | 'rectangle' | 'circle' | 'text' | 'image' | 'line';

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  position: Position;
  dimensions: Dimensions;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  name: string;
  parentId?: string;
  properties: ElementProperties;
}

export interface ElementProperties {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  shadow?: Shadow;
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  // Layout properties
  padding?: number;
  layoutMode?: 'none' | 'horizontal' | 'vertical' | 'grid';
  gap?: number;
  justifyContent?: 'start' | 'center' | 'end' | 'space-between';
  alignItems?: 'start' | 'center' | 'end';
  // Image properties
  imageUrl?: string;
  imageFit?: 'fill' | 'contain' | 'cover';
}

export interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface Layer {
  id: string;
  name: string;
  type: ElementType;
  visible: boolean;
  locked: boolean;
  children?: Layer[];
}

export interface Viewport {
  offsetX: number;
  offsetY: number;
  zoom: number;
}
