import React, { useState, useRef } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultPanel } from '../components/ResultPanel';
import { enhanceImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import { EnhancementSlider } from '../components/EnhancementSlider';
import type { TFunction } from '../hooks/useLocalization';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';

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
    
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    
     const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setPrompt(text);
            };
            reader.onerror = (e) => {
                console.error("Failed to read file", e);
                setError("Failed to read the selected file.");
            }
            reader.readAsText(file);
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
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="prompt-enhancer" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('enhancement_label')}</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".txt"
                            className="hidden"
                            id="prompt-file-upload-enhancer"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title={t('upload_prompt_label')}
                            aria-label={t('upload_prompt_label')}
                            className="p-2 rounded-lg bg-brand-accent text-brand-bg hover:bg-brand-accent-dark transition-colors"
                        >
                            <UploadTextIcon />
                        </button>
                    </div>
                    <textarea
                        id="prompt-enhancer"
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
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isLoading ? '...' : t('enhance_button')}
                </button>
            </div>

            {/* Right Panel: Result */}
            <ResultPanel generatedImage={generatedImage} isLoading={isLoading} error={error} t={t} view="enhancer" />
        </div>
    );
};