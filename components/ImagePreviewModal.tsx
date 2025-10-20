import React from 'react';
import { XIcon } from './icons/XIcon';
import type { TFunction } from '../hooks/useLocalization';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
  t: TFunction;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose, t }) => {
  // Prevent closing when clicking on the image/modal content itself
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-preview-title"
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] animate-scale-in"
        onClick={handleContentClick}
      >
        <h2 id="image-preview-title" className="sr-only">
          {t('image_preview_title')}
        </h2>
        
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent z-10"
          aria-label={t('close_preview')}
          title={t('close_preview')}
        >
          <XIcon />
        </button>
        
        <img
          src={imageUrl}
          alt={t('generated_image_alt')}
          className="max-w-full max-h-[calc(90vh-2rem)] object-contain rounded-md"
        />
      </div>
    </div>
  );
};