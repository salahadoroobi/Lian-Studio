import React from 'react';
// Fix: Correctly import types from the implemented useLocalization hook.
import type { Language, TFunction } from '../hooks/useLocalization';
import { TranslateIcon } from './icons/TranslateIcon';

interface LanguageSwitcherProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TFunction;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage, t }) => {
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    const tooltip = language === 'en' ? t('switch_language_to_ar') : t('switch_language_to_en');

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-brand-accent/20 text-brand-accent dark:text-brand-accent transition-colors"
            aria-label={tooltip}
            title={tooltip}
        >
            <TranslateIcon />
        </button>
    );
};