import React, { useState, useRef, useLayoutEffect } from 'react';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { summarizeText } from '../services/geminiService';
import type { TFunction, Language } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ActionButton } from '../components/ActionButton';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';
import { PasteIcon } from '../components/icons/PasteIcon';
import { ShimmerWrapper } from '../components/ShimmerWrapper';
import { SUMMARY_FORMATS } from '../constants';
import { LengthSlider } from '../components/LengthSlider';
import { XIcon } from '../components/icons/XIcon';
import { ExtractionLanguageSelector } from '../components/ExtractionLanguageSelector';

// Type definitions
type SummaryFormat = 'paragraph' | 'bullet points';

interface SummarizerViewProps {
  t: TFunction;
  language: Language;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({ t, language }) => {
    const [text, setText] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
    
    // Advanced Options State
    const [summaryLength, setSummaryLength] = useState(40);
    const [summaryFormat, setSummaryFormat] = useState<SummaryFormat>('paragraph');
    const [focusKeywords, setFocusKeywords] = useState('');

    const [summarizedText, setSummarizedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [outputLanguage, setOutputLanguage] = useState<string>('en');
    const [pasteMessage, setPasteMessage] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);

    const handleSummarize = async () => {
        if (!text.trim() && !uploadedFile) {
            setError('Please provide text or a file to summarize.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSummarizedText(null);
        try {
            const options = isAdvancedOptionsOpen 
                ? { length: summaryLength, format: summaryFormat, keywords: focusKeywords }
                : { length: 40, format: 'paragraph' as SummaryFormat, keywords: '' };
            
            const result = await summarizeText(text, uploadedFile, outputLanguage, options.length, options.format, options.keywords);
            setSummarizedText(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setText('');
            setError(null);
        }
        if (event.target) event.target.value = '';
    };
    
    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    const handlePaste = async () => {
        setPasteMessage(null);
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText) {
                setText(clipboardText);
                setUploadedFile(null);
            } else {
                setPasteMessage(t('paste_error_not_text'));
                setTimeout(() => setPasteMessage(null), 3000);
            }
        } catch (err) {
             setPasteMessage(t('paste_error_not_text'));
             setTimeout(() => setPasteMessage(null), 3000);
        }
    };
    
    const canSummarize = !isLoading && (text.trim().length > 0 || !!uploadedFile);

    const OptionButton: React.FC<{ tKey: Parameters<TFunction>[0]; isSelected: boolean; onClick: () => void; }> = ({ tKey, isSelected, onClick }) => (
        <button
            onClick={onClick}
            className={`p-3 border rounded-lg text-center font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                isSelected
                ? 'bg-brand-accent text-white border-brand-accent ring-brand-accent/50'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
        >
            {t(tKey)}
        </button>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('summarizer_title')}</h2>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="summarizer-input" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('summarizer_input_label')}</label>
                        <div className="flex items-center gap-2 relative">
                            {pasteMessage && <div className="absolute right-0 -top-10 bg-gray-800 text-white text-xs rounded-md py-1 px-2 animate-fade-in">{pasteMessage}</div>}
                            <button onClick={handlePaste} title={t('paste_from_clipboard')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><PasteIcon /></button>
                            <button onClick={() => fileInputRef.current?.click()} title={t('upload_prompt_label')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><UploadTextIcon /></button>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.pdf,.doc,.docx" className="hidden" />
                        </div>
                    </div>
                    <textarea
                        ref={textareaRef}
                        id="summarizer-input"
                        rows={10}
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            if (uploadedFile) setUploadedFile(null);
                        }}
                        placeholder={t('summarizer_input_placeholder')}
                        dir="auto"
                        disabled={!!uploadedFile}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none overflow-hidden disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
                    />
                    {uploadedFile && (
                        <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg animate-fade-in">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate pr-2">
                               {t('summarizer_file_uploaded_label')} {uploadedFile.name}
                            </span>
                            <button onClick={handleRemoveFile} title={t('summarizer_remove_file_tooltip')} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors">
                                <XIcon />
                            </button>
                        </div>
                    )}
                </div>
                
                 <ExtractionLanguageSelector
                    selectedLanguage={outputLanguage}
                    setSelectedLanguage={setOutputLanguage}
                    t={t}
                />
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300">
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsAdvancedOptionsOpen(p => !p)} role="button" aria-expanded={isAdvancedOptionsOpen}>
                        <div className="flex items-center gap-2">
                            <label className="text-lg font-semibold text-brand-primary dark:text-gray-300 pointer-events-none">{t('summarizer_advanced_options_toggle')}</label>
                            <ShimmerWrapper className="rounded-full"><span className="inline-flex bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">{t('beta_tag')}</span></ShimmerWrapper>
                        </div>
                        <label className="inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="sr-only peer" checked={isAdvancedOptionsOpen} onChange={(e) => setIsAdvancedOptionsOpen(e.target.checked)} />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                        </label>
                    </div>
                    
                    <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: isAdvancedOptionsOpen ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-6">
                                <LengthSlider length={summaryLength} setLength={setSummaryLength} t={t} />
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('summary_format_label')}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SUMMARY_FORMATS.map(item => (
                                            <OptionButton key={item.value} tKey={item.tKey} isSelected={summaryFormat === item.value} onClick={() => setSummaryFormat(item.value as SummaryFormat)} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                     <label htmlFor="focus-keywords" className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('focus_keywords_label')}</label>
                                     <input
                                        id="focus-keywords"
                                        type="text"
                                        value={focusKeywords}
                                        onChange={(e) => setFocusKeywords(e.target.value)}
                                        placeholder={t('focus_keywords_placeholder')}
                                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                     />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <ActionButton onClick={handleSummarize} disabled={!canSummarize} className="w-full bg-brand-accent text-brand-bg font-bold py-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mt-auto">
                    {isLoading ? '...' : t('summarize_button')}
                </ActionButton>
            </div>

            {/* Right Panel */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('summarizing_title')}</p>
                        <p className="text-sm">{t('summarizing_desc')}</p>
                     </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <PromptResultDisplay text={summarizedText} t={t} outputLanguage={outputLanguage === 'Arabic' ? 'ar' : 'en'} initialDescKey="initial_desc_summarizer" />
                    </div>
                )}
            </div>
        </div>
    );
};