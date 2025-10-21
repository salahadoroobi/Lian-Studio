import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GeneratorView } from './views/GeneratorView';
import { EnhancerView } from './views/EnhancerView';
import { ExtractorView } from './views/ExtractorView';
import { LandingPage } from './views/LandingPage';
import { useLocalization } from './hooks/useLocalization';
import { MergerView } from './views/MergerView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EditorView } from './views/EditorView';

export type View = 'landing' | 'editor' | 'generator' | 'enhancer' | 'extractor' | 'merger';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [view, setView] = useState<View>('landing');
    const { t, setLanguage, language, dir } = useLocalization();
    const [theme, setTheme] = useState<Theme>('light');
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        root.dir = dir;
    }, [theme, dir]);
    
    // Add a transition effect for language change
    const [isLangTransitioning, setIsLangTransitioning] = useState(false);
    const handleSetLanguage = (lang: 'en' | 'ar') => {
        if (lang !== language) {
            setIsLangTransitioning(true);
            setTimeout(() => {
                setLanguage(lang);
                setTimeout(() => setIsLangTransitioning(false), 50); // allow DOM to update
            }, 300);
        }
    };
    
    // Add a transition effect for view change
    const [isViewTransitioning, setIsViewTransitioning] = useState(false);
    const changeView = (newView: View) => {
        if (newView !== view) {
            setIsViewTransitioning(true);
            setTimeout(() => {
                setView(newView);
                // Let the new view mount before fading it in
                setTimeout(() => setIsViewTransitioning(false), 50);
            }, 300); // This duration should match the fade-out duration
        }
    };


    const renderView = () => {
        switch (view) {
            case 'editor':
                return <EditorView t={t} language={language} />;
            case 'generator':
                return <GeneratorView t={t} language={language} />;
            case 'enhancer':
                return <EnhancerView t={t} language={language} />;
            case 'merger':
                return <MergerView t={t} language={language} />;
            case 'extractor':
                return <ExtractorView t={t} />;
            case 'landing':
            default:
                return <LandingPage setView={changeView} t={t} language={language} />;
        }
    };

    const mainContentClasses = isLangTransitioning || isViewTransitioning ? 'opacity-0' : 'opacity-100';

    return (
        <div className={`min-h-screen bg-brand-bg dark:bg-gray-900 transition-colors duration-300 ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
            <Header
                currentView={view}
                setView={changeView}
                theme={theme}
                setTheme={setTheme}
                language={language}
                setLanguage={handleSetLanguage}
                t={t}
                setIsApiKeyModalOpen={setIsApiKeyModalOpen}
            />
            <main className={`transition-opacity duration-300 ease-in-out ${mainContentClasses}`}>
                {renderView()}
            </main>
            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => setIsApiKeyModalOpen(false)}
                t={t}
                language={language}
            />
        </div>
    );
};

export default App;