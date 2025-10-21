import React from 'react';
// Fix: Correctly import TFunction from the implemented useLocalization hook.
import type { TFunction } from '../hooks/useLocalization';
import { QUALITY_OPTIONS } from '../constants';

interface QualitySelectorProps {
  selectedQuality: string;
  setSelectedQuality: (quality: string) => void;
  t: TFunction;
}

export const QualitySelector: React.FC<QualitySelectorProps> = ({ selectedQuality, setSelectedQuality, t }) => {
  return (
    <div>
      <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('quality_label')}</label>
      <div className="grid grid-cols-2 gap-3">
        {QUALITY_OPTIONS.map(({ tKey, value }) => {
          const isSelected = selectedQuality === value;
          return (
            <button
              key={value}
              onClick={() => setSelectedQuality(value)}
              className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 h-full
                ${
                  isSelected
                    ? 'bg-brand-accent text-white border-brand-accent ring-brand-accent/50'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              {/* Fix: Use the type-safe tKey for translations. */}
              <p>{t(tKey)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};