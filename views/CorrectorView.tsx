import React, { useState, useRef, useLayoutEffect } from 'react';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { correctPrompt } from '../services/geminiService';
import type { TFunction } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ExtractionLanguageSelector } from '../components/ExtractionLanguageSelector';
import { ActionButton } from '../components/ActionButton';

interface CorrectorViewProps {
  t: TFunction;
}

export const CorrectorView: React.FC<CorrectorViewProps> = ({ t }) => {
    const [idea, setIdea] = useState('');
    const [correctedText, setCorrectedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [outputLanguage, setOutputLanguage] = useState<string>('en');

    const ideaTextareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        const textarea = ideaTextareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [idea]);

    const handleCorrect = async () => {
        if (!idea.trim()) {
            setError('Please provide an idea to correct.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCorrectedText(null);
        try {
            const result = await correctPrompt(idea, outputLanguage);
            setCorrectedText(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const canCorrect = !isLoading && idea.trim().length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('corrector_title')}</h2>
                
                <div>
                    <label htmlFor="idea-input" className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('corrector_idea_label')}</label>
                    <textarea
                        ref={ideaTextareaRef}
                        id="idea-input"
                        rows={5}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder={t('corrector_idea_placeholder')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden"
                    />
                </div>
                
                <ExtractionLanguageSelector
                    selectedLanguage={outputLanguage}
                    setSelectedLanguage={setOutputLanguage}
                    t={t}
                />

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <ActionButton
                    onClick={handleCorrect}
                    disabled={!canCorrect}
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
                >
                    {isLoading ? '...' : t('correct_button')}
                </ActionButton>
            </div>

            {/* Right Panel: Result */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] lg:min-h-0 flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('correcting_title')}</p>
                        <p className="text-sm">{t('correcting_desc')}</p>
                     </div>
                ) : (
                    <PromptResultDisplay text={correctedText} t={t} outputLanguage={outputLanguage} initialDescKey="initial_desc_corrector" />
                )}
            </div>
        </div>
    );
};