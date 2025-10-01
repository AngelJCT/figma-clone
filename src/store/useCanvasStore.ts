import { create } from 'zustand';
import { ProjectState, CanvasElement, Artboard, Tool, Viewport } from '@/types';

interface CanvasStore extends ProjectState {
  activeTool: Tool;
  isDrawing: boolean;
  isPanning: boolean;
  
  // Actions
  setActiveTool: (tool: Tool) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setIsPanning: (isPanning: boolean) => void;
  
  // Element actions
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  
  // Artboard actions
  addArtboard: (artboard: Artboard) => void;
  updateArtboard: (id: string, updates: Partial<Artboard>) => void;
  deleteArtboard: (id: string) => void;
  setSelectedArtboard: (id: string | null) => void;
  
  // Viewport actions
  setViewport: (viewport: Partial<Viewport>) => void;
  zoom: (delta: number) => void;
  pan: (dx: number, dy: number) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
}

const MAX_HISTORY = 50;

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  id: '',
  name: 'Untitled Project',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  artboards: [],
  elements: {},
  selectedElementIds: [],
  selectedArtboardId: null,
  viewport: {
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
  },
  history: {
    past: [],
    present: { artboards: [], elements: {} },
    future: [],
  },
  activeTool: 'select',
  isDrawing: false,
  isPanning: false,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setIsPanning: (isPanning) => set({ isPanning }),

  addElement: (element) => set((state) => ({
    elements: { ...state.elements, [element.id]: element },
    updatedAt: Date.now(),
  })),

  updateElement: (id, updates) => set((state) => ({
    elements: {
      ...state.elements,
      [id]: { ...state.elements[id], ...updates },
    },
    updatedAt: Date.now(),
  })),

  deleteElement: (id) => set((state) => {
    const { [id]: removed, ...rest } = state.elements;
    return {
      elements: rest,
      selectedElementIds: state.selectedElementIds.filter((eid) => eid !== id),
      updatedAt: Date.now(),
    };
  }),

  selectElement: (id, multi = false) => set((state) => ({
    selectedElementIds: multi
      ? [...state.selectedElementIds, id]
      : [id],
  })),

  clearSelection: () => set({ selectedElementIds: [] }),

  addArtboard: (artboard) => set((state) => ({
    artboards: [...state.artboards, artboard],
    updatedAt: Date.now(),
  })),

  updateArtboard: (id, updates) => set((state) => ({
    artboards: state.artboards.map((ab) =>
      ab.id === id ? { ...ab, ...updates } : ab
    ),
    updatedAt: Date.now(),
  })),

  deleteArtboard: (id) => set((state) => ({
    artboards: state.artboards.filter((ab) => ab.id !== id),
    selectedArtboardId: state.selectedArtboardId === id ? null : state.selectedArtboardId,
    updatedAt: Date.now(),
  })),

  setSelectedArtboard: (id) => set({ selectedArtboardId: id }),

  setViewport: (viewport) => set((state) => ({
    viewport: { ...state.viewport, ...viewport },
  })),

  zoom: (delta) => set((state) => {
    const newZoom = Math.max(0.1, Math.min(5, state.viewport.zoom + delta));
    return {
      viewport: { ...state.viewport, zoom: newZoom },
    };
  }),

  pan: (dx, dy) => set((state) => ({
    viewport: {
      ...state.viewport,
      offsetX: state.viewport.offsetX + dx,
      offsetY: state.viewport.offsetY + dy,
    },
  })),

  saveSnapshot: () => set((state) => {
    const snapshot = {
      artboards: state.artboards,
      elements: state.elements,
    };
    const past = [...state.history.past, state.history.present].slice(-MAX_HISTORY);
    return {
      history: {
        past,
        present: snapshot,
        future: [],
      },
    };
  }),

  undo: () => set((state) => {
    if (state.history.past.length === 0) return state;
    const previous = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);
    return {
      ...previous,
      history: {
        past: newPast,
        present: previous,
        future: [state.history.present, ...state.history.future],
      },
      updatedAt: Date.now(),
    };
  }),

  redo: () => set((state) => {
    if (state.history.future.length === 0) return state;
    const next = state.history.future[0];
    const newFuture = state.history.future.slice(1);
    return {
      ...next,
      history: {
        past: [...state.history.past, state.history.present],
        present: next,
        future: newFuture,
      },
      updatedAt: Date.now(),
    };
  }),
}));
