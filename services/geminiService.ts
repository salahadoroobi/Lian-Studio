
import { GoogleGenAI, Modality } from '@google/genai';
import type { ReferenceImage } from '../types';

// Per guidelines, API key is available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateImage = async (
  prompt: string,
  referenceImages: ReferenceImage[],
  aspectRatio: string,
  quality: string
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  let fullPrompt = prompt;
  if (aspectRatio !== 'Default') {
    // Remove conflicting instructions from the prompt
    fullPrompt = fullPrompt.replace(/vertical format|portrait aspect ratio|1080x1920|9:16/gi, '');
    fullPrompt = fullPrompt.replace(/horizontal format|landscape aspect ratio|1920x1080|16:9/gi, '');
    fullPrompt = fullPrompt.replace(/square format|square aspect ratio|1080x1080|1:1/gi, '');
    fullPrompt += `\n- Aspect ratio: ${aspectRatio}`;
  }
  if (quality === 'HD') {
    fullPrompt += `\n- Quality: high definition, high quality, sharp focus, intricate details.`;
  }

  const imageParts = await Promise.all(referenceImages.map(img => fileToGenerativePart(img.file)));
  
  const parts = fullPrompt.trim()
    ? [...imageParts, { text: fullPrompt }]
    : imageParts;

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
  }

  throw new Error('Image generation failed or the model did not return an image.');
};

export const enhanceImage = async (
  prompt: string,
  baseImage: ReferenceImage,
  strength: number
): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const imagePart = await fileToGenerativePart(baseImage.file);
    
    let strengthPrompt = '';
    if (strength <= 33) strengthPrompt = 'Make a subtle change: ';
    else if (strength <= 66) strengthPrompt = 'Make a noticeable change: ';
    else strengthPrompt = 'Make a dramatic change: ';

    const textPart = { text: strengthPrompt + prompt };
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error('Image enhancement failed or the model did not return an image.');
};

export const mergeImages = async (
  prompt: string,
  sourceImages: ReferenceImage[]
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';

  const imageParts = await Promise.all(sourceImages.map(img => fileToGenerativePart(img.file)));

  const textInstruction = `Task: Blend Multiple Images.
Instructions: Analyze all the provided images. Create a single, new, cohesive image that intelligently blends the key subjects, artistic styles, and color palettes from all of them.
${prompt ? `User Guidance: Pay special attention to the following instruction: "${prompt}"` : ''}`;

  const textPart = { text: textInstruction };
  
  const response = await ai.models.generateContent({
    model,
    contents: { parts: [...imageParts, textPart] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
  }

  throw new Error('Image merging failed or the model did not return an image.');
};


export const extractPromptFromImage = async (image: ReferenceImage, language: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const imagePart = await fileToGenerativePart(image.file);
    
    const languageMap: { [key: string]: string } = {
        en: 'ENGLISH',
        ar: 'ARABIC',
        es: 'SPANISH',
        fr: 'FRENCH',
        de: 'GERMAN',
        ja: 'JAPANESE',
    };
    
    const langName = languageMap[language] || 'ENGLISH';
    const langInstruction = `The final output must be ONLY the generated prompt, in ${langName}, with no additional explanation or introductory text.`;

    const textPart = { text: `You are an expert prompt engineer for an advanced AI image generation model. Your task is to analyze the provided image and create a perfect, detailed prompt that could be used to generate a very similar image.

Break down your analysis into these key areas:
1.  **Subject & Scene:** Describe the main subject(s), their appearance, attire, pose, expression, and the overall scene or environment.
2.  **Style & Medium:** Identify the artistic style (e.g., photorealism, oil painting, digital art, anime, 3D render) and medium.
3.  **Composition & Framing:** Describe the shot type (e.g., close-up portrait, wide landscape shot, medium shot).
4.  **Lighting:** Describe the lighting setup (e.g., cinematic lighting, soft studio light, dramatic neon lighting, golden hour).
5.  **Colors & Mood:** Describe the color palette and the overall mood or atmosphere (e.g., serene, moody, energetic, nostalgic).
6.  **Details & Quality:** Add keywords for high quality, like "hyperrealistic," "hyperdetailed," "4k," "intricate details."

Combine all these elements into a single, cohesive paragraph. ${langInstruction}` };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
    });
    
    const text = response.text;
    if (typeof text === 'string') {
        return text;
    }
    
    throw new Error('Prompt extraction failed or the model did not return text.');
};
