import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { UndoIcon } from './icons/UndoIcon';
import { TrashIcon } from './icons/TrashIcon';
import { RedoIcon } from './icons/RedoIcon';
import type { EditorTool } from '../views/EditorView';
import { ResetViewIcon } from './icons/ResetViewIcon';

interface ImageEditorCanvasProps {
  imageSrc: string | null;
  tool: EditorTool;
  brushColor: string;
  brushSize: number;
  isMaskVisible: boolean;
  onStrokeComplete: (color: string) => void;
  onClear: () => void;
  onUndoToEmpty: () => void;
  t: TFunction;
}

export const ImageEditorCanvas = forwardRef<
    { getCanvasDataUrl: () => string | undefined; clearCanvas: () => void; },
    ImageEditorCanvasProps
>(({
  imageSrc,
  tool,
  brushColor,
  brushSize,
  isMaskVisible,
  onStrokeComplete,
  onClear,
  onUndoToEmpty,
  t
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number, y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);

  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  
  const handleInternalClear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
      setRedoHistory([]);
      setTransform({ scale: 1, x: 0, y: 0 }); // Reset zoom/pan
    }
  };

  useImperativeHandle(ref, () => ({
    getCanvasDataUrl: () => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            return tempCanvas.toDataURL('image/png');
        }
        return canvas.toDataURL('image/png');
    },
    clearCanvas: handleInternalClear,
  }));
  
    const resizeCanvas = () => {
        const image = imageRef.current;
        const canvas = canvasRef.current;
        if (image && canvas && image.naturalWidth > 0) {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
        }
    };
    
    // Keyboard listener for panning
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsSpacePressed(true);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsSpacePressed(false);
                setIsPanning(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

  useEffect(() => {
    if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            if (imageRef.current) {
                imageRef.current.src = image.src;
            }
            // Wait for image to render to get correct dimensions
            setTimeout(() => {
                resizeCanvas();
                handleInternalClear();
            }, 0);
        };
    }
  }, [imageSrc]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) return null;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Mouse position relative to the container element
    const mouseXInContainer = clientX - rect.left;
    const mouseYInContainer = clientY - rect.top;

    // Reverse the CSS transform to find where the click happened on the untransformed element
    const mouseXOnElement = (mouseXInContainer - transform.x) / transform.scale;
    const mouseYOnElement = (mouseYInContainer - transform.y) / transform.scale;
    
    // Map the coordinates from the element's display size to the canvas's internal resolution
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    
    const finalX = mouseXOnElement * scaleX;
    const finalY = mouseYOnElement * scaleY;

    return { x: finalX, y: finalY };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
    const coords = getCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setLastPosition(coords);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const currentPosition = getCoordinates(e);
    if (context && currentPosition && lastPosition && canvas.clientWidth > 0) {
      context.beginPath();
      context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      context.strokeStyle = brushColor;
      // Adjust brush size to appear consistent on screen, regardless of zoom or canvas resolution.
      const canvasToDisplayScale = canvas.width / canvas.clientWidth;
      context.lineWidth = (brushSize * canvasToDisplayScale) / transform.scale;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.globalAlpha = 0.5;
      context.moveTo(lastPosition.x, lastPosition.y);
      context.lineTo(currentPosition.x, currentPosition.y);
      context.stroke();
      setLastPosition(currentPosition);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPosition(null);
    const canvas = canvasRef.current;
    if (canvas) {
        setHistory(prev => [...prev, canvas.toDataURL()]);
        setRedoHistory([]);
        onStrokeComplete(brushColor);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
      if (isSpacePressed) {
          setIsPanning(true);
          panStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
      } else {
          startDrawing(e);
      }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
      if (isPanning) {
          const x = e.clientX - panStart.current.x;
          const y = e.clientY - panStart.current.y;
          setTransform(prev => ({ ...prev, x, y }));
      } else {
          draw(e);
      }
  };
  
  const handleMouseUp = () => {
      if (isPanning) setIsPanning(false);
      else stopDrawing();
  };
  
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setTransform(prevTransform => {
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.max(0.5, Math.min(5, prevTransform.scale + scaleAmount));
        
        const newX = mouseX - (mouseX - prevTransform.x) * (newScale / prevTransform.scale);
        const newY = mouseY - (mouseY - prevTransform.y) * (newScale / prevTransform.scale);

        return { scale: newScale, x: newX, y: newY };
    });
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (node) {
        node.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            node.removeEventListener('wheel', handleWheel);
        };
    }
  }, [handleWheel]);
  
  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setRedoHistory(prev => [lastState, ...prev]);
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    const prevStateUrl = newHistory[newHistory.length - 1] || null;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (prevStateUrl) {
        const img = new Image();
        img.onload = () => context.drawImage(img, 0, 0);
        img.src = prevStateUrl;
    } else {
        onUndoToEmpty();
    }
  };
  
  const handleRedo = () => {
      if (redoHistory.length === 0) return;
      const nextState = redoHistory[0];
      const newRedoHistory = redoHistory.slice(1);
      setRedoHistory(newRedoHistory);
      setHistory(prev => [...prev, nextState]);
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;
      const img = new Image();
      img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
      };
      img.src = nextState;
  };

  if (!imageSrc) return null;
  
  const cursorClass = isSpacePressed ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-crosshair';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-auto aspect-[${imageRef.current?.naturalWidth || 1}/${imageRef.current?.naturalHeight || 1}] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-900 ${cursorClass}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={startDrawing} // Basic touch drawing, no pan/zoom
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    >
      <img
        ref={imageRef}
        alt="base for editing"
        className="absolute top-0 left-0 w-full h-full object-contain select-none pointer-events-none"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: 'top left' }}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full touch-none pointer-events-none ${!isMaskVisible ? 'hidden' : ''}`}
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: 'top left' }}
      />
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-accent-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors"
              aria-label={t('undo_mask')}
              title={t('undo_mask')}
          >
              <UndoIcon />
          </button>
          <button
              onClick={handleRedo}
              disabled={redoHistory.length === 0}
              className="p-2 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-accent-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors"
              aria-label={t('redo_mask')}
              title={t('redo_mask')}
          >
              <RedoIcon />
          </button>
      </div>
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
            onClick={() => setTransform({ scale: 1, x: 0, y: 0 })}
            className="p-2 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"
            aria-label={t('reset_view')}
            title={t('reset_view')}
        >
            <ResetViewIcon />
        </button>
        <button
            onClick={() => {
                handleInternalClear();
                onClear();
            }}
            disabled={history.length === 0}
            className="p-2 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-accent-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors"
            aria-label={t('clear_mask')}
            title={t('clear_mask')}
        >
            <TrashIcon />
        </button>
      </div>
    </div>
  );
});