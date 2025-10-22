import React, { useState } from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface PromptResultDisplayProps {
  text: string | null;
  t: TFunction;
  outputLanguage: string;
  initialDescKey?: Parameters<TFunction>[0];
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ text, t, outputLanguage, initialDescKey }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownload = () => {
    if (text) {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lian-studio-prompt-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!text) {
    return (
      <div className="text-center text-gray-400">
        <DocumentTextIcon />
        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('initial_title')}</p>
        <p className="text-sm dark:text-gray-500">{t(initialDescKey || 'initial_desc_extractor')}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-center p-4">
      <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleCopy}
              title={copied ? t('copy_success') : t('copy_button')}
              aria-label={copied ? t('copy_success') : t('copy_button')}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-brand-primary dark:text-brand-accent"
            >
              {copied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
            </button>
            <button
              onClick={handleDownload}
              title={t('download_prompt_label')}
              aria-label={t('download_prompt_label')}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-brand-primary dark:text-brand-accent"
            >
              <DownloadIcon />
            </button>
        </div>
        <p
          dir={outputLanguage === 'ar' ? 'rtl' : 'ltr'}
          className="text-brand-primary dark:text-brand-accent whitespace-pre-wrap select-text pr-12"
        >
          {text}
        </p>
      </div>
    </div>
  );
};