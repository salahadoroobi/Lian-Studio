import React from 'react';
// Fix: Correctly import TFunction from the implemented useLocalization hook.
import type { TFunction } from '../hooks/useLocalization';
import { ASPECT_RATIOS } from '../constants';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  setSelectedRatio: (ratio: string) => void;
  t: TFunction;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, setSelectedRatio, t }) => {
  return (
    <div>
      <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('aspect_ratio_label')}</label>
      <div className="grid grid-cols-2 gap-3">
        {ASPECT_RATIOS.map(({ label, value }) => {
          const isSelected = selectedRatio === value;
          return (
            <button
              key={value}
              onClick={() => setSelectedRatio(value)}
              className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                ${
                  isSelected
                    ? 'bg-brand-accent text-white border-brand-accent ring-brand-accent/50'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              <p>{t(`aspect_ratio_${label}`)}</p>
              {value !== 'Default' && <p className="text-xs font-normal opacity-80">{value}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
};