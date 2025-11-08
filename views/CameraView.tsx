import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultPanel } from '../components/ResultPanel';
import { changeImageAngle } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction, Language } from '../hooks/useLocalization';
import { ActionButton } from '../components/ActionButton';
import { ShimmerWrapper } from '../components/ShimmerWrapper';
import { ResetIcon } from '../components/icons/ResetIcon';

interface CameraViewProps {
  t: TFunction;
  language: Language;
}

const ControlSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    t: TFunction;
}> = ({ label, value, onChange, t }) => (
    <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
            <label className="block text-md font-semibold text-brand-primary dark:text-gray-300">{label}</label>
            <button onClick={() => onChange(0)} title={t('reset_view')} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-brand-accent transition-colors">
                <ResetIcon className="w-4 h-4" />
            </button>
        </div>
        <div className="flex items-center gap-4">
            <input
                type="range"
                min="-90"
                max="90"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:bg-brand-accent [&::-moz-range-thumb]:bg-brand-accent"
            />
            <span className="font-semibold text-brand-primary dark:text-gray-300 w-16 text-center tabular-nums">
                {value > 0 ? '+' : ''}{value}°
            </span>
        </div>
    </div>
);


export const CameraView: React.FC<CameraViewProps> = ({ t, language }) => {
    const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
    
    const [yaw, setYaw] = useState(0); // Horizontal rotation
    const [pitch, setPitch] = useState(0); // Vertical angle
    const [dolly, setDolly] = useState(0); // Zoom in/out
    const [wideAngle, setWideAngle] = useState(false);

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRerender = async () => {
        if (baseImage.length === 0) {
            setError('Please upload an image to adjust.');
            return;
        }
        if (yaw === 0 && pitch === 0 && dolly === 0 && !wideAngle) {
            setError('Please adjust at least one camera control.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const result = await changeImageAngle(baseImage[0], { yaw, pitch, dolly, wideAngle });
            setGeneratedImage(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetAll = () => {
        setYaw(0);
        setPitch(0);
        setDolly(0);
        setWideAngle(false);
    };
    
    const canRerender = !isLoading && baseImage.length > 0 && (yaw !== 0 || pitch !== 0 || dolly !== 0 || wideAngle);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            {/* Left Panel: Controls */}
            <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('camera_title')}</h2>
                
                <div>
                    <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('base_image_label')}</label>
                    <ImageUploader images={baseImage} setImages={setBaseImage} maxFiles={1} t={t} descriptionKey="base_image_desc_camera" />
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-brand-primary dark:text-gray-300">
                                {t('camera_options_label')}
                            </h3>
                             <ShimmerWrapper className="rounded-full">
                                <span className="inline-flex items-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {t('beta_tag')}
                                </span>
                            </ShimmerWrapper>
                        </div>
                        <button onClick={handleResetAll} title={t('reset_view')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-brand-accent transition-colors">
                            <ResetIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <ControlSlider
                        label={t('camera_yaw_label')}
                        value={yaw}
                        onChange={setYaw}
                        t={t}
                    />
                    <ControlSlider
                        label={t('camera_pitch_label')}
                        value={pitch}
                        onChange={setPitch}
                        t={t}
                    />
                    <ControlSlider
                        label={t('camera_dolly_label')}
                        value={dolly}
                        onChange={setDolly}
                        t={t}
                    />
                    
                    <div className="flex items-center justify-between mt-2">
                        <label htmlFor="wide-angle-toggle" className="text-md font-medium text-gray-900 dark:text-gray-300">
                           {t('camera_wide_angle_label')}
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                id="wide-angle-toggle"
                                type="checkbox"
                                className="sr-only peer"
                                checked={wideAngle}
                                onChange={(e) => setWideAngle(e.target.checked)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/30 dark:peer-focus:ring-brand-accent/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-accent"></div>
                        </label>
                    </div>
                </div>

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <ActionButton
                    onClick={handleRerender}
                    disabled={!canRerender}
                    className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
                >
                    {isLoading ? '...' : t('re_render_button')}
                </ActionButton>
            </div>

            {/* Right Panel: Result */}
            <ResultPanel 
                generatedImage={generatedImage} 
                isLoading={isLoading} 
                error={error} 
                t={t} 
                view="camera" 
            />
        </div>
    );
};
