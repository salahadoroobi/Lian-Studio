import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ResultPanel } from '../components/ResultPanel';
import { editImage } from '../services/geminiService';
import type { ReferenceImage } from '../types';
import type { TFunction, Language } from '../hooks/useLocalization';
import { ImageEditorCanvas } from '../components/ImageEditorCanvas';
import { ActionButton } from '../components/ActionButton';

type CanvasHandle = {
  getCanvasDataUrl: () => string | undefined;
  clearCanvas: () => void;
};

export type EditorTool = 'brush' | 'eraser' | 'pan';

interface EditorViewProps {
  t: TFunction;
  language: Language;
}

export const EditorView: React.FC<EditorViewProps> = ({ t, language }) => {
  const [prompt, setPrompt] = useState('');
  const [baseImage, setBaseImage] = useState<ReferenceImage[]>([]);
  
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [colorPrompts, setColorPrompts] = useState<Record<string, string>>({});

  const [tool, setTool] = useState<EditorTool>('brush');
  const [brushColor, setBrushColor] = useState('#f0522e'); // Brand Accent Orange
  const [brushSize, setBrushSize] = useState(30);
  const [isMaskVisible, setIsMaskVisible] = useState(true);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<CanvasHandle>(null);

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
    const coloredMaskDataUrl = canvasRef.current?.getCanvasDataUrl();
    if (!coloredMaskDataUrl || activeColors.length === 0) {
      setError('Please draw a mask on the image to specify the edit area.');
      return;
    }

    const hasColorPrompts = Object.values(colorPrompts).some(p => p.trim().length > 0);
    if (!prompt.trim() && !hasColorPrompts) {
        setError('Please provide general edit instructions or instructions for at least one color.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let finalPrompt = `Using the second image as a colored mask, edit the first image.`;
      if (prompt.trim()) {
        finalPrompt += `\nGeneral instructions: ${prompt.trim()}.`;
      }
      const colorInstructions = activeColors
        .map(color => {
          const instruction = colorPrompts[color]?.trim();
          return instruction ? `For the area masked in ${color}, apply this change: "${instruction}"` : '';
        })
        .filter(Boolean)
        .join('\n');
      
      if (colorInstructions) {
        finalPrompt += `\n\nSpecific instructions for colored areas:\n${colorInstructions}`;
      }
      
      const result = await editImage(finalPrompt, baseImage[0], coloredMaskDataUrl);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (images: ReferenceImage[]) => {
    // Setting the new image will cause the ImageEditorCanvas to re-mount or receive a new `src`.
    // The `onLoad` handler within ImageEditorCanvas is responsible for clearing its own state.
    setBaseImage(images);
  };

  const handleStrokeComplete = (color: string) => {
    if (tool === 'brush' && !activeColors.includes(color)) {
        setActiveColors(prev => [...prev, color]);
    }
  };

  // This function is called by the canvas child component when it clears itself
  // or when an undo action results in an empty canvas.
  const handleCanvasReset = useCallback(() => {
    setActiveColors([]);
    setColorPrompts({});
  }, []);

  const hasColorPrompts = Object.values(colorPrompts).some(p => p.trim().length > 0);
  const canEdit = !isLoading && baseImage.length > 0 && activeColors.length > 0 && (prompt.trim().length > 0 || hasColorPrompts);

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
              ref={canvasRef}
              imageSrc={baseImage[0]?.dataUrl}
              tool={tool}
              setTool={setTool}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              isMaskVisible={isMaskVisible}
              setIsMaskVisible={setIsMaskVisible}
              onStrokeComplete={handleStrokeComplete}
              onClear={handleCanvasReset}
              onUndoToEmpty={handleCanvasReset}
              t={t}
            />
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">{t('editor_pan_instruction')}</p>
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

        {activeColors.length > 0 && (
            <div className="flex flex-col gap-3 -mt-2 animate-fade-in">
                {activeColors.map(color => (
                    <div key={color} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                        <div 
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-600 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                        />
                        <input
                            type="text"
                            value={colorPrompts[color] || ''}
                            onChange={(e) => setColorPrompts(p => ({...p, [color]: e.target.value}))}
                            placeholder={t('color_prompt_placeholder')}
                            aria-label={`Instructions for color ${color}`}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>
                ))}
            </div>
        )}

        <ActionButton
          onClick={handleEdit}
          disabled={!canEdit}
          className="w-full bg-brand-accent text-brand-bg font-bold py-4 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-auto"
        >
          {isLoading ? '...' : t('edit_button')}
        </ActionButton>
      </div>

      {/* Right Panel: Result */}
      <ResultPanel generatedImage={generatedImage} isLoading={isLoading} error={error} t={t} view="editor" />
    </div>
  );
};