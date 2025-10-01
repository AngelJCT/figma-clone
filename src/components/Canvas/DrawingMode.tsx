'use client';

import { useState, useRef } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { generateId } from '@/utils';
import { Position } from '@/types';

interface DrawingModeProps {
  viewport: { offsetX: number; offsetY: number; zoom: number };
}

export default function DrawingMode({ viewport }: DrawingModeProps) {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const addElement = useCanvasStore((state) => state.addElement);
  const setActiveTool = useCanvasStore((state) => state.setActiveTool);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [currentPos, setCurrentPos] = useState<Position | null>(null);

  if (activeTool === 'select' || activeTool === 'hand') {
    return null;
  }

  const screenToCanvas = (screenX: number, screenY: number) => {
    return {
      x: (screenX - viewport.offsetX) / viewport.zoom,
      y: (screenY - viewport.offsetY) / viewport.zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'text') {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      addElement({
        id: generateId(),
        type: 'text',
        name: 'Text',
        position: canvasPos,
        dimensions: { width: 200, height: 50 },
        rotation: 0,
        opacity: 1,
        zIndex: Object.keys(useCanvasStore.getState().elements).length + 1,
        locked: false,
        visible: true,
        properties: {
          text: 'Double click to edit',
          fontSize: 16,
          fontFamily: 'sans-serif',
          fontWeight: 400,
          fill: '#ffffff',
          textAlign: 'left',
        },
      });
      setActiveTool('select');
      return;
    }

    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setIsDrawing(true);
    setStartPos(canvasPos);
    setCurrentPos(canvasPos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos) return;
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setCurrentPos(canvasPos);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos || !currentPos) return;

    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width < 5 || height < 5) {
      setIsDrawing(false);
      setStartPos(null);
      setCurrentPos(null);
      return;
    }

    const position = {
      x: Math.min(startPos.x, currentPos.x),
      y: Math.min(startPos.y, currentPos.y),
    };

    const baseElement = {
      id: generateId(),
      position,
      dimensions: { width, height },
      rotation: 0,
      opacity: 1,
      zIndex: Object.keys(useCanvasStore.getState().elements).length + 1,
      locked: false,
      visible: true,
    };

    switch (activeTool) {
      case 'rectangle':
        addElement({
          ...baseElement,
          type: 'rectangle',
          name: 'Rectangle',
          properties: {
            fill: '#3b82f6',
            stroke: '#1e40af',
            strokeWidth: 2,
            borderRadius: 0,
          },
        });
        break;
      case 'circle':
        addElement({
          ...baseElement,
          type: 'circle',
          name: 'Circle',
          properties: {
            fill: '#ef4444',
            stroke: '#991b1b',
            strokeWidth: 2,
          },
        });
        break;
      case 'frame':
        addElement({
          ...baseElement,
          type: 'frame',
          name: 'Frame',
          properties: {
            fill: '#6b7280',
            stroke: '#374151',
            strokeWidth: 2,
            borderRadius: 8,
            padding: 16,
            layoutMode: 'none',
          },
        });
        break;
      case 'line':
        addElement({
          ...baseElement,
          type: 'line',
          name: 'Line',
          properties: {
            stroke: '#ffffff',
            strokeWidth: 2,
          },
        });
        break;
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
    setActiveTool('select');
  };

  const renderPreview = () => {
    if (!isDrawing || !startPos || !currentPos) return null;

    const x = Math.min(startPos.x, currentPos.x) * viewport.zoom + viewport.offsetX;
    const y = Math.min(startPos.y, currentPos.y) * viewport.zoom + viewport.offsetY;
    const width = Math.abs(currentPos.x - startPos.x) * viewport.zoom;
    const height = Math.abs(currentPos.y - startPos.y) * viewport.zoom;

    return (
      <div
        className="absolute border-2 border-blue-500 border-dashed bg-blue-500 bg-opacity-10 pointer-events-none"
        style={{
          left: x,
          top: y,
          width,
          height,
        }}
      />
    );
  };

  return (
    <div
      className="absolute inset-0 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {renderPreview()}
    </div>
  );
}
