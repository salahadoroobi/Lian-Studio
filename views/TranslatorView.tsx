import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { translateText } from '../services/geminiService';
import type { TFunction, Language } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ActionButton } from '../components/ActionButton';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';
import { PasteIcon } from '../components/icons/PasteIcon';
import { TRANSLATION_LANGUAGES, FORMALITY_OPTIONS } from '../constants';
import { ArrowSwapIcon } from '../components/icons/ArrowSwapIcon';
import { ShimmerWrapper } from '../components/ShimmerWrapper';

interface TranslatorViewProps {
  t: TFunction;
  language: Language;
}

type Formality = 'default' | 'formal' | 'informal';

export const TranslatorView: React.FC<TranslatorViewProps> = ({ t, language }) => {
    const [inputText, setInputText] = useState('');
    const [fromLang, setFromLang] = useState('auto');
    const [toLang, setToLang] = useState(language === 'en' ? 'Arabic' : 'English');
    const [formality, setFormality] = useState<Formality>('default');
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
    
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pasteMessage, setPasteMessage] = useState<string | null>(null);

    const inputTextareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Set default target language based on UI language
    useEffect(() => {
        setToLang(language === 'en' ? 'Arabic' : 'English');
    }, [language]);

    useLayoutEffect(() => {
        const textarea = inputTextareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [inputText]);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setError('Please enter text to translate.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTranslatedText(null);
        try {
            const finalFormality = isAdvancedOptionsOpen ? formality : 'default';
            const result = await translateText(inputText, fromLang, toLang, finalFormality);
            setTranslatedText(result);
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
                setInputText(text);
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
                setInputText(text);
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

    const handleSwapLanguages = () => {
        if (fromLang === 'auto') return; // Cannot swap with auto-detect
        const currentFrom = fromLang;
        setFromLang(toLang);
        setToLang(currentFrom);
    };

    const canTranslate = !isLoading && inputText.trim().length > 0;

    const LanguageSelect: React.FC<{
        id: string;
        label: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        options: readonly { tKey: any, value: string }[];
        includeAuto?: boolean;
    }> = ({ id, label, value, onChange, options, includeAuto }) => (
        <div className="flex-1">
            <label htmlFor={id} className="block text-sm font-medium text-brand-primary dark:text-gray-300 mb-1">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
                {includeAuto && <option value="auto">{t('output_language_auto')}</option>}
                {options.map(lang => (
                    <option key={lang.value} value={lang.value}>{t(lang.tKey)}</option>
                ))}
            </select>
        </div>
    );
    
    const FormalityOptionButton: React.FC<{
        tKey: Parameters<TFunction>[0];
        value: Formality;
    }> = ({ tKey, value }) => (
        <button
            onClick={() => setFormality(value)}
            className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                formality === value
                ? 'bg-brand-accent text-white border-brand-accent ring-brand-accent/50'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
        >
            {t(tKey)}
        </button>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('translator_title')}</h2>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="translate-input" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('translator_input_label')}</label>
                         <div className="flex items-center gap-2 relative">
                            {pasteMessage && (
                                <div className="absolute right-0 -top-10 bg-gray-800 text-white text-xs font-semibold rounded-md py-1.5 px-3 animate-fade-in shadow-lg whitespace-nowrap z-10">
                                    {pasteMessage}
                                </div>
                            )}
                            <button onClick={handlePaste} title={t('paste_from_clipboard')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><PasteIcon /></button>
                            <button onClick={() => fileInputRef.current?.click()} title={t('upload_prompt_label')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><UploadTextIcon /></button>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt" className="hidden" />
                        </div>
                    </div>
                    <textarea
                        ref={inputTextareaRef}
                        id="translate-input"
                        rows={8}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('translator_input_placeholder')}
                        dir="auto"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden"
                    />
                </div>
                
                <div className="flex items-end gap-2">
                    <LanguageSelect id="from-lang" label={t('translator_from_label')} value={fromLang} onChange={e => setFromLang(e.target.value)} options={TRANSLATION_LANGUAGES} includeAuto />
                    <button onClick={handleSwapLanguages} disabled={fromLang === 'auto'} title={t('swap_languages_tooltip')} className="p-2.5 mb-0.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ArrowSwapIcon/></button>
                    <LanguageSelect id="to-lang" label={t('translator_to_label')} value={toLang} onChange={e => setToLang(e.target.value)} options={TRANSLATION_LANGUAGES} />
                </div>
                
                 <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300">
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => setIsAdvancedOptionsOpen(prev => !prev)}
                        role="button"
                        aria-expanded={isAdvancedOptionsOpen}
                        aria-controls="advanced-translator-options-content"
                    >
                         <div className="flex items-center gap-2">
                            <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 pointer-events-none">
                                {t('translator_advanced_options_toggle')}
                            </label>
                            <ShimmerWrapper className="rounded-full">
                                <span className="inline-flex items-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {t('beta_tag')}
                                </span>
                            </ShimmerWrapper>
                        </div>
                        <label htmlFor="advanced-options-toggle-translator" className="inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input
                                id="advanced-options-toggle-translator"
                                type="checkbox"
                                className="sr-only peer"
                                checked={isAdvancedOptionsOpen}
                                onChange={(e) => setIsAdvancedOptionsOpen(e.target.checked)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 dark:peer-focus:ring-brand-accent/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-accent"></div>
                        </label>
                    </div>
                    
                    <div id="advanced-translator-options-content" className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: isAdvancedOptionsOpen ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-6">
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('formality_label')}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {FORMALITY_OPTIONS.map(opt => (
                                            <FormalityOptionButton key={opt.value} tKey={opt.tKey} value={opt.value as Formality} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <ActionButton
                    onClick={handleTranslate}
                    disabled={!canTranslate}
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
                >
                    {isLoading ? '...' : t('translate_button')}
                </ActionButton>
            </div>

            {/* Right Panel: Result */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] lg:min-h-0 flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('translating_title')}</p>
                        <p className="text-sm">{t('translating_desc')}</p>
                     </div>
                ) : (
                    <PromptResultDisplay text={translatedText} t={t} outputLanguage={toLang === 'Arabic' ? 'ar' : 'en'} initialDescKey="initial_desc_translator" />
                )}
            </div>
        </div>
    );
};
