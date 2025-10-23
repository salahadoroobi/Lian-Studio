import React from 'react';
import { XIcon } from './icons/XIcon';
import type { TFunction } from '../hooks/useLocalization';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { XSocialIcon } from './icons/XSocialIcon';
import { TelegramIcon } from './icons/TelegramIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { EmailIcon } from './icons/EmailIcon';
import { GitHubIcon } from './icons/GitHubIcon';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
}

const SocialLink: React.FC<{ href: string; title: string; children: React.ReactNode }> = ({ href, title, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className="text-gray-500 dark:text-gray-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors transform hover:scale-110"
    >
        {children}
    </a>
);


export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="developer-modal-title"
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-brand-accent/10 rounded-full mb-4">
                 <UserCircleIcon className="h-10 w-10 text-brand-accent" />
            </div>

            <h2 id="developer-modal-title" className="text-2xl font-bold text-brand-primary dark:text-white mb-2">
              {t('developer_modal_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('developer_label')}</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {t('developer_name')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
                {t('developer_bio')}
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
                <SocialLink href="https://www.facebook.com/share/1Ejkmy26eq/" title={t('tooltip_facebook')}><FacebookIcon /></SocialLink>
                <SocialLink href="https://www.instagram.com/salahdinadvs?igsh=a3puZDA5dHp5eWZ2" title={t('tooltip_instagram')}><InstagramIcon /></SocialLink>
                <SocialLink href="https://x.com/salahdinADVS1" title={t('tooltip_x')}><XSocialIcon /></SocialLink>
                <SocialLink href="https://t.me/salahadoroobi" title={t('tooltip_telegram')}><TelegramIcon /></SocialLink>
                <SocialLink href="https://wa.me/967772934757" title={t('tooltip_whatsapp')}><WhatsAppIcon /></SocialLink>
                <SocialLink href="mailto:salahadoroobi@gmail.com" title={t('tooltip_email')}><EmailIcon /></SocialLink>
                <SocialLink href="https://github.com/salahadoroobi" title={t('tooltip_github')}><GitHubIcon /></SocialLink>
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
