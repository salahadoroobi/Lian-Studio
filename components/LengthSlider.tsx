import React from 'react';
import type { TFunction } from '../hooks/useLocalization';

interface LengthSliderProps {
  length: number;
  setLength: (value: number) => void;
  t: TFunction;
}

export const LengthSlider: React.FC<LengthSliderProps> = ({ length, setLength, t }) => {
  return (
    <div>
      <label htmlFor="length-slider" className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">
        {t('summary_length_label')}
      </label>
      <div className="flex items-center gap-4">
        <input
          id="length-slider"
          type="range"
          min="10"
          max="90"
          step="10"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
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
        <span className="font-semibold text-brand-primary dark:text-gray-300 w-12 text-center">{length}%</span>
      </div>
    </div>
  );
};