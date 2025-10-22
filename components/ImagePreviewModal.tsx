import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import type { TFunction } from '../hooks/useLocalization';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
  t: TFunction;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose, t }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom/pan when the modal is opened with a new image
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [imageUrl]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;

    const containerRatio = container.clientWidth / container.clientHeight;
    const imageRatio = image.naturalWidth / image.naturalHeight;

    let imgRenderedWidth, imgRenderedHeight;
    if (imageRatio > containerRatio) {
        imgRenderedWidth = container.clientWidth;
        imgRenderedHeight = imgRenderedWidth / imageRatio;
    } else {
        imgRenderedHeight = container.clientHeight;
        imgRenderedWidth = imgRenderedHeight * imageRatio;
    }

    const offsetX = (container.clientWidth - imgRenderedWidth) / 2;
    const offsetY = (container.clientHeight - imgRenderedHeight) / 2;

    const mouseX_container = e.clientX - container.getBoundingClientRect().left;
    const mouseY_container = e.clientY - container.getBoundingClientRect().top;
    
    const mouseX = mouseX_container - offsetX;
    const mouseY = mouseY_container - offsetY;

    if (mouseX < 0 || mouseX > imgRenderedWidth || mouseY < 0 || mouseY > imgRenderedHeight) {
        return; // Not over the image
    }

    const scaleAmount = -e.deltaY * 0.005;
    const newScale = Math.max(1, Math.min(5, scale + scaleAmount));
    
    if (Math.abs(newScale - scale) < 0.01) return;

    const newX = mouseX - (mouseX - position.x) * (newScale / scale);
    const newY = mouseY - (mouseY - position.y) * (newScale / scale);
    
    if (Math.abs(newScale - 1) < 0.05) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setStartDrag({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - startDrag.x;
      const newY = e.clientY - startDrag.y;
      setPosition({ x: newX, y: newY });
    }
  };
  
  useEffect(() => {
    if (!imageRef.current || !containerRef.current || scale <= 1) return;
    
    const image = imageRef.current;
    const container = containerRef.current;

    const scaledWidth = image.clientWidth * scale;
    const scaledHeight = image.clientHeight * scale;

    const maxPanX = Math.max(0, (scaledWidth - container.clientWidth) / 2);
    const maxPanY = Math.max(0, (scaledHeight - container.clientHeight) / 2);

    const clampedX = Math.max(-maxPanX, Math.min(maxPanX, position.x));
    const clampedY = Math.max(-maxPanY, Math.min(maxPanY, position.y));

    if (clampedX !== position.x || clampedY !== position.y) {
       setPosition({ x: clampedX, y: clampedY });
    }
  }, [scale, position]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-preview-title"
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="image-preview-title" className="sr-only">
          {t('image_preview_title')}
        </h2>
        
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-brand-accent text-brand-bg rounded-full p-2 shadow-lg hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent z-20 transition-colors"
          aria-label={t('close_preview')}
          title={t('close_preview')}
        >
          <XIcon />
        </button>
        
        <div
          ref={containerRef}
          className="w-full h-full max-h-[calc(90vh-2rem)] flex items-center justify-center overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt={t('generated_image_alt')}
            className={`max-w-full max-h-full object-contain select-none transition-transform duration-100 ease-out ${scale > 1 ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
};
