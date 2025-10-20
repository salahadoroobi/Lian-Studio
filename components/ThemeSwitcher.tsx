import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
// Fix: Correctly import TFunction from the implemented useLocalization hook.
import type { TFunction } from '../hooks/useLocalization';

type Theme = 'light' | 'dark';

interface ThemeSwitcherProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    t: TFunction;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme, t }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-brand-accent/20 text-brand-accent dark:text-brand-accent transition-colors"
            aria-label={theme === 'light' ? t('toggle_theme_dark') : t('toggle_theme_light')}
            title={theme === 'light' ? t('toggle_theme_dark') : t('toggle_theme_light')}
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};