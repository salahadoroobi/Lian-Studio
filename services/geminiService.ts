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

export const restoreImage = async (
    baseImage: ReferenceImage,
    options: {
        fixDamage: boolean;
        improveClarity: boolean;
        colorize: boolean;
        removeNoise: boolean;
    },
    additionalInstructions: string
): Promise<string> => {
    const ai = getAi();
    
    const imagePart = await fileToGenerativePart(baseImage.file);
    
    let promptInstructions = `You are a master photo restorer with a focus on historical accuracy and preservation. Your primary goal is to repair damage while faithfully maintaining the original photograph's character and content.

**CRITICAL DIRECTIVE: PRESERVE, DO NOT ALTER.** The final image must look like a perfectly preserved version of the original photo, not a modern re-imagining.
- **DO NOT** change facial features, expressions, or the identity of the people in the photo.
- **DO NOT** add new objects, backgrounds, or elements that were not in the original scene.
- **DO NOT** remove existing objects or elements, even if they are unclear.
- **DO NOT** over-smooth skin or textures to the point where they look artificial or "plastic". Retain the natural grain and texture of the original photograph as much as possible after repairs.

Your restoration process based on the user's request:
`;
    
    const processSteps: string[] = [];
    if (options.fixDamage) {
        processSteps.push("- **Damage Repair:** Meticulously fix all physical damage: scratches, tears, folds, stains, dust, and discoloration. Reconstruct missing areas logically based on surrounding context.");
    }
    if (options.colorize) {
        processSteps.push("- **Color Correction & Colorization:** If the photo is black and white, colorize it using subtle, realistic, and historically appropriate colors. Avoid vibrant, oversaturated tones. If it's already in color, restore the original tonal range and correct any color fading.");
    } else {
        processSteps.push("- **Color Correction:** If the photo is black and white, restore its original tonal range, improving contrast and clarity without losing detail in shadows or highlights. DO NOT colorize it.");
    }
    if (options.improveClarity) {
        processSteps.push("- **Subtle Detail Enhancement:** Gently sharpen blurry areas to improve clarity. The enhancement should be minimal and only serve to counteract the degradation of the original photo, not to add artificial detail.");
    }
    if (options.removeNoise) {
        processSteps.push("- **Noise Reduction:** Carefully reduce excessive film grain or digital noise while preserving essential details.");
    }

    if (processSteps.length > 0) {
        promptInstructions += processSteps.join('\n');
    } else {
        promptInstructions += "- Follow general best practices for photo restoration."
    }

    if (additionalInstructions.trim()) {
        promptInstructions += `\n\n**Additional User Instructions:**\n- ${additionalInstructions.trim()}`;
    }

    promptInstructions += `\n\nProceed with the restoration of the provided image, adhering strictly to these guidelines.`

    const textPart = { text: promptInstructions };
    
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
    
    throw new Error('Image restoration failed. No image data received.');
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

export const correctPrompt = async (
    idea: string,
    outputLanguage: string
): Promise<string> => {
    const ai = getAi();
    const instruction = `You are a professional prompt engineer for advanced AI image generation models. Your task is to take a user's simple idea and transform it into a detailed, well-structured, and creative prompt. The final prompt must be in ${outputLanguage}.

User's idea: "${idea}"

Generate a high-quality prompt based on this idea. The prompt should include details about:
- Subject and its appearance
- Setting and environment
- Artistic style (e.g., photorealistic, oil painting, anime, futuristic)
- Composition and camera angle
- Lighting and mood
- Relevant keywords for quality (e.g., 4k, masterpiece, highly detailed)

Respond only with the final, polished prompt.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: instruction,
    });
    
    if (!response.text) {
        throw new Error("Failed to correct the prompt.");
    }
    return response.text;
};

export const generateContentText = async (
    description: string,
    images: ReferenceImage[],
    tone: string,
    contentType: string,
    outputLanguage: string,
    contentRatio: number
): Promise<string> => {
    const ai = getAi();
    const parts: any[] = [];

    let ratioInstruction = '';
    if (contentRatio <= 20) {
        ratioInstruction = 'Generate very concise and brief content. Keep it short and to the point.';
    } else if (contentRatio >= 80) {
        ratioInstruction = 'Generate highly detailed, comprehensive, and elaborate content. Provide an in-depth and thorough response.';
    } else {
        ratioInstruction = `Adjust the length and detail of the content to a ratio of approximately ${contentRatio} out of 100, where 100 is the most detailed and 0 is the most brief.`;
    }

    let instruction = `As an expert copywriter, generate compelling content for a "${contentType}" with a "${tone}" tone of voice. The content must be in ${outputLanguage}.

Base the content on the following description: "${description}"

${ratioInstruction}

If an image is provided, use it for visual context about the product or idea.

Respond ONLY with the final generated content.`;

    for (const image of images) {
        parts.push(await fileToGenerativePart(image.file));
    }
    parts.push({ text: instruction });


    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
    });

    if (!response.text) {
        throw new Error("Failed to generate content.");
    }
    return response.text.trim();
};

export const translateText = async (
    text: string,
    fromLanguage: string,
    toLanguageName: string,
    formality: string
): Promise<string> => {
    const ai = getAi();
    
    let formalityInstruction = '';
    if (formality !== 'default') {
        formalityInstruction = `The desired formality is "${formality}".`;
    }

    const fromLanguageInstruction = fromLanguage === 'auto'
        ? 'from the auto-detected language'
        : `from ${fromLanguage}`;

    const instruction = `You are an expert translator. Translate the following text ${fromLanguageInstruction} to ${toLanguageName}.
${formalityInstruction}
Respond ONLY with the translated text, without any additional explanations, formatting, or quotation marks.

Text to translate:
"${text}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: instruction,
    });

    if (!response.text) {
        throw new Error("Failed to translate the text.");
    }
    return response.text.trim();
};
