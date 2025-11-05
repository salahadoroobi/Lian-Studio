import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GeneratorView } from './views/GeneratorView';
import { EnhancerView } from './views/EnhancerView';
import { PromptExtractorView } from './views/PromptExtractorView';
import { LandingPage } from './views/LandingPage';
import { useLocalization } from './hooks/useLocalization';
import { MergerView } from './views/MergerView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EditorView } from './views/EditorView';
import { CorrectorView } from './views/CorrectorView';
import { Footer } from './components/Footer';
import { DeveloperModal } from './components/DeveloperModal';
import { RestorerView } from './views/RestorerView';
import { WriterView } from './views/WriterView';
import { TranslatorView } from './views/TranslatorView';
import { ProofreaderView } from './views/ProofreaderView';
import { StealthView } from './views/StealthView';
import { SummarizerView } from './views/SummarizerView';
import { TextExtractorView } from './views/TextExtractorView';
import { LiveSupportModal } from './components/LiveSupportModal';

export type View = 'landing' | 'editor' | 'generator' | 'enhancer' | 'prompt_extractor' | 'merger' | 'corrector' | 'restorer' | 'writer' | 'translator' | 'proofreader' | 'stealth' | 'summarizer' | 'text_extractor';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [view, setView] = useState<View>('landing');
    const { t, setLanguage, language, dir } = useLocalization();
    const [theme, setTheme] = useState<Theme>('light');
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
    const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
    const [isLiveSupportModalOpen, setIsLiveSupportModalOpen] = useState(false);
    const [initialGeneratorPrompt, setInitialGeneratorPrompt] = useState('');
    const [visibleCards, setVisibleCards] = useState(15);

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
    const changeView = (newView: View, options?: { initialPrompt?: string }) => {
        if (newView !== view || (newView === 'generator' && options?.initialPrompt)) {
            if (newView === 'generator' && options?.initialPrompt) {
                setInitialGeneratorPrompt(options.initialPrompt);
            } else {
                setInitialGeneratorPrompt('');
            }

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
                return <GeneratorView t={t} language={language} initialPrompt={initialGeneratorPrompt} />;
            case 'enhancer':
                return <EnhancerView t={t} language={language} />;
            case 'merger':
                return <MergerView t={t} language={language} />;
            case 'restorer':
                return <RestorerView t={t} language={language} />;
            case 'prompt_extractor':
                return <PromptExtractorView t={t} />;
            case 'text_extractor':
                return <TextExtractorView t={t} />;
            case 'corrector':
                return <CorrectorView t={t} language={language} />;
            case 'writer':
                return <WriterView t={t} language={language} />;
            case 'translator':
                return <TranslatorView t={t} language={language} />;
            case 'proofreader':
                return <ProofreaderView t={t} language={language} />;
            case 'stealth':
                return <StealthView t={t} language={language} />;
            case 'summarizer':
                return <SummarizerView t={t} language={language} />;
            case 'landing':
            default:
                return <LandingPage 
                    setView={changeView} 
                    t={t} 
                    language={language} 
                    visibleCards={visibleCards}
                    setVisibleCards={setVisibleCards}
                />;
        }
    };

    const mainContentClasses = isLangTransitioning || isViewTransitioning ? 'opacity-0' : 'opacity-100';

    return (
        <div className={`min-h-screen bg-brand-bg dark:bg-gray-900 transition-colors duration-300 font-sans flex flex-col`}>
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
            <main className={`flex-grow transition-opacity duration-300 ease-in-out ${mainContentClasses}`}>
                {renderView()}
            </main>
            <Footer t={t} onHeartClick={() => setIsDeveloperModalOpen(true)} setIsLiveSupportModalOpen={setIsLiveSupportModalOpen} />
            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => setIsApiKeyModalOpen(false)}
                t={t}
                language={language}
            />
            <DeveloperModal
                isOpen={isDeveloperModalOpen}
                onClose={() => setIsDeveloperModalOpen(false)}
                t={t}
            />
            <LiveSupportModal
                isOpen={isLiveSupportModalOpen}
                onClose={() => setIsLiveSupportModalOpen(false)}
                t={t}
            />
        </div>
    );
};

export default App;
