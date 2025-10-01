'use client';

import { CanvasElement } from '@/types';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useState, useRef } from 'react';

interface TransformControlsProps {
  element: CanvasElement;
  viewport: { offsetX: number; offsetY: number; zoom: number };
}

export default function TransformControls({ element, viewport }: TransformControlsProps) {
  const updateElement = useCanvasStore((state) => state.updateElement);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    e.stopPropagation();
    
    if (handle) {
      setIsResizing(handle);
      setElementStart({
        x: element.position.x,
        y: element.position.y,
        width: element.dimensions.width,
        height: element.dimensions.height,
      });
    } else {
      setIsDragging(true);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const dx = (e.clientX - dragStart.x) / viewport.zoom;
    const dy = (e.clientY - dragStart.y) / viewport.zoom;

    if (isDragging) {
      updateElement(element.id, {
        position: {
          x: element.position.x + dx,
          y: element.position.y + dy,
        },
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing) {
      handleResize(isResizing, dx, dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleResize = (handle: string, dx: number, dy: number) => {
    const updates: any = { position: { ...element.position }, dimensions: { ...element.dimensions } };

    switch (handle) {
      case 'nw':
        updates.position.x = element.position.x + dx;
        updates.position.y = element.position.y + dy;
        updates.dimensions.width = element.dimensions.width - dx;
        updates.dimensions.height = element.dimensions.height - dy;
        break;
      case 'n':
        updates.position.y = element.position.y + dy;
        updates.dimensions.height = element.dimensions.height - dy;
        break;
      case 'ne':
        updates.position.y = element.position.y + dy;
        updates.dimensions.width = element.dimensions.width + dx;
        updates.dimensions.height = element.dimensions.height - dy;
        break;
      case 'e':
        updates.dimensions.width = element.dimensions.width + dx;
        break;
      case 'se':
        updates.dimensions.width = element.dimensions.width + dx;
        updates.dimensions.height = element.dimensions.height + dy;
        break;
      case 's':
        updates.dimensions.height = element.dimensions.height + dy;
        break;
      case 'sw':
        updates.position.x = element.position.x + dx;
        updates.dimensions.width = element.dimensions.width - dx;
        updates.dimensions.height = element.dimensions.height + dy;
        break;
      case 'w':
        updates.position.x = element.position.x + dx;
        updates.dimensions.width = element.dimensions.width - dx;
        break;
    }

    if (updates.dimensions.width > 10 && updates.dimensions.height > 10) {
      updateElement(element.id, updates);
    }
  };

  const screenX = element.position.x * viewport.zoom + viewport.offsetX;
  const screenY = element.position.y * viewport.zoom + viewport.offsetY;
  const screenWidth = element.dimensions.width * viewport.zoom;
  const screenHeight = element.dimensions.height * viewport.zoom;

  const handles = [
    { id: 'nw', x: -4, y: -4, cursor: 'nwse-resize' },
    { id: 'n', x: screenWidth / 2 - 4, y: -4, cursor: 'ns-resize' },
    { id: 'ne', x: screenWidth - 4, y: -4, cursor: 'nesw-resize' },
    { id: 'e', x: screenWidth - 4, y: screenHeight / 2 - 4, cursor: 'ew-resize' },
    { id: 'se', x: screenWidth - 4, y: screenHeight - 4, cursor: 'nwse-resize' },
    { id: 's', x: screenWidth / 2 - 4, y: screenHeight - 4, cursor: 'ns-resize' },
    { id: 'sw', x: -4, y: screenHeight - 4, cursor: 'nesw-resize' },
    { id: 'w', x: -4, y: screenHeight / 2 - 4, cursor: 'ew-resize' },
  ];

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: screenX,
        top: screenY,
        width: screenWidth,
        height: screenHeight,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute inset-0 border-2 border-blue-500 cursor-move"
        onMouseDown={(e) => handleMouseDown(e)}
      />
      
      {handles.map((handle) => (
        <div
          key={handle.id}
          className="absolute w-2 h-2 bg-white border border-blue-500"
          style={{
            left: handle.x,
            top: handle.y,
            cursor: handle.cursor,
          }}
          onMouseDown={(e) => handleMouseDown(e, handle.id)}
        />
      ))}
    </div>
  );
}
