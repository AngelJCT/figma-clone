import { useEffect } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';

export const useKeyboardShortcuts = () => {
  const setActiveTool = useCanvasStore((state) => state.setActiveTool);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const deleteElement = useCanvasStore((state) => state.deleteElement);
  const elements = useCanvasStore((state) => state.elements);
  const addElement = useCanvasStore((state) => state.addElement);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const zoom = useCanvasStore((state) => state.zoom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'v') {
        setActiveTool('select');
      } else if (e.key === 'h') {
        setActiveTool('hand');
      } else if (e.key === 'f') {
        setActiveTool('frame');
      } else if (e.key === 'r') {
        setActiveTool('rectangle');
      } else if (e.key === 'c') {
        setActiveTool('circle');
      } else if (e.key === 't') {
        setActiveTool('text');
      } else if (e.key === 'i') {
        setActiveTool('image');
      } else if (e.key === 'l') {
        setActiveTool('line');
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        selectedElementIds.forEach((id) => deleteElement(id));
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        selectedElementIds.forEach((id) => {
          const element = elements[id];
          if (element) {
            addElement({
              ...element,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              position: {
                x: element.position.x + 20,
                y: element.position.y + 20,
              },
            });
          }
        });
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault();
        zoom(0.1);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        zoom(-0.1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool, selectedElementIds, deleteElement, elements, addElement, undo, redo, zoom]);
};
