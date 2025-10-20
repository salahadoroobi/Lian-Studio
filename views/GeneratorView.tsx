import React, { useState, useRef } from 'react';
import { AspectRatioSelector } from '../components/AspectRatioSelector';
import { ImageUploader } from '../components/ImageUploader';
import { QualitySelector } from '../components/QualitySelector';
import { ResultPanel } from '../components/ResultPanel';
import { generateImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction } from '../hooks/useLocalization';
import { UploadTextIcon } from '../components/icons/UploadTextIcon';

interface GeneratorViewProps {
  t: TFunction;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ t }) => {
    const [prompt, setPrompt] = useState('');
    const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
    const [aspectRatio, setAspectRatio] = useState('Default');
    const [quality, setQuality] = useState('Standard');

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        if (!prompt.trim() && referenceImages.length === 0) {
            setError('Please provide a prompt or at least one reference image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const result = await generateImage(prompt, referenceImages, aspectRatio, quality);
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
    
    const canGenerate = !isLoading && (prompt.trim().length > 0 || referenceImages.length > 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('generator_title')}</h2>
                
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="prompt" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('prompt_label')}</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".txt"
                            className="hidden"
                            id="prompt-file-upload-generator"
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
                        id="prompt"
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('prompt_placeholder')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
                
                <div>
                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('reference_images_label')}</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('reference_images_desc')}</p>
                    <ImageUploader images={referenceImages} setImages={setReferenceImages} t={t} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <AspectRatioSelector selectedRatio={aspectRatio} setSelectedRatio={setAspectRatio} t={t} />
                    <QualitySelector selectedQuality={quality} setSelectedQuality={setQuality} t={t} />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isLoading ? '...' : t('generate_button')}
                </button>
            </div>

            {/* Right Panel: Result */}
            <ResultPanel generatedImage={generatedImage} isLoading={isLoading} error={error} t={t} view="generator" />
        </div>
    );
};