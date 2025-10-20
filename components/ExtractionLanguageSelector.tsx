import React from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { EXTRACTION_LANGUAGES } from '../constants';

interface ExtractionLanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  t: TFunction;
}

export const ExtractionLanguageSelector: React.FC<ExtractionLanguageSelectorProps> = ({ selectedLanguage, setSelectedLanguage, t }) => {
  return (
    <div>
      <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('output_language_label')}</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EXTRACTION_LANGUAGES.map(({ value }) => {
          const isSelected = selectedLanguage === value;
          return (
            <button
              key={value}
              onClick={() => setSelectedLanguage(value)}
              className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                ${
                  isSelected
                    ? 'bg-brand-accent text-white border-brand-accent ring-brand-accent/50'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              <p>{t(`output_language_${value}`)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
