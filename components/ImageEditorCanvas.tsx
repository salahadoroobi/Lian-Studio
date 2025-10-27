import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useLayoutEffect,
} from 'react';
import type { TFunction, Language } from '../hooks/useLocalization';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ResetViewIcon } from './icons/ResetViewIcon';
import type { EditorTool, Path, Point } from '../types';
import { HandIcon } from './icons/HandIcon';
import { BrushIcon } from './icons/BrushIcon';
import { EraserIcon } from './icons/EraserIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { ZoomIcon } from './icons/ZoomIcon';

const ChevronUpIcon: React.FC = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
);

const ChevronDownIcon: React.FC = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

interface ImageEditorCanvasProps {
  imageSrc?: string;
  tool: EditorTool;
  setTool: (tool: EditorTool) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  isMaskVisible: boolean;
  setIsMaskVisible: (isVisible: boolean | ((prevState: boolean) => boolean)) => void;
  onStrokeComplete: (color: string) => void;
  onClear: () => void;
  onHistoryChange: (paths: Path[]) => void;
  language: Language;
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
      setBrushColor,
      brushSize,
      setBrushSize,
      isMaskVisible,
      setIsMaskVisible,
      onStrokeComplete,
      onClear,
      onHistoryChange,
      language,
      t,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const brushSettingsRef = useRef<HTMLDivElement>(null);
    const brushSettingsButtonRef = useRef<HTMLButtonElement>(null);
    const zoomControlRef = useRef<HTMLDivElement>(null);
    const zoomControlButtonRef = useRef<HTMLButtonElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [paths, setPaths] = useState<Path[]>([]);
    const [history, setHistory] = useState<Path[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isBrushSettingsOpen, setIsBrushSettingsOpen] = useState(false);
    const [isZoomControlOpen, setIsZoomControlOpen] = useState(false);
    const [allowZoomOut, setAllowZoomOut] = useState(false);
    const [isZoomEnabled, setIsZoomEnabled] = useState(true);
    const [isToolbarExpanded, setIsToolbarExpanded] = useState(true);
    
    const [brushPopupStyle, setBrushPopupStyle] = useState<React.CSSProperties>({});
    const [zoomPopupStyle, setZoomPopupStyle] = useState<React.CSSProperties>({});

    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [isGrabbing, setIsGrabbing] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    useLayoutEffect(() => {
        if (isBrushSettingsOpen && brushSettingsButtonRef.current && containerRef.current) {
            const buttonRect = brushSettingsButtonRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const top = (buttonRect.top - containerRect.top) + (buttonRect.height / 2);

            if (language === 'ar') {
                const right = (containerRect.right - buttonRect.left) + 12; // 12px for space
                setBrushPopupStyle({
                    position: 'absolute',
                    top: `${top}px`,
                    right: `${right}px`,
                    transform: 'translateY(-50%)',
                });
            } else {
                 const left = (buttonRect.right - containerRect.left) + 12; // 12px for space
                 setBrushPopupStyle({
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translateY(-50%)',
                });
            }
        }
    }, [isBrushSettingsOpen, language]);

    useLayoutEffect(() => {
        if (isZoomControlOpen && zoomControlButtonRef.current && containerRef.current) {
            const buttonRect = zoomControlButtonRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const top = (buttonRect.top - containerRect.top) + (buttonRect.height / 2);
            
            if (language === 'ar') {
                const right = (containerRect.right - buttonRect.left) + 12; // 12px for space
                setZoomPopupStyle({
                    position: 'absolute',
                    top: `${top}px`,
                    right: `${right}px`,
                    transform: 'translateY(-50%)',
                });
            } else {
                const left = (buttonRect.right - containerRect.left) + 12;
                setZoomPopupStyle({
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translateY(-50%)',
                });
            }
        }
    }, [isZoomControlOpen, language]);


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
            const { offsetWidth: width, offsetHeight: height } = imageContainer;
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
    
    const getPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // Mouse position relative to the on-screen canvas's top-left corner
      const xOnScreen = clientX - rect.left;
      const yOnScreen = clientY - rect.top;

      // Convert the on-screen position to a coordinate on the original canvas buffer
      // by finding the proportional position and multiplying by the buffer dimensions.
      const pointX = (xOnScreen / rect.width) * canvas.width;
      const pointY = (yOnScreen / rect.height) * canvas.height;
      
      return { x: pointX, y: pointY };
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

    const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        if (!isZoomEnabled) return;
        
        const container = containerRef.current;
        const imageContainer = imageContainerRef.current;
        if (!container || !imageContainer) return;
    
        const scaleAmount = -e.deltaY * 0.005;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setTransform(prev => {
            const minScale = allowZoomOut ? 0.1 : 1;
            const newScale = Math.max(minScale, Math.min(5, prev.scale + scaleAmount));

            if (Math.abs(newScale - prev.scale) < 0.001) return prev;
            
            if (!allowZoomOut && Math.abs(newScale - 1) < 0.05) {
                return { x: 0, y: 0, scale: 1 };
            }

            const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
            const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);
            
            // Clamp pan
            const scaledWidth = imageContainer.offsetWidth * newScale;
            const scaledHeight = imageContainer.offsetHeight * newScale;
            const maxPanX = Math.max(0, (scaledWidth - container.clientWidth) / 2);
            const maxPanY = Math.max(0, (scaledHeight - container.clientHeight) / 2);
            const clampedX = Math.max(-maxPanX, Math.min(maxPanX, newX));
            const clampedY = Math.max(-maxPanY, Math.min(maxPanY, newY));

            return { x: clampedX, y: clampedY, scale: newScale };
        });
      }, [allowZoomOut, isZoomEnabled]);
    
    useEffect(() => {
      const container = containerRef.current;
      
      if (container) {
          container.addEventListener('wheel', handleWheel, { passive: false });
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isTextInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (e.code === 'Space' && !isPanning && !isTextInput) {
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

      const handleClickOutside = (event: MouseEvent) => {
          if (
              brushSettingsRef.current &&
              !brushSettingsRef.current.contains(event.target as Node) &&
              brushSettingsButtonRef.current &&
              !brushSettingsButtonRef.current.contains(event.target as Node)
          ) {
              setIsBrushSettingsOpen(false);
          }
          if (
              zoomControlRef.current &&
              !zoomControlRef.current.contains(event.target as Node) &&
              zoomControlButtonRef.current &&
              !zoomControlButtonRef.current.contains(event.target as Node)
          ) {
              setIsZoomControlOpen(false);
          }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        if (container) {
            container.removeEventListener('wheel', handleWheel);
        }
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isPanning, handleWheel]);
    
    // Close popovers if tool changes
    useEffect(() => {
        setIsBrushSettingsOpen(false);
        setIsZoomControlOpen(false);
    }, [tool]);

    const localUndo = useCallback(() => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const newPaths = history[newIndex];
        setPaths(newPaths);
        onHistoryChange(newPaths);
      }
    }, [history, historyIndex, onHistoryChange]);

    const localRedo = useCallback(() => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        const newPaths = history[newIndex];
        setPaths(newPaths);
        onHistoryChange(newPaths);
      }
    }, [history, historyIndex, onHistoryChange]);

    const localClearCanvas = useCallback(() => {
      setPaths([]);
      setHistory([[]]);
      setHistoryIndex(0);
      onClear();
    }, [onClear]);

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
    
    const handleZoom = (direction: 'in' | 'out') => {
        const scaleAmount = 0.2 * (direction === 'in' ? 1 : -1);
        const container = containerRef.current;
        const imageContainer = imageContainerRef.current;
        if (!container || !imageContainer) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setTransform(prev => {
            const minScale = allowZoomOut ? 0.1 : 1;
            const newScale = Math.max(minScale, Math.min(5, prev.scale + scaleAmount));

            if (Math.abs(newScale - prev.scale) < 0.001) return prev;
            
            const newX = centerX - (centerX - prev.x) * (newScale / prev.scale);
            const newY = centerY - (centerY - prev.y) * (newScale / prev.scale);

            // Clamp pan
            const scaledWidth = imageContainer.offsetWidth * newScale;
            const scaledHeight = imageContainer.offsetHeight * newScale;
            const maxPanX = Math.max(0, (scaledWidth - container.clientWidth) / 2);
            const maxPanY = Math.max(0, (scaledHeight - container.clientHeight) / 2);
            const clampedX = Math.max(-maxPanX, Math.min(maxPanX, newX));
            const clampedY = Math.max(-maxPanY, Math.min(maxPanY, newY));

            return { x: clampedX, y: clampedY, scale: newScale };
        });
    };

    const isPanActive = isPanning || tool === 'pan';
    const cursor = isGrabbing ? 'grabbing' : isPanActive ? 'grab' : 'crosshair';
    const toolbarPositionClass = language === 'ar' ? 'right-2' : 'left-2';

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
                    setPanStart({ x: e.clientX, y: e.clientY });
                    setTransform(prev => {
                        const newX = prev.x + dx;
                        const newY = prev.y + dy;

                        const container = containerRef.current;
                        const imageContainer = imageContainerRef.current;
                        if (!container || !imageContainer) return prev;

                        const scaledWidth = imageContainer.offsetWidth * prev.scale;
                        const scaledHeight = imageContainer.offsetHeight * prev.scale;
                        const maxPanX = Math.max(0, (scaledWidth - container.clientWidth) / 2);
                        const maxPanY = Math.max(0, (scaledHeight - container.clientHeight) / 2);
                        const clampedX = Math.max(-maxPanX, Math.min(maxPanX, newX));
                        const clampedY = Math.max(-maxPanY, Math.min(maxPanY, newY));

                        return { ...prev, x: clampedX, y: clampedY };
                    });
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
        <div className={`absolute top-2 ${toolbarPositionClass} bg-black/30 backdrop-blur-sm p-1.5 rounded-lg z-10`}>
          <button
            onClick={() => setIsToolbarExpanded(prev => !prev)}
            title={t(isToolbarExpanded ? 'collapse_toolbar' : 'expand_toolbar')}
            className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 w-full"
            aria-expanded={isToolbarExpanded}
            aria-controls="editor-toolbar-content"
          >
            {isToolbarExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
          <div
            id="editor-toolbar-content"
            className="grid transition-all duration-500 ease-in-out"
            style={{ gridTemplateRows: isToolbarExpanded ? '1fr' : '0fr' }}
          >
            <div className="overflow-y-hidden">
              <div className="flex flex-col gap-2 pt-2">
                <button onClick={() => setTool('brush')} title={t('tool_brush')} className={`p-2 rounded-md transition-colors ${tool === 'brush' ? 'bg-brand-accent text-white' : 'text-brand-accent hover:bg-brand-accent/20'}`}>
                    <BrushIcon className="w-5 h-5" />
                </button>
                <button onClick={() => setTool('eraser')} title={t('tool_eraser')} className={`p-2 rounded-md transition-colors ${tool === 'eraser' ? 'bg-brand-accent text-white' : 'text-brand-accent hover:bg-brand-accent/20'}`}>
                    <EraserIcon className="w-5 h-5" />
                </button>
      
                <div className="h-px bg-white/20 mx-1.5 my-1"></div>
                
                <button onClick={localUndo} disabled={historyIndex === 0} title={t('undo_mask')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 disabled:text-brand-accent/40 disabled:hover:bg-transparent">
                  <UndoIcon />
                </button>
                 <button onClick={localRedo} disabled={historyIndex === history.length - 1} title={t('redo_mask')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 disabled:text-brand-accent/40 disabled:hover:bg-transparent">
                  <RedoIcon />
                </button>
                 <button onClick={localClearCanvas} disabled={paths.length === 0} title={t('clear_mask')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 disabled:text-brand-accent/40 disabled:hover:bg-transparent">
                  <TrashIcon />
                </button>
      
                <div className="h-px bg-white/20 mx-1.5 my-1"></div>
      
                <button onClick={() => setIsMaskVisible(prev => !prev)} title={t('toggle_mask_visibility')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20">
                    {isMaskVisible ? <EyeIcon className="w-5 h-5"/> : <EyeSlashIcon className="w-5 h-5"/>}
                </button>
                 <button onClick={() => setTool('pan')} title={t('tool_pan')} className={`p-2 rounded-md transition-colors ${tool === 'pan' ? 'bg-brand-accent text-white' : 'text-brand-accent hover:bg-brand-accent/20'}`}>
                  <HandIcon />
                </button>
                 <button onClick={resetView} title={t('reset_view')} className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20">
                  <ResetViewIcon />
                </button>
                <div className="relative">
                    <button
                      ref={zoomControlButtonRef}
                      onClick={() => setIsZoomControlOpen(prev => !prev)}
                      title={t('zoom_tool')}
                      className={`p-2 rounded-md transition-colors w-full flex justify-center items-center ${isZoomControlOpen ? 'bg-brand-accent text-white' : 'text-brand-accent hover:bg-brand-accent/20'}`}
                    >
                        <ZoomIcon className="w-5 h-5" />
                    </button>
                </div>
      
                <div className="h-px bg-white/20 mx-1.5 my-1"></div>
                
                <div className="relative">
                  <button
                      ref={brushSettingsButtonRef}
                      onClick={() => setIsBrushSettingsOpen(prev => !prev)}
                      title={t('mask_color')}
                      className="p-2 rounded-md transition-colors text-brand-accent hover:bg-brand-accent/20 w-full flex justify-center items-center"
                  >
                      <div 
                          className="w-5 h-5 rounded-full border-2 border-white/50 shadow-md"
                          style={{ backgroundColor: brushColor }}
                          aria-hidden="true"
                      />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isZoomControlOpen && (
            <div
                ref={zoomControlRef}
                style={zoomPopupStyle}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg shadow-xl flex flex-col items-center gap-4 animate-fade-in w-48"
            >
                <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('zoom_tool')}</span>
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-12 text-center">{(transform.scale * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2 w-full">
                    <button onClick={() => handleZoom('out')} disabled={!isZoomEnabled} className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">-</button>
                    <input
                        type="range"
                        min={allowZoomOut ? 0.1 : 1}
                        max="5"
                        step="0.05"
                        value={transform.scale}
                        onChange={(e) => setTransform(prev => ({ ...prev, scale: Number(e.target.value) }))}
                        disabled={!isZoomEnabled}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:bg-brand-accent [&::-moz-range-thumb]:bg-brand-accent disabled:opacity-50"
                    />
                    <button onClick={() => handleZoom('in')} disabled={!isZoomEnabled} className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">+</button>
                </div>
                <div className="flex items-center gap-2 self-start w-full">
                    <input
                        type="checkbox"
                        id="enable-zoom-checkbox"
                        checked={isZoomEnabled}
                        onChange={(e) => setIsZoomEnabled(e.target.checked)}
                        className="w-4 h-4 text-brand-accent bg-gray-100 border-gray-300 rounded focus:ring-brand-accent dark:focus:ring-brand-accent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="enable-zoom-checkbox" className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">{t('allow_zooming')}</label>
                </div>
                <div className="flex items-center gap-2 self-start w-full">
                    <input
                        type="checkbox"
                        id="allow-shrink-checkbox"
                        checked={allowZoomOut}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setAllowZoomOut(checked);
                            if (!checked && transform.scale < 1) {
                                resetView();
                            }
                        }}
                        className="w-4 h-4 text-brand-accent bg-gray-100 border-gray-300 rounded focus:ring-brand-accent dark:focus:ring-brand-accent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="allow-shrink-checkbox" className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">{t('allow_shrinking')}</label>
                </div>
            </div>
        )}
        {isBrushSettingsOpen && (
          <div 
              ref={brushSettingsRef} 
              style={brushPopupStyle}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg shadow-xl flex flex-col gap-4 animate-fade-in"
          >
              <div className="flex items-center gap-2">
                  <label htmlFor="brush-color-popover" className="sr-only">{t('mask_color')}</label>
                  <input id="brush-color-popover" type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-9 h-9 p-0 border-none rounded-md cursor-pointer bg-transparent" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('mask_color')}</span>
              </div>
               <div className="flex flex-col items-center gap-2">
                  <label htmlFor="brush-size-popover" className="text-sm font-semibold text-gray-700 dark:text-gray-300 self-start">{t('brush_size')}</label>
                  <div className="flex items-center gap-2">
                       <input
                          id="brush-size-popover"
                          type="range"
                          min="5" max="100"
                          value={brushSize}
                          onChange={(e) => setBrushSize(Number(e.target.value))}
                          className="w-28 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:bg-brand-accent [&::-moz-range-thumb]:bg-brand-accent"
                        />
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-8 text-center">{brushSize}</span>
                  </div>
              </div>
          </div>
        )}
      </div>
    );
  }
);

ImageEditorCanvas.displayName = 'ImageEditorCanvas';