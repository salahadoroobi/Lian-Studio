import React, { useState } from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';

interface PromptResultDisplayProps {
  text: string | null;
  t: TFunction;
  extractionLanguage: 'en' | 'ar';
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ text, t, extractionLanguage }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!text) {
    return (
      <div className="text-center text-gray-400">
        <DocumentTextIcon />
        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('initial_title')}</p>
        <p className="text-sm dark:text-gray-500">{t('initial_desc_extractor')}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-center p-4">
      <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <button
          onClick={handleCopy}
          title={copied ? t('copy_success') : t('copy_button')}
          aria-label={copied ? t('copy_success') : t('copy_button')}
          className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-brand-primary dark:text-brand-accent"
        >
          {copied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
        </button>
        <p
          dir={extractionLanguage === 'ar' ? 'rtl' : 'ltr'}
          className="text-brand-primary dark:text-brand-accent whitespace-pre-wrap select-text pr-10"
        >
          {text}
        </p>
      </div>
    </div>
  );
};