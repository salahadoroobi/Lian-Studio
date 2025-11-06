import React, { useState, useRef, useLayoutEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { generateContentText } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction, Language } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ExtractionLanguageSelector } from '../components/ExtractionLanguageSelector';
import { ActionButton } from '../components/ActionButton';
import { MAX_IMAGES } from '../constants';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';
import { PasteIcon } from '../components/icons/PasteIcon';
import { ContentRatioSlider } from '../components/ContentRatioSlider';
import { ShimmerWrapper } from '../components/ShimmerWrapper';

interface WriterViewProps {
  t: TFunction;
  language: Language;
}

type Tone = 'professional' | 'casual' | 'enthusiastic' | 'humorous';
type ContentType = 'social_media' | 'product_desc' | 'blog_idea' | 'email';

const TONES: Tone[] = ['professional', 'casual', 'enthusiastic', 'humorous'];
const CONTENT_TYPES: ContentType[] = ['social_media', 'product_desc', 'blog_idea', 'email'];

export const WriterView: React.FC<WriterViewProps> = ({ t, language }) => {
    const [idea, setIdea] = useState('');
    const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
    const [tone, setTone] = useState<Tone>('professional');
    const [contentType, setContentType] = useState<ContentType>('social_media');
    const [contentRatio, setContentRatio] = useState(50);
    const [pasteMessage, setPasteMessage] = useState<string | null>(null);
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
    
    const [generatedText, setGeneratedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [outputLanguage, setOutputLanguage] = useState<string>('en');

    const ideaTextareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        const textarea = ideaTextareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [idea]);

    const handleGenerate = async () => {
        if (!idea.trim()) {
            setError('Please provide an idea or description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedText(null);
        try {
            // Determine options based on whether the advanced panel is open
            const finalTone = isAdvancedOptionsOpen ? tone : 'professional';
            const finalContentType = isAdvancedOptionsOpen ? contentType : 'social_media';
            const finalContentRatio = isAdvancedOptionsOpen ? contentRatio : 50;

            const result = await generateContentText(
                idea, 
                baseImage, 
                t(`tone_${finalTone}`), 
                t(`content_type_${finalContentType}`), 
                outputLanguage, 
                finalContentRatio
            );
            setGeneratedText(result);
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

    const canGenerate = !isLoading && idea.trim().length > 0;

    const OptionButton: React.FC<{
        tKey: Parameters<TFunction>[0];
        isSelected: boolean;
        onClick: () => void;
    }> = ({ tKey, isSelected, onClick }) => (
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
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('writer_title')}</h2>
                
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="idea-input" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('writer_idea_label')}</label>
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
                                id="prompt-file-upload-writer"
                            />
                        </div>
                    </div>
                    <textarea
                        ref={ideaTextareaRef}
                        id="idea-input"
                        rows={4}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder={t('writer_idea_placeholder')}
                        dir="auto"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden text-start"
                    />
                </div>
                
                <div>
                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('writer_optional_image_label')}</label>
                    <ImageUploader images={baseImage} setImages={setBaseImage} maxFiles={MAX_IMAGES} t={t} descriptionKey="writer_optional_image_desc" />
                </div>

                {/* Integrated Advanced Options Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300">
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => setIsAdvancedOptionsOpen(prev => !prev)}
                        role="button"
                        aria-expanded={isAdvancedOptionsOpen}
                        aria-controls="advanced-writer-options-content"
                    >
                        <div className="flex items-center gap-2">
                            <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 pointer-events-none">
                                {t('writer_advanced_options_toggle')}
                            </label>
                            <ShimmerWrapper className="rounded-full">
                                <span className="inline-flex items-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {t('beta_tag')}
                                </span>
                            </ShimmerWrapper>
                        </div>
                        <label htmlFor="advanced-options-toggle-writer" className="inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input
                                id="advanced-options-toggle-writer"
                                type="checkbox"
                                className="sr-only peer"
                                checked={isAdvancedOptionsOpen}
                                onChange={(e) => setIsAdvancedOptionsOpen(e.target.checked)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 dark:peer-focus:ring-brand-accent/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-accent"></div>
                        </label>
                    </div>
                    
                    <div
                        id="advanced-writer-options-content"
                        className="grid transition-all duration-500 ease-in-out"
                        style={{ gridTemplateRows: isAdvancedOptionsOpen ? '1fr' : '0fr' }}
                    >
                        <div className="overflow-hidden">
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-6">
                                <ContentRatioSlider ratio={contentRatio} setRatio={setContentRatio} t={t} />
                
                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('writer_tone_label')}</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {TONES.map(tVal => (
                                            <OptionButton key={tVal} tKey={`tone_${tVal}`} isSelected={tone === tVal} onClick={() => setTone(tVal)} />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('writer_content_type_label')}</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                                        {CONTENT_TYPES.map(cVal => (
                                            <OptionButton key={cVal} tKey={`content_type_${cVal}`} isSelected={contentType === cVal} onClick={() => setContentType(cVal)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ExtractionLanguageSelector
                    selectedLanguage={outputLanguage}
                    setSelectedLanguage={setOutputLanguage}
                    t={t}
                />

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <ActionButton
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
                >
                    {isLoading ? '...' : t('generate_content_button')}
                </ActionButton>
            </div>

            {/* Right Panel: Result */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] lg:min-h-0 flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('writing_title')}</p>
                        <p className="text-sm">{t('writing_desc')}</p>
                     </div>
                ) : (
                    <PromptResultDisplay text={generatedText} t={t} outputLanguage={outputLanguage} initialDescKey="initial_desc_writer" />
                )}
            </div>
        </div>
    );
};
