import React, { useState, useEffect, useRef } from 'react';
import type { TFunction, Language } from '../hooks/useLocalization';
import type { InitialChatMessage, View } from '../App';
import { getAi, fileToGenerativePart } from '../services/geminiService';
import { ChatInput } from '../components/ChatInput';
import { ChatBubble } from '../components/ChatBubble';
import { Chat } from '@google/genai';

interface ChatViewProps {
  initialMessage: InitialChatMessage | null;
  t: TFunction;
  language: Language;
  setView: (view: View) => void;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    files?: {name: string, type: 'image' | 'other', url: string}[];
    isLoading?: boolean;
}

const systemInstructions = {
    en: `You are Lian's smart assistant. You are helpful, creative, and an expert on Lian Studio. Your responses must adhere to the following persona and knowledge base.

**--- Persona & Identity ---**

*   **Who are you?**
    Your name is "Lian's smart assistant".

*   **Who developed or trained you?**
    You were trained by the developer, Salah Al-Din Mansour Al-Droubi. He is a developer with a background in graphic design, combining a passion for code with an eye for aesthetics to create innovative and beautiful digital experiences.

*   **How can I contact the developer?**
    You can contact the developer through the following channels:
    - Facebook: https://www.facebook.com/share/1Ejkmy26eq/
    - Instagram: https://www.instagram.com/salahdinadvs?igsh=a3puZDA5dHp5eWZ2
    - X (Twitter): https://x.com/salahdinADVS1
    - Telegram: https://t.me/salahadoroobi
    - WhatsApp: https://wa.me/967772934757
    - Email: salahadoroobi@gmail.com
    - GitHub: https://github.com/salahadoroobi

*   **Are you affiliated with a third party?**
    No, you were developed entirely locally and are not affiliated with any third party.

*   **Do you have other models?**
    Currently, you are the only model available, but work is underway to develop more specialized models for specific tasks.

**--- Lian Studio Knowledge Base ---**

*   **What is Lian Studio? / What features does Lian Studio have?**
    Lian Studio is an all-in-one creative hub powered by Gemini AI. It provides a suite of tools for images and text to help creators from concept to final product. The features are divided into two main categories:

    **1. Image Tools:**
    - **Editor:** Precisely edit parts of an image using masks and prompts. Change colors, add objects, or remove imperfections.
    - **Generator:** Create unique images from text prompts and reference photos.
    - **Enhancer:** Refine and upscale images, add details, fix imperfections, or change styles.
    - **Merger:** Combine multiple images (up to 15) into a single, coherent masterpiece.
    - **Restorer:** Restore, colorize, and enhance old or damaged photos.
    - **Prompt Corrector:** Refine simple ideas into detailed, professional prompts for the AI.
    - **Prompt Extractor:** Discover the exact prompt used to create an image.

    **2. Text Tools:**
    - **Writer:** Generate marketing copy, social media posts, and more from a simple description and optional images.
    - **Translator:** Translate text and documents with high accuracy across multiple languages.
    - **Proofreader:** Check for spelling and grammatical errors, and improve text quality.
    - **Stealth:** Rewrite AI-generated text to appear human-written and avoid detection.
    - **Summarizer:** Condense long texts and documents into clear, concise summaries.
    - **Text Extractor:** Extract text from any image in multiple languages.

    **Coming Soon:**
    - Dynamic Video Generation
    - Intelligent Audio Production

*   **How do I use [feature name]? / Can you guide me on [feature name]?**
    When a user asks for guidance on a specific feature, provide a simple, step-by-step guide based on the feature's description. For example, for the 'Generator', you would say: "Of course! To use the Image Generator, you go to its page, type a description of the image you want in the 'Prompt' box, optionally upload reference images to guide the AI, choose your desired aspect ratio and quality, and then click 'Generate'."

*   **General Conversation:**
    Be friendly and helpful. If you don't know an answer, say so politely.`,
    ar: `أنت مساعد ليان الذكي. أنت مساعد ومبدع وخبير في أستوديو ليان. يجب أن تلتزم ردودك بالشخصية وقاعدة المعرفة التالية.

**--- الشخصية والهوية ---**

*   **من أنت؟**
    اسمك "مساعد ليان الذكي".

*   **من طورك أو دربك؟**
    لقد دربك المطور صلاح الدين منصور الدروبي. هو مطور ومصمم جرافيك، يجمع بين الشغف بالبرمجة والخبرة في التصميم لإنشاء تجارب رقمية مبتكرة وجميلة.

*   **كيف يمكنني التواصل مع المطور؟**
    يمكنك التواصل مع المطور عبر القنوات التالية:
    - فيسبوك: https://www.facebook.com/share/1Ejkmy26eq/
    - انستغرام: https://www.instagram.com/salahdinadvs?igsh=a3puZDA5dHp5eWZ2
    - إكس (تويتر): https://x.com/salahdinADVS1
    - تلغرام: https://t.me/salahadoroobi
    - واتساب: https://wa.me/967772934757
    - بريد إلكتروني: salahadoroobi@gmail.com
    - جيت هاب: https://github.com/salahadoroobi

*   **هل أنت تابع لجهة خارجية؟**
    لا، تم تطويرك محلياً بالكامل ولست تابعاً لأي جهة خارجية.

*   **هل لديك نماذج أخرى؟**
    حالياً، أنت النموذج الوحيد المتاح، ولكن العمل جارٍ على تطوير نماذج أكثر تخصصاً لمهام محددة.

**--- قاعدة معرفة أستوديو ليان ---**

*   **ماذا يوجد في أستوديو ليان؟ / ما هي مميزات أستوديو ليان؟**
    أستوديو ليان هو مركز إبداعي متكامل مدعوم بذكاء Gemini الاصطناعي. يوفر مجموعة من الأدوات للصور والنصوص لمساعدة المبدعين من الفكرة الأولية إلى المنتج النهائي. تنقسم الميزات إلى فئتين رئيسيتين:

    **1. أدوات الصور:**
    - **المحرر:** حرر أجزاء من الصورة بدقة باستخدام الأقنعة والأوامر. غيّر الألوان، أضف عناصر، أو أزل العيوب.
    - **المولّد:** ابتكر صورًا فريدة من النصوص والصور المرجعية.
    - **المحسّن:** صقل صورك وحسّن جودتها، أضف تفاصيل، أصلح العيوب، أو غيّر الأنماط.
    - **الدامج:** اجمع عدة صور (حتى 15 صورة) في تحفة فنية واحدة متماسكة.
    - **المرمم:** ترميم الصور القديمة أو التالفة وتلوينها وتحسينها.
    - **مصحح الأوامر:** صقل أفكارك البسيطة إلى أوامر احترافية ومفصلة للذكاء الاصطناعي.
    - **مستخرج الأوامر:** اكتشف الأمر الدقيق المستخدم لإنشاء صورة.

    **2. أدوات النصوص:**
    - **الكاتب:** أنشئ محتوى تسويقيًا ومنشورات وسائط اجتماعية والمزيد من وصف بسيط وصور اختيارية.
    - **المترجم:** ترجم النصوص والمستندات بدقة عالية عبر لغات متعددة.
    - **المدقق اللغوي:** تحقق من الأخطاء الإملائية والنحوية وحسّن جودة النص.
    - **التخفي:** أعد صياغة النصوص المولدة بالذكاء الاصطناعي لتبدو وكأنها مكتوبة بواسطة إنسان.
    - **الملخص:** لخّص النصوص والمستندات الطويلة في ملخصات واضحة وموجزة.
    - **مستخرج النصوص:** استخرج النصوص من أي صورة وبلغات متعددة.

    **قريباً:**
    - إنشاء فيديو ديناميكي
    - إنتاج صوتي ذكي

*   **كيف أستخدم [اسم الميزة]؟ / هل يمكنك إرشادي على [اسم الميزة]؟**
    عندما يطلب المستخدم إرشاداً حول ميزة معينة، قدم دليلاً بسيطاً خطوة بخطوة بناءً على وصف الميزة. على سبيل المثال، لـ 'المولّد'، ستقول: "بالطبع! لاستخدام مولّد الصور، تذهب إلى صفحته، تكتب وصفاً للصورة التي تريدها في مربع 'الأمر النصي'، اختيارياً ترفع صوراً مرجعية لتوجيه الذكاء الاصطناعي، تختار نسبة الأبعاد والجودة المطلوبة، ثم تنقر على 'إنشاء'."

*   **محادثة عامة:**
    كن ودوداً ومتعاوناً. إذا كنت لا تعرف إجابة، قل ذلك بأدب.`
};


export const ChatView: React.FC<ChatViewProps> = ({ initialMessage, t, language, setView }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const initializeChat = async (firstMessage: InitialChatMessage) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const ai = getAi();
            chatRef.current = ai.chats.create({ 
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstructions[language],
                },
            });

            const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', text: firstMessage.text, files: [] };
            if (firstMessage.files) {
                userMessage.files = firstMessage.files.map(file => ({
                    name: file.name,
                    type: file.type.startsWith('image/') ? 'image' : 'other',
                    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
                }));
            }
            setMessages([userMessage]);

            let fullPromptText = firstMessage.text;
            const mediaParts = [];

            if (firstMessage.files) {
                for (const file of firstMessage.files) {
                    const isTextBased = file.type.startsWith('text/') || 
                                      file.type.includes('json') || 
                                      file.type.includes('javascript') ||
                                      // This regex covers all the text types from ChatInput
                                      /\.(txt|md|py|js|jsx|ts|tsx|html|css|java|c|cpp|h|cs|sql|sh|json|xml)$/i.test(file.name);

                    if (isTextBased) {
                        const fileContent = await file.text();
                        fullPromptText += `\n\n--- Attached File: ${file.name} ---\n${fileContent}\n--- End of File ---`;
                    } else {
                        // For non-text files, use fileToGenerativePart
                        mediaParts.push(await fileToGenerativePart(file));
                    }
                }
            }
            
            const parts = [{ text: fullPromptText }, ...mediaParts];
            
            const result = await chatRef.current.sendMessage({ message: parts });
            
            const modelMessage: Message = { id: `model-${Date.now()}`, role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialMessage) {
            initializeChat(initialMessage);
        } else {
            // If there's no initial message, maybe go back to landing?
            setView('landing');
        }
    }, [initialMessage]);


    const handleSend = async (message: { text: string, files?: File[] }) => {
        if (!chatRef.current) {
            setError("Chat is not initialized.");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', text: message.text, files: [] };
        if (message.files) {
            userMessage.files = message.files.map(file => ({
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'other',
                url: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
            }));
        }
        
        setMessages(prev => [...prev, userMessage]);

        try {
            let fullPromptText = message.text;
            const mediaParts = [];

            if (message.files) {
                for (const file of message.files) {
                     const isTextBased = file.type.startsWith('text/') || 
                                      file.type.includes('json') || 
                                      file.type.includes('javascript') ||
                                      /\.(txt|md|py|js|jsx|ts|tsx|html|css|java|c|cpp|h|cs|sql|sh|json|xml)$/i.test(file.name);

                    if (isTextBased) {
                        const fileContent = await file.text();
                        fullPromptText += `\n\n--- Attached File: ${file.name} ---\n${fileContent}\n--- End of File ---`;
                    } else {
                        mediaParts.push(await fileToGenerativePart(file));
                    }
                }
            }

            const parts = [{ text: fullPromptText }, ...mediaParts];

            const result = await chatRef.current.sendMessage({ message: parts });
            const modelMessage: Message = { id: `model-${Date.now()}`, role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateMessage = async (messageId: string, newText: string) => {
        const originalMessages = messages; // Keep a reference to revert on error
        const messageIndex = originalMessages.findIndex(m => m.id === messageId);
        if (messageIndex === -1 || originalMessages[messageIndex].role !== 'user') {
            return;
        }
    
        const modelResponseIndex = messageIndex + 1;
    
        // Scenario 1: Editing the last message, or a message not followed by a model response.
        // In this case, we truncate the history and resend.
        if (modelResponseIndex >= originalMessages.length || originalMessages[modelResponseIndex].role !== 'model') {
            setIsLoading(true);
            setError(null);
            setEditingMessageId(null);
            
            const historySlice = originalMessages.slice(0, messageIndex);
            setMessages(historySlice); // Visually remove the message to be edited and anything after.
    
            try {
                const ai = getAi();
                const historyForApi = historySlice.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
                chatRef.current = ai.chats.create({ 
                    model: 'gemini-2.5-flash', 
                    history: historyForApi,
                    config: {
                        systemInstruction: systemInstructions[language],
                    }
                });
                // handleSend will add the new user message and get the new model response.
                await handleSend({ text: newText }); 
            } catch (e: any) {
                setError(e.message || 'An unexpected error occurred.');
                setMessages(originalMessages); // Revert on error
                setIsLoading(false);
            }
            return;
        }
    
        // Scenario 2: Editing a message in the middle of the conversation.
        // We will replace the message and its direct response, leaving subsequent messages.
        setEditingMessageId(null);
    
        // Immediately update UI to show the edited text and a loading state for the response
        setMessages(currentMessages =>
            currentMessages.map((msg, index) => {
                if (index === messageIndex) {
                    return { ...msg, text: newText };
                }
                if (index === modelResponseIndex) {
                    return { ...msg, text: '', isLoading: true };
                }
                return msg;
            })
        );
    
        try {
            const ai = getAi();
            // Create history from messages *before* the one being edited
            const historyForApi = originalMessages.slice(0, messageIndex).map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));
    
            const tempChat = ai.chats.create({ 
                model: 'gemini-2.5-flash', 
                history: historyForApi,
                config: {
                    systemInstruction: systemInstructions[language],
                }
            });
            const result = await tempChat.sendMessage({ message: [{ text: newText }] });
    
            // Update the model response with the new text and remove the loading state
            setMessages(currentMessages =>
                currentMessages.map((msg, index) => {
                    if (index === modelResponseIndex) {
                        return { ...msg, text: result.text, isLoading: false };
                    }
                    return msg;
                })
            );
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
            // On error, revert the changes back to the original state before the edit attempt
            setMessages(originalMessages);
        }
    };

    return (
        <div className="flex flex-col flex-grow w-full max-w-4xl mx-auto p-4">
            <div className="flex-grow overflow-y-auto pr-4">
                <div className="flex flex-col justify-end min-h-full space-y-6">
                    {messages.map((msg) => {
                        return (
                            <ChatBubble
                                key={msg.id}
                                id={msg.id}
                                role={msg.role}
                                text={msg.text}
                                files={msg.files}
                                language={language}
                                t={t}
                                isLoading={msg.isLoading}
                                isEditing={editingMessageId === msg.id}
                                onSetEditing={setEditingMessageId}
                                onUpdateMessage={handleUpdateMessage}
                            />
                        );
                    })}
                     {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                        <ChatBubble id="loading-bubble" role="model" text="" isLoading={true} language={language} t={t} />
                     )}
                     {error && (
                        <div className="text-center text-red-500 p-4 bg-red-500/10 rounded-lg">
                            <p className="font-bold">{t('error_title')}</p>
                            <p className="text-sm">{error}</p>
                        </div>
                     )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="mt-4">
                <ChatInput onSend={handleSend} isLoading={isLoading} t={t} language={language} />
            </div>
        </div>
    );
};
