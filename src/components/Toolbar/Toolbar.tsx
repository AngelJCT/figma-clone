'use client';

import { useCanvasStore } from '@/store/useCanvasStore';
import { Tool } from '@/types';

const tools: { id: Tool; label: string; icon: string; shortcut: string }[] = [
  { id: 'select', label: 'Select', icon: 'V', shortcut: 'V' },
  { id: 'hand', label: 'Hand', icon: 'H', shortcut: 'H' },
  { id: 'frame', label: 'Frame', icon: 'F', shortcut: 'F' },
  { id: 'rectangle', label: 'Rectangle', icon: 'R', shortcut: 'R' },
  { id: 'circle', label: 'Circle', icon: 'C', shortcut: 'C' },
  { id: 'text', label: 'Text', icon: 'T', shortcut: 'T' },
  { id: 'image', label: 'Image', icon: 'I', shortcut: 'I' },
  { id: 'line', label: 'Line', icon: 'L', shortcut: 'L' },
];

export default function Toolbar() {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setActiveTool = useCanvasStore((state) => state.setActiveTool);

  return (
    <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
            activeTool === tool.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title={`${tool.label} (${tool.shortcut})`}
        >
          <span className="font-bold text-lg">{tool.icon}</span>
        </button>
      ))}
    </div>
  );
}
