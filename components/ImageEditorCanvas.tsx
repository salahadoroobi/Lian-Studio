import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { UndoIcon } from './icons/UndoIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageEditorCanvasProps {
  imageSrc: string | null;
  brushColor: string;
  brushSize: number;
  onStrokeComplete: (color: string) => void;
  onClear: () => void;
  t: TFunction;
}

export const ImageEditorCanvas = forwardRef<
    { getCanvasDataUrl: () => string | undefined; clearCanvas: () => void; },
    ImageEditorCanvasProps
>(({
  imageSrc,
  brushColor,
  brushSize,
  onStrokeComplete,
  onClear,
  t
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number, y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  
  const handleInternalClear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
    }
  };

  useImperativeHandle(ref, () => ({
    getCanvasDataUrl: () => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        // To handle transparency properly, draw the colored mask onto a white background
        // before sending it to the model.
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
    if (image && canvas) {
      const { width, height } = image.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }
  };

  useEffect(() => {
    if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            resizeCanvas();
            handleInternalClear();
        };
    }
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [imageSrc]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
        if (e.touches.length > 0) {
            e.preventDefault();
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            return null; // No touches to process
        }
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setLastPosition(coords);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const currentPosition = getCoordinates(e);
    if (context && currentPosition && lastPosition) {
      context.beginPath();
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.globalAlpha = 0.5; // semi-transparent mask
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
        onStrokeComplete(brushColor);
    }
  };
  
  const handleUndo = () => {
    if (history.length === 0) return;

    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    const prevStateUrl = newHistory[newHistory.length - 1] || null;
    
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (prevStateUrl) {
        const img = new Image();
        img.onload = () => {
            context.drawImage(img, 0, 0);
        };
        img.src = prevStateUrl;
    } else {
        // We've undone back to a blank state, let the parent know.
        onClear();
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="base for editing"
        className="w-full h-auto rounded-lg select-none"
        onLoad={resizeCanvas}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-accent-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors"
          aria-label={t('undo_mask')}
          title={t('undo_mask')}
      >
          <UndoIcon />
      </button>
      <button
          onClick={() => {
              handleInternalClear();
              onClear();
          }}
          disabled={history.length === 0}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-accent-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors"
          aria-label={t('clear_mask')}
          title={t('clear_mask')}
      >
          <TrashIcon />
      </button>
    </div>
  );
});