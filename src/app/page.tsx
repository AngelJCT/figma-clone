'use client';

import { useState } from 'react';
import Canvas from '@/components/Canvas/Canvas';
import Toolbar from '@/components/Toolbar/Toolbar';
import LayersPanel from '@/components/Sidebar/LayersPanel';
import PropertiesPanel from '@/components/Sidebar/PropertiesPanel';
import TemplateSelector from '@/components/Templates/TemplateSelector';
import ArtboardList from '@/components/Templates/ArtboardList';
import { useCanvasStore } from '@/store/useCanvasStore';
import { generateId } from '@/utils';
import { DEFAULT_ELEMENT_PROPERTIES } from '@/constants';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Home() {
  useKeyboardShortcuts();
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  
  const addElement = useCanvasStore((state) => state.addElement);
  const addArtboard = useCanvasStore((state) => state.addArtboard);
  const viewport = useCanvasStore((state) => state.viewport);
  const zoom = useCanvasStore((state) => state.zoom);

  const handleAddRectangle = () => {
    addElement({
      id: generateId(),
      type: 'rectangle',
      name: 'Rectangle',
      position: { x: 100, y: 100 },
      dimensions: { width: 200, height: 150 },
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      properties: {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
        borderRadius: 8,
      },
    });
  };

  const handleAddCircle = () => {
    addElement({
      id: generateId(),
      type: 'circle',
      name: 'Circle',
      position: { x: 350, y: 100 },
      dimensions: { width: 150, height: 150 },
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      properties: {
        fill: '#ef4444',
        stroke: '#991b1b',
        strokeWidth: 2,
      },
    });
  };

  const handleAddText = () => {
    addElement({
      id: generateId(),
      type: 'text',
      name: 'Text',
      position: { x: 100, y: 300 },
      dimensions: { width: 300, height: 50 },
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      properties: {
        text: 'Hello, Figma Clone!',
        fontSize: 32,
        fontFamily: 'sans-serif',
        fontWeight: 700,
        fill: '#ffffff',
        textAlign: 'left',
      },
    });
  };

  const handleAddArtboard = () => {
    setIsTemplateSelectorOpen(true);
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Figma Clone</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddArtboard}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Add Artboard
          </button>
          <button
            onClick={handleAddRectangle}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            Add Rectangle
          </button>
          <button
            onClick={handleAddCircle}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Add Circle
          </button>
          <button
            onClick={handleAddText}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
          >
            Add Text
          </button>
          <div className="text-xs text-gray-400 ml-4">
            Zoom: {Math.round(viewport.zoom * 100)}%
          </div>
          <button
            onClick={() => zoom(0.1)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            +
          </button>
          <button
            onClick={() => zoom(-0.1)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            -
          </button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <Toolbar />
        <Canvas onCreateArtboard={handleAddArtboard} />
        <div className="flex">
          <ArtboardList />
          <LayersPanel />
          <PropertiesPanel />
        </div>
      </main>
      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
      />
    </div>
  );
}
