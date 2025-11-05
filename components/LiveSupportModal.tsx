import React from 'react';
import { XIcon } from './icons/XIcon';
import type { TFunction } from '../hooks/useLocalization';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface LiveSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
}

export const LiveSupportModal: React.FC<LiveSupportModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    window.open('https://lianstudio.app.n8n.cloud/form-test/bc9caeac-47fe-4a87-85a9-0cceaba4e90f', '_blank');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-support-modal-title"
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-brand-accent/10 rounded-full mb-4">
                 <ChatBubbleIcon className="h-8 w-8 text-brand-accent" />
            </div>

            <h2 id="live-support-modal-title" className="text-2xl font-bold text-brand-primary dark:text-white mb-2">
              {t('live_support_modal_title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('live_support_modal_desc')}
            </p>

            <div className="w-full flex justify-center gap-3">
                 <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                 >
                    {t('live_support_modal_close')}
                 </button>
                 <button
                    onClick={handleConfirm}
                    className="px-6 py-2 rounded-lg bg-brand-accent text-white font-bold hover:bg-brand-accent-dark transition-colors"
                 >
                    {t('live_support_modal_continue')}
                 </button>
            </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label={t('close_preview')}
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
};