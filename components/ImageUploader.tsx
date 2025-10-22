import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { XIcon } from './icons/XIcon';
import { MAX_IMAGES, MAX_FILE_SIZE_MB, MAX_MERGE_IMAGES } from '../constants';
import type { ReferenceImage } from '../types';
import type { TFunction } from '../hooks/useLocalization';
import { ImagePreviewModal } from './ImagePreviewModal';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  images: ReferenceImage[];
  setImages: React.Dispatch<React.SetStateAction<ReferenceImage[]>>;
  maxFiles?: number;
  // Fix: Use a specific translation key type instead of a generic string.
  descriptionKey: Parameters<TFunction>[0];
  t: TFunction;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages, maxFiles = MAX_IMAGES, descriptionKey, t }) => {
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    if (rejectedFiles && rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0].code;
        if (firstError === 'file-too-large') {
            setError(t('uploader_error_size'));
        } else if (firstError === 'file-invalid-type') {
            setError(t('uploader_error_type'));
        } else {
            setError('An unknown error occurred during upload.');
        }
        return;
    }

    if (images.length + acceptedFiles.length > maxFiles) {
      if (maxFiles === 1) {
        setError(t('uploader_error_single_count'));
      } else if (maxFiles === MAX_MERGE_IMAGES) {
        setError(t('uploader_error_merge_count'));
      }
       else {
        setError(t(`uploader_error_count`));
      }
      return;
    }

    const newImages = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      dataUrl: URL.createObjectURL(file),
    }));

    if (maxFiles === 1) {
        setImages(newImages);
    } else {
        setImages(prev => [...prev, ...newImages]);
    }
  }, [images, setImages, maxFiles, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'] },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  });

  const removeImage = (id: string) => {
    setImages(images.filter(image => image.id !== id));
  };

  if (images.length === 0) {
    return (
      <div>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full min-h-[160px] p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragActive ? 'border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20' : 'border-gray-300 dark:border-gray-600 hover:border-brand-primary/70 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
          `}
        >
          <input {...getInputProps()} />
          <UploadIcon />
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {t('uploader_cta_title')}
          </p>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
            {t('uploader_cta_desc')}
          </p>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t(descriptionKey)}</p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative aspect-square group">
            <button
              onClick={() => setPreviewImage(image.dataUrl)}
              className="w-full h-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent dark:focus:ring-offset-gray-800"
              aria-label={t('image_preview_title')}
            >
              <img src={image.dataUrl} alt="preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </button>
            <button
              onClick={() => removeImage(image.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-10"
            >
              <XIcon />
            </button>
            <div className="absolute -top-2 -left-2 bg-brand-primary dark:bg-brand-primary-dark text-brand-bg rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold shadow-md z-10 pointer-events-none">
                {index + 1}
            </div>
          </div>
        ))}
        {images.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center aspect-square p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${isDragActive ? 'border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20' : 'border-gray-300 dark:border-gray-600 hover:border-brand-primary/70 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
            `}
          >
            <input {...getInputProps()} />
            <UploadIcon className="w-8 h-8 mb-2 text-brand-accent" />
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
               {t('uploader_cta_add_more')}
            </p>
          </div>
        )}
      </div>
       <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t(descriptionKey)}</p>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
          t={t}
        />
      )}
    </div>
  );
};