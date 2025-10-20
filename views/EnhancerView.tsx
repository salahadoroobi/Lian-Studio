import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultPanel } from '../components/ResultPanel';
import { enhanceImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import { EnhancementSlider } from '../components/EnhancementSlider';
import type { TFunction } from '../hooks/useLocalization';

interface EnhancerViewProps {
  t: TFunction;
}

export const EnhancerView: React.FC<EnhancerViewProps> = ({ t }) => {
    const [prompt, setPrompt] = useState('');
    const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
    const [enhancementStrength, setEnhancementStrength] = useState(50);
    
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEnhance = async () => {
        if (baseImage.length === 0) {
            setError('Please upload an image to enhance.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please provide an enhancement prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const result = await enhanceImage(prompt, baseImage[0], enhancementStrength);
            setGeneratedImage(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const canEnhance = !isLoading && baseImage.length > 0 && prompt.trim().length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('enhancer_title')}</h2>
                
                <div>
                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('base_image_label')}</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('base_image_desc')}</p>
                    <ImageUploader images={baseImage} setImages={setBaseImage} maxFiles={1} t={t} />
                </div>

                <div>
                    <label htmlFor="prompt" className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('enhancement_label')}</label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('enhancement_placeholder')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>

                <EnhancementSlider strength={enhancementStrength} setStrength={setEnhancementStrength} t={t} />

                <button
                    onClick={handleEnhance}
                    disabled={!canEnhance}
                    className="w-full bg-brand-accent text-white font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isLoading ? '...' : t('enhance_button')}
                </button>
            </div>

            {/* Right Panel: Result */}
            <ResultPanel generatedImage={generatedImage} isLoading={isLoading} error={error} t={t} view="enhancer" />
        </div>
    );
};