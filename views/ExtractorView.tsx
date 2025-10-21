
import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { PromptResultDisplay } from '../components/PromptResultDisplay';
import { extractPromptFromImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction } from '../hooks/useLocalization';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ExtractionLanguageSelector } from '../components/ExtractionLanguageSelector';

interface ExtractorViewProps {
  t: TFunction;
}

export const ExtractorView: React.FC<ExtractorViewProps> = ({ t }) => {
    const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractionLanguage, setExtractionLanguage] = useState<string>('en');

    const handleExtract = async () => {
        if (baseImage.length === 0) {
            setError('Please upload an image to extract text from.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setExtractedText(null);
        try {
            const result = await extractPromptFromImage(baseImage[0], extractionLanguage);
            setExtractedText(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const canExtract = !isLoading && baseImage.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('extractor_title')}</h2>
                
                <div>
                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('base_image_label_extractor')}</label>
                    <ImageUploader images={baseImage} setImages={setBaseImage} maxFiles={1} t={t} descriptionKey="base_image_desc_extractor" />
                </div>
                
                <ExtractionLanguageSelector
                    selectedLanguage={extractionLanguage}
                    setSelectedLanguage={setExtractionLanguage}
                    t={t}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    onClick={handleExtract}
                    disabled={!canExtract}
                    className="w-full bg-brand-accent text-white font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isLoading ? '...' : t('extract_button')}
                </button>
            </div>

            {/* Right Panel: Result */}
            <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-2xl shadow-inner border border-gray-200/80 dark:border-gray-700 min-h-[400px] lg:min-h-0 flex items-center justify-center">
                {isLoading ? (
                     <div className="text-center text-gray-500 dark:text-gray-400">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-primary dark:text-brand-accent">{t('extracting_title')}</p>
                        <p className="text-sm">{t('extracting_desc')}</p>
                     </div>
                ) : (
                    <PromptResultDisplay text={extractedText} t={t} extractionLanguage={extractionLanguage} />
                )}
            </div>
        </div>
    );
};
