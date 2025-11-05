import React from 'react';
import type { TFunction } from '../hooks/useLocalization';
import { AnimatedHeartIcon } from './AnimatedHeartIcon';
import { ShimmerWrapper } from './ShimmerWrapper';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface FooterProps {
  t: TFunction;
  onHeartClick: () => void;
  setIsLiveSupportModalOpen: (isOpen: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ t, onHeartClick, setIsLiveSupportModalOpen }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-bg/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-inner py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-x-4 gap-y-2 text-gray-600 dark:text-gray-400 text-sm flex-wrap">
        {/* Copyright Notice */}
        <div className="flex items-center justify-center gap-x-1.5 flex-wrap">
            <span>{t('footer_copyright_legal')}</span>
            <span dir="ltr">
                {t('footer_copyright_brand').replace('{year}', currentYear.toString())}
            </span>
        </div>

        {/* Separator */}
        <span className="hidden md:block">|</span>

        {/* Made with Love */}
        <span className="flex items-center gap-1.5">
          {t('footer_text')}
          <AnimatedHeartIcon onClick={onHeartClick} t={t} />
        </span>
        
        {/* Separator */}
        <span className="hidden md:block">|</span>
        
        {/* Version */}
        <ShimmerWrapper className="rounded-full">
          <span className="inline-flex items-center justify-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full min-w-[50px]">
            v3.7.0
          </span>
        </ShimmerWrapper>

        {/* Separator */}
        <span className="hidden md:block">|</span>

        {/* Live Support Button */}
        <button
            onClick={() => setIsLiveSupportModalOpen(true)}
            aria-label={t('live_support_tooltip')}
            title={t('live_support_tooltip')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 rounded-full"
        >
            <ShimmerWrapper className="rounded-full">
              <span className="inline-flex items-center justify-center gap-1.5 bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">
                <ChatBubbleIcon className="w-4 h-4" />
                {t('live_support_tooltip')}
              </span>
            </ShimmerWrapper>
        </button>
      </div>
    </footer>
  );
};
