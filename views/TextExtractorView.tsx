import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { extractTextFromImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ActionButton } from '../components/ActionButton';
import { EXTRACTION_LANGUAGES } from '../constants';
import { ShimmerWrapper } from '../components/ShimmerWrapper';

interface TextExtractorViewProps {
  t: TFunction;
}

export const TextExtractorView: React.FC<TextExtractorViewProps> = ({ t }) => {
    const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<string>('auto');
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

    const handleExtract = async () => {
        if (baseImage.length === 0) {
            setError('Please upload an image to extract text from.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setExtractedText(null);
        try {
            const result = await extractTextFromImage(baseImage[0], language);
            setExtractedText(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const canExtract = !isLoading && baseImage.length > 0;

    const languageOptions = [{ tKey: 'output_language_auto', value: 'auto' }, ...EXTRACTION_LANGUAGES];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('text_extractor_title')}</h2>
                
                <div>
                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('text_extractor_image_label')}</label>
                    <ImageUploader images={baseImage} setImages={setBaseImage} maxFiles={1} t={t} descriptionKey="text_extractor_image_desc" />
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300">
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsAdvancedOptionsOpen(p => !p)} role="button" aria-expanded={isAdvancedOptionsOpen}>
                        <div className="flex items-center gap-2">
                            <label className="text-lg font-semibold text-brand-primary dark:text-gray-300 pointer-events-none">{t('restorer_advanced_options_toggle')}</label>
                            <ShimmerWrapper className="rounded-full"><span className="inline-flex bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">{t('beta_tag')}</span></ShimmerWrapper>
                        </div>
                        <label className="inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="sr-only peer" checked={isAdvancedOptionsOpen} onChange={(e) => setIsAdvancedOptionsOpen(e.target.checked)} />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                        </label>
                    </div>
                    
                    <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: isAdvancedOptionsOpen ? '1fr' : '0fr' }}>
                        <div className="overflow-hidden">
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('text_extractor_lang_label')}</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {languageOptions.map(({ tKey, value }) => {
                                      const isSelected = language === value;
                                      return (
                                        <button
                                          key={value}
                                          onClick={() => setLanguage(value)}
                                          className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${ isSelected ? 'bg-brand-accent text-white border-brand-accent ring-brand-accent/50' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600' }`}
                                        >
                                          <p>{t(tKey as any)}</p>
                                        </button>
                                      );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <ActionButton
                    onClick={handleExtract}
                    disabled={!canExtract}
                    className="w-full bg-brand-accent text-white font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
                >
                    {isLoading ? '...' : t('extract_text_button')}
                </ActionButton>
            </div>

            {/* Right Panel: Result */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] lg:min-h-0 flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('extracting_text_title')}</p>
                        <p className="text-sm">{t('extracting_text_desc')}</p>
                     </div>
                ) : (
                    <PromptResultDisplay text={extractedText} t={t} outputLanguage={'auto'} initialDescKey="initial_desc_text_extractor" />
                )}
            </div>
        </div>
    );
};