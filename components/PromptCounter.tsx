import React, { useState, useEffect } from 'react';
import type { TFunction, Language } from '../hooks/useLocalization';

interface PromptCounterProps {
  count: number;
  t: TFunction;
  language: Language;
}

export const PromptCounter: React.FC<PromptCounterProps> = ({ count, t, language }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    // Reset animation state when count changes
    setIsAnimationComplete(false);

    if (count === 0) {
      setDisplayCount(0);
      return;
    }

    const duration = 2500; // Total animation duration in ms
    let startTime: number | null = null;
    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Use linear progression for a constant speed
      const currentCount = Math.floor(percentage * count);
      setDisplayCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        // Ensure it ends on the exact count and trigger the plus sign animation
        setDisplayCount(count);
        setIsAnimationComplete(true);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [count]);

  const tooltipText = t('prompts_available_tooltip').replace('{count}', String(count));
  
  const plusSign = (
    <span className={`inline-block ${language === 'ar' ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}>
      +
    </span>
  );

  return (
    <span 
      className="bg-brand-accent text-brand-bg text-sm font-bold px-2.5 py-1 rounded-full tabular-nums flex items-center justify-center gap-0.5"
      aria-label={tooltipText}
      title={tooltipText}
    >
      {language === 'ar' && isAnimationComplete && plusSign}
      <span className={`inline-block ${isAnimationComplete ? 'animate-jiggle' : ''}`}>{displayCount}</span>
      {language === 'en' && isAnimationComplete && plusSign}
    </span>
  );
};
