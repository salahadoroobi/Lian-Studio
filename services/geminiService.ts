import { GoogleGenAI, Modality } from '@google/genai';
import type { ReferenceImage } from '../types';

// Helper to convert File to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    // The type assertion is safe because a valid data URL will have this part.
    const mime = (arr[0].match(/:(.*?);/) as RegExpMatchArray)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const getAi = () => {
    const userApiKey = localStorage.getItem('gemini_api_key');
    const apiKey = userApiKey || process.env.API_KEY;
     if (!apiKey) {
        throw new Error('API key is not available. Please set your key in the settings.');
    }
    return new GoogleGenAI({ apiKey });
};

export const validateApiKey = async (key: string): Promise<boolean> => {
    if (!key || !key.trim()) {
        return false;
    }
    try {
        const ai = new GoogleGenAI({ apiKey: key });
        // Use a lightweight model and a very short prompt to validate.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'test',
        });
        // A successful response with text indicates a valid key.
        return !!response.text;
    } catch (e) {
        console.error("API Key validation failed", e);
        return false;
    }
};


export const generateImage = async (
    prompt: string,
    referenceImages: ReferenceImage[],
    aspectRatio: string,
    quality: string // 'Standard' or 'HD'
): Promise<string> => {
    const ai = getAi();
    const parts: any[] = [];
    
    let fullPrompt = prompt.trim();
    if (aspectRatio !== 'Default') {
        fullPrompt += `, aspect ratio ${aspectRatio}`;
    }
    if (quality !== 'Standard') {
        fullPrompt += `, ${quality} quality`;
    }

    if (fullPrompt) {
        parts.push({ text: fullPrompt });
    }
    
    for (const image of referenceImages) {
        parts.push(await fileToGenerativePart(image.file));
    }
    
    if (parts.length === 0) {
        throw new Error('Prompt or reference images are required.');
    }
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error('Image generation failed. No image data received.');
};

export const editImage = async (
    prompt: string,
    baseImage: ReferenceImage,
    coloredMaskDataUrl: string
): Promise<string> => {
    const ai = getAi();

    const maskFile = dataURLtoFile(coloredMaskDataUrl, 'mask.png');
    
    const baseImagePart = await fileToGenerativePart(baseImage.file);
    const maskImagePart = await fileToGenerativePart(maskFile);

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [baseImagePart, maskImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error('Image editing failed. No image data received.');
};

export const enhanceImage = async (
    prompt: string,
    baseImage: ReferenceImage,
    enhancementStrength: number // 0-100, though not directly used by API, can hint in prompt
): Promise<string> => {
    const ai = getAi();
    
    const imagePart = await fileToGenerativePart(baseImage.file);
    const textPart = { text: `${prompt} (enhancement strength: ${enhancementStrength}%)` };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error('Image enhancement failed. No image data received.');
};

export const mergeImages = async (
    prompt: string,
    sourceImages: ReferenceImage[]
): Promise<string> => {
    const ai = getAi();
    const parts: any[] = [];

    // All source images first
    for (const image of sourceImages) {
        parts.push(await fileToGenerativePart(image.file));
    }

    // Then the prompt
    if (prompt.trim()) {
        parts.push({ text: `Merge these images. ${prompt}` });
    } else {
        parts.push({ text: 'Merge these images into a coherent new image.' });
    }
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error('Image merging failed. No image data received.');
};


export const extractPromptFromImage = async (
    image: ReferenceImage,
    language: string,
    extractionMode: 'descriptive' | 'concise'
): Promise<string> => {
    const ai = getAi();
    const imagePart = await fileToGenerativePart(image.file);
    
    let instruction = '';
    if (extractionMode === 'concise') {
        instruction = `Analyze this image and provide a concise, factual description of its main subject and key elements. The description should be brief and suitable as a base for further editing prompts. Respond only in ${language}.`;
    } else { // default to descriptive
        instruction = `You are an expert prompt engineer. Analyze this image and generate a detailed, descriptive prompt that could be used to recreate it. Describe the subject, environment, artistic style, composition, lighting, and mood. Respond only in ${language}.`;
    }
    
    const textPart = { text: instruction };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    
    if (!response.text) {
        throw new Error("Failed to extract prompt from the image.");
    }
    return response.text;
};