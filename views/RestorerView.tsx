import React, { useState, useLayoutEffect, useRef } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultPanel } from '../components/ResultPanel';
import { restoreImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction, Language } from '../hooks/useLocalization';
import { ActionButton } from '../components/ActionButton';
import { ShimmerWrapper } from '../components/ShimmerWrapper';

interface RestorerViewProps {
  t: TFunction;
  language: Language;
}

const RestorationOption: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 text-brand-accent bg-gray-100 border-gray-300 rounded focus:ring-brand-accent dark:focus:ring-brand-accent-dark dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
        />
        <label htmlFor={id} className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
            {label}
        </label>
    </div>
);


export const RestorerView: React.FC<RestorerViewProps> = ({ t, language }) => {
    const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
    
    const [options, setOptions] = useState({
        fixDamage: true,
        improveClarity: true,
        colorize: true,
        removeNoise: true,
    });
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const instructionsTextareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        const textarea = instructionsTextareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [additionalInstructions]);

    const handleOptionChange = (option: keyof typeof options, value: boolean) => {
        setOptions(prev => ({ ...prev, [option]: value }));
    };

    const handleRestore = async () => {
        if (baseImage.length === 0) {
            setError('Please upload an image to restore.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            // If advanced options are closed, use default settings.
            const restorationOptions = isAdvancedOptionsOpen ? options : {
                fixDamage: true,
                improveClarity: true,
                colorize: true,
                removeNoise: true,
            };
            // Additional instructions are now independent and always included.
            const result = await restoreImage(baseImage[0], restorationOptions, additionalInstructions);
            setGeneratedImage(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const canRestore = !isLoading && baseImage.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('restorer_title')}</h2>
                
                <div>
                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('base_image_label')}</label>
                    <ImageUploader images={baseImage} setImages={setBaseImage} maxFiles={1} t={t} descriptionKey="base_image_desc_restorer" />
                </div>
                
                {/* Integrated Advanced Options Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300">
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => setIsAdvancedOptionsOpen(prev => !prev)}
                        role="button"
                        aria-expanded={isAdvancedOptionsOpen}
                        aria-controls="advanced-restoration-options-content"
                    >
                        <div className="flex items-center gap-2">
                            <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 pointer-events-none">
                                {t('restorer_advanced_options_toggle')}
                            </label>
                            <ShimmerWrapper className="rounded-full">
                                <span className="inline-flex items-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {t('beta_tag')}
                                </span>
                            </ShimmerWrapper>
                        </div>
                        <label htmlFor="advanced-options-toggle" className="inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input
                                id="advanced-options-toggle"
                                type="checkbox"
                                className="sr-only peer"
                                checked={isAdvancedOptionsOpen}
                                onChange={(e) => setIsAdvancedOptionsOpen(e.target.checked)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 dark:peer-focus:ring-brand-accent/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-accent"></div>
                        </label>
                    </div>
                    
                    <div
                        id="advanced-restoration-options-content"
                        className="grid transition-all duration-500 ease-in-out"
                        style={{ gridTemplateRows: isAdvancedOptionsOpen ? '1fr' : '0fr' }}
                    >
                        <div className="overflow-hidden">
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-3">{t('restorer_options_label')}</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <RestorationOption 
                                        id="fix-damage"
                                        label={t('restorer_option_fix_damage')}
                                        checked={options.fixDamage}
                                        onChange={(checked) => handleOptionChange('fixDamage', checked)}
                                    />
                                    <RestorationOption 
                                        id="improve-clarity"
                                        label={t('restorer_option_improve_clarity')}
                                        checked={options.improveClarity}
                                        onChange={(checked) => handleOptionChange('improveClarity', checked)}
                                    />
                                    <RestorationOption 
                                        id="colorize"
                                        label={t('restorer_option_colorize')}
                                        checked={options.colorize}
                                        onChange={(checked) => handleOptionChange('colorize', checked)}
                                    />
                                    <RestorationOption 
                                        id="remove-noise"
                                        label={t('restorer_option_remove_noise')}
                                        checked={options.removeNoise}
                                        onChange={(checked) => handleOptionChange('removeNoise', checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Additional Instructions is now always visible */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="additional-instructions" className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('restorer_instructions_label')}</label>
                        <div className="flex items-center gap-2">
                        </div>
                    </div>
                    <textarea
                        ref={instructionsTextareaRef}
                        id="additional-instructions"
                        rows={2}
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                        placeholder={t('restorer_instructions_placeholder')}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden"
                    />
                </div>

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <ActionButton
                    onClick={handleRestore}
                    disabled={!canRestore}
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
                >
                    {isLoading ? '...' : t('restore_button')}
                </ActionButton>
            </div>

            {/* Right Panel: Result */}
            <ResultPanel 
                generatedImage={generatedImage} 
                isLoading={isLoading} 
                error={error} 
                t={t} 
                view="restorer" 
            />
        </div>
    );
};