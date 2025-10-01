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



  const handleAddArtboard = () => {
    setIsTemplateSelectorOpen(true);
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Figma Clone</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddArtboard}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
          >
            New Artboard
          </button>
          <div className="h-6 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              Zoom: {Math.round(viewport.zoom * 100)}%
            </span>
            <button
              onClick={() => zoom(0.1)}
              className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded"
            >
              +
            </button>
            <button
              onClick={() => zoom(-0.1)}
              className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded"
            >
              -
            </button>
          </div>
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
