import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useLayoutEffect,
} from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ResetViewIcon } from './icons/ResetViewIcon';
import type { EditorTool } from '../views/EditorView';
import { HandIcon } from './icons/HandIcon';
import { BrushIcon } from './icons/BrushIcon';
import { EraserIcon } from './icons/EraserIcon';

interface Point {
  x: number;
  y: number;
}

interface Path {
  points: Point[];
  color: string;
  size: number;
  tool: EditorTool;
}

interface ImageEditorCanvasProps {
  imageSrc?: string;
  tool: EditorTool;
  setTool: (tool: EditorTool) => void;
  brushColor: string;
  brushSize: number;
  isMaskVisible: boolean;
  onStrokeComplete: (color: string) => void;
  onClear: () => void;
  onUndoToEmpty: () => void;
  t: TFunction;
}

export type CanvasHandle = {
  getCanvasDataUrl: () => string | undefined;
  clearCanvas: () => void;
};

export const ImageEditorCanvas = forwardRef<CanvasHandle, ImageEditorCanvasProps>(
  (
    {
      imageSrc,
      tool,
      setTool,
      brushColor,
      brushSize,
      isMaskVisible,
      onStrokeComplete,
      onClear,
      onUndoToEmpty,
      t,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const initialOffsetRef = useRef({ x: 0, y: 0 });

    const [isDrawing, setIsDrawing] = useState(false);
    const [paths, setPaths] = useState<Path[]>([]);
    const [history, setHistory] = useState<Path[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [isGrabbing, setIsGrabbing] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    const getCanvasContext = () => canvasRef.current?.getContext('2d');

    const drawPath = useCallback((ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.beginPath();
      ctx.strokeStyle = path.tool === 'brush' ? path.color : 'black';
      ctx.lineWidth = path.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = path.tool === 'brush' ? 'source-over' : 'destination-out';

      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }
      }
      ctx.stroke();
    }, []);

    const pathsRef = useRef(paths);
    pathsRef.current = paths;

    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = getCanvasContext();
        if (!canvas || !ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        pathsRef.current.forEach(path => drawPath(ctx, path));
    }, [drawPath]);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const imageContainer = imageContainerRef.current;
        if (canvas && imageContainer) {
            const { width, height } = imageContainer.getBoundingClientRect();
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                redrawCanvas();
            }
        }
    }, [redrawCanvas]);

    useEffect(() => {
        redrawCanvas();
    }, [paths, redrawCanvas]);

    useEffect(() => {
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);
    
    useLayoutEffect(() => {
        const container = containerRef.current;
        const imageContainer = imageContainerRef.current;
        if (imageSrc && container && imageContainer && transform.scale === 1) {
            const containerRect = container.getBoundingClientRect();
            const imageContainerRect = imageContainer.getBoundingClientRect();
            initialOffsetRef.current = {
                x: imageContainerRect.left - containerRect.left,
                y: imageContainerRect.top - containerRect.top,
            };
        }
    }, [imageSrc, transform.scale]);

    const getPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left),
        y: (clientY - rect.top),
      };
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
      if (isPanning || tool === 'pan' || ('button' in e && e.button !== 0)) return;
      setIsDrawing(true);
      const point = getPoint(e);
      if (!point) return;

      const newPath: Path = {
        points: [point],
        color: brushColor,
        size: brushSize,
        tool,
      };
      setPaths(prevPaths => [...prevPaths, newPath]);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const point = getPoint(e);
      if (!point) return;
      setPaths(prevPaths => {
        const currentPath = prevPaths[prevPaths.length - 1];
        const updatedPath = {
          ...currentPath,
          points: [...currentPath.points, point],
        };
        return [...prevPaths.slice(0, -1), updatedPath];
      });
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      setIsDrawing(false);

      if (paths.length > 0 && tool === 'brush') {
        const lastPathColor = paths[paths.length - 1].color;
        onStrokeComplete(lastPathColor);
      }
      
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, paths]);
      setHistoryIndex(newHistory.length);
    };

    useEffect(() => {
      const container = containerRef.current;

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!container) return;
    
        const rect = container.getBoundingClientRect();
        const mouseX_container = e.clientX - rect.left;
        const mouseY_container = e.clientY - rect.top;
        
        const point = {
            x: mouseX_container - initialOffsetRef.current.x,
            y: mouseY_container - initialOffsetRef.current.y,
        };
    
        const scaleAmount = -e.deltaY * 0.005;
    
        setTransform(prev => {
          const newScale = Math.max(0.5, Math.min(5, prev.scale + scaleAmount));
    
          if (Math.abs(newScale - 1) < 0.05) {
            return { x: 0, y: 0, scale: 1 };
          }
          
          const newX = point.x - (point.x - prev.x) * (newScale / prev.scale);
          const newY = point.y - (point.y - prev.y) * (newScale / prev.scale);
    
          return { x: newX, y: newY, scale: newScale };
        });
      };
      
      if (container) {
          container.addEventListener('wheel', handleWheel, { passive: false });
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && !isPanning) {
          e.preventDefault();
          setIsPanning(true);
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          setIsPanning(false);
          setIsGrabbing(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        if (container) {
            container.removeEventListener('wheel', handleWheel);
        }
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, [isPanning]);
    
    const localUndo = useCallback(() => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setPaths(history[newIndex]);
        if (history[newIndex].length === 0) {
          onUndoToEmpty();
        }
      }
    }, [history, historyIndex, onUndoToEmpty]);

    const localRedo = useCallback(() => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setPaths(history[newIndex]);
      }
    }, [history, historyIndex]);

    const localClearCanvas = useCallback(() => {
      setPaths([]);
      setHistory([[]]);
      setHistoryIndex(0);
      onClear();
    }, [onClear]);

    const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

    const handleImageLoad = useCallback(() => {
        const image = imageRef.current;
        const imageContainer = imageContainerRef.current;
        if (image && image.complete && imageContainer) {
            const { naturalWidth, naturalHeight } = image;
            if (naturalWidth > 0 && naturalHeight > 0) {
                imageContainer.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;
            }
        }
        resetView();
        queueMicrotask(() => {
            resizeCanvas();
        });
        localClearCanvas();
    }, [resizeCanvas, localClearCanvas]);


    useImperativeHandle(ref, () => ({
      getCanvasDataUrl: () => {
        const canvas = canvasRef.current;
        if (!canvas || paths.length === 0) return undefined;
        const originalCanvas = document.createElement('canvas');
        const image = imageRef.current;
        if (!image || !image.complete || image.naturalWidth === 0) return undefined;
        
        originalCanvas.width = image.naturalWidth;
        originalCanvas.height = image.naturalHeight;
        const ctx = originalCanvas.getContext('2d');
        if (!ctx) return undefined;
        
        const scaleX = image.naturalWidth / canvas.width;
        const scaleY = image.naturalHeight / canvas.height;
        
        ctx.save();
        ctx.scale(scaleX, scaleY);
        paths.forEach(path => drawPath(ctx, path));
        ctx.restore();
        
        return originalCanvas.toDataURL('image/png');
      },
      clearCanvas: localClearCanvas,
    }));
    
    const isPanActive = isPanning || tool === 'pan';
    const cursor = isGrabbing ? 'grabbing' : isPanActive ? 'grab' : 'crosshair';

    return (
      <div className="relative w-full min-h-[250px] bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden grid place-items-center select-none"
        ref={containerRef}
      >
        <div
            ref={imageContainerRef}
            className="relative transition-transform duration-100 ease-out max-w-full max-h-full"
            style={{ 
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            }}
        >
          {imageSrc && <img
            ref={imageRef}
            src={imageSrc}
            alt={t('base_image_label')}
            className="block w-full h-full object-contain pointer-events-none"
            onLoad={handleImageLoad}
          />}
          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-auto"
            style={{ cursor }}
            onMouseDown={(e) => {
                if (isPanActive && e.button === 0) {
                    setPanStart({ x: e.clientX, y: e.clientY });
                    setIsGrabbing(true);
                } else {
                    handleMouseDown(e);
                }
            }}
            onMouseMove={(e) => {
                if (isGrabbing) {
                    const dx = e.clientX - panStart.x;
                    const dy = e.clientY - panStart.y;
                    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
                    setPanStart({ x: e.clientX, y: e.clientY });
                } else {
                    handleMouseMove(e);
                }
            }}
            onMouseUp={() => {
                if (isGrabbing) {
                    setIsGrabbing(false);
                }
                handleMouseUp();
            }}
            onMouseLeave={() => {
                if(isGrabbing) setIsGrabbing(false);
                handleMouseUp();
            }}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ 
                    opacity: isMaskVisible ? 0.6 : 0, 
                    pointerEvents: 'none',
                }}
            />
          </div>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-lg z-10">
          <button onClick={() => setTool('brush')} title={t('tool_brush')} className={`p-2 rounded-md transition-colors ${tool === 'brush' ? 'bg-brand-accent text-white' : 'text-brand-accent hover:bg-brand-accent/20'}`}>
              <BrushIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setTool('eraser')} title={t('tool_eraser')} className={`p-2 rounded-md transition-colors ${tool === 'eraser' ? 'bg-brand-accent text-white' : 'text-brand-accent hover:bg-brand-accent/20'}`}>
              <EraserIcon className="w-5 h-5" />
          </button>
          <button onClick={localUndo} disabled={historyIndex === 0} title={t('undo_mask')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 disabled:text-brand-accent/40 disabled:hover:bg-transparent">
            <UndoIcon />
          </button>
           <button onClick={localRedo} disabled={historyIndex === history.length - 1} title={t('redo_mask')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 disabled:text-brand-accent/40 disabled:hover:bg-transparent">
            <RedoIcon />
          </button>
           <button onClick={localClearCanvas} disabled={paths.length === 0} title={t('clear_mask')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 disabled:text-brand-accent/40 disabled:hover:bg-transparent">
            <TrashIcon />
          </button>
          <button onClick={() => setTool('pan')} title={t('tool_pan')} className={`p-2 rounded-md transition-colors ${tool === 'pan' ? 'bg-brand-accent text-white' : 'text-brand-accent hover:bg-brand-accent/20'}`}>
            <HandIcon />
          </button>
           <button onClick={resetView} title={t('reset_view')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20">
            <ResetViewIcon />
          </button>
        </div>
      </div>
    );
  }
);

ImageEditorCanvas.displayName = 'ImageEditorCanvas';