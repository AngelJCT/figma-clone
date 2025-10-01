'use client';

import { useCanvasStore } from '@/store/useCanvasStore';

export default function LayersPanel() {
  const elements = useCanvasStore((state) => state.elements);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const selectElement = useCanvasStore((state) => state.selectElement);
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const deleteElement = useCanvasStore((state) => state.deleteElement);

  const elementList = Object.values(elements).sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">Layers</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {elementList.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No layers yet
          </div>
        ) : (
          <div className="p-2">
            {elementList.map((element) => (
              <div
                key={element.id}
                onClick={() => selectElement(element.id)}
                className={`p-2 rounded mb-1 cursor-pointer flex items-center justify-between ${
                  selectedElementIds.includes(element.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{element.type.toUpperCase()}</span>
                  <span className="text-sm">{element.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(element.id);
                  }}
                  className="text-xs opacity-50 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
