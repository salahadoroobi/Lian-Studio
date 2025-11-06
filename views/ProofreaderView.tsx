import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { proofreadText } from '../services/geminiService';
import type { TFunction, Language } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ExtractionLanguageSelector } from '../components/ExtractionLanguageSelector';
import { ActionButton } from '../components/ActionButton';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';
import { PasteIcon } from '../components/icons/PasteIcon';
import { ShimmerWrapper } from '../components/ShimmerWrapper';
import { CORRECTION_LEVELS, TARGET_AUDIENCES } from '../constants';
import { XIcon } from '../components/icons/XIcon';

interface ProofreaderViewProps {
  t: TFunction;
  language: Language;
}

type CorrectionLevel = 'basic' | 'advanced' | 'rewrite';
type TargetAudience = 'general' | 'academic' | 'business';

export const ProofreaderView: React.FC<ProofreaderViewProps> = ({ t, language }) => {
    const [text, setText] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
    const [correctionLevel, setCorrectionLevel] = useState<CorrectionLevel>('advanced');
    const [targetAudience, setTargetAudience] = useState<TargetAudience>('general');
    const [vocalization, setVocalization] = useState(false);
    const [grammaticalDiscipline, setGrammaticalDiscipline] = useState(true);
    
    const [proofreadTextResult, setProofreadTextResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [outputLanguage, setOutputLanguage] = useState<string>('en');
    const [pasteMessage, setPasteMessage] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-enable vocalization for Arabic
    useEffect(() => {
        const arabicRegex = /[\u0600-\u06FF]/;
        const isArabicInput = arabicRegex.test(text);
        const isArabicOutput = outputLanguage === 'Arabic';

        if (isArabicInput && isArabicOutput) {
            setVocalization(true);
        } else if (outputLanguage !== 'Arabic') {
            setVocalization(false);
        }
    }, [text, outputLanguage]);

    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);

    const handleProofread = async () => {
        if (!text.trim() && !uploadedFile) {
            setError('Please provide text or a file to proofread.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setProofreadTextResult(null);
        try {
            const finalCorrectionLevel = isAdvancedOptionsOpen ? correctionLevel : 'advanced';
            const finalTargetAudience = isAdvancedOptionsOpen ? targetAudience : 'general';
            const finalVocalization = isAdvancedOptionsOpen ? vocalization : (outputLanguage === 'Arabic' && /[\u0600-\u06FF]/.test(text));
            const finalGrammaticalDiscipline = isAdvancedOptionsOpen ? grammaticalDiscipline : true;
            
            const result = await proofreadText(text, uploadedFile, outputLanguage, finalCorrectionLevel, finalTargetAudience, finalVocalization, finalGrammaticalDiscipline);
            setProofreadTextResult(result);
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
            setText(''); // Clear text input
            setError(null);
        }
         // Clear the input value so the same file can be selected again
        if (event.target) {
            event.target.value = '';
        }
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
            console.error('Failed to read clipboard contents: ', err);
            setPasteMessage(t('paste_error_not_text'));
            setTimeout(() => setPasteMessage(null), 3000);
        }
    };
    
    const canProofread = !isLoading && (text.trim().length > 0 || !!uploadedFile);

    const OptionButton: React.FC<{ tKey: Parameters<TFunction>[0]; isSelected: boolean; onClick: () => void; }> = ({ tKey, isSelected, onClick }) => (
        <button
            onClick={onClick}
            className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                isSelected
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
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('proofreader_title')}</h2>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="proofreader-input" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('proofreader_input_label')}</label>
                        <div className="flex items-center gap-2 relative">
                            {pasteMessage && (
                                <div className="absolute right-0 -top-10 bg-gray-800 text-white text-xs font-semibold rounded-md py-1.5 px-3 animate-fade-in shadow-lg whitespace-nowrap z-10">
                                    {pasteMessage}
                                </div>
                            )}
                             <button onClick={handlePaste} title={t('paste_from_clipboard')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><PasteIcon /></button>
                            <button onClick={() => fileInputRef.current?.click()} title={t('upload_prompt_label')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><UploadTextIcon /></button>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.pdf,.doc,.docx" className="hidden" />
                        </div>
                    </div>
                    <textarea
                        ref={textareaRef}
                        id="proofreader-input"
                        rows={8}
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            if (uploadedFile) setUploadedFile(null);
                        }}
                        placeholder={t('proofreader_input_placeholder')}
                        dir="auto"
                        disabled={!!uploadedFile}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden disabled:bg-gray-100 dark:disabled:bg-gray-700/50 text-start"
                    />
                     {uploadedFile && (
                        <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg animate-fade-in">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate pr-2">
                               {t('proofreader_file_uploaded_label')} {uploadedFile.name}
                            </span>
                            <button
                                onClick={handleRemoveFile}
                                title={t('proofreader_remove_file_tooltip')}
                                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
                            >
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
                            <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 pointer-events-none">{t('proofreader_advanced_options_toggle')}</label>
                            <ShimmerWrapper className="rounded-full"><span className="inline-flex items-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">{t('beta_tag')}</span></ShimmerWrapper>
                        </div>
                        <label className="inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="sr-only peer" checked={isAdvancedOptionsOpen} onChange={(e) => setIsAdvancedOptionsOpen(e.target.checked)} />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 dark:peer-focus:ring-brand-accent/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-accent"></div>
                        </label>
                    </div>
                    
                    <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: isAdvancedOptionsOpen ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-6">
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('correction_level_label')}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {CORRECTION_LEVELS.map(level => (
                                            <OptionButton key={level.value} tKey={level.tKey} isSelected={correctionLevel === level.value} onClick={() => setCorrectionLevel(level.value as CorrectionLevel)} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('target_audience_label')}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {TARGET_AUDIENCES.map(audience => (
                                            <OptionButton key={audience.value} tKey={audience.tKey} isSelected={targetAudience === audience.value} onClick={() => setTargetAudience(audience.value as TargetAudience)} />
                                        ))}
                                    </div>
                                </div>
                                 <div className="flex items-center justify-between">
                                    <label htmlFor="vocalization-toggle" className="text-md font-medium text-gray-900 dark:text-gray-300">
                                        {t('proofreader_vocalization_label')}
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            id="vocalization-toggle"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={vocalization}
                                            onChange={(e) => setVocalization(e.target.checked)}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 dark:peer-focus:ring-brand-accent/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-accent"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="grammar-discipline-toggle" className="text-md font-medium text-gray-900 dark:text-gray-300">
                                        {t('proofreader_grammar_discipline_label')}
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            id="grammar-discipline-toggle"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={grammaticalDiscipline}
                                            onChange={(e) => setGrammaticalDiscipline(e.target.checked)}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 dark:peer-focus:ring-brand-accent/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-accent"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <ActionButton
                    onClick={handleProofread}
                    disabled={!canProofread}
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
                >
                    {isLoading ? '...' : t('proofread_button')}
                </ActionButton>
            </div>

            {/* Right Panel: Result */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] lg:min-h-0 flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('proofreading_title')}</p>
                        <p className="text-sm">{t('proofreading_desc')}</p>
                     </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <PromptResultDisplay text={proofreadTextResult} t={t} outputLanguage={outputLanguage} initialDescKey="initial_desc_proofreader" />
                         {proofreadTextResult && uploadedFile && (
                            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 animate-fade-in">
                                {t('proofreader_output_format_note')}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
