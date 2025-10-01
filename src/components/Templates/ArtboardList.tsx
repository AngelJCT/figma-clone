'use client';

import { useCanvasStore } from '@/store/useCanvasStore';

export default function ArtboardList() {
  const artboards = useCanvasStore((state) => state.artboards);
  const selectedArtboardId = useCanvasStore((state) => state.selectedArtboardId);
  const setSelectedArtboard = useCanvasStore((state) => state.setSelectedArtboard);
  const deleteArtboard = useCanvasStore((state) => state.deleteArtboard);

  if (artboards.length === 0) {
    return null;
  }

  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">Artboards</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {artboards.map((artboard) => (
          <div
            key={artboard.id}
            onClick={() => setSelectedArtboard(artboard.id)}
            className={`p-3 rounded mb-2 cursor-pointer transition-colors ${
              selectedArtboardId === artboard.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{artboard.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteArtboard(artboard.id);
                }}
                className="text-xs opacity-50 hover:opacity-100"
              >
                ×
              </button>
            </div>
            <div className="text-xs opacity-75">
              {artboard.width} × {artboard.height}
            </div>
            <div className="text-xs opacity-75">
              Position: {Math.round(artboard.position.x)}, {Math.round(artboard.position.y)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
