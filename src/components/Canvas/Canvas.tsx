'use client';

import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { screenToCanvas, isPointInRect } from '@/utils';
import { CANVAS_BACKGROUND, MIN_ZOOM, MAX_ZOOM } from '@/constants';
import TransformControls from './TransformControls';
import EmptyState from './EmptyState';
import DrawingMode from './DrawingMode';

interface CanvasProps {
  onCreateArtboard: () => void;
}

export default function Canvas({ onCreateArtboard }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const viewport = useCanvasStore((state) => state.viewport);
  const pan = useCanvasStore((state) => state.pan);
  const zoom = useCanvasStore((state) => state.zoom);
  const elements = useCanvasStore((state) => state.elements);
  const artboards = useCanvasStore((state) => state.artboards);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const selectElement = useCanvasStore((state) => state.selectElement);
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const selectedArtboardId = useCanvasStore((state) => state.selectedArtboardId);
  const setSelectedArtboard = useCanvasStore((state) => state.setSelectedArtboard);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCanvas(ctx);
  }, [viewport, elements, artboards]);

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CANVAS_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(viewport.offsetX, viewport.offsetY);
    ctx.scale(viewport.zoom, viewport.zoom);

    drawGrid(ctx);
    drawArtboards(ctx);
    drawElements(ctx);

    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 20;
    const canvas = ctx.canvas;
    const startX = Math.floor(-viewport.offsetX / viewport.zoom / gridSize) * gridSize;
    const startY = Math.floor(-viewport.offsetY / viewport.zoom / gridSize) * gridSize;
    const endX = startX + canvas.width / viewport.zoom + gridSize;
    const endY = startY + canvas.height / viewport.zoom + gridSize;

    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 1 / viewport.zoom;
    ctx.beginPath();

    for (let x = startX; x < endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }

    for (let y = startY; y < endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }

    ctx.stroke();
  };

  const drawArtboards = (ctx: CanvasRenderingContext2D) => {
    artboards.forEach((artboard) => {
      const isSelected = artboard.id === selectedArtboardId;
      
      ctx.fillStyle = artboard.backgroundColor;
      ctx.fillRect(artboard.position.x, artboard.position.y, artboard.width, artboard.height);

      ctx.strokeStyle = isSelected ? '#3b82f6' : '#666';
      ctx.lineWidth = (isSelected ? 3 : 2) / viewport.zoom;
      ctx.strokeRect(artboard.position.x, artboard.position.y, artboard.width, artboard.height);

      ctx.fillStyle = isSelected ? '#3b82f6' : '#fff';
      ctx.font = `${14 / viewport.zoom}px sans-serif`;
      ctx.fillText(artboard.name, artboard.position.x, artboard.position.y - 10 / viewport.zoom);
    });
  };

  const drawElements = (ctx: CanvasRenderingContext2D) => {
    Object.values(elements).forEach((element) => {
      if (!element.visible) return;

      ctx.save();
      ctx.globalAlpha = element.opacity;
      ctx.translate(
        element.position.x + element.dimensions.width / 2,
        element.position.y + element.dimensions.height / 2
      );
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(
        -(element.position.x + element.dimensions.width / 2),
        -(element.position.y + element.dimensions.height / 2)
      );

      switch (element.type) {
        case 'rectangle':
        case 'frame':
          drawRectangle(ctx, element);
          break;
        case 'circle':
          drawCircle(ctx, element);
          break;
        case 'text':
          drawText(ctx, element);
          break;
        case 'line':
          drawLine(ctx, element);
          break;
      }

      ctx.restore();
    });
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, element: any) => {
    const { position, dimensions, properties } = element;
    
    if (properties.fill) {
      ctx.fillStyle = properties.fill;
      if (properties.borderRadius) {
        roundRect(ctx, position.x, position.y, dimensions.width, dimensions.height, properties.borderRadius);
        ctx.fill();
      } else {
        ctx.fillRect(position.x, position.y, dimensions.width, dimensions.height);
      }
    }

    if (properties.stroke) {
      ctx.strokeStyle = properties.stroke;
      ctx.lineWidth = (properties.strokeWidth || 1) / viewport.zoom;
      if (properties.borderRadius) {
        roundRect(ctx, position.x, position.y, dimensions.width, dimensions.height, properties.borderRadius);
        ctx.stroke();
      } else {
        ctx.strokeRect(position.x, position.y, dimensions.width, dimensions.height);
      }
    }

    if (element.type === 'frame' && properties.layoutMode && properties.layoutMode !== 'none') {
      const padding = properties.padding || 0;
      ctx.save();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1 / viewport.zoom;
      ctx.setLineDash([4 / viewport.zoom, 4 / viewport.zoom]);
      ctx.strokeRect(
        position.x + padding,
        position.y + padding,
        dimensions.width - padding * 2,
        dimensions.height - padding * 2
      );
      ctx.restore();
    }
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, element: any) => {
    const { position, dimensions, properties } = element;
    const centerX = position.x + dimensions.width / 2;
    const centerY = position.y + dimensions.height / 2;
    const radiusX = dimensions.width / 2;
    const radiusY = dimensions.height / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);

    if (properties.fill) {
      ctx.fillStyle = properties.fill;
      ctx.fill();
    }

    if (properties.stroke) {
      ctx.strokeStyle = properties.stroke;
      ctx.lineWidth = (properties.strokeWidth || 1) / viewport.zoom;
      ctx.stroke();
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D, element: any) => {
    const { position, properties } = element;
    const fontSize = properties.fontSize || 16;
    const fontFamily = properties.fontFamily || 'sans-serif';
    const fontWeight = properties.fontWeight || 400;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = properties.fill || '#000';
    ctx.textAlign = properties.textAlign || 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(properties.text || '', position.x, position.y);
  };

  const drawLine = (ctx: CanvasRenderingContext2D, element: any) => {
    const { position, dimensions, properties } = element;
    
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + dimensions.width, position.y + dimensions.height);
    
    if (properties.stroke) {
      ctx.strokeStyle = properties.stroke;
      ctx.lineWidth = (properties.strokeWidth || 2) / viewport.zoom;
      ctx.stroke();
    }
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY * 0.01;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewport.zoom + delta));
      zoom(newZoom - viewport.zoom);
    } else {
      pan(-e.deltaX, -e.deltaY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'hand' || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (activeTool === 'select') {
      const canvasPos = screenToCanvas(e.clientX, e.clientY, viewport);
      let elementClicked = false;
      let artboardClicked = false;

      for (const element of Object.values(elements).sort((a, b) => b.zIndex - a.zIndex)) {
        if (isPointInRect(canvasPos, {
          x: element.position.x,
          y: element.position.y,
          width: element.dimensions.width,
          height: element.dimensions.height,
        })) {
          selectElement(element.id);
          elementClicked = true;
          break;
        }
      }

      if (!elementClicked) {
        for (const artboard of artboards) {
          if (isPointInRect(canvasPos, {
            x: artboard.position.x,
            y: artboard.position.y,
            width: artboard.width,
            height: artboard.height,
          })) {
            setSelectedArtboard(artboard.id);
            artboardClicked = true;
            break;
          }
        }
      }

      if (!elementClicked && !artboardClicked) {
        clearSelection();
        setSelectedArtboard(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      pan(dx, dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className={activeTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
      />
      {artboards.length === 0 && <EmptyState onCreateArtboard={onCreateArtboard} />}
      <DrawingMode viewport={viewport} />
      {selectedElementIds.map((id) => {
        const element = elements[id];
        if (!element) return null;
        return <TransformControls key={id} element={element} viewport={viewport} />;
      })}
    </div>
  );
}
