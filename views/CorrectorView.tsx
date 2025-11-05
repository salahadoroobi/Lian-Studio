

import React, { useState, useRef, useLayoutEffect } from 'react';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { correctPrompt } from '../services/geminiService';
import type { TFunction, Language } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ExtractionLanguageSelector } from '../components/ExtractionLanguageSelector';
import { ActionButton } from '../components/ActionButton';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';
import { PasteIcon } from '../components/icons/PasteIcon';

interface CorrectorViewProps {
  t: TFunction;
  language: Language;
}

export const CorrectorView: React.FC<CorrectorViewProps> = ({ t, language }) => {
    const [idea, setIdea] = useState('');
    const [correctedText, setCorrectedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [outputLanguage, setOutputLanguage] = useState<string>('en');
    const [pasteMessage, setPasteMessage] = useState<string | null>(null);

    const ideaTextareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setIdea(text);
            };
            reader.onerror = (e) => {
                console.error("Failed to read file", e);
                setError("Failed to read the selected file.");
            }
            reader.readAsText(file);
        }
    };

    const handlePaste = async () => {
        setPasteMessage(null);
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setIdea(text);
            } else {
                setPasteMessage(t('paste_error_not_text'));
                setTimeout(() => setPasteMessage(null), 3000);
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            setPasteMessage(t('paste_error_not_text'));
            setTimeout(() => setPasteMessage(null), 3000);
        }
    };
    
    const canCorrect = !isLoading && idea.trim().length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('corrector_title')}</h2>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="idea-input" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('corrector_idea_label')}</label>
                        <div className="flex items-center gap-2 relative">
                            {pasteMessage && (
                                <div className="absolute right-0 -top-10 bg-gray-800 text-white text-xs font-semibold rounded-md py-1.5 px-3 animate-fade-in shadow-lg whitespace-nowrap z-10">
                                    {pasteMessage}
                                </div>
                            )}
                             <button
                                onClick={handlePaste}
                                title={t('paste_from_clipboard')}
                                aria-label={t('paste_from_clipboard')}
                                className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"
                            >
                                <PasteIcon />
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                title={t('upload_prompt_label')}
                                aria-label={t('upload_prompt_label')}
                                className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"
                            >
                                <UploadTextIcon />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".txt"
                                className="hidden"
                                id="prompt-file-upload-corrector"
                            />
                        </div>
                    </div>
                    <textarea
                        ref={ideaTextareaRef}
                        id="idea-input"
                        rows={5}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder={t('corrector_idea_placeholder')}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
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