import React from 'react';
import type { TFunction } from '../hooks/useLocalization';

interface AnimatedHeartIconProps {
  onClick: () => void;
  t: TFunction;
}

export const AnimatedHeartIcon: React.FC<AnimatedHeartIconProps> = ({ onClick, t }) => {
  return (
    <button
      onClick={onClick}
      className="inline-block align-middle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 rounded-full"
      aria-label={t('contact_us_tooltip')}
      title={t('contact_us_tooltip')}
    >
      <svg 
          className="w-7 h-7 text-brand-accent animate-pulse-heart"
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
      >
          <path 
              fillRule="evenodd" 
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
              clipRule="evenodd"
          >
          </path>
      </svg>
    </button>
  );
};
