import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import type { TFunction } from '../hooks/useLocalization';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, t }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('user_api_key');
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('user_api_key', apiKey);
    onClose();
  };
  
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-title"
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md animate-scale-in"
        onClick={handleContentClick}
      >
        <div className="text-center">
            <div className="mx-auto bg-brand-primary/10 dark:bg-brand-accent/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <KeyIcon className="w-8 h-8 text-brand-primary dark:text-brand-accent" />
            </div>
            <h2 id="api-key-title" className="text-2xl font-bold text-brand-primary dark:text-white">
              {t('api_key_modal_title')}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('api_key_modal_desc')}
            </p>
        </div>
        
        <div className="mt-6">
            <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('api_key_modal_placeholder')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
             <button
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-3 bg-brand-accent text-white font-bold rounded-lg hover:bg-brand-accent-dark transition duration-300"
            >
                {t('api_key_modal_save')}
            </button>
            <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
            >
                {t('api_key_modal_close')}
            </button>
        </div>
      </div>
    </div>
  );
};