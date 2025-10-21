import React from 'react';
import type { View } from '../App';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Language, TFunction } from '../hooks/useLocalization';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { KeyIcon } from './icons/KeyIcon';

type Theme = 'light' | 'dark';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TFunction;
    setIsApiKeyModalOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, theme, setTheme, language, setLanguage, t, setIsApiKeyModalOpen }) => {
    
    return (
        <header className="bg-brand-bg/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left section */}
                <div className="w-1/3 flex justify-start">
                    {currentView !== 'landing' ? (
                        <button
                            onClick={() => setView('landing')}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-brand-accent dark:text-brand-accent transition-colors"
                            aria-label={t('back_to_home')}
                            title={t('back_to_home')}
                        >
                           <ArrowLeftIcon />
                        </button>
                    ) : (
                         <h1 className="text-2xl font-bold text-brand-primary dark:text-white flex items-center gap-2">
                            {t('app_title')}
                            <span className="bg-brand-accent text-brand-bg dark:bg-gray-700 dark:text-brand-accent text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                v3.0.5
                            </span>
                        </h1>
                    )}
                </div>

                {/* Center section (only for tool views) */}
                <div className="w-1/3 flex justify-center">
                     {currentView !== 'landing' && (
                         <h1 className="text-2xl font-bold text-brand-primary dark:text-white">
                             {t('app_title')}
                         </h1>
                     )}
                </div>

                {/* Right section */}
                <div className="w-1/3 flex justify-end">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsApiKeyModalOpen(true)}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-brand-accent/20 text-brand-accent dark:text-brand-accent transition-colors"
                            aria-label={t('api_key_tooltip')}
                            title={t('api_key_tooltip')}
                        >
                            <KeyIcon />
                        </button>
                        <LanguageSwitcher language={language} setLanguage={setLanguage} t={t} />
                        <ThemeSwitcher theme={theme} setTheme={setTheme} t={t} />
                    </div>
                </div>
            </div>
        </header>
    );
};