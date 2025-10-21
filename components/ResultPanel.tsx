import React from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { ImageIcon } from './icons/ImageIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultPanelProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  t: TFunction;
  view: 'generator' | 'enhancer' | 'merger' | 'editor';
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ generatedImage, isLoading, error, t, view }) => {

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `lian-studio-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      // Fix: Use a specific translation key type instead of a generic string.
      let titleKey: Parameters<TFunction>[0] = 'generating_title';
      let descKey: Parameters<TFunction>[0] = 'generating_desc';
      if (view === 'enhancer') {
          titleKey = 'enhancing_title';
          descKey = 'enhancing_desc';
      } else if (view === 'merger') {
          titleKey = 'merging_title';
          descKey = 'merging_desc';
      } else if (view === 'editor') {
          titleKey = 'editing_title';
          descKey = 'editing_desc';
      }

      return (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <SpinnerIcon />
          <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t(titleKey)}</p>
          <p className="text-sm">{t(descKey)}</p>
        </div>
      );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 dark:text-red-400">
                <div className="mx-auto bg-red-100 dark:bg-red-900/50 rounded-full h-12 w-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="mt-4 text-lg font-semibold">{t('error_title')}</p>
                <p className="text-sm max-w-sm mx-auto">{error}</p>
            </div>
        );
    }
    
    if (generatedImage) {
      return (
        <div className="relative w-full h-full group">
          <img
            src={generatedImage}
            alt={t('generated_image_alt')}
            className="w-full h-full object-contain rounded-lg"
          />
          <button
            onClick={handleDownload}
            title={t('download_image_label')}
            aria-label={t('download_image_label')}
            className="absolute top-4 right-4 bg-brand-accent text-white p-3 rounded-full shadow-lg 
                       opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                       transform transition-all duration-300 ease-in-out 
                       hover:bg-brand-accent-dark hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800/50 focus:ring-brand-accent"
          >
            <DownloadIcon />
          </button>
        </div>
      );
    }
    
    return (
      <div className="text-center text-gray-400">
        <ImageIcon />
        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('initial_title')}</p>
        <p className="text-sm dark:text-gray-500">{t('initial_desc')}</p>
      </div>
    );
  };
  
  return (
    <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] lg:min-h-0 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
            {renderContent()}
        </div>
    </div>
  );
};