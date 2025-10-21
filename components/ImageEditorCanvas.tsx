import React, { useRef, useEffect, useState } from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { UndoIcon } from './icons/UndoIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageEditorCanvasProps {
  imageSrc: string | null;
  brushColor: string;
  brushSize: number;
  onMaskChange: (maskDataUrl: string) => void;
  onClear: () => void;
  t: TFunction;
}

export const ImageEditorCanvas: React.FC<ImageEditorCanvasProps> = ({
  imageSrc,
  brushColor,
  brushSize,
  onMaskChange,
  onClear,
  t
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number, y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const generateAndPropagateMask = (sourceCanvas: HTMLCanvasElement) => {
    const image = imageRef.current;
    if (sourceCanvas && image && image.naturalWidth > 0) {
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = image.naturalWidth;
      maskCanvas.height = image.naturalHeight;
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.drawImage(sourceCanvas, 0, 0, image.naturalWidth, image.naturalHeight);
        const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) { // If pixel has any opacity
            data[i] = 255;     // R
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
            data[i + 3] = 255; // A
          }
        }
        maskCtx.putImageData(imageData, 0, 0);
        onMaskChange(maskCanvas.toDataURL('image/png'));
      }
    }
  };

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
            handleClear(); // Clear canvas and history for new image
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
        generateAndPropagateMask(canvas);
    }
  };
  
  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
      onClear();
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
            generateAndPropagateMask(canvas);
        };
        img.src = prevStateUrl;
    } else {
        onClear(); // We've undone back to a blank state
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
          onClick={handleClear}
          disabled={history.length === 0}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-accent-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors"
          aria-label={t('clear_mask')}
          title={t('clear_mask')}
      >
          <TrashIcon />
      </button>
    </div>
  );
};