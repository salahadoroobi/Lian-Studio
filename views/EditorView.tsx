import React, { useState, useRef, useLayoutEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultPanel } from '../components/ResultPanel';
import { editImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction, Language } from '../hooks/useLocalization';
import { ImageEditorCanvas } from '../components/ImageEditorCanvas';

interface EditorViewProps {
  t: TFunction;
  language: Language;
}

export const EditorView: React.FC<EditorViewProps> = ({ t, language }) => {
  const [prompt, setPrompt] = useState('');
  const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
  const [maskDataUrl, setMaskDataUrl] = useState<string>('');
  
  const [brushColor, setBrushColor] = useState('#ef4444'); // Red
  const [brushSize, setBrushSize] = useState(30);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = promptTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);
  
  const handleEdit = async () => {
    if (baseImage.length === 0) {
      setError('Please upload an image to edit.');
      return;
    }
    if (!maskDataUrl) {
      setError('Please draw a mask on the image to specify the edit area.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please provide edit instructions.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await editImage(prompt, baseImage[0], maskDataUrl);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (images: ReferenceImage[]) => {
    setBaseImage(images);
    setMaskDataUrl(''); // Clear mask when new image is uploaded
  };

  const canEdit = !isLoading && baseImage.length > 0 && prompt.trim().length > 0 && !!maskDataUrl;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
      {/* Left Panel: Controls */}
      <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{t('editor_title')}</h2>
        
        <div>
          <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('base_image_label')}</label>
          <ImageUploader images={baseImage} setImages={handleImageUpload} maxFiles={1} t={t} descriptionKey="base_image_desc_editor" />
        </div>

        {baseImage.length > 0 && (
          <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <label className="block text-lg font-semibold text-brand-primary dark:text-gray-300">{t('mask_area_label')}</label>
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-3 mb-2">{t('mask_area_desc')}</p>
            <ImageEditorCanvas 
              imageSrc={baseImage[0]?.dataUrl}
              brushColor={brushColor}
              brushSize={brushSize}
              onMaskChange={setMaskDataUrl}
              onClear={() => setMaskDataUrl('')}
              t={t}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label htmlFor="brush-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('brush_size')}</label>
                <div className="flex items-center gap-2">
                    <input id="brush-size" type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-8 text-center">{brushSize}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-self-start sm:justify-self-center">
                <label htmlFor="brush-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('mask_color')}</label>
                <input id="brush-color" type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-10 h-10 rounded-md border-gray-300 dark:border-gray-600 cursor-pointer bg-transparent" />
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="prompt-editor" className="block text-lg font-semibold text-brand-primary dark:text-gray-300 mb-2">{t('edit_instructions_label')}</label>
          <textarea
            ref={promptTextareaRef}
            id="prompt-editor"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('edit_instructions_placeholder')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden"
          />
        </div>

        <button
          onClick={handleEdit}
          disabled={!canEdit}
          className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
        >
          {isLoading ? '...' : t('edit_button')}
        </button>
      </div>

      {/* Right Panel: Result */}
      <ResultPanel generatedImage={generatedImage} isLoading={isLoading} error={error} t={t} view="editor" />
    </div>
  );
};