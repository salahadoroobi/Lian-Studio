import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import type { Language, TFunction } from '../hooks/useLocalization';
import { KeyIcon } from './icons/KeyIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { validateApiKey } from '../services/geminiService';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
  language: Language;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, t, language }) => {
  const [apiKey, setApiKey] = useState('');
  const [isPassword, setIsPassword] = useState(true);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');

  // Load existing key from local storage when modal opens
  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(storedKey);
      if (storedKey) {
        // Re-validate the stored key silently
        validateApiKey(storedKey).then(isValid => {
            setValidationStatus(isValid ? 'valid' : 'invalid');
        });
      } else {
        setValidationStatus('idle');
      }
    }
  }, [isOpen]);

  // Debounced validation effect
  useEffect(() => {
    // This effect is for user input, not the initial load.
    if (!isOpen) return;

    if (!apiKey.trim()) {
      setValidationStatus('idle');
      return;
    }

    // Only re-validate if the key has changed from what's stored
    if (apiKey === localStorage.getItem('gemini_api_key')) {
        return;
    }

    setValidationStatus('validating');
    const handler = setTimeout(async () => {
      const isValid = await validateApiKey(apiKey);
      setValidationStatus(isValid ? 'valid' : 'invalid');
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [apiKey, isOpen]);

  const handleSave = () => {
    if (validationStatus === 'valid') {
      localStorage.setItem('gemini_api_key', apiKey);
      onClose();
    } else if (apiKey.trim() === '') {
      localStorage.removeItem('gemini_api_key');
      onClose();
    }
  };

  const renderValidationStatus = () => {
    const marginClass = language === 'ar' ? 'mr-2' : 'ml-2';
    switch (validationStatus) {
      case 'validating':
        return <div className="flex items-center text-sm text-gray-500 dark:text-gray-400"><SpinnerIcon className="animate-spin h-5 w-5 text-brand-primary dark:text-brand-accent" /> <span className={marginClass}>{t('api_key_validating')}</span></div>;
      case 'valid':
        return <div className="text-sm text-green-600 dark:text-green-400">{t('api_key_valid')}</div>;
      case 'invalid':
        return <div className="text-sm text-red-600 dark:text-red-400">{t('api_key_invalid')}</div>;
      case 'idle':
      default:
        return null; // Placeholder is handled by parent div
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-brand-accent/10 rounded-full mb-4">
                 <KeyIcon className="h-8 w-8 text-brand-accent" />
            </div>

            <h2 id="api-key-modal-title" className="text-2xl font-bold text-brand-primary dark:text-white mb-2">
              {t('api_key_modal_title_manual')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('api_key_modal_desc_manual')}
            </p>

            <div className="w-full relative mb-4">
                <input
                    type={isPassword ? 'password' : 'text'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t('api_key_input_placeholder')}
                    dir="auto"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ltr:pr-10 rtl:pl-10 text-start"
                />
                <button
                    onClick={() => setIsPassword(!isPassword)}
                    className="absolute inset-y-0 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ltr:right-0 ltr:pr-3 rtl:left-0 rtl:pl-3"
                    title={isPassword ? t('show_api_key') : t('hide_api_key')}
                >
                    {isPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
            </div>
            
            <div className="w-full flex justify-between items-center mt-4">
                <div className="min-h-[20px] flex-1 text-start">
                     {renderValidationStatus()}
                </div>
                <div className="flex justify-end gap-3">
                     <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                     >
                        {t('api_key_close_button')}
                     </button>
                     <button
                        onClick={handleSave}
                        disabled={validationStatus !== 'valid' && apiKey.trim() !== ''}
                        className="px-6 py-2 rounded-lg bg-brand-accent text-white font-bold hover:bg-brand-accent-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                        {t('api_key_save_button')}
                     </button>
                </div>
            </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label={t('close_preview')}
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
};
