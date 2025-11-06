import React, { useState, useRef, useLayoutEffect } from 'react';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { humanizeText } from '../services/geminiService';
import type { TFunction, Language } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ActionButton } from '../components/ActionButton';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';
import { PasteIcon } from '../components/icons/PasteIcon';
import { ShimmerWrapper } from '../components/ShimmerWrapper';
import { TONES_STEALTH, COMPLEXITY_LEVELS } from '../constants';
import { IntensitySlider } from '../components/IntensitySlider';
import { XIcon } from '../components/icons/XIcon';

// Type definitions
type Tone = 'professional' | 'casual' | 'academic' | 'creative';
type Complexity = 'simple' | 'standard' | 'advanced';

interface StealthViewProps {
  t: TFunction;
  language: Language;
}

// Checkbox component for techniques
const TechniqueCheckbox: React.FC<{
    id: string;
    labelKey: Parameters<TFunction>[0];
    checked: boolean;
    onChange: (checked: boolean) => void;
    t: TFunction;
}> = ({ id, labelKey, checked, onChange, t }) => (
    <div className="flex items-center">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-brand-accent bg-gray-100 border-gray-300 rounded focus:ring-brand-accent dark:focus:ring-brand-accent-dark dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
        />
        <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
            {t(labelKey)}
        </label>
    </div>
);


export const StealthView: React.FC<StealthViewProps> = ({ t, language }) => {
    const [text, setText] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
    
    // Advanced Options State
    const [intensity, setIntensity] = useState(75);
    const [tone, setTone] = useState<Tone>('casual');
    const [complexity, setComplexity] = useState<Complexity>('standard');
    const [techniques, setTechniques] = useState({
        anecdotes: false,
        varyStructure: true,
        imperfections: true,
    });

    const [humanizedText, setHumanizedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const handleHumanize = async () => {
        if (!text.trim() && !uploadedFile) {
            setError('Please provide text or a file to humanize.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setHumanizedText(null);
        try {
            const options = isAdvancedOptionsOpen 
                ? { intensity, tone: t(`tone_${tone}`), complexity: t(`complexity_${complexity}`), techniques }
                : { intensity: 75, tone: t('tone_casual'), complexity: t('complexity_standard'), techniques: { anecdotes: false, varyStructure: true, imperfections: true } };
            
            const result = await humanizeText(text, uploadedFile, options);
            setHumanizedText(result);
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
    
    const canHumanize = !isLoading && (text.trim().length > 0 || !!uploadedFile);

    const OptionButton: React.FC<{ tKey: Parameters<TFunction>[0]; isSelected: boolean; onClick: () => void; }> = ({ tKey, isSelected, onClick }) => (
        <button
            onClick={onClick}
            className={`p-2 border rounded-lg text-center font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
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
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('stealth_title')}</h2>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="stealth-input" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('stealth_input_label')}</label>
                        <div className="flex items-center gap-2 relative">
                            {pasteMessage && <div className="absolute right-0 -top-10 bg-gray-800 text-white text-xs rounded-md py-1 px-2 animate-fade-in">{pasteMessage}</div>}
                            <button onClick={handlePaste} title={t('paste_from_clipboard')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><PasteIcon /></button>
                            <button onClick={() => fileInputRef.current?.click()} title={t('upload_prompt_label')} className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"><UploadTextIcon /></button>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.pdf,.doc,.docx" className="hidden" />
                        </div>
                    </div>
                    <textarea
                        ref={textareaRef}
                        id="stealth-input"
                        rows={10}
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            if (uploadedFile) setUploadedFile(null);
                        }}
                        placeholder={t('stealth_input_placeholder')}
                        dir="auto"
                        disabled={!!uploadedFile}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none overflow-hidden disabled:bg-gray-100 dark:disabled:bg-gray-700/50 text-start"
                    />
                    {uploadedFile && (
                        <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg animate-fade-in">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate pr-2">
                               {t('stealth_file_uploaded_label')} {uploadedFile.name}
                            </span>
                            <button
                                onClick={handleRemoveFile}
                                title={t('stealth_remove_file_tooltip')}
                                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
                            >
                                <XIcon />
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300">
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsAdvancedOptionsOpen(p => !p)} role="button" aria-expanded={isAdvancedOptionsOpen}>
                        <div className="flex items-center gap-2">
                            <label className="text-lg font-semibold text-brand-primary dark:text-gray-300 pointer-events-none">{t('stealth_advanced_options_toggle')}</label>
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
                                <IntensitySlider intensity={intensity} setIntensity={setIntensity} t={t} />
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('humanization_tone_label')}</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {TONES_STEALTH.map(item => (
                                            <OptionButton key={item.value} tKey={item.tKey} isSelected={tone === item.value} onClick={() => setTone(item.value as Tone)} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('complexity_level_label')}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {COMPLEXITY_LEVELS.map(item => (
                                            <OptionButton key={item.value} tKey={item.tKey} isSelected={complexity === item.value} onClick={() => setComplexity(item.value as Complexity)} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('humanization_techniques_label')}</label>
                                    <div className="flex flex-col gap-2">
                                        <TechniqueCheckbox id="tech-anecdotes" labelKey="technique_anecdotes" checked={techniques.anecdotes} onChange={c => setTechniques(p => ({...p, anecdotes: c}))} t={t} />
                                        <TechniqueCheckbox id="tech-structure" labelKey="technique_vary_structure" checked={techniques.varyStructure} onChange={c => setTechniques(p => ({...p, varyStructure: c}))} t={t} />
                                        <TechniqueCheckbox id="tech-imperfections" labelKey="technique_imperfections" checked={techniques.imperfections} onChange={c => setTechniques(p => ({...p, imperfections: c}))} t={t} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <ActionButton onClick={handleHumanize} disabled={!canHumanize} className="w-full bg-brand-accent text-brand-bg font-bold py-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mt-auto">
                    {isLoading ? '...' : t('stealth_button')}
                </ActionButton>
            </div>

            {/* Right Panel */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('stealthing_title')}</p>
                        <p className="text-sm">{t('stealthing_desc')}</p>
                     </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <PromptResultDisplay text={humanizedText} t={t} outputLanguage={language} initialDescKey="initial_desc_stealth" />
                        {humanizedText && uploadedFile && (
                            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 animate-fade-in">
                                {t('stealth_output_format_note')}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
