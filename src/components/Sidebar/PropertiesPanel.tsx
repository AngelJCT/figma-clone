'use client';

import { useCanvasStore } from '@/store/useCanvasStore';

export default function PropertiesPanel() {
  const elements = useCanvasStore((state) => state.elements);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const updateElement = useCanvasStore((state) => state.updateElement);

  if (selectedElementIds.length === 0) {
    return (
      <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-gray-300">Properties</h2>
        </div>
        <div className="p-4 text-center text-gray-500 text-sm">
          Select an element to view properties
        </div>
      </div>
    );
  }

  const selectedElement = elements[selectedElementIds[0]];
  if (!selectedElement) return null;

  const handlePositionChange = (key: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    updateElement(selectedElement.id, {
      position: { ...selectedElement.position, [key]: numValue },
    });
  };

  const handleDimensionChange = (key: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    updateElement(selectedElement.id, {
      dimensions: { ...selectedElement.dimensions, [key]: numValue },
    });
  };

  const handlePropertyChange = (key: string, value: any) => {
    updateElement(selectedElement.id, {
      properties: { ...selectedElement.properties, [key]: value },
    });
  };

  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">Properties</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Name</label>
          <input
            type="text"
            value={selectedElement.name}
            onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
            className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">X</label>
            <input
              type="number"
              value={selectedElement.position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Y</label>
            <input
              type="number"
              value={selectedElement.position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Width</label>
            <input
              type="number"
              value={selectedElement.dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Height</label>
            <input
              type="number"
              value={selectedElement.dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle' || selectedElement.type === 'frame') && (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Fill</label>
              <input
                type="color"
                value={selectedElement.properties.fill || '#ffffff'}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="w-full h-8 bg-gray-700 rounded border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Stroke</label>
              <input
                type="color"
                value={selectedElement.properties.stroke || '#000000'}
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                className="w-full h-8 bg-gray-700 rounded border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Stroke Width</label>
              <input
                type="number"
                value={selectedElement.properties.strokeWidth || 1}
                onChange={(e) => handlePropertyChange('strokeWidth', parseFloat(e.target.value))}
                className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {(selectedElement.type === 'rectangle' || selectedElement.type === 'frame') && (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Border Radius</label>
                <input
                  type="number"
                  value={selectedElement.properties.borderRadius || 0}
                  onChange={(e) => handlePropertyChange('borderRadius', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </>
        )}

        {selectedElement.type === 'frame' && (
          <>
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 mb-3">Auto Layout</h3>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Layout Mode</label>
                <select
                  value={selectedElement.properties.layoutMode || 'none'}
                  onChange={(e) => handlePropertyChange('layoutMode', e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="none">None</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="grid">Grid</option>
                </select>
              </div>

              {selectedElement.properties.layoutMode && selectedElement.properties.layoutMode !== 'none' && (
                <>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Padding</label>
                    <input
                      type="number"
                      value={selectedElement.properties.padding || 0}
                      onChange={(e) => handlePropertyChange('padding', parseFloat(e.target.value))}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Gap</label>
                    <input
                      type="number"
                      value={selectedElement.properties.gap || 0}
                      onChange={(e) => handlePropertyChange('gap', parseFloat(e.target.value))}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Justify Content</label>
                    <select
                      value={selectedElement.properties.justifyContent || 'start'}
                      onChange={(e) => handlePropertyChange('justifyContent', e.target.value)}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                      <option value="start">Start</option>
                      <option value="center">Center</option>
                      <option value="end">End</option>
                      <option value="space-between">Space Between</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Align Items</label>
                    <select
                      value={selectedElement.properties.alignItems || 'start'}
                      onChange={(e) => handlePropertyChange('alignItems', e.target.value)}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                      <option value="start">Start</option>
                      <option value="center">Center</option>
                      <option value="end">End</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {selectedElement.type === 'line' && (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Stroke</label>
              <input
                type="color"
                value={selectedElement.properties.stroke || '#ffffff'}
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                className="w-full h-8 bg-gray-700 rounded border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Stroke Width</label>
              <input
                type="number"
                value={selectedElement.properties.strokeWidth || 2}
                onChange={(e) => handlePropertyChange('strokeWidth', parseFloat(e.target.value))}
                className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}

        {selectedElement.type === 'text' && (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Text</label>
              <textarea
                value={selectedElement.properties.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Size</label>
              <input
                type="number"
                value={selectedElement.properties.fontSize || 16}
                onChange={(e) => handlePropertyChange('fontSize', parseFloat(e.target.value))}
                className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Color</label>
              <input
                type="color"
                value={selectedElement.properties.fill || '#000000'}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="w-full h-8 bg-gray-700 rounded border border-gray-600"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs text-gray-400 mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedElement.opacity}
            onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
