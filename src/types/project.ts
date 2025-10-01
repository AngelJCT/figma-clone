import { CanvasElement, Viewport } from './canvas';
import { Artboard } from './template';

export interface ProjectState {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  artboards: Artboard[];
  elements: Record<string, CanvasElement>;
  selectedElementIds: string[];
  selectedArtboardId: string | null;
  viewport: Viewport;
  history: HistoryState;
}

export interface HistoryState {
  past: ProjectSnapshot[];
  present: ProjectSnapshot;
  future: ProjectSnapshot[];
}

export interface ProjectSnapshot {
  artboards: Artboard[];
  elements: Record<string, CanvasElement>;
}

export type Tool = 'select' | 'frame' | 'rectangle' | 'circle' | 'text' | 'image' | 'line' | 'hand';

export interface EditorState {
  activeTool: Tool;
  isDrawing: boolean;
  isPanning: boolean;
}
