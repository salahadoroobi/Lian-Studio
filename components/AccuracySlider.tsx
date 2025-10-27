import React from 'react';
import type { TFunction } from '../hooks/useLocalization';

interface AccuracySliderProps {
  ratio: number;
  setRatio: (value: number) => void;
  t: TFunction;
}

export const AccuracySlider: React.FC<AccuracySliderProps> = ({ ratio, setRatio, t }) => {
  return (
    <div>
      <label htmlFor="accuracy-slider" className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">
        {t('translator_accuracy_label')}
      </label>
      <div className="flex items-center gap-4">
        <input
          id="accuracy-slider"
          type="range"
          min="0"
          max="100"
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-brand-accent
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-brand-accent"
        />
        <span className="font-semibold text-brand-primary dark:text-gray-300 w-12 text-center">{ratio}%</span>
      </div>
    </div>
  );
};